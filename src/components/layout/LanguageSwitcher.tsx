'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe2, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  size?: 'sm' | 'md';
}

export default function LanguageSwitcher({ className = '', size = 'md' }: LanguageSwitcherProps) {
  const { lang, setLang, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold transition shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        }`}
        aria-expanded={isOpen}
      >
        <Globe2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="font-semibold text-slate-900">{activeOption.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Select Language / भाषा चुनें
          </div>
          {languages.map((item) => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLang(item.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex flex-col">
                  <span>{item.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{item.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
