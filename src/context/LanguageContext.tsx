'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  TranslationDictionary, 
  translations, 
  SUPPORTED_LANGUAGES, 
  LanguageOption 
} from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
  languages: SUPPORTED_LANGUAGES,
});

export const STORAGE_KEY = 'kr_selected_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    // 1. Check URL query param first
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as Language;
      if (urlLang && SUPPORTED_LANGUAGES.some((l) => l.code === urlLang)) {
        setLangState(urlLang);
        try {
          localStorage.setItem(STORAGE_KEY, urlLang);
        } catch {
          // ignore localStorage access issues
        }
        return;
      }

      // 2. Check localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Language;
        if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
          setLangState(saved);
          return;
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch {
        // ignore
      }
      document.documentElement.lang = newLang;
      // Broadcast event for multi-tab synchronization
      window.dispatchEvent(new CustomEvent('kr_language_change', { detail: newLang }));
    }
  };

  // Listen to cross-tab or external changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const l = e.newValue as Language;
        if (SUPPORTED_LANGUAGES.some((item) => item.code === l)) {
          setLangState(l);
        }
      }
    };

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<Language>;
      if (custom.detail && SUPPORTED_LANGUAGES.some((item) => item.code === custom.detail)) {
        setLangState(custom.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('kr_language_change', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('kr_language_change', handleCustomEvent);
    };
  }, []);

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
