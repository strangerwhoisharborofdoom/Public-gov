import React, { useState } from 'react';
import { 
  User, 
  Save, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  Volume2, 
  Eye, 
  Sparkles,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { CitizenProfile, LanguageCode } from '../types';
import { getTranslation } from '../i18n/translations';
import { LocalDatabase } from '../services/localDatabase';

interface CitizenProfileViewProps {
  profile: CitizenProfile;
  onProfileUpdate: (updated: CitizenProfile) => void;
  currentLanguage: LanguageCode;
}

export const CitizenProfileView: React.FC<CitizenProfileViewProps> = ({
  profile,
  onProfileUpdate,
  currentLanguage
}) => {
  const [formData, setFormData] = useState<CitizenProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(formData);
    LocalDatabase.saveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to delete all stored profile details and applications?')) {
      LocalDatabase.deleteAllUserData();
      window.location.reload();
    }
  };

  return (
    <div id="citizen-profile-container" className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {getTranslation(currentLanguage, 'profile')}
            </h2>
            <p className="text-xs text-stone-500">
              Deterministic rule parameters for calculating scheme eligibility accurately
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved & Evaluated</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Demographics Card */}
        <div className="p-4 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            Basic Citizen Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Age (Years)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="FEMALE">Female (ಮಹಿಳೆ / महिला)</option>
                <option value="MALE">Male (ಪುರುಷ / पुरुष)</option>
                <option value="TRANSGENDER">Transgender (ಇತರೆ / अन्य)</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Family Annual Income (₹)</label>
              <input
                type="number"
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Socio-Economic & Occupational Sector Card */}
        <div className="p-4 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            Occupation & Special Criteria
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Occupation</label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="STUDENT">Student (ವಿದ್ಯಾರ್ಥಿ / छात्र)</option>
                <option value="FARMER">Farmer (ರೈತ / किसान)</option>
                <option value="ARTISAN">Traditional Artisan (ಕುಶಲಕರ್ಮಿ / शिल्पकार)</option>
                <option value="RETIRED">Senior Citizen / Retired (ಹಿರಿಯರು / सेवानिवृत्त)</option>
                <option value="SELF_EMPLOYED">Self-Employed / Street Vendor</option>
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {formData.occupation === 'STUDENT' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Student Education Level</label>
                <select
                  value={formData.studentLevel || 'UNDERGRADUATE'}
                  onChange={(e) => setFormData({ ...formData, studentLevel: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="SECONDARY">Secondary (10th)</option>
                  <option value="HIGHER_SECONDARY">Higher Secondary (12th / PUC)</option>
                  <option value="UNDERGRADUATE">Degree / Engineering / Diploma</option>
                  <option value="POSTGRADUATE">Postgraduate / Ph.D.</option>
                </select>
              </div>
            )}

            {formData.occupation === 'FARMER' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Landholding Size (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.landHoldingAcres || 0}
                  onChange={(e) => setFormData({ ...formData, landHoldingAcres: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Ration Card Category</label>
              <select
                value={formData.rationCardType || 'BPL'}
                onChange={(e) => setFormData({ ...formData, rationCardType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="BPL">BPL (Below Poverty Line / ಬಿಪಿಎಲ್)</option>
                <option value="AAY">AAY (Antyodaya Anna Yojana / ಅತ್ಯಂತ ಹಿಂದುಳಿದ)</option>
                <option value="APL">APL (Above Poverty Line / ಎಪಿಎಲ್)</option>
                <option value="NONE">None</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isArtisan}
                onChange={(e) => setFormData({ ...formData, isArtisan: e.target.checked })}
                className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Registered Traditional Artisan / Craftsperson</span>
                <span className="text-[11px] text-stone-500">Qualifies for PM Vishwakarma toolkit & loans</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasDisability}
                onChange={(e) => setFormData({ ...formData, hasDisability: e.target.checked })}
                className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Person with Disability (Divyangjan)</span>
                <span className="text-[11px] text-stone-500">Qualifies for ADIP aids & special concessions</span>
              </div>
            </label>
          </div>
        </div>

        {/* Accessibility & Voice Preferences */}
        <div className="p-4 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-600" />
            Accessibility & Speech Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.seniorMode}
                onChange={(e) => setFormData({ ...formData, seniorMode: e.target.checked })}
                className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Senior Citizen Mode</span>
                <span className="text-[11px] text-stone-500">Large font sizing & simplified card layouts</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.voiceReadAloud}
                onChange={(e) => setFormData({ ...formData, voiceReadAloud: e.target.checked })}
                className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Auto Voice Read-Aloud</span>
                <span className="text-[11px] text-stone-500">Speak assistant answers automatically</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.highContrast}
                onChange={(e) => setFormData({ ...formData, highContrast: e.target.checked })}
                className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">High Contrast Visuals</span>
                <span className="text-[11px] text-stone-500">WCAG AAA contrast boundaries</span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleDeleteData}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{getTranslation(currentLanguage, 'deleteMyData')}</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Citizen Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
