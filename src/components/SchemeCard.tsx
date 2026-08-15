import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { CitizenProfile, EligibilityMatchResult, LanguageCode, Scheme } from '../types';
import { getTranslation } from '../i18n/translations';
import { EligibilityEngine } from '../services/eligibilityEngine';
import { SpeechService } from '../services/speechService';
import { GeminiService } from '../services/geminiService';
import { getSchemeName, getSchemeSimplified, getSchemeDocuments } from '../utils/schemeHelpers';

interface SchemeCardProps {
  scheme: Scheme;
  profile: CitizenProfile;
  currentLanguage: LanguageCode;
  isSaved: boolean;
  onToggleSave: (schemeId: string) => void;
  onOpenDetails: (scheme: Scheme) => void;
  onStartApplication: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  profile,
  currentLanguage,
  isSaved,
  onToggleSave,
  onOpenDetails,
  onStartApplication
}) => {
  const [showSimplified, setShowSimplified] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);
  const [loadingSimplified, setLoadingSimplified] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Deterministically evaluate eligibility
  const matchResult: EligibilityMatchResult = EligibilityEngine.evaluateScheme(profile, scheme);

  const localizedName = getSchemeName(scheme, currentLanguage);
  const defaultExplanation = getSchemeSimplified(scheme, currentLanguage);
  const documents = getSchemeDocuments(scheme);

  const handleToggleExplain = async () => {
    if (!showSimplified) {
      if (!simplifiedText) {
        setLoadingSimplified(true);
        const text = await GeminiService.explainSimply(scheme, currentLanguage);
        setSimplifiedText(text);
        setLoadingSimplified(false);
      }
      setShowSimplified(true);
    } else {
      setShowSimplified(false);
    }
  };

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      const textToSpeak = `${localizedName}. ${scheme.benefit}. ${
        showSimplified && simplifiedText ? simplifiedText : (defaultExplanation || scheme.description)
      }`;
      setIsSpeaking(true);
      SpeechService.speakText(
        textToSpeak, 
        currentLanguage, 
        () => setIsSpeaking(true), 
        () => setIsSpeaking(false)
      );
    }
  };

  // Match score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-800 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-400';
  };

  return (
    <div 
      id={`scheme-card-${scheme.id}`}
      className={`rounded-2xl border bg-white p-4 sm:p-5 transition-all hover:shadow-md flex flex-col justify-between ${
        matchResult.status === 'HIGH_MATCH' 
          ? 'border-emerald-200 shadow-xs ring-1 ring-emerald-500/20' 
          : 'border-stone-200'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              {scheme.ministry}
            </span>
            {scheme.isVerifiedSource && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> {getTranslation(currentLanguage, 'verified')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReadAloud}
              title={isSpeaking ? "Stop Audio" : "Listen to scheme details"}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSpeaking 
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(scheme.id)}
              title={isSaved ? "Saved" : "Save Scheme"}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved 
                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-700" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-snug tracking-tight mb-1">
          {localizedName}
        </h3>
        {currentLanguage !== 'en' && (
          <p className="text-xs text-stone-500 mb-2 italic">
            {scheme.name}
          </p>
        )}

        {/* Benefit Highlight Pill */}
        <div className="inline-block px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-950 font-bold text-xs sm:text-sm mb-3">
          🎁 {scheme.benefit}
        </div>

        {/* Deterministic Match Score Meter */}
        <div className={`p-2.5 rounded-xl border mb-3 ${getScoreColor(matchResult.matchScore)}`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {matchResult.status === 'HIGH_MATCH' 
                ? 'High Eligibility Match' 
                : matchResult.status === 'POTENTIAL_MATCH'
                ? 'Potential Match'
                : 'Condition Check Required'}
            </span>
            <span className="font-bold text-sm">{matchResult.matchScore}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden mb-1.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(matchResult.matchScore)}`}
              style={{ width: `${matchResult.matchScore}%` }}
            ></div>
          </div>

          <p className="text-[11px] leading-tight opacity-90">
            {matchResult.summaryText}
          </p>
        </div>

        {/* Explain Simply Accordion */}
        <div className="mb-3">
          <button
            onClick={handleToggleExplain}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-semibold transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {getTranslation(currentLanguage, 'explainSimply')}
            </span>
            {showSimplified ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSimplified && (
            <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-stone-800 leading-relaxed animate-in fade-in">
              {loadingSimplified ? (
                <div className="flex items-center gap-2 text-stone-500">
                  <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                  Simplifying official guidelines...
                </div>
              ) : (
                <p>
                  {simplifiedText || defaultExplanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Required Documents Mini Badges */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Required Documents ({documents.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {documents.slice(0, 3).map((doc, idx) => (
              <span key={idx} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200">
                {doc.name}
              </span>
            ))}
            {documents.length > 3 && (
              <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-medium">
                +{documents.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
        <button
          id={`scheme-details-btn-${scheme.id}`}
          onClick={() => onOpenDetails(scheme)}
          className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors text-center"
        >
          View Details
        </button>
        <button
          id={`scheme-apply-btn-${scheme.id}`}
          onClick={() => onStartApplication(scheme)}
          className="flex-1 py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs"
        >
          <span>{getTranslation(currentLanguage, 'startApplication')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
