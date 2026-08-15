import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  Bot, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { 
  ChatMessage, 
  CitizenProfile, 
  LanguageCode, 
  Scheme 
} from '../types';
import { getTranslation } from '../i18n/translations';
import { GeminiService } from '../services/geminiService';
import { LocalDatabase } from '../services/localDatabase';
import { SpeechService, VoiceState } from '../services/speechService';
import { SchemeCard } from './SchemeCard';

interface AssistantViewProps {
  currentLanguage: LanguageCode;
  profile: CitizenProfile;
  onOpenSchemeDetails: (scheme: Scheme) => void;
  onStartApplication: (scheme: Scheme) => void;
  onOpenProfile: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  currentLanguage,
  profile,
  onOpenSchemeDetails,
  onStartApplication,
  onOpenProfile
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load existing messages or initialize with welcoming message
  useEffect(() => {
    const stored = LocalDatabase.getMessages();
    if (stored.length > 0) {
      setMessages(stored);
    } else {
      const welcomeMap: Record<LanguageCode, string> = {
        en: `Namaste ${profile.fullName}! I am Mitra, your digital assistant for government schemes. How can I help you today? You can ask in your own language about scholarships, farming, pensions, healthcare, or artisan support.`,
        kn: `ನಮಸ್ಕಾರ ${profile.fullName}! ನಾನು ಮಿತ್ರ, ಸರ್ಕಾರಿ ಸೇವೆಗಳ ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ಯೋಜನೆಯ ಮಾಹಿತಿ ಬೇಕು? ನೀವು ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು ಅಥವಾ ಬರೆಯಬಹುದು.`,
        hi: `नमस्ते ${profile.fullName}! मैं मित्रा हूँ, सरकारी योजनाओं के लिए आपका डिजिटल सहायक। मैं आपकी क्या मदद कर सकता हूँ?`,
        ta: `வணக்கம் ${profile.fullName}! நான் மித்ரா, அரசு திட்டங்களுக்கான உங்கள் டிஜிட்டல் உதவியாளர். உங்களுக்கு என்ன உதவி வேண்டும்?`,
        te: `నమస్కారం ${profile.fullName}! నేను మిత్ర, ప్రభుత్వ పథకాల సహాయకుడిని. మీకు ఎలాంటి సహాయం కావాలి?`,
        mr: `नमस्कार ${profile.fullName}! मी मित्र, शासकीय योजनांसाठी आपला डिजिटल सहाय्यक. मी आपल्याला कशी मदत करू?`,
        bn: `নমস্কার ${profile.fullName}! আমি মিত্র, সরকারি প্রকল্পের জন্য আপনার ডিজিটাল সহকারী।`,
        ml: `നമസ്കാരം ${profile.fullName}! ഞാൻ മിത്ര, സർക്കാർ സേവനങ്ങൾക്കായുള്ള നിങ്ങളുടെ സഹായി.`
      };

      const initialMessage: ChatMessage = {
        id: `msg-initial`,
        sender: 'ASSISTANT',
        text: welcomeMap[currentLanguage] || welcomeMap.en,
        timestamp: new Date().toISOString(),
        isAiGenerated: false
      };
      setMessages([initialMessage]);
      LocalDatabase.saveMessage(initialMessage);
    }
  }, [currentLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'CITIZEN',
      text: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    LocalDatabase.saveMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await GeminiService.processCitizenQuery(
        textToSend,
        profile,
        currentLanguage
      );

      const assistantMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ASSISTANT',
        text: response.replyText,
        timestamp: new Date().toISOString(),
        detectedIntent: response.intent,
        matchedSchemes: response.matchedSchemes,
        eligibilityResult: response.primaryEligibilityResult,
        suggestedFollowUps: response.suggestedQuestions,
        isAiGenerated: response.isAiGenerated
      };

      setMessages(prev => [...prev, assistantMessage]);
      LocalDatabase.saveMessage(assistantMessage);

      // If voice read aloud enabled in profile, speak response
      if (profile.voiceReadAloud) {
        handleSpeakMessage(assistantMessage.id, response.replyText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVoice = () => {
    if (voiceState === 'LISTENING') {
      SpeechService.stopListening();
      setVoiceState('IDLE');
      return;
    }

    SpeechService.startListening(
      currentLanguage,
      (transcript, isFinal) => {
        if (isFinal) {
          setInputValue(transcript);
          setVoiceState('IDLE');
          handleSendMessage(transcript);
        } else {
          setInputValue(transcript);
        }
      },
      (err) => {
        console.warn(err);
        setVoiceState('IDLE');
      },
      (st) => setVoiceState(st)
    );
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      SpeechService.stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msgId);
      SpeechService.speakText(
        text, 
        currentLanguage, 
        () => setSpeakingMessageId(msgId), 
        () => setSpeakingMessageId(null)
      );
    }
  };

  const handleClearHistory = () => {
    LocalDatabase.clearMessages();
    setMessages([]);
  };

  return (
    <div id="mitra-assistant-view" className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-80px)] bg-stone-50/50 rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Assistant Header */}
      <div className="p-3 sm:p-4 bg-white border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-700 to-orange-500 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">
                Mitra Citizen Assistant
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-[11px] text-stone-500">
              Multilingual Conversational Discovery & Deterministic Rule Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 border border-stone-200 text-xs flex items-center gap-1"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'CITIZEN' ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex items-start gap-2.5 max-w-2xl ${msg.sender === 'CITIZEN' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'CITIZEN' 
                  ? 'bg-stone-800 text-white' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {msg.sender === 'CITIZEN' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'CITIZEN'
                  ? 'bg-stone-900 text-white rounded-tr-xs'
                  : 'bg-white text-stone-900 border border-stone-200 rounded-tl-xs shadow-xs'
              }`}>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[10px] font-bold tracking-wider opacity-60 uppercase">
                    {msg.sender === 'CITIZEN' ? profile.fullName : 'Mitra Assistant'}
                  </span>
                  {msg.sender === 'ASSISTANT' && (
                    <button
                      onClick={() => handleSpeakMessage(msg.id, msg.text)}
                      className="text-stone-400 hover:text-amber-700 transition-colors"
                      title="Read aloud"
                    >
                      {speakingMessageId === msg.id ? (
                        <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Primary Eligibility Match Result in Assistant Message */}
                {msg.eligibilityResult && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                    <div className="flex items-center justify-between font-bold text-xs mb-1">
                      <span>✓ {msg.eligibilityResult.status}</span>
                      <span>Score: {msg.eligibilityResult.matchScore}%</span>
                    </div>
                    <p className="text-[11px] leading-tight text-emerald-900">
                      {msg.eligibilityResult.summaryText}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Embedded Matched Scheme Cards */}
            {msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
              <div className="w-full max-w-2xl mt-3 grid grid-cols-1 gap-3 pl-10">
                {msg.matchedSchemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    profile={profile}
                    currentLanguage={currentLanguage}
                    isSaved={LocalDatabase.getSavedSchemeIds().includes(scheme.id)}
                    onToggleSave={(id) => LocalDatabase.toggleSaveScheme(id)}
                    onOpenDetails={onOpenSchemeDetails}
                    onStartApplication={onStartApplication}
                  />
                ))}
              </div>
            )}

            {/* Suggested Follow-up Questions */}
            {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 pl-10">
                {msg.suggestedFollowUps.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-medium rounded-full border border-stone-200 shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3 h-3 text-amber-700" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-xs font-bold shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs rounded-tl-xs flex items-center gap-2 text-xs text-stone-500">
              <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
              <span>Finding matching schemes in your language...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about government schemes in your language..."
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={handleStartVoice}
            className={`p-3 rounded-2xl transition-all ${
              voiceState === 'LISTENING'
                ? 'bg-rose-600 text-white animate-pulse shadow-md'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
            title="Voice input"
          >
            {voiceState === 'LISTENING' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white rounded-2xl shadow-xs transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
