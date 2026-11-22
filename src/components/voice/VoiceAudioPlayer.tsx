'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { speakText, stopSpeaking, isTtsSupported } from '@/lib/voice';
import { Language } from '@/lib/i18n';

interface VoiceAudioPlayerProps {
  textToSpeak: string;
  lang?: Language;
  buttonLabel?: string;
  size?: 'sm' | 'md';
}

export default function VoiceAudioPlayer({
  textToSpeak,
  lang = 'hi',
  buttonLabel,
  size = 'md'
}: VoiceAudioPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSupported(isTtsSupported());
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!mounted || !supported) return null;

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(textToSpeak, lang, () => {
        setIsPlaying(false);
      });
    }
  };

  const defaultLabel = lang === 'hi-RJ'
    ? 'आवाज़ में सुणो'
    : lang === 'hi'
    ? 'बोलकर सुनें'
    : lang === 'gu'
    ? 'સાંભળો'
    : lang === 'mr'
    ? 'ऐका'
    : lang === 'pa'
    ? 'ਸੁਣੋ'
    : 'Listen Aloud';

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={`inline-flex items-center gap-1.5 rounded-xl font-bold transition shadow-xs ${
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      } ${
        isPlaying
          ? 'bg-amber-600 text-white animate-pulse'
          : 'bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 border border-emerald-300/60'
      }`}
      title={isPlaying ? 'Stop Audio Readout' : 'Listen Aloud to Diagnosis'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 shrink-0" />
          <span>रोकें / Stop</span>
          <span className="flex gap-0.5 ml-1">
            <span className="w-1 h-2.5 bg-white rounded-full animate-bounce" />
            <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>{buttonLabel || defaultLabel}</span>
        </>
      )}
    </button>
  );
}
