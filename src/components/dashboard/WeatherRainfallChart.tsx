'use client';

import React from 'react';
import { Droplets } from 'lucide-react';
import { DailyForecastItem } from '@/lib/weather-service';
import { Language } from '@/lib/i18n';

interface WeatherRainfallChartProps {
  daily: DailyForecastItem[];
  lang?: Language;
}

export default function WeatherRainfallChart({ daily, lang = 'en' }: WeatherRainfallChartProps) {
  if (!daily || daily.length === 0) return null;

  const maxProb = 100;

  const title = lang === 'gu'
    ? '7 દિવસનો વરસાદ અંદાજ અને ફૂગ જોખમ'
    : lang === 'mr'
    ? '7 दिवसांचा पाऊस अंदाज आणि बुरशी जोखीम'
    : lang === 'pa'
    ? '7 ਦਿਨਾਂ ਦਾ ਮੀਂਹ ਦਾ ਅਨੁਮਾਨ ਅਤੇ ਉੱਲੀ ਜੋਖਮ'
    : lang === 'hi-RJ'
    ? '7 दिनां रो मेह रो अंदाजो अर फफूंद जोखिम'
    : lang === 'hi'
    ? '7 दिवसीय वर्षा संभावना एवं फफूंद संक्रमण जोखिम'
    : '7-Day Precipitation Probability & Fungal Infection Window';

  const todayLabel = lang === 'gu' ? 'આજે' : lang === 'mr' ? 'आज' : lang === 'pa' ? 'ਅੱਜ' : lang === 'hi-RJ' || lang === 'hi' ? 'आज' : 'Today';

  const lowRiskLabel = lang === 'gu' ? '<35% ઓછું જોખમ' : lang === 'mr' ? '<35% कमी जोखीम' : lang === 'pa' ? '<35% ਘੱਟ ਜੋਖਮ' : lang === 'hi-RJ' || lang === 'hi' ? '<35% कम जोखिम' : '<35% Low Risk';
  const modRiskLabel = lang === 'gu' ? '35-60% મધ્યમ' : lang === 'mr' ? '35-60% मध्यम' : lang === 'pa' ? '35-60% ਦਰਮਿਆਨਾ' : lang === 'hi-RJ' || lang === 'hi' ? '35-60% मध्यम' : '35-60% Moderate';
  const highRiskLabel = lang === 'gu' ? '>60% ફૂગ ખતરો' : lang === 'mr' ? '>60% बुरशी धोका' : lang === 'pa' ? '>60% ਉੱਲੀ ਖ਼ਤਰਾ' : lang === 'hi-RJ' || lang === 'hi' ? '>60% फफूंद खतरा' : '>60% Fungal Window';

  const weekdaysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-blue-600" />
          {title}
        </span>
        <span className="text-[11px] font-semibold text-slate-500">
          Source: Open-Meteo
        </span>
      </div>

      {/* SVG-based Bar + Trend Chart */}
      <div className="pt-2">
        <div className="grid grid-cols-7 gap-2 items-end h-28 border-b border-slate-200 pb-2">
          {daily.slice(0, 7).map((day, idx) => {
            const prob = day.precipitation_probability;
            const barHeightPercent = Math.max(8, (prob / maxProb) * 100);
            const isHighRisk = prob >= 60;
            const isModRisk = prob >= 35 && prob < 60;

            const barColor = isHighRisk 
              ? 'bg-red-500 hover:bg-red-600' 
              : isModRisk 
              ? 'bg-amber-500 hover:bg-amber-600' 
              : 'bg-blue-500 hover:bg-blue-600';

            const d = new Date(day.date);
            const dayLabel = idx === 0 
              ? todayLabel 
              : (lang === 'hi' || lang === 'hi-RJ')
              ? weekdaysHi[d.getDay()]
              : d.toLocaleDateString([], { weekday: 'narrow' });

            return (
              <div key={day.date} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-600 opacity-80 group-hover:opacity-100">
                  {prob}%
                </span>
                <div 
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${barColor}`}
                  style={{ height: `${barHeightPercent}%` }}
                  title={`${day.date}: ${prob}% rain probability (${day.description})`}
                />
                <span className="text-[11px] font-bold text-slate-700">
                  {dayLabel}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> {lowRiskLabel}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> {modRiskLabel}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" /> {highRiskLabel}
            </span>
          </div>
          <span className="font-medium">Scale: 0-100%</span>
        </div>
      </div>
    </div>
  );
}
