/**
 * Web Speech API Utility for KISHAN RAKSHAK AI
 * Implements:
 * 1. Speech-to-Text (Voice Query Search) in Hindi & Indian English
 * 2. Text-to-Speech (Audio Readout of Diagnosis & Precautions) for low-literacy farmers
 */

import { Language } from './i18n';

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error?: string;
  supported: boolean;
}

export function getSpeechLocale(lang: Language): string {
  switch (lang) {
    case 'gu': return 'gu-IN';
    case 'mr': return 'mr-IN';
    case 'pa': return 'pa-IN';
    case 'hi':
    case 'hi-RJ': return 'hi-IN';
    case 'en':
    default: return 'en-IN';
  }
}

// 1. SPEECH-TO-TEXT (VOICE RECOGNITION)
export class SpeechRecognizer {
  private recognition: any = null;
  public isSupported = false;

  constructor(private lang: Language = 'hi') {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = getSpeechLocale(lang);
        this.isSupported = true;
      }
    }
  }

  setLanguage(lang: Language) {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = getSpeechLocale(lang);
    }
  }

  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech Recognition is not supported on this browser. Please use Chrome or Safari.');
      return;
    }

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      onResult(final || interim, Boolean(final));
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error || 'Voice input error');
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }

  stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Recognition stop exception:', e);
      }
    }
  }
}

// 2. TEXT-TO-SPEECH (VOICE READOUT)
export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(
  text: string,
  lang: Language = 'hi',
  onEnd?: () => void
): boolean {
  if (!isTtsSupported()) return false;

  window.speechSynthesis.cancel(); // Cancel any ongoing speech

  // Strip markdown, URLs, and HTML tags for clean speech
  const cleanText = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_`]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Set language locale
  utterance.lang = getSpeechLocale(lang);

  // Slower rate (0.88) and natural pitch (1.0) so rural farmers can easily comprehend
  utterance.rate = 0.88;
  utterance.pitch = 1.0;

  // Try to find a native Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  const locale = getSpeechLocale(lang);
  const matchedVoice = voices.find(v => v.lang === locale || v.lang.startsWith(locale.split('-')[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isTtsSupported()) {
    window.speechSynthesis.cancel();
  }
}
