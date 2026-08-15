/**
 * Speech Recognition and Text-to-Speech Engine
 * Supports 8 Indian Languages with Web Speech API and backend Gemini TTS fallbacks.
 */

import { LanguageCode } from '../types';

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public static isTTSSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static startListening(
    lang: LanguageCode,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onStateChange: (state: VoiceState) => void
  ) {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser environment.');
      onStateChange('ERROR');
      return;
    }

    try {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      const langMap: Record<LanguageCode, string> = {
        en: 'en-IN',
        kn: 'kn-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        ml: 'ml-IN'
      };

      this.recognition.lang = langMap[lang] || 'en-IN';

      this.recognition.onstart = () => {
        this.isListening = true;
        onStateChange('LISTENING');
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onStateChange('ERROR');
        onError(event.error || 'Speech recognition error occurred.');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onStateChange('IDLE');
      };

      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onStateChange('ERROR');
      onError(e?.message || 'Could not start microphone capture.');
    }
  }

  public static stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition', e);
      }
      this.isListening = false;
    }
  }

  public static speakText(
    text: string, 
    lang: LanguageCode, 
    onStart?: () => void, 
    onEnd?: () => void
  ) {
    if (!this.isTTSSupported()) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const langMap: Record<LanguageCode, string> = {
        en: 'en-IN',
        kn: 'kn-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        ml: 'ml-IN'
      };

      utterance.lang = langMap[lang] || 'en-IN';
      utterance.rate = 0.95; // Slightly calmer, articulate pacing
      utterance.pitch = 1.0;

      // Select available regional voice if present
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.startsWith(lang));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS execution error', e);
      if (onEnd) onEnd();
    }
  }

  public static stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}
