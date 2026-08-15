import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Globe, 
  Flame, 
  Users, 
  Award,
  ArrowRight
} from 'lucide-react';

interface PresentationModeModalProps {
  onClose: () => void;
}

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: 'DECODE SIH 2026 • PROBLEM STATEMENT PS3',
      title: 'GovMitra: Government Services, Explained Your Way',
      subtitle: 'Multilingual Digital Citizen Assistant for Unified Government Scheme Access & Preparation',
      content: (
        <div className="space-y-6 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center mx-auto text-3xl font-extrabold shadow-xl">
            GM
          </div>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Over 800+ central & state welfare schemes exist in India, but millions of eligible citizens miss out due to language barriers, complex bureaucratic terminology, and fragmented portal navigation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 font-bold text-lg block">8 Languages</span>
              <span className="text-stone-400 text-xs">Full voice & text Indic interaction</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold text-lg block">0% Hallucination</span>
              <span className="text-stone-400 text-xs">Deterministic Room SQLite rule engine</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-orange-400 font-bold text-lg block">Offline-First</span>
              <span className="text-stone-400 text-xs">Works without active connectivity</span>
            </div>
          </div>
        </div>
      )
    },
    {
      badge: 'THE CITIZEN CHALLENGE',
      title: 'Why Existing Government Portals Fail the Common Citizen',
      subtitle: 'The gap between citizen colloquial needs and official administrative terminology',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/50 space-y-3">
            <h4 className="font-bold text-rose-400 text-sm flex items-center gap-2">
              <span>Current Status Quo Friction</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>• Citizens don't know scheme names like "AICTE Pragati" or "ADIP Scheme".</li>
              <li>• Scheme circulars are written in dense 40-page administrative English/Hindi gazettes.</li>
              <li>• Generic chatbots hallucinate benefits and make unverified eligibility promises.</li>
              <li>• Internet dropouts in rural areas cause lost application form progress.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-900/50 space-y-3">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <span>The GovMitra Innovation</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>✓ Conversational intent matching (e.g. "my daughter's college fees").</li>
              <li>✓ Gemini simplifies dense circulars into 2-sentence plain language in 8 languages.</li>
              <li>✓ Hard deterministic mathematical rule engine for eligibility calculations.</li>
              <li>✓ Offline Room SQLite caching + background sync queue.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      badge: 'ARCHITECTURAL RIGOR',
      title: 'Zero-Hallucination Deterministic Pipeline',
      subtitle: 'Separating conversational synthesis from mathematical eligibility evaluation',
      content: (
        <div className="space-y-4 text-left">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="p-3 bg-amber-900/40 border border-amber-600/40 rounded-xl">
              <span className="font-bold text-amber-300 block">1. Regional Voice/Text</span>
              <span className="text-stone-400">Kannada, Hindi, Tamil, Telugu, etc.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 hidden sm:block" />
            <div className="p-3 bg-blue-900/40 border border-blue-600/40 rounded-xl">
              <span className="font-bold text-blue-300 block">2. Multilingual NLU</span>
              <span className="text-stone-400">Intent & Profile Entity extraction</span>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 hidden sm:block" />
            <div className="p-3 bg-emerald-900/40 border border-emerald-600/40 rounded-xl">
              <span className="font-bold text-emerald-300 block">3. Room Deterministic Engine</span>
              <span className="text-stone-400">Rule match: Age, Income, Sector</span>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 hidden sm:block" />
            <div className="p-3 bg-orange-900/40 border border-orange-600/40 rounded-xl">
              <span className="font-bold text-orange-300 block">4. Official Portal Ready</span>
              <span className="text-stone-400">Dossier & Reference ID generated</span>
            </div>
          </div>

          <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 text-xs text-stone-300 space-y-1">
            <span className="font-bold text-amber-400 block">Security & API Privacy Guarantee:</span>
            <p>Production Gemini API calls are securely proxied via server-side endpoints with header validation. No keys are ever exposed in client bundles.</p>
          </div>
        </div>
      )
    },
    {
      badge: 'IMPACT & ACCESSIBILITY',
      title: 'Tailored for Every Segment of India',
      subtitle: 'Empowering students, farmers, senior citizens, and traditional artisans',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-amber-400 font-bold text-xs block">🎓 Students</span>
            <p className="text-[11px] text-stone-400">AICTE Pragati, Post-Matric NSP, Skill India PMKVY.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-emerald-400 font-bold text-xs block">🌾 Farmers</span>
            <p className="text-[11px] text-stone-400">PM-KISAN ₹6,000/yr & PM Fasal Bima crop cover.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-blue-400 font-bold text-xs block">👵 Senior Citizens</span>
            <p className="text-[11px] text-stone-400">Universal 70+ Ayushman Vay Vandana & IGNOAPS.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-orange-400 font-bold text-xs block">🔨 Rural Artisans</span>
            <p className="text-[11px] text-stone-400">PM Vishwakarma ₹15,000 toolkit & 5% loans.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div 
        id="presentation-modal"
        className="bg-stone-950 text-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-800 overflow-hidden"
      >
        {/* Top Controls */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 uppercase">
              SIH 2026 Showcase
            </span>
            <span className="text-xs text-stone-400 font-medium">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex flex-col justify-center space-y-6 text-center">
          <div>
            <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase block mb-1">
              {slides[currentSlide].badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div>
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Bottom Slide Navigation */}
        <div className="p-4 sm:p-5 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-semibold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-amber-500' : 'bg-stone-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide(prev => prev + 1);
              } else {
                onClose();
              }
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1"
          >
            <span>{currentSlide === slides.length - 1 ? 'Exit Presentation' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
