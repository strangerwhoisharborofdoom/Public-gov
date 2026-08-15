import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  Sparkles, 
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Building,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { CitizenProfile, EligibilityMatchResult, LanguageCode, Scheme } from '../types';
import { getTranslation } from '../i18n/translations';
import { EligibilityEngine } from '../services/eligibilityEngine';
import { SpeechService } from '../services/speechService';
import { GeminiService } from '../services/geminiService';
import { getSchemeName, getSchemeDescription, getSchemeSimplified, getSchemeDocuments, getSchemePortalUrl } from '../utils/schemeHelpers';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  profile: CitizenProfile;
  currentLanguage: LanguageCode;
  isSaved: boolean;
  onToggleSave: (schemeId: string) => void;
  onClose: () => void;
  onStartApplication: (scheme: Scheme) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  profile,
  currentLanguage,
  isSaved,
  onToggleSave,
  onClose,
  onStartApplication
}) => {
  if (!scheme) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'documents' | 'process'>('overview');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);
  const [loadingSimplified, setLoadingSimplified] = useState(false);

  const matchResult: EligibilityMatchResult = EligibilityEngine.evaluateScheme(profile, scheme);
  const localizedName = getSchemeName(scheme, currentLanguage);
  const defaultExplanation = getSchemeSimplified(scheme, currentLanguage);
  const documents = getSchemeDocuments(scheme);
  const portalUrl = getSchemePortalUrl(scheme);

  const handleReadAloud = () => {
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      const text = `${localizedName}. Ministry: ${scheme.ministry}. Benefit: ${scheme.benefit}. Overview: ${
        defaultExplanation || scheme.description
      }`;
      setIsSpeaking(true);
      SpeechService.speakText(text, currentLanguage, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  const handleLoadSimplified = async () => {
    setLoadingSimplified(true);
    const res = await GeminiService.explainSimply(scheme, currentLanguage);
    setSimplifiedText(res);
    setLoadingSimplified(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="scheme-detail-modal"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50/70 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-stone-200 text-stone-800">
                {scheme.ministry}
              </span>
              {scheme.isVerifiedSource && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> {getTranslation(currentLanguage, 'verified')}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
              {localizedName}
            </h2>
            {currentLanguage !== 'en' && (
              <p className="text-xs text-stone-500 italic mt-0.5">{scheme.name}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleReadAloud}
              className={`p-2 rounded-xl border transition-colors ${
                isSpeaking ? 'bg-amber-500 text-white border-amber-600 animate-pulse' : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
              }`}
              title="Listen aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(scheme.id)}
              className="p-2 rounded-xl bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              title="Save scheme"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-700" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-4 sm:px-6 bg-white gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Benefits' },
            { id: 'eligibility', label: 'Eligibility Conditions' },
            { id: 'documents', label: `Documents (${documents.length})` },
            { id: 'process', label: 'Application Steps' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-700 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm text-stone-800">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Benefit Banner */}
              <div className="p-4 rounded-2xl bg-orange-50/90 border border-orange-200 text-orange-950">
                <span className="text-xs font-semibold uppercase tracking-wider block text-orange-800 mb-1">
                  Scheme Benefit & Coverage
                </span>
                <p className="text-base sm:text-lg font-bold">{scheme.benefit}</p>
              </div>

              {/* AI Explain Simply Card */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Plain Language Explanation
                  </span>
                  {!simplifiedText && (
                    <button
                      onClick={handleLoadSimplified}
                      disabled={loadingSimplified}
                      className="text-xs font-semibold text-amber-800 underline hover:text-amber-950"
                    >
                      {loadingSimplified ? 'Refreshing...' : 'Generate New Summary'}
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-800">
                  {simplifiedText || defaultExplanation}
                </p>
              </div>

              {/* Official Description */}
              <div>
                <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Official Scheme Overview
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              {/* Ministry and Verification Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="text-stone-500 block mb-0.5">Administering Ministry:</span>
                  <span className="font-semibold text-stone-900">{scheme.ministry}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="text-stone-500 block mb-0.5">Last Verified Source:</span>
                  <span className="font-semibold text-stone-900">{scheme.lastVerifiedDate}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              {/* Match Result Banner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-stone-900">
                    Deterministic Profile Match Score: {matchResult.matchScore}%
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {matchResult.status}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mb-1">{matchResult.summaryText}</p>
                <p className="text-[11px] text-stone-600 italic">
                  * {matchResult.disclaimer}
                </p>
              </div>

              {/* Matched Rules Checklist */}
              <div>
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                  Matched Conditions ({matchResult.matchedRules.length})
                </h4>
                <div className="space-y-1.5">
                  {matchResult.matchedRules.map((res, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-center gap-2 text-emerald-950 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{res.reason}</span>
                    </div>
                  ))}
                  {matchResult.matchedRules.length === 0 && (
                    <p className="text-xs text-stone-500">No profile matches recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Unknown or Confirmation Needed Rules */}
              {matchResult.unknownRules.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                    Needs Confirmation During Application ({matchResult.unknownRules.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchResult.unknownRules.map((res, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center gap-2 text-amber-950">
                        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{res.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                You will need the following valid documents ready before proceeding to final portal submission:
              </p>
              <div className="space-y-2">
                {documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs text-stone-900">{doc.name}</h5>
                          {doc.isMandatory ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              MANDATORY
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded">
                              OPTIONAL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">{doc.purpose}</p>
                        {doc.issuingAuthority && (
                          <span className="text-[10px] text-stone-500 block mt-0.5">
                            Authority: {doc.issuingAuthority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Step-by-Step Workflow
              </h4>
              <div className="space-y-3">
                {scheme.applicationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs text-stone-800 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              {scheme.helplineNumber && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                  <span>Official Toll-Free Helpline:</span>
                  <span className="font-bold text-sm text-amber-900">{scheme.helplineNumber}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50/80 flex flex-wrap items-center justify-between gap-3">
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-800"
          >
            <span>{getTranslation(currentLanguage, 'continueToOfficialPortal')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold border border-stone-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartApplication(scheme);
              }}
              className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <span>{getTranslation(currentLanguage, 'startApplication')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
