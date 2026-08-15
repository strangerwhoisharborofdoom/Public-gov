import { LanguageCode, RequiredDocument, Scheme } from '../types';

export function getSchemeName(scheme?: Scheme | null, lang: LanguageCode = 'en'): string {
  if (!scheme) return '';
  if (scheme.localizedNames && scheme.localizedNames[lang]) {
    return scheme.localizedNames[lang];
  }
  if (scheme.nameLocal && scheme.nameLocal[lang]) {
    return scheme.nameLocal[lang];
  }
  if (scheme.localizedNames && scheme.localizedNames.en) {
    return scheme.localizedNames.en;
  }
  if (scheme.nameLocal && scheme.nameLocal.en) {
    return scheme.nameLocal.en;
  }
  return scheme.name || '';
}

export function getSchemeDescription(scheme?: Scheme | null, lang: LanguageCode = 'en'): string {
  if (!scheme) return '';
  if (scheme.localizedDescriptions && scheme.localizedDescriptions[lang]) {
    return scheme.localizedDescriptions[lang];
  }
  if (scheme.localizedDescriptions && scheme.localizedDescriptions.en) {
    return scheme.localizedDescriptions.en;
  }
  return scheme.description || '';
}

export function getSchemeSimplified(scheme?: Scheme | null, lang: LanguageCode = 'en'): string {
  if (!scheme) return '';
  if (scheme.simplifiedExplanation && scheme.simplifiedExplanation[lang]) {
    return scheme.simplifiedExplanation[lang];
  }
  if (scheme.simplifiedExplanation && scheme.simplifiedExplanation.en) {
    return scheme.simplifiedExplanation.en;
  }
  return getSchemeDescription(scheme, lang);
}

export function getSchemeDocuments(scheme?: Scheme | null): RequiredDocument[] {
  if (!scheme) return [];
  return scheme.requiredDocuments || scheme.documentsRequired || [];
}

export function getSchemePortalUrl(scheme?: Scheme | null): string {
  if (!scheme) return '#';
  return scheme.officialPortalUrl || scheme.officialUrl || scheme.applicationUrl || 'https://www.myscheme.gov.in';
}
