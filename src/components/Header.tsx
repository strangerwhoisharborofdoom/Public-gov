import React, { useState } from 'react';
import { 
  Globe, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Eye, 
  Sparkles, 
  Presentation, 
  Bell, 
  CheckCircle2, 
  RotateCcw,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { CitizenProfile, LanguageCode, NotificationItem } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';
import { LocalDatabase } from '../services/localDatabase';
import { SpeechService } from '../services/speechService';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  profile: CitizenProfile;
  onProfileChange: (profile: CitizenProfile) => void;
  onOpenPresentation: () => void;
  onNavigate: (view: any) => void;
  notifications: NotificationItem[];
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  profile,
  onProfileChange,
  onOpenPresentation,
  onNavigate,
  notifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOfflineSim, setIsOfflineSim] = useState(LocalDatabase.isOffline());
  const [isAiOffSim, setIsAiOffSim] = useState(LocalDatabase.isAiUnavailable());

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleOffline = () => {
    const next = !isOfflineSim;
    setIsOfflineSim(next);
    LocalDatabase.setOfflineSimulation(next);
  };

  const handleToggleAi = () => {
    const next = !isAiOffSim;
    setIsAiOffSim(next);
    LocalDatabase.setAiFailureSimulation(next);
  };

  const handleToggleSeniorMode = () => {
    const updated = { 
      ...profile, 
      seniorMode: !profile.seniorMode,
      highContrast: !profile.seniorMode
    };
    onProfileChange(updated);
    LocalDatabase.saveProfile(updated);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo applications and return to default state?')) {
      LocalDatabase.resetDemoState();
      window.location.reload();
    }
  };

  return (
    <header id="govmitra-header" className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Official Tricolor National Stripe */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Emblem */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onNavigate('home')}
          id="brand-logo-btn"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <span className="font-bold text-lg tracking-tight">GM</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-stone-900 leading-tight">
                {getTranslation(currentLanguage, 'appName')}
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-0.5" /> SIH 2026 PS3
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-none hidden md:block">
              {getTranslation(currentLanguage, 'tagline')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Senior Citizen Accessibility Toggle */}
          <button
            id="senior-mode-toggle-btn"
            onClick={handleToggleSeniorMode}
            title={getTranslation(currentLanguage, 'seniorModeToggle')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              profile.seniorMode 
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Senior Mode</span>
          </button>

          {/* Offline Mode Indicator / Simulator */}
          <button
            id="offline-toggle-btn"
            onClick={handleToggleOffline}
            title="Toggle Offline Room Simulation"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isOfflineSim 
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            {isOfflineSim ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
            <span className="hidden md:inline">{isOfflineSim ? 'Offline Mode' : 'Online'}</span>
          </button>

          {/* AI Unavailable Simulator */}
          {isAiOffSim && (
            <span 
              onClick={handleToggleAi}
              title="AI Failure Mode Active (Deterministic fallback engaged)"
              className="hidden xl:inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-medium cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-rose-600" /> AI Fallback
            </span>
          )}

          {/* Multilingual Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-stone-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="language-select"
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="pl-7 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 border border-stone-200 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                  <h3 className="font-semibold text-xs text-stone-900">Government Scheme Alerts</h3>
                  <span className="text-[10px] text-stone-500">{notifications.length} updates</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2 rounded-lg text-xs transition-colors ${
                        n.read ? 'bg-stone-50 text-stone-600' : 'bg-amber-50 text-amber-950 border border-amber-200'
                      }`}
                      onClick={() => LocalDatabase.markNotificationRead(n.id)}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-[11px] text-stone-900">{n.title}</span>
                        <span className="text-[9px] text-stone-400">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Presentation Mode Pitch Deck Button */}
          <button
            id="presentation-mode-btn"
            onClick={onOpenPresentation}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold shadow-xs transition-transform active:scale-95"
            title="Open SIH 2026 Presentation & Architecture Pitch"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Presentation</span>
          </button>
        </div>
      </div>
    </header>
  );
};
