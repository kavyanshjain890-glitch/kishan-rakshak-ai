'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  CloudSun, 
  ArrowLeft, 
  Globe2, 
  ShieldCheck, 
  SlidersHorizontal, 
  RefreshCw,
  Info
} from 'lucide-react';
import LocationPicker from '@/components/weather/LocationPicker';
import WeatherAlertSection from '@/components/weather/WeatherAlertSection';
import { CompleteWeatherPayload, AlertColor } from '@/lib/weather-service';
import { District, State, Village } from '@/lib/locations';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function WeatherDashboardPage() {
  const { lang, setLang, t } = useLanguage();

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('rj-jaipur');
  const [mockAlert, setMockAlert] = useState<AlertColor | undefined>(undefined);
  const [weatherData, setWeatherData] = useState<CompleteWeatherPayload | null>(null);
  const [loading, setLoading] = useState(true);

  // Check query params for initial mock
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('mock_alert')?.toUpperCase() as AlertColor;
      if (m && ['GREEN', 'YELLOW', 'ORANGE', 'RED', 'UNAVAILABLE'].includes(m)) {
        setMockAlert(m);
      }
    }
  }, []);

  const fetchWeather = useCallback(async (distId: string, alertOverride?: AlertColor) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ district_id: distId });
      if (alertOverride) params.append('mock_alert', alertOverride);

      const res = await fetch(`/api/weather?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setWeatherData(json);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(selectedDistrictId, mockAlert);
  }, [selectedDistrictId, mockAlert, fetchWeather]);

  const handleLocationChange = (district: District, state: State, village?: Village) => {
    setSelectedDistrictId(district.id);
  };

  const alertButtons: AlertColor[] = ['GREEN', 'YELLOW', 'ORANGE', 'RED', 'UNAVAILABLE'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              KR
            </Link>
            <div>
              <Link href="/" className="font-bold text-slate-900 text-base leading-tight hover:text-emerald-700 transition">
                {t.appName}
              </Link>
              <div className="text-xs text-emerald-700 font-medium hidden sm:block">
                Agro-Weather Advisory & IMD Warning Engine
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Language Switcher */}
            <LanguageSwitcher />

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CloudSun className="w-7 h-7 text-emerald-600" />
              Live Agro-Weather & Official Alerts
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Real-time numerical weather prediction with strictly isolated official IMD severe weather themes.
            </p>
          </div>

          <button
            onClick={() => fetchWeather(selectedDistrictId, mockAlert)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs self-start"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Refresh Weather
          </button>
        </div>

        {/* Location Picker */}
        <LocationPicker
          selectedDistrictId={selectedDistrictId}
          onLocationChange={handleLocationChange}
        />

        {/* Phase 3 Acceptance Testing Bar (Mock Alert Levels) */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              Interactive Theme Simulator (Acceptance Criteria Test Harness):
            </span>
            {mockAlert && (
              <button
                onClick={() => setMockAlert(undefined)}
                className="text-[11px] text-emerald-700 font-bold hover:underline"
              >
                Reset to Live Real Mode
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {alertButtons.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setMockAlert(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wide uppercase transition border ${
                  mockAlert === lvl 
                    ? 'ring-2 ring-slate-900 shadow-sm' 
                    : 'opacity-80 hover:opacity-100'
                } ${
                  lvl === 'GREEN' ? 'bg-emerald-600 text-white border-emerald-700' :
                  lvl === 'YELLOW' ? 'bg-amber-500 text-slate-950 border-amber-600' :
                  lvl === 'ORANGE' ? 'bg-orange-600 text-white border-orange-700' :
                  lvl === 'RED' ? 'bg-red-600 text-white border-red-700' :
                  'bg-slate-500 text-white border-slate-600'
                }`}
              >
                {lvl === 'UNAVAILABLE' ? 'Neutral (Unavailable)' : `${lvl} Alert`}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">
            Note: Dynamic CSS variables accent the alert card and widgets only, preserving clear readability across the site.
          </p>
        </div>

        {/* Weather Alert Section */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <CloudSun className="w-10 h-10 animate-bounce mx-auto text-emerald-600/60 mb-2" />
            <p className="text-sm font-medium">Fetching satellite & numerical weather feeds...</p>
          </div>
        ) : weatherData ? (
          <WeatherAlertSection weather={weatherData} lang={lang} />
        ) : null}
      </main>
    </div>
  );
}
