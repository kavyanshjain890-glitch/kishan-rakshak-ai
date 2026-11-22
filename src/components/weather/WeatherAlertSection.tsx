'use client';

import React from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ExternalLink, 
  HelpCircle, 
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import CropRiskEngineCard from './CropRiskEngineCard';
import { CompleteWeatherPayload, DailyForecastItem } from '@/lib/weather-service';
import { Language } from '@/lib/i18n';

interface WeatherAlertSectionProps {
  weather: CompleteWeatherPayload;
  lang?: Language;
}

export default function WeatherAlertSection({ weather, lang = 'en' }: WeatherAlertSectionProps) {
  const { official_alert, theme, forecast, ai_crop_advisory, location } = weather;

  // Dynamic CSS variables scoped ONLY to this container and its accents
  const scopedStyle: React.CSSProperties = {
    ['--alert-accent' as any]: theme.accent,
    ['--alert-bg' as any]: theme.bg,
    ['--alert-border' as any]: theme.border,
    ['--alert-text' as any]: theme.text,
  };

  const isUnavailable = official_alert.warning_color === 'UNAVAILABLE';

  return (
    <div 
      style={scopedStyle}
      className="space-y-6 transition-all duration-300 ease-in-out"
    >
      {/* 1. OFFICIAL IMD WARNING SECTION (SCOPED DYNAMIC THEME) */}
      <section 
        className="rounded-3xl border-2 p-6 md:p-8 shadow-sm transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: 'var(--alert-bg)',
          borderColor: 'var(--alert-border)',
          color: 'var(--alert-text)'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
          style={{ borderColor: 'var(--alert-border)' }}
        >
          <div className="flex items-center gap-3">
            <span 
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xs"
              style={{ backgroundColor: 'var(--alert-accent)' }}
            >
              Official IMD
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              {location.district}, {location.state}
            </span>
            {official_alert.is_mock && (
              <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                TEST SUITE SIMULATION
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold">
              Warning Level: <strong className="uppercase">{official_alert.warning_color}</strong>
            </span>
          </div>
        </div>

        {/* Alert Body */}
        <div className="mt-5 space-y-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: 'var(--alert-text)' }}>
              {isUnavailable ? (
                'Official weather data is currently unavailable'
              ) : (
                lang === 'hi' ? theme.hindiLabel : theme.label
              )}
            </h2>
            <p className="text-sm mt-1 font-medium opacity-90">
              {official_alert.hazard_type}
            </p>
          </div>

          {/* Alert Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t text-xs" style={{ borderColor: 'var(--alert-border)' }}>
            <div>
              <span className="opacity-75 block text-[11px] font-semibold">Issue Time:</span>
              <strong className="font-bold">{official_alert.issue_time}</strong>
            </div>
            <div>
              <span className="opacity-75 block text-[11px] font-semibold">Validity:</span>
              <strong className="font-bold">{official_alert.validity_period}</strong>
            </div>
            <div>
              <span className="opacity-75 block text-[11px] font-semibold">Last Updated:</span>
              <strong className="font-bold">{new Date(official_alert.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div>
              <span className="opacity-75 block text-[11px] font-semibold">Source Link:</span>
              <a 
                href={official_alert.source_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold underline hover:opacity-80"
              >
                <span>IMD Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUMERICAL WEATHER FORECAST (POWERED BY OPEN-METEO) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-1">
              <CloudSun className="w-4 h-4 text-blue-600" />
              <span>{forecast.attribution}</span>
            </div>
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900">
              7-Day District Weather Forecast
            </h3>
          </div>

          <div className="text-xs text-slate-400">
            <span>Synced: {new Date(forecast.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Current Weather Snapshot Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <span>Temperature</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{forecast.current.temperature}°C</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>Humidity</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{forecast.current.relative_humidity}%</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <Wind className="w-4 h-4 text-teal-600" />
              <span>Wind Speed</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{forecast.current.wind_speed} km/h</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <CloudSun className="w-4 h-4 text-indigo-600" />
              <span>Precipitation</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{forecast.current.precipitation} mm</p>
          </div>
        </div>

        {/* 7-Day Forecast Strip */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">7-Day Outlook (Open-Meteo)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast.daily.map((day: DailyForecastItem, idx: number) => (
              <div key={day.date} className={`p-3 rounded-xl border text-center text-xs space-y-1.5 ${idx === 0 ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
                <p className="font-bold text-slate-900">
                  {idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString([], { weekday: 'short', day: 'numeric' })}
                </p>
                <div className="text-sm font-black text-slate-900">
                  {day.temp_max}° / <span className="text-slate-500 font-medium text-xs">{day.temp_min}°</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-700">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  <span>{day.precipitation_probability}%</span>
                </div>
                <p className="text-[10px] text-slate-600 line-clamp-1" title={day.description}>
                  {day.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t pt-2 flex items-center justify-between">
          <span>Non-commercial open data tier under CC BY 4.0</span>
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
            Open-Meteo Terms & Attribution
          </a>
        </div>
      </section>

      {/* 3. AI CROP-RISK ADVISORY (STRICTLY BELOW OFFICIAL ALERT, NEVER INSIDE IT) */}
      <section>
        <CropRiskEngineCard
          alertColor={official_alert.warning_color}
          currentWeather={{
            temperature: forecast.current.temperature,
            relative_humidity: forecast.current.relative_humidity,
            precipitation_probability: forecast.daily[0]?.precipitation_probability || 0,
            wind_speed: forecast.current.wind_speed
          }}
          lang={lang}
        />
      </section>
    </div>
  );
}
