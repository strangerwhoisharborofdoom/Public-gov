import React from 'react';
import { 
  FileCheck2, 
  Clock, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { LanguageCode, Scheme, SchemeApplication } from '../types';
import { getTranslation } from '../i18n/translations';
import { getSchemeName, getSchemePortalUrl } from '../utils/schemeHelpers';

interface ApplicationsViewProps {
  applications: SchemeApplication[];
  schemes: Scheme[];
  currentLanguage: LanguageCode;
  onOpenSchemeDetails: (scheme: Scheme) => void;
  onStartNewApplication: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  schemes,
  currentLanguage,
  onOpenSchemeDetails,
  onStartNewApplication
}) => {
  return (
    <div id="my-applications-view" className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-lg">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {getTranslation(currentLanguage, 'applications')}
            </h2>
            <p className="text-xs text-stone-500">
              Track guided preparation dossiers, verified document attachments, and official portal links
            </p>
          </div>
        </div>

        <button
          onClick={onStartNewApplication}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <span>Explore New Schemes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900 mb-1">
              {getTranslation(currentLanguage, 'noApplications')}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Find a scheme matching your profile or ask Mitra Assistant to begin your first guided application.
            </p>
          </div>
          <button
            onClick={onStartNewApplication}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Start Discovering Schemes
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const scheme = schemes.find(s => s.id === app.schemeId);
            return (
              <div
                key={app.id}
                id={`application-item-${app.id}`}
                className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      READY FOR PORTAL
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      REF: {app.referenceId}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900">
                    {scheme ? getSchemeName(scheme, currentLanguage) : app.schemeName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      {app.documentsAttached.length} Documents Attached
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {scheme && (
                    <button
                      onClick={() => onOpenSchemeDetails(scheme)}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold"
                    >
                      Details
                    </button>
                  )}

                  {scheme && (
                    <a
                      href={getSchemePortalUrl(scheme)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Proceed to Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
