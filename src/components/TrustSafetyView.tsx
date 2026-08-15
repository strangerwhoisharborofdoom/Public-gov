import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ExternalLink, 
  Database, 
  FileText, 
  AlertCircle,
  Cpu
} from 'lucide-react';
import { LanguageCode } from '../types';
import { getTranslation } from '../i18n/translations';

interface TrustSafetyViewProps {
  currentLanguage: LanguageCode;
}

export const TrustSafetyView: React.FC<TrustSafetyViewProps> = ({
  currentLanguage
}) => {
  return (
    <div id="trust-safety-view" className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center font-bold text-lg shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {getTranslation(currentLanguage, 'trustCenter')}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent disclosure on AI boundaries, hallucination mitigation, verified sources, and citizen privacy.
          </p>
        </div>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-stone-900">Deterministic Eligibility</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            AI language models are NEVER allowed to make eligibility calculations. All criteria are evaluated strictly using deterministic mathematical rules based on official gazette limits.
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-stone-900">Official Source Grounding</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every scheme summary is grounded directly in published ministry notifications (myscheme.gov.in, NSP, PM-KISAN) with verified timestamps and official helpline references.
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-stone-900">Local-First Citizen Privacy</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Citizen demographics, family income, and draft application packages stay safely stored in your local browser sandbox. Citizens can purge all records with one click.
          </p>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer */}
      <div className="p-5 bg-amber-50 rounded-3xl border border-amber-200 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          <span>Statutory National Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          GovMitra is an assistive citizen preparation platform built for the Smart India Hackathon 2026. All matches indicate potential eligibility based on user-supplied criteria. The final right of sanction and benefit disbursement rests solely with the respective Central or State Government department.
        </p>
      </div>

      {/* Official Government Portals Registry */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
          Verified National Source Repositories
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { name: 'myScheme National Portal', url: 'https://www.myscheme.gov.in', ministry: 'MeitY & Digital India' },
            { name: 'National Scholarship Portal (NSP)', url: 'https://scholarships.gov.in', ministry: 'Ministry of Education' },
            { name: 'PM-KISAN Samman Nidhi', url: 'https://pmkisan.gov.in', ministry: 'Ministry of Agriculture' },
            { name: 'PM Vishwakarma Portal', url: 'https://pmvishwakarma.gov.in', ministry: 'Ministry of MSME' },
            { name: 'Ayushman Bharat PM-JAY & Vay Vandana', url: 'https://nha.gov.in', ministry: 'National Health Authority' },
            { name: 'PM Surya Ghar Muft Bijli', url: 'https://pmsuryaghar.gov.in', ministry: 'Ministry of New & Renewable Energy' }
          ].map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-stone-50 rounded-2xl border border-stone-200 hover:bg-stone-100 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-bold text-stone-900 group-hover:text-amber-800 block">{portal.name}</span>
                <span className="text-[11px] text-stone-500">{portal.ministry}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-amber-700" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
