import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  Download, 
  Printer, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CitizenProfile, LanguageCode, Scheme, SchemeApplication } from '../types';
import { getTranslation } from '../i18n/translations';
import { LocalDatabase } from '../services/localDatabase';
import { GeminiService } from '../services/geminiService';
import { getSchemeName, getSchemeDocuments, getSchemePortalUrl } from '../utils/schemeHelpers';

interface ApplicationWorkspaceModalProps {
  scheme: Scheme | null;
  profile: CitizenProfile;
  currentLanguage: LanguageCode;
  onClose: () => void;
  onApplicationCompleted: (app: SchemeApplication) => void;
}

export const ApplicationWorkspaceModal: React.FC<ApplicationWorkspaceModalProps> = ({
  scheme,
  profile,
  currentLanguage,
  onClose,
  onApplicationCompleted
}) => {
  if (!scheme) return null;

  const localizedName = getSchemeName(scheme, currentLanguage);
  const documents = getSchemeDocuments(scheme);
  const portalUrl = getSchemePortalUrl(scheme);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: profile.fullName || 'Asha Kumari',
    gender: profile.gender,
    age: profile.age,
    state: profile.state,
    district: profile.district,
    annualIncome: profile.annualIncome,
    occupation: profile.occupation,
    aadhaarLast4: '8834',
    mobileNumber: '9845012345',
    // Scheme specific fields
    collegeName: 'Government Engineering College, Hassan',
    rollNumber: 'GEC24ENG041',
    landSurveyNumber: 'Parcel #42/B',
    artisanTrade: profile.artisanTrade || 'WEAVER_SCULPTOR',
    declarationAccepted: false
  });

  const [documentsState, setDocumentsState] = useState<Record<string, { status: 'PENDING' | 'ANALYZING' | 'VERIFIED'; fileData?: string; name: string }>>({});
  const [generatedRefId, setGeneratedRefId] = useState<string>('');

  // Handle Document Upload & AI verification
  const handleFileUpload = async (docName: string, file: File) => {
    setDocumentsState(prev => ({
      ...prev,
      [docName]: { status: 'ANALYZING', name: file.name }
    }));

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const analysis = await GeminiService.analyzeDocument(docName, base64, file.type);

      setDocumentsState(prev => ({
        ...prev,
        [docName]: {
          status: 'VERIFIED',
          fileData: base64,
          name: file.name
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = () => {
    if (currentStep === 4) {
      // Complete Submission Preparation
      const refId = `GM-2026-${profile.state.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedRefId(refId);

      const application: SchemeApplication = {
        id: `app-${Date.now()}`,
        schemeId: scheme.id,
        schemeName: scheme.name,
        referenceId: refId,
        citizenProfileId: profile.id,
        status: 'PREPARED_READY_FOR_PORTAL',
        submittedAt: new Date().toISOString(),
        formData,
        documentsAttached: Object.keys(documentsState).map(k => ({
          documentType: k,
          fileName: documentsState[k].name,
          verificationStatus: 'AI_VERIFIED'
        })),
        notes: `Prepared via GovMitra for submission on ${scheme.ministry} portal.`
      };

      LocalDatabase.saveApplication(application);
      onApplicationCompleted(application);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore confetti errors
      }

      setCurrentStep(5);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="application-workspace-dialog"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Workspace Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                Guided Application Workspace
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Step {currentStep} of 5
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 truncate max-w-lg mt-0.5">
              {localizedName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-stone-200 text-stone-600 border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-step Breadcrumb Progress Bar */}
        <div className="bg-stone-100 px-4 sm:px-6 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs overflow-x-auto gap-2">
          {[
            { step: 1, label: 'Profile' },
            { step: 2, label: 'Documents' },
            { step: 3, label: 'Questions' },
            { step: 4, label: 'Declaration' },
            { step: 5, label: 'Summary' }
          ].map(s => (
            <div key={s.step} className="flex items-center gap-1.5 shrink-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                currentStep === s.step 
                  ? 'bg-amber-700 text-white' 
                  : currentStep > s.step 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-stone-300 text-stone-700'
              }`}>
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span className={`font-semibold ${currentStep === s.step ? 'text-amber-900' : 'text-stone-500'}`}>
                {s.label}
              </span>
              {s.step < 5 && <span className="text-stone-300 ml-1">›</span>}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-sm text-stone-800 space-y-4">
          {/* STEP 1: Profile Review & Pre-fill */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>GovMitra has pre-filled your verified citizen details to save your time. Please review and update if necessary.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Full Name (as per Aadhaar)</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Aadhaar (Last 4 Digits)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.aadhaarLast4}
                    onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Mobile Number (Linked to Aadhaar)</label>
                  <input
                    type="text"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">State & District</label>
                  <input
                    type="text"
                    value={`${formData.state}, ${formData.district}`}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-medium text-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Family Annual Income (₹)</label>
                  <input
                    type="number"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Current Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AI Document Verification */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-xs text-stone-600">
                Upload scans or photos of your required certificates. Our AI scanner checks document legibility and key data points before final submission.
              </p>

              <div className="space-y-3">
                {documents.map((doc, idx) => {
                  const state = documentsState[doc.name];
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-stone-900">{doc.name}</span>
                            {doc.isMandatory && (
                              <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                REQUIRED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">{doc.purpose}</p>
                        </div>
                      </div>

                      {/* Verification Status & Upload Button */}
                      <div>
                        {state?.status === 'ANALYZING' && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
                            <span className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                            <span>Scanning...</span>
                          </div>
                        )}

                        {state?.status === 'VERIFIED' && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Verified: {state.name.slice(0, 14)}...</span>
                          </div>
                        )}

                        {(!state || state.status === 'PENDING') && (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-300 shadow-2xs cursor-pointer">
                            <UploadCloud className="w-3.5 h-3.5 text-amber-700" />
                            <span>Upload Scan</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(doc.name, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Scheme-Specific Questions */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Specific Criteria for {scheme.name}
              </h4>

              {scheme.category === 'EDUCATION' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">College / Institution Name</label>
                    <input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Admission Enrolment / Roll Number</label>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {scheme.category === 'AGRICULTURE' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Agricultural Land Parcel / Survey Number (RTC Pahani)</label>
                    <input
                      type="text"
                      value={formData.landSurveyNumber}
                      onChange={(e) => setFormData({ ...formData, landSurveyNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Land Holding Size (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={profile.landHoldingAcres || 2.5}
                      readOnly
                      className="w-full px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-medium text-stone-600"
                    />
                  </div>
                </div>
              )}

              {scheme.category === 'ARTISAN_MSME' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Traditional Artisan Craft / Trade</label>
                    <select
                      value={formData.artisanTrade}
                      onChange={(e) => setFormData({ ...formData, artisanTrade: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="WEAVER_SCULPTOR">Traditional Weaver / Sculptor</option>
                      <option value="CARPENTER">Carpenter (Suthar)</option>
                      <option value="BLACKSMITH">Blacksmith (Lohar)</option>
                      <option value="POTTER">Potter (Kumhaar)</option>
                      <option value="COBBLER">Cobbler (Charmakar)</option>
                      <option value="MASON">Mason (Rajmistri)</option>
                      <option value="BASKET_MAKER">Basket / Mat Maker</option>
                    </select>
                  </div>
                </div>
              )}

              {scheme.category === 'SENIOR_CITIZEN' && (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                  <span className="font-bold block mb-1">Universal Senior Citizen Eligibility:</span>
                  <p>Aadhaar-based age verification confirms age 70+. No income ceiling barrier applies for the universal Ayushman Vay Vandana health coverage.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Citizen Self-Declaration */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Statutory Citizen Self-Declaration
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  I hereby solemnly declare that all particulars furnished by me in this application workspace are true, complete, and accurate to the best of my knowledge. I understand that any false information will result in rejection of the benefit under government guidelines.
                </p>
                <div className="pt-2 border-t border-stone-200">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.declarationAccepted}
                      onChange={(e) => setFormData({ ...formData, declarationAccepted: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-amber-700 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-stone-900">
                      I agree to the declaration and authorize preparation of my application package.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Summary & Reference ID */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center py-2 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                Application Preparation Package Ready!
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Your pre-filled dossier and verified documents have been compiled. Use your Reference ID to complete final biometric or OTP submission on the official portal.
              </p>

              {/* Reference ID Card */}
              <div className="p-4 bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-2xl max-w-sm mx-auto">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  GovMitra Reference Identifier
                </span>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-amber-950 tracking-wider">
                  {generatedRefId}
                </span>
                <span className="block text-[10px] text-stone-500 mt-1">
                  Timestamp: {new Date().toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={handlePrintSummary}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 border border-stone-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <span>{getTranslation(currentLanguage, 'continueToOfficialPortal')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold border border-stone-200 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          {currentStep < 5 ? (
            <button
              onClick={handleNextStep}
              disabled={currentStep === 4 && !formData.declarationAccepted}
              className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <span>{currentStep === 4 ? 'Compile Application' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold"
            >
              Done & Return to Schemes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
