import { CitizenProfile, EligibilityMatchResult, EligibilityRule, RuleEvaluationResult, Scheme } from '../types';

export class EligibilityEngine {
  /**
   * Deterministically evaluates a citizen's profile against a scheme's defined rules
   */
  public static evaluateScheme(profile: CitizenProfile, scheme: Scheme): EligibilityMatchResult {
    const rules = scheme.eligibilityRules || [];
    if (rules.length === 0) {
      return {
        schemeId: scheme.id,
        matchScore: 100,
        status: 'HIGH_MATCH',
        matchedRules: [],
        failedRules: [],
        unknownRules: [],
        summaryText: 'Universal access scheme with no restrictive barriers.',
        disclaimer: 'Potential match based on available scheme rules. Final eligibility is determined solely by the respective government authority.'
      };
    }

    const matchedRules: RuleEvaluationResult[] = [];
    const failedRules: RuleEvaluationResult[] = [];
    const unknownRules: RuleEvaluationResult[] = [];

    for (const rule of rules) {
      const userValue = (profile as any)[rule.field];
      const evaluation = this.evaluateSingleRule(rule, userValue);

      if (evaluation.status === 'MATCHED') {
        matchedRules.push(evaluation);
      } else if (evaluation.status === 'FAILED') {
        failedRules.push(evaluation);
      } else {
        unknownRules.push(evaluation);
      }
    }

    // Deterministic Match Score Calculation
    let score = 0;
    const totalRules = rules.length;
    const mandatoryCount = rules.filter(r => r.isMandatory).length;
    const mandatoryFailed = failedRules.filter(r => r.rule.isMandatory).length;

    if (mandatoryFailed > 0) {
      // If a mandatory criterion failed, cap score at max 35%
      score = Math.max(10, Math.round((matchedRules.length / totalRules) * 35));
    } else {
      // Mandatory passed or pending
      const matchedWeight = (matchedRules.length / totalRules) * 85;
      const unknownPenalty = (unknownRules.length / totalRules) * 15;
      score = Math.min(100, Math.max(20, Math.round(15 + matchedWeight - unknownPenalty * 0.5)));
    }

    let status: EligibilityMatchResult['status'] = 'POTENTIAL_MATCH';
    if (score >= 80 && mandatoryFailed === 0) {
      status = 'HIGH_MATCH';
    } else if (score < 40 || mandatoryFailed > 0) {
      status = 'UNLIKELY_MATCH';
    } else if (unknownRules.length >= totalRules / 2) {
      status = 'INSUFFICIENT_DATA';
    }

    // Build human-readable summary
    const summaryParts: string[] = [];
    if (matchedRules.length > 0) {
      summaryParts.push(`${matchedRules.length} conditions matched`);
    }
    if (failedRules.length > 0) {
      summaryParts.push(`${failedRules.length} conditions not satisfied`);
    }
    if (unknownRules.length > 0) {
      summaryParts.push(`${unknownRules.length} items need confirmation`);
    }

    const summaryText = summaryParts.join(' • ');

    return {
      schemeId: scheme.id,
      matchScore: score,
      status,
      matchedRules,
      failedRules,
      unknownRules,
      summaryText,
      disclaimer: 'Potential match based on available scheme rules. Final eligibility is determined solely by the respective government authority.'
    };
  }

  /**
   * Evaluates a single rule with type-safe operators
   */
  private static evaluateSingleRule(rule: EligibilityRule, userValue: any): RuleEvaluationResult {
    if (userValue === undefined || userValue === null || userValue === '') {
      return {
        rule,
        status: 'UNKNOWN',
        reason: `${rule.labelEn} (Details not provided in citizen profile)`
      };
    }

    let matched = false;
    let explanation = '';

    switch (rule.operator) {
      case '=':
        matched = String(userValue).toUpperCase() === String(rule.value).toUpperCase();
        explanation = matched 
          ? `✓ ${rule.labelEn} (${userValue} matches)`
          : `✗ Requires ${rule.value}, found ${userValue}`;
        break;

      case '!=':
        matched = String(userValue).toUpperCase() !== String(rule.value).toUpperCase();
        explanation = matched ? `✓ Satisfied condition` : `✗ Condition failed`;
        break;

      case '>=':
        matched = Number(userValue) >= Number(rule.value);
        explanation = matched
          ? `✓ ${rule.labelEn} (Current: ${userValue} >= ${rule.value})`
          : `✗ Minimum required is ${rule.value}, found ${userValue}`;
        break;

      case '<=':
        matched = Number(userValue) <= Number(rule.value);
        explanation = matched
          ? `✓ ${rule.labelEn} (Current: ₹${Number(userValue).toLocaleString('en-IN')} ≤ ₹${Number(rule.value).toLocaleString('en-IN')})`
          : `✗ Exceeds ceiling limit of ₹${Number(rule.value).toLocaleString('en-IN')} (Current: ₹${Number(userValue).toLocaleString('en-IN')})`;
        break;

      case '>':
        matched = Number(userValue) > Number(rule.value);
        explanation = matched
          ? `✓ ${rule.labelEn} (${userValue} > ${rule.value})`
          : `✗ Required > ${rule.value}, found ${userValue}`;
        break;

      case '<':
        matched = Number(userValue) < Number(rule.value);
        explanation = matched
          ? `✓ ${rule.labelEn} (${userValue} < ${rule.value})`
          : `✗ Required < ${rule.value}, found ${userValue}`;
        break;

      case 'IN':
        if (Array.isArray(rule.value)) {
          matched = rule.value.map(v => String(v).toUpperCase()).includes(String(userValue).toUpperCase());
        } else {
          matched = String(rule.value).toUpperCase() === String(userValue).toUpperCase();
        }
        explanation = matched
          ? `✓ ${rule.labelEn} (${userValue} is eligible category)`
          : `✗ Category ${userValue} is not among accepted categories`;
        break;

      case 'NOT_IN':
        if (Array.isArray(rule.value)) {
          matched = !rule.value.map(v => String(v).toUpperCase()).includes(String(userValue).toUpperCase());
        } else {
          matched = String(rule.value).toUpperCase() !== String(userValue).toUpperCase();
        }
        explanation = matched ? `✓ Category allowed` : `✗ Ineligible category`;
        break;

      default:
        matched = false;
        explanation = 'Unknown evaluation rule';
    }

    return {
      rule,
      status: matched ? 'MATCHED' : 'FAILED',
      userValue,
      reason: explanation
    };
  }

  /**
   * Sorts and filters schemes based on transparent relevance and eligibility match score
   */
  public static rankSchemesForProfile(profile: CitizenProfile, allSchemes: Scheme[]): { scheme: Scheme; match: EligibilityMatchResult }[] {
    const results = allSchemes.map(scheme => {
      const match = this.evaluateScheme(profile, scheme);
      return { scheme, match };
    });

    // Sort by match score descending, prioritizing verified schemes
    results.sort((a, b) => {
      if (b.match.matchScore !== a.match.matchScore) {
        return b.match.matchScore - a.match.matchScore;
      }
      return a.scheme.name.localeCompare(b.scheme.name);
    });

    return results;
  }
}
