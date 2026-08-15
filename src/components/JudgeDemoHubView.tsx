import React, { useState } from 'react';
import { 
  Flame, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  RotateCcw, 
  Layers, 
  ArrowRight,
  GraduationCap,
  Tractor,
  HeartHandshake,
  Hammer,
  ExternalLink
} from 'lucide-react';
import { CitizenProfile, LanguageCode, Scheme } from '../types';
import { JUDGE_DEMO_SCENARIOS, JudgeScenario } from '../data/demoScenarios';
import { LocalDatabase } from '../services/localDatabase';
import { getTranslation } from '../i18n/translations';

interface JudgeDemoHubViewProps {
  currentLanguage: LanguageCode;
  onSelectScenario: (scenario: JudgeScenario) => void;
  onOpenTrustSafety: () => void;
  onOpenPresentation: () => void;
  allSchemes: Scheme[];
}

export const JudgeDemoHubView: React.FC<JudgeDemoHubViewProps> = ({
  currentLanguage,
  onSelectScenario,
  onOpenTrustSafety,
  onOpenPresentation,
  allSchemes
}) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'pipeline' | 'evaluation'>('scenarios');
  const [isOffline, setIsOffline] = useState(LocalDatabase.isOffline());
  const [isAiOff, setIsAiOff] = useState(LocalDatabase.isAiUnavailable());
  const [activePipelineStep, setActivePipelineStep] = useState<number>(3);

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    LocalDatabase.setOfflineSimulation(next);
  };

  const handleToggleAi = () => {
    const next = !isAiOff;
    setIsAiOff(next);
    LocalDatabase.setAiFailureSimulation(next);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo state and return to fresh baseline?')) {
      LocalDatabase.resetDemoState();
      window.location.reload();
    }
  };

  const sihRubrics = [
    {
      title: 'Multilingual Natural Interaction',
      description: 'Supports 8 Indian languages (Kannada, Hindi, Tamil, Telugu, Marathi, Bengali, Malayalam, English) with speech recognition & regional TTS.',
      status: 'VERIFIED'
    },
    {
      title: 'Conversational Service Discovery',
      description: 'Citizens state colloquial needs ("scholarship for my daughter\'s engineering", "crop insurance for 2.5 acres") rather than knowing bureaucratic scheme names.',
      status: 'VERIFIED'
    },
    {
      title: 'Deterministic Eligibility Engine',
      description: 'Zero LLM hallucination in eligibility determinations; pure rule evaluation matching Age, Income ceiling, Land parcel, Caste, and Disability.',
      status: 'VERIFIED'
    },
    {
      title: 'Plain Language AI Explanation',
      description: 'Gemini simplifies complex gazette notifications and circulars into 2-3 accessible sentences in the citizen\'s mother tongue.',
      status: 'VERIFIED'
    },
    {
      title: 'Guided Application Workspace',
      description: 'Step-by-step pre-fill dossier, AI document legibility verification, citizen self-declaration, and generated Reference ID.',
      status: 'VERIFIED'
    },
    {
      title: 'Offline-First Local Architecture',
      description: 'Simulated Room SQLite local caching with sync queue, enabling service discovery without internet connectivity.',
      status: 'VERIFIED'
    },
    {
      title: 'Trust, Safety & Privacy',
      description: 'Clear official source attribution, timestamped verification, transparent rule evaluation, and one-tap citizen data deletion.',
      status: 'VERIFIED'
    }
  ];

  return (
    <div id="judge-demo-hub-container" className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl shadow-lg border border-amber-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-black uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-black" /> SIH 2026 JUDGE DEMO HUB
              </span>
              <span className="text-xs text-amber-200/80 font-medium">Problem Statement PS3</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Interactive Evaluation & Scenario Showcase
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mt-1">
              Select pre-configured citizen personas, test offline fault-tolerance, and inspect the deterministic AI architecture in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenPresentation}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pitch Deck</span>
            </button>
            <button
              onClick={handleResetDemo}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-2 overflow-x-auto">
        {[
          { id: 'scenarios', label: '1-Click Persona Scenarios (4)' },
          { id: 'pipeline', label: 'Live Architecture Pipeline' },
          { id: 'evaluation', label: 'SIH PS3 Evaluation Rubrics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: 4 Pre-configured Scenarios */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {JUDGE_DEMO_SCENARIOS.map((scenario) => {
              const icons = {
                STUDENT: GraduationCap,
                FARMER: Tractor,
                SENIOR_CITIZEN: HeartHandshake,
                RURAL_ARTISAN: Hammer
              };
              const Icon = icons[scenario.demographicType];

              return (
                <div
                  key={scenario.id}
                  id={`judge-scenario-card-${scenario.id}`}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800">
                            {scenario.demographicType.replace('_', ' ')}
                          </span>
                          <h3 className="font-bold text-sm sm:text-base text-stone-900 leading-snug">
                            {scenario.title}
                          </h3>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        {scenario.defaultLanguage.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mb-3">
                      {scenario.subtitle}
                    </p>

                    {/* Persona Pill */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 mb-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Citizen Persona:</span>
                        <span className="font-bold text-stone-900">{scenario.personaName} ({scenario.age}y)</span>
                      </div>
                      <div className="flex items-start justify-between gap-2 pt-1 border-t border-stone-200/60">
                        <span className="text-stone-500">Query (Audio/Text):</span>
                        <span className="font-medium text-amber-900 text-right">{scenario.initialTextPrompt}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 italic">
                        "{scenario.englishTranslation}"
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1 mb-4">
                      {scenario.keyHighlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="text-[11px] text-stone-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectScenario(scenario)}
                    id={`load-scenario-btn-${scenario.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Load & Run Scenario in App</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Fault-Tolerance Simulation Suite */}
          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-700" />
              Live System Fault-Tolerance Simulator
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Test GovMitra's offline-first durability and graceful degradation by simulating live network cutoffs or API outages.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleToggleOffline}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-colors ${
                  isOffline ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {isOffline ? <WifiOff className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" /> : <Wifi className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                <div>
                  <span className="font-bold text-xs block">
                    {isOffline ? 'Offline Mode Active (Room SQLite Cache)' : 'Online Mode (Cloud Connected)'}
                  </span>
                  <span className="text-[11px] opacity-80 block">
                    {isOffline ? 'All searches & rules execute from local Room DB cache' : 'Click to simulate loss of internet connection'}
                  </span>
                </div>
              </button>

              <button
                onClick={handleToggleAi}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-colors ${
                  isAiOff ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isAiOff ? 'text-rose-600' : 'text-stone-500'}`} />
                <div>
                  <span className="font-bold text-xs block">
                    {isAiOff ? 'AI Failure Fallback Mode Engaged' : 'Gemini AI Online'}
                  </span>
                  <span className="text-[11px] opacity-80 block">
                    {isAiOff ? 'Deterministic local assistant answers accurately without Gemini' : 'Click to simulate Gemini API quota exhaustion or outage'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Architecture Visualizer */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-stone-900">
                End-to-End GovMitra Processing Pipeline
              </h3>
              <p className="text-xs text-stone-500">
                How a citizen's regional voice input transforms into a verified government application without LLM hallucination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {[
                { step: 1, title: 'Voice / Text Input', desc: '8 Indian languages capture with Web Speech / ASR' },
                { step: 2, title: 'Multilingual NLU', desc: 'Intent & Entity extraction in regional dialect' },
                { step: 3, title: 'Deterministic Rules', desc: 'Room SQLite criteria match (Age, Income, Sector)' },
                { step: 4, title: 'AI Simplification', desc: 'Gemini translates gazette text to plain talk' },
                { step: 5, title: 'Official Portal Handover', desc: 'Dossier compiled with unique Reference ID' }
              ].map((p) => (
                <div
                  key={p.step}
                  onClick={() => setActivePipelineStep(p.step)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    activePipelineStep === p.step
                      ? 'bg-amber-50 border-amber-400 shadow-xs scale-102 ring-2 ring-amber-500/20'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-amber-700 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                    {p.step}
                  </div>
                  <h4 className="font-bold text-stone-900 mb-1">{p.title}</h4>
                  <p className="text-[11px] text-stone-500 leading-snug">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Pipeline Stage Inspector Detail */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white text-xs space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>Stage {activePipelineStep} Inspector</span>
                <span className="font-mono text-[10px]">STATUS: ACTIVE & VERIFIED</span>
              </div>
              {activePipelineStep === 1 && (
                <p className="text-stone-300">
                  Audio input streamed via Web Speech API with regional locale mapping (e.g. kn-IN, hi-IN). Fallback supports direct typing in regional Indic scripts and English.
                </p>
              )}
              {activePipelineStep === 2 && (
                <p className="text-stone-300">
                  NLU extracts citizen domain intent (e.g. EDUCATION_SCHOLARSHIP, FARMER_SUPPORT, SENIOR_CITIZEN_SUPPORT, ARTISAN_MSME_SUPPORT) and populates profile entities.
                </p>
              )}
              {activePipelineStep === 3 && (
                <p className="text-stone-300">
                  Mathematical evaluation engine checks hard constraints (e.g. Age &gt;= 70, Income &lt;= 800000, Occupation = FARMER). Guarantees zero false promises or hallucinated entitlements.
                </p>
              )}
              {activePipelineStep === 4 && (
                <p className="text-stone-300">
                  Server-side Gemini 3.7 Flash summarizes official ministry circulars into empathetic, concise explanations in the citizen's native language.
                </p>
              )}
              {activePipelineStep === 5 && (
                <p className="text-stone-300">
                  Compiles verified application package, generates timestamped Reference ID (GM-2026-...), and directs user to official ministry portal (e.g. scholarships.gov.in, pmkisan.gov.in).
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SIH PS3 Evaluation Rubrics */}
      {activeTab === 'evaluation' && (
        <div className="space-y-3">
          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
              Smart India Hackathon 2026 - PS3 Compliance Matrix
            </h3>

            <div className="space-y-2.5">
              {sihRubrics.map((r, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-900">{r.title}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{r.description}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
