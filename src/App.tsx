import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  Navigation, 
  NavigationView 
} from './components/Navigation';
import { 
  ConversationalSearch 
} from './components/ConversationalSearch';
import { 
  SchemeCard 
} from './components/SchemeCard';
import { 
  SchemeDetailModal 
} from './components/SchemeDetailModal';
import { 
  ApplicationWorkspaceModal 
} from './components/ApplicationWorkspaceModal';
import { 
  AssistantView 
} from './components/AssistantView';
import { 
  CitizenProfileView 
} from './components/CitizenProfileView';
import { 
  JudgeDemoHubView 
} from './components/JudgeDemoHubView';
import { 
  TrustSafetyView 
} from './components/TrustSafetyView';
import { 
  AdminConsoleView 
} from './components/AdminConsoleView';
import { 
  ApplicationsView 
} from './components/ApplicationsView';
import { 
  PresentationModeModal 
} from './components/PresentationModeModal';

import { 
  CitizenProfile, 
  LanguageCode, 
  Scheme, 
  SchemeApplication, 
  SchemeCategory 
} from './types';
import { getTranslation } from './i18n/translations';
import { LocalDatabase } from './services/localDatabase';
import { EligibilityEngine } from './services/eligibilityEngine';
import { JudgeScenario } from './data/demoScenarios';
import { 
  GraduationCap, 
  Tractor, 
  HeartHandshake, 
  Hammer, 
  Home as HomeIcon, 
  Activity, 
  Baby, 
  Accessibility, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Search,
  Filter,
  Flame,
  ArrowRight
} from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<NavigationView>('home');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('kn'); // Default to Kannada as per DECODE SIH PS3 showcase
  const [profile, setProfile] = useState<CitizenProfile>(LocalDatabase.getProfile());
  const [schemes, setSchemes] = useState<Scheme[]>(LocalDatabase.getSchemes());
  const [applications, setApplications] = useState<SchemeApplication[]>(LocalDatabase.getApplications());
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(LocalDatabase.getSavedSchemeIds());
  const [notifications, setNotifications] = useState(LocalDatabase.getNotifications());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals
  const [selectedSchemeForDetail, setSelectedSchemeForDetail] = useState<Scheme | null>(null);
  const [selectedSchemeForApplication, setSelectedSchemeForApplication] = useState<Scheme | null>(null);
  const [showPresentationMode, setShowPresentationMode] = useState(false);

  // Sync state with LocalDatabase updates
  useEffect(() => {
    const unsubscribe = LocalDatabase.subscribe(() => {
      setProfile(LocalDatabase.getProfile());
      setSchemes(LocalDatabase.getSchemes());
      setApplications(LocalDatabase.getApplications());
      setSavedSchemeIds(LocalDatabase.getSavedSchemeIds());
      setNotifications(LocalDatabase.getNotifications());
    });
    return () => unsubscribe();
  }, []);

  // When profile updates, update language if changed
  const handleProfileChange = (updated: CitizenProfile) => {
    setProfile(updated);
    if (updated.preferredLanguage && updated.preferredLanguage !== currentLanguage) {
      setCurrentLanguage(updated.preferredLanguage);
    }
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    const updated = { ...profile, preferredLanguage: lang };
    setProfile(updated);
    LocalDatabase.saveProfile(updated);
  };

  // Conversational Search triggered from Home
  const handleConversationalSearch = (query: string) => {
    setSearchQuery(query);
    setActiveView('assistant');
  };

  // Judge Scenario 1-Click Execution
  const handleSelectScenario = (scenario: JudgeScenario) => {
    setProfile(scenario.citizenProfile);
    LocalDatabase.saveProfile(scenario.citizenProfile);
    setCurrentLanguage(scenario.defaultLanguage);
    
    // Switch to Assistant or Home with scenario context
    setActiveView('assistant');
  };

  const handleToggleSaveScheme = (schemeId: string) => {
    LocalDatabase.toggleSaveScheme(schemeId);
  };

  // Rank schemes deterministically for current profile
  const rankedSchemes = EligibilityEngine.rankSchemesForProfile(profile, schemes);

  // Categories list for Explore view
  const categoryFilters = [
    { id: 'ALL', label: 'All Categories', icon: Sparkles },
    { id: 'EDUCATION', label: 'Education & Scholarships', icon: GraduationCap },
    { id: 'AGRICULTURE', label: 'Agriculture & Farming', icon: Tractor },
    { id: 'SENIOR_CITIZEN', label: 'Senior Citizens', icon: HeartHandshake },
    { id: 'ARTISAN_MSME', label: 'Artisans & MSME', icon: Hammer },
    { id: 'HOUSING', label: 'Housing & Solar Energy', icon: HomeIcon },
    { id: 'HEALTHCARE', label: 'Healthcare & Wellness', icon: Activity },
    { id: 'WOMEN_CHILD', label: 'Women & Child Development', icon: Baby },
    { id: 'DISABILITY', label: 'Divyangjan / Disability', icon: Accessibility },
    { id: 'EMPLOYMENT', label: 'Skill India & Jobs', icon: Briefcase }
  ];

  const filteredSchemes = rankedSchemes.filter(item => {
    const s = item.scheme;
    const matchCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className={`min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans ${
      profile.seniorMode ? 'text-base' : 'text-sm'
    }`}>
      {/* Top Application Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        profile={profile}
        onProfileChange={handleProfileChange}
        onOpenPresentation={() => setShowPresentationMode(true)}
        onNavigate={setActiveView}
        notifications={notifications}
      />

      {/* Main Adaptive Layout */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Material 3 Desktop / Tablet Navigation Rail */}
        <Navigation
          activeView={activeView}
          onNavigate={setActiveView}
          currentLanguage={currentLanguage}
          applicationCount={applications.length}
        />

        {/* Dynamic Main Content Canvas */}
        <main className="flex-1 p-3 sm:p-6 pb-20 md:pb-6 overflow-y-auto max-w-full">
          {/* VIEW: HOME */}
          {activeView === 'home' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Central Multilingual Voice & Conversational Search */}
              <ConversationalSearch
                currentLanguage={currentLanguage}
                onSearch={handleConversationalSearch}
              />

              {/* SIH Judge Demo Shortcut Banner */}
              <div 
                onClick={() => setActiveView('judgeHub')}
                className="p-4 rounded-3xl bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 text-white cursor-pointer shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-white shrink-0">
                    <Flame className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base leading-tight">
                      SIH 2026 Judge Demo Hub & Scenario Simulator
                    </h3>
                    <p className="text-xs text-amber-100 mt-0.5">
                      1-Click Student (Asha in Kannada), Farmer (Ravi), Senior (Lakshmi) & Artisan (Meera) test personas.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-xs font-bold bg-white text-stone-900 px-3 py-1.5 rounded-xl">
                  <span>Explore Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Recommended Schemes for Citizen Profile */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-stone-900 tracking-tight">
                      {getTranslation(currentLanguage, 'recommendedForYou')}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Calculated deterministically based on {profile.fullName}'s profile ({profile.occupation}, {profile.state})
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveView('explore')}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                  >
                    <span>View All ({schemes.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rankedSchemes.slice(0, 6).map(({ scheme }) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      profile={profile}
                      currentLanguage={currentLanguage}
                      isSaved={savedSchemeIds.includes(scheme.id)}
                      onToggleSave={handleToggleSaveScheme}
                      onOpenDetails={setSelectedSchemeForDetail}
                      onStartApplication={setSelectedSchemeForApplication}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: EXPLORE SCHEMES */}
          {activeView === 'explore' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                    {getTranslation(currentLanguage, 'explore')}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Comprehensive dataset of verified Central & State Government Welfare Schemes
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by keyword or tags..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {categoryFilters.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isSelected 
                          ? 'bg-amber-700 text-white shadow-xs' 
                          : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-700'}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scheme Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSchemes.map(({ scheme }) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    profile={profile}
                    currentLanguage={currentLanguage}
                    isSaved={savedSchemeIds.includes(scheme.id)}
                    onToggleSave={handleToggleSaveScheme}
                    onOpenDetails={setSelectedSchemeForDetail}
                    onStartApplication={setSelectedSchemeForApplication}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: MITRA ASSISTANT */}
          {activeView === 'assistant' && (
            <AssistantView
              currentLanguage={currentLanguage}
              profile={profile}
              onOpenSchemeDetails={setSelectedSchemeForDetail}
              onStartApplication={setSelectedSchemeForApplication}
              onOpenProfile={() => setActiveView('profile')}
            />
          )}

          {/* VIEW: MY APPLICATIONS */}
          {activeView === 'applications' && (
            <ApplicationsView
              applications={applications}
              schemes={schemes}
              currentLanguage={currentLanguage}
              onOpenSchemeDetails={setSelectedSchemeForDetail}
              onStartNewApplication={() => setActiveView('explore')}
            />
          )}

          {/* VIEW: CITIZEN PROFILE */}
          {activeView === 'profile' && (
            <CitizenProfileView
              profile={profile}
              onProfileUpdate={handleProfileChange}
              currentLanguage={currentLanguage}
            />
          )}

          {/* VIEW: JUDGE DEMO HUB */}
          {activeView === 'judgeHub' && (
            <JudgeDemoHubView
              currentLanguage={currentLanguage}
              onSelectScenario={handleSelectScenario}
              onOpenTrustSafety={() => setActiveView('trustCenter')}
              onOpenPresentation={() => setShowPresentationMode(true)}
              allSchemes={schemes}
            />
          )}

          {/* VIEW: AI TRUST & SAFETY */}
          {activeView === 'trustCenter' && (
            <TrustSafetyView
              currentLanguage={currentLanguage}
            />
          )}

          {/* VIEW: ADMIN CONSOLE */}
          {activeView === 'admin' && (
            <AdminConsoleView
              schemes={schemes}
              currentLanguage={currentLanguage}
            />
          )}
        </main>
      </div>

      {/* Scheme Detail Dialog Modal */}
      {selectedSchemeForDetail && (
        <SchemeDetailModal
          scheme={selectedSchemeForDetail}
          profile={profile}
          currentLanguage={currentLanguage}
          isSaved={savedSchemeIds.includes(selectedSchemeForDetail.id)}
          onToggleSave={handleToggleSaveScheme}
          onClose={() => setSelectedSchemeForDetail(null)}
          onStartApplication={(scheme) => {
            setSelectedSchemeForDetail(null);
            setSelectedSchemeForApplication(scheme);
          }}
        />
      )}

      {/* Guided Application Workspace Modal */}
      {selectedSchemeForApplication && (
        <ApplicationWorkspaceModal
          scheme={selectedSchemeForApplication}
          profile={profile}
          currentLanguage={currentLanguage}
          onClose={() => setSelectedSchemeForApplication(null)}
          onApplicationCompleted={(newApp) => {
            setApplications(LocalDatabase.getApplications());
          }}
        />
      )}

      {/* Full-Screen Presentation Mode Modal */}
      {showPresentationMode && (
        <PresentationModeModal
          onClose={() => setShowPresentationMode(false)}
        />
      )}
    </div>
  );
}
export default App;
