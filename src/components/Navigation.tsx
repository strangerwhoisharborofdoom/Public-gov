import React from 'react';
import { 
  Home, 
  Search, 
  MessageSquareText, 
  FileCheck2, 
  User, 
  Flame, 
  ShieldCheck, 
  SlidersHorizontal,
  BookmarkCheck,
  CheckCircle
} from 'lucide-react';
import { LanguageCode } from '../types';
import { getTranslation } from '../i18n/translations';

export type NavigationView = 
  | 'home' 
  | 'explore' 
  | 'assistant' 
  | 'applications' 
  | 'profile' 
  | 'judgeHub' 
  | 'trustCenter' 
  | 'admin';

interface NavigationProps {
  activeView: NavigationView;
  onNavigate: (view: NavigationView) => void;
  currentLanguage: LanguageCode;
  applicationCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onNavigate,
  currentLanguage,
  applicationCount
}) => {
  const navItems = [
    { id: 'home', icon: Home, labelKey: 'home' },
    { id: 'explore', icon: Search, labelKey: 'explore' },
    { id: 'assistant', icon: MessageSquareText, labelKey: 'assistant', highlight: true },
    { id: 'applications', icon: FileCheck2, labelKey: 'applications', badge: applicationCount },
    { id: 'profile', icon: User, labelKey: 'profile' },
    { id: 'judgeHub', icon: Flame, labelKey: 'judgeHub', special: true },
    { id: 'trustCenter', icon: ShieldCheck, labelKey: 'trustCenter' },
    { id: 'admin', icon: SlidersHorizontal, labelKey: 'admin' }
  ];

  return (
    <>
      {/* Desktop / Tablet Navigation Rail */}
      <aside 
        id="desktop-nav-rail"
        className="hidden md:flex flex-col w-64 bg-stone-50/90 border-r border-stone-200 p-3 shrink-0 h-[calc(100vh-57px)] sticky top-[57px] justify-between overflow-y-auto"
      >
        <div className="space-y-1.5">
          <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-stone-600 uppercase">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-rail-${item.id}`}
                onClick={() => onNavigate(item.id as NavigationView)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : item.special
                    ? 'bg-orange-100 text-orange-900 hover:bg-orange-200 border border-orange-200'
                    : 'text-stone-700 hover:bg-stone-200/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.special ? 'text-orange-700' : 'text-stone-600'}`} />
                  <span className="truncate">{getTranslation(currentLanguage, item.labelKey)}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-amber-700' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.special && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-600 text-white font-bold animate-pulse">
                    DEMO
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SIH PS3 Info Footer */}
        <div className="p-3 bg-white rounded-xl border border-stone-200 mt-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wide">
              SIH 2026 Ready
            </span>
          </div>
          <p className="text-[11px] text-stone-500 leading-tight">
            Deterministic Rule Engine + Offline-First Local Cache + Multilingual Voice Assistant.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-2 py-1 shadow-lg flex items-center justify-around"
      >
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onNavigate(item.id as NavigationView)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-amber-700 font-semibold' : 'text-stone-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-600 text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 max-w-[64px] truncate text-center">
                {getTranslation(currentLanguage, item.labelKey)}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
