'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, Sparkles, X, Volume2 } from 'lucide-react';
import { SpeechRecognizer } from '@/lib/voice';
import { searchGlossary, GlossaryTerm } from '@/lib/agricultural-glossary';
import { Language } from '@/lib/i18n';

interface VoiceSearchBarProps {
  onSearch: (query: string) => void;
  lang?: Language;
  placeholder?: string;
  initialValue?: string;
}

export default function VoiceSearchBar({
  onSearch,
  lang = 'hi',
  placeholder,
  initialValue = ''
}: VoiceSearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<GlossaryTerm[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  useEffect(() => {
    recognizerRef.current = new SpeechRecognizer(lang);
    return () => {
      recognizerRef.current?.stop();
    };
  }, [lang]);

  const handleStartListening = () => {
    setVoiceError(null);
    if (!recognizerRef.current?.isSupported) {
      setVoiceError('Voice input not supported in this browser. Please type your query.');
      return;
    }

    setIsListening(true);
    recognizerRef.current.setLanguage(lang);

    recognizerRef.current.start(
      (transcript, isFinal) => {
        setQuery(transcript);
        if (isFinal) {
          setIsListening(false);
          onSearch(transcript);
        }
      },
      (error) => {
        setVoiceError(`Voice input: ${error}`);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    recognizerRef.current?.stop();
    setIsListening(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) {
      const matches = searchGlossary(val).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  const selectSuggestion = (term: GlossaryTerm) => {
    const termText = lang === 'hi-RJ' ? term.raj : lang === 'hi' ? term.hi : term.en;
    setQuery(termText);
    setShowSuggestions(false);
    onSearch(termText);
  };

  const defaultPlaceholder = lang === 'hi-RJ'
    ? 'फसल, पाना रा रोग या लक्षण बोलो (जैसे: कांदो, पीळी रोली)...'
    : lang === 'hi'
    ? 'बोलकर खोजें या टाइप करें (जैसे: टमाटर पर काले धब्बे, पीला रतुआ)...'
    : 'Speak or type query (e.g. black spots on tomato leaf, yellow rust)...';

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder || defaultPlaceholder}
          className={`w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white border text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition shadow-sm ${
            isListening 
              ? 'border-red-500 ring-2 ring-red-200' 
              : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
          }`}
        />

        {/* Action Buttons: Clear & Voice */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShowSuggestions(false);
                onSearch('');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Microphone Button */}
          <button
            type="button"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-bold ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-md'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 shadow-xs'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak Your Query'}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span className="hidden sm:inline">बोलिए...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">बोलकर खोजें</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Listening Status Banner */}
      {isListening && (
        <div className="absolute left-0 right-0 -bottom-9 bg-red-50 text-red-700 text-xs font-bold px-4 py-1.5 rounded-xl border border-red-200 flex items-center justify-between z-20 shadow-xs animate-fade-in">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            माइक्रोफ़ोन सक्रिय है... कृपया अपनी समस्या बोलें
          </span>
          <button 
            type="button" 
            onClick={handleStopListening}
            className="text-[11px] underline hover:text-red-900"
          >
            रोकें
          </button>
        </div>
      )}

      {/* Voice Error notice */}
      {voiceError && (
        <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          {voiceError}
        </div>
      )}

      {/* Glossary Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-30 divide-y divide-slate-100">
          <div className="px-3.5 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            कृषि शब्दावली सुझाव (Agricultural Glossary Match):
          </div>
          {suggestions.map((term) => (
            <button
              key={term.id}
              type="button"
              onClick={() => selectSuggestion(term)}
              className="w-full px-4 py-2.5 text-left text-xs hover:bg-emerald-50/60 transition flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 group-hover:text-emerald-800">
                  {lang === 'hi-RJ' ? term.raj : lang === 'hi' ? term.hi : term.en}
                </span>
                <span className="text-[11px] text-slate-400 ml-2 italic">
                  ({term.en})
                </span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                {term.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
