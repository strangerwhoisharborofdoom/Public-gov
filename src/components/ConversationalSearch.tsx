import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  Search, 
  X,
  Compass,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  Tractor,
  HeartHandshake,
  Hammer,
  Sun
} from 'lucide-react';
import { LanguageCode } from '../types';
import { getTranslation } from '../i18n/translations';
import { SpeechService, VoiceState } from '../services/speechService';

interface ConversationalSearchProps {
  currentLanguage: LanguageCode;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const ConversationalSearch: React.FC<ConversationalSearchProps> = ({
  currentLanguage,
  onSearch,
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickPrompts: { label: string; icon: any; queryLocal: Record<LanguageCode, string> }[] = [
    {
      label: 'Daughter\'s College Scholarship',
      icon: GraduationCap,
      queryLocal: {
        en: 'Scholarship and fees support for my daughter\'s college education',
        kn: 'ನನ್ನ ಮಗಳ ಓದಿಗೆ ಹಣದ ಸಹಾಯ ಮತ್ತು ಸ್ಕಾಲರ್‌ಶಿಪ್ ಬೇಕು.',
        hi: 'मेरी बेटी की कॉलेज की पढ़ाई और फीस के लिए छात्रवृत्ति चाहिए।',
        ta: 'என் மகளின் கல்லூரி படிப்புக்கு கல்வி உதவித்தொகை வேண்டும்.',
        te: 'నా కుమార్తె కాలేజీ చదువు కోసం స్కాలర్‌షిప్ కావాలి.',
        mr: 'मुलीच्या कॉलेज शिक्षणासाठी शिष्यवृत्ती हवी आहे.',
        bn: 'মেয়ের কলেজ শিক্ষার জন্য স্কলারশিপ দরকার।',
        ml: 'മകളുടെ കോളേജ് വിദ്യാഭ്യാസത്തിന് സ്കോളർഷിപ്പ് വേണം.'
      }
    },
    {
      label: 'Farmer Support & Crop Insurance',
      icon: Tractor,
      queryLocal: {
        en: 'Agricultural crop insurance and financial support for farmer landholding',
        kn: 'ನನ್ನ ಜಮೀನಿಗೆ ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಕೃಷಿ ಸಹಾಯಧನ ಬೇಕಾಗಿದೆ.',
        hi: 'खेती के लिए फसल बीमा और किसान सम्मान निधि की जानकारी चाहिए।',
        ta: 'விவசாய நிலத்திற்கான பயிர் காப்பீடு மற்றும் அரசு உதவி.',
        te: 'రైతు భూమికి పంట బీమా మరియు ఆర్థిక సహాయం కావాలి.',
        mr: 'शेतीसाठी पीक विमा आणि आर्थिक मदत हवी आहे.',
        bn: 'ফসলের বিমা এবং কৃষকদের জন্য আর্থিক সাহায্য প্রয়োজন।',
        ml: 'കർഷകർക്കുള്ള വിള ഇൻഷുറൻസും ധനസഹായവും.'
      }
    },
    {
      label: 'Senior 70+ Healthcare & Pension',
      icon: HeartHandshake,
      queryLocal: {
        en: 'Health insurance and monthly pension for senior citizen age 70+',
        kn: '70 ವರ್ಷ ಮೀರಿದ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಮತ್ತು ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ.',
        hi: 'मेरी उम्र 72 वर्ष है, मुझे स्वास्थ्य और दवा के लिए सहायता चाहिए।',
        ta: '70 வயதுக்கு மேற்பட்ட முதியோருக்கான மருத்துவ காப்பீடு மற்றும் ஓய்வூதியம்.',
        te: '70 ఏళ్లు పైబడిన వృద్ధులకు ఉచిత వైద్యం మరియు పింఛను.',
        mr: '७० वर्षांवरील ज्येष्ठ नागरिकांसाठी आरोग्य कार्ड आणि पेन्शन.',
        bn: '৭০ বছরের বেশি প্রবীণদের জন্য চিকিৎসা ও বার্ধক্য ভাতা।',
        ml: '70 വയസ്സ് കഴിഞ്ഞവർക്കുള്ള ആരോഗ്യ പരിരക്ഷയും പെൻഷനും.'
      }
    },
    {
      label: 'PM Vishwakarma Artisan Support',
      icon: Hammer,
      queryLocal: {
        en: 'Artisan toolkit and low interest loan for traditional craft',
        kn: 'ಸಾಂಪ್ರದಾಯಿಕ ಕುಶಲಕರ್ಮಿಗಳಿಗೆ ಉಪಕರಣಗಳು ಮತ್ತು ಸಾಲ ಸೌಲಭ್ಯ.',
        hi: 'पारंपरिक कारीगरों के लिए टूलकिट और कम ब्याज पर लोन सहायता।',
        ta: 'கைவினைஞர்களுக்கான இலவச கருவித்தொகுப்பு மற்றும் கடன் உதவி.',
        te: 'చేతివృత్తుల వారికి టూల్‌కిట్ మరియు తక్కువ వడ్డీ రుణం.',
        mr: 'पारंपरिक कारागिरांसाठी टूलकिट आणि कर्ज योजना.',
        bn: 'কারিগরদের জন্য বিনামূল্যে টুলকিট এবং ঋণ সহায়তা।',
        ml: 'കരകൗശല തൊഴിലാളികൾക്കുള്ള ടൂൾകിറ്റും വായ്പയും.'
      }
    },
    {
      label: 'PM Surya Ghar Solar Rooftop',
      icon: Sun,
      queryLocal: {
        en: 'Government subsidy for rooftop solar electricity installation',
        kn: 'ಮನೆ ಮೇಲ್ಛಾವಣಿ ಸೋಲಾರ್ ವಿದ್ಯುತ್ ಅಳವಡಿಕೆಗೆ ಸಬ್ಸಿಡಿ.',
        hi: 'छत पर सोलर पैनल लगाने के लिए सरकारी सब्सिडी।',
        ta: 'வீட்டு கூரை சோலார் மின்சாரத்திற்கான மானியம்.',
        te: 'రూఫ్‌టాప్ సోలార్ ప్యానెల్స్ కొరకు ప్రభుత్వ రాయితీ.',
        mr: 'सौर ऊर्जेसाठी सरकारी अनुदान माहिती.',
        bn: 'সৌর বিদ্যুৎ স্থাপনের জন্য সরকারি অনুদান।',
        ml: 'സോളാർ റൂഫ്‌ടോപ്പിനുള്ള സബ്‌സിഡി.'
      }
    }
  ];

  const handleStartVoice = () => {
    if (voiceState === 'LISTENING') {
      SpeechService.stopListening();
      setVoiceState('IDLE');
      return;
    }

    setErrorMessage(null);
    SpeechService.startListening(
      currentLanguage,
      (transcript, isFinal) => {
        if (isFinal) {
          setQuery(transcript);
          setInterimText('');
          setVoiceState('IDLE');
          onSearch(transcript);
        } else {
          setInterimText(transcript);
        }
      },
      (err) => {
        setErrorMessage(err);
        setVoiceState('IDLE');
      },
      (st) => setVoiceState(st)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSelectQuickPrompt = (promptText: string) => {
    setQuery(promptText);
    onSearch(promptText);
  };

  return (
    <div id="conversational-search-container" className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-sm relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-100/40 via-orange-100/20 to-transparent rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-1">
          {getTranslation(currentLanguage, 'whatDoYouNeedHelpWith')}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto mb-4">
          {getTranslation(currentLanguage, 'conversationalSubtitle')}
        </p>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="relative mb-3">
          <div className="relative flex items-center shadow-xs rounded-2xl bg-stone-50 border border-stone-300 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all p-1.5">
            <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
            
            <input
              id="citizen-query-input"
              type="text"
              value={interimText || query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={getTranslation(currentLanguage, 'searchPlaceholder')}
              className="w-full px-3 py-2.5 bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice Input Button */}
            <button
              type="button"
              id="voice-search-mic-btn"
              onClick={handleStartVoice}
              title={voiceState === 'LISTENING' ? getTranslation(currentLanguage, 'stopListening') : getTranslation(currentLanguage, 'speak')}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                voiceState === 'LISTENING'
                  ? 'bg-rose-600 text-white animate-pulse shadow-md ring-4 ring-rose-300'
                  : 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
              }`}
            >
              {voiceState === 'LISTENING' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (!query.trim() && !interimText)}
              id="conversational-submit-btn"
              className="ml-1.5 p-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Real-time Listening Waveform Visualizer */}
        {voiceState === 'LISTENING' && (
          <div className="flex items-center justify-center gap-1.5 py-2 text-rose-600 animate-in fade-in">
            <span className="text-xs font-semibold">{getTranslation(currentLanguage, 'listening')}</span>
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce"></span>
              <span className="w-1 h-5 bg-rose-600 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-6 bg-rose-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
            </div>
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-rose-600 mb-2">{errorMessage}</p>
        )}

        {/* Quick Scenario Discovery Chips */}
        <div className="mt-4 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>{getTranslation(currentLanguage, 'quickHelp')}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {quickPrompts.map((item, idx) => {
              const Icon = item.icon;
              const text = item.queryLocal[currentLanguage] || item.queryLocal.en;
              return (
                <button
                  key={idx}
                  id={`quick-prompt-${idx}`}
                  onClick={() => handleSelectQuickPrompt(text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100/90 hover:bg-stone-200/90 border border-stone-200 text-stone-800 text-xs font-medium transition-all hover:scale-102 active:scale-98"
                >
                  <Icon className="w-3.5 h-3.5 text-amber-700" />
                  <span className="truncate max-w-[220px] sm:max-w-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
