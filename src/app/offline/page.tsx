'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  WifiOff, 
  RefreshCw, 
  PhoneCall, 
  Sprout, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { getOfflineDiagnoses, OfflineDiagnosisRecord } from '@/lib/offline-storage';
import VoiceAudioPlayer from '@/components/voice/VoiceAudioPlayer';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function OfflineFallbackPage() {
  const { lang, t } = useLanguage();
  const [cachedScans, setCachedScans] = useState<OfflineDiagnosisRecord[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    async function loadScans() {
      try {
        const records = await getOfflineDiagnoses();
        setCachedScans(records);
      } catch (err) {
        console.warn('Could not read cached offline diagnoses:', err);
      }
    }
    loadScans();
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              KR
            </Link>
            <div>
              <Link href="/" className="font-bold text-slate-900 text-base leading-tight">
                KISHAN RAKSHAK AI
              </Link>
              <div className="text-xs text-amber-700 font-medium">
                PWA Offline Diagnostic Mode
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher size="sm" />
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Checking...' : 'Check Connection'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Offline Alert Banner */}
        <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <WifiOff className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] font-black uppercase tracking-wider">
                  No Internet Connection Detected
                </span>
                <h1 className="text-xl md:text-2xl font-black text-amber-950 mt-1">
                  ऑफ़लाइन मोड / You are Offline
                </h1>
              </div>
            </div>

            <VoiceAudioPlayer
              textToSpeak="आपका इंटरनेट कनेक्शन बंद है। आप अपने पुराने डायग्नोसिस रिकॉर्ड्स ऑफ़लाइन देख सकते हैं या किसान हेल्पलाइन 1800-180-1551 पर कॉल कर सकते हैं।"
              lang="hi"
            />
          </div>

          <p className="text-xs md:text-sm text-amber-900 leading-relaxed font-medium">
            Kishan Rakshak AI runs in offline-first mode. When internet is unavailable, your past plant disease diagnoses and basic agricultural advisories remain safe in local browser storage.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reconnect Now
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-white border border-amber-300 text-amber-900 font-bold text-xs rounded-xl hover:bg-amber-50 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home Dashboard
            </Link>
          </div>
        </div>

        {/* Emergency Kisan Call Center Helpline */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Emergency Offline Agriculture Support
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                Kisan Call Center: <strong>1800-180-1551</strong> (Toll Free, 06:00 - 22:00)
              </div>
            </div>
          </div>

          <a
            href="tel:18001801551"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shrink-0 transition text-center shadow-xs"
          >
            Call 1800-180-1551
          </a>
        </div>

        {/* Cached Diagnoses from IndexedDB */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-sm text-slate-900">
                Cached Disease Diagnoses ({cachedScans.length} stored locally)
              </h2>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
              IndexedDB Storage
            </span>
          </div>

          {cachedScans.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="text-xs font-medium">No previous offline scans saved on this device yet.</p>
              <p className="text-[11px] text-slate-400">Scans captured while online or offline are stored here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cachedScans.map((scan) => (
                <div
                  key={scan.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{scan.crop} ({scan.plantPart})</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-emerald-800">{scan.topDisease}</div>
                    <div className="text-[11px] text-slate-500">
                      Match Confidence: {Math.round(scan.confidence * 100)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Saved Locally
                    </span>
                    <span className="text-slate-400">Syncs when online</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Offline Capabilities Explanation */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            What works offline?
          </div>
          <p>• Viewing past disease diagnoses stored in your device&apos;s IndexedDB.</p>
          <p>• Emergency phone call links to local Krishi Vigyan Kendra (KVK) and Kisan Call Center.</p>
          <p>• Full weather updates and new cloud-based disease recognition models will refresh automatically once network returns.</p>
        </div>
      </main>
    </div>
  );
}
