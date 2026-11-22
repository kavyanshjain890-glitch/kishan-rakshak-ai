'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Sprout, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  CropGrowthStage, 
  SoilType, 
  CropRiskEvaluationResult 
} from '@/lib/types';
import { Language, translations } from '@/lib/i18n';
import VoiceAudioPlayer from '@/components/voice/VoiceAudioPlayer';

interface CropRiskEngineCardProps {
  alertColor?: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'UNAVAILABLE';
  currentWeather?: {
    temperature: number;
    relative_humidity: number;
    precipitation_probability: number;
    wind_speed: number;
  };
  lang?: Language;
}

export default function CropRiskEngineCard({
  alertColor,
  currentWeather,
  lang = 'en'
}: CropRiskEngineCardProps) {
  const t = translations[lang] || translations.en;

  const crops = [
    { name: 'Wheat', label: lang === 'hi' ? 'गेहूं (Wheat)' : 'Wheat' },
    { name: 'Rice', label: lang === 'hi' ? 'धान / चावल (Rice)' : 'Rice' },
    { name: 'Tomato', label: lang === 'hi' ? 'टमाटर (Tomato)' : 'Tomato' },
    { name: 'Potato', label: lang === 'hi' ? 'आलू (Potato)' : 'Potato' },
    { name: 'Cotton', label: lang === 'hi' ? 'कपास (Cotton)' : 'Cotton' },
    { name: 'Mustard', label: lang === 'hi' ? 'सरसों (Mustard)' : 'Mustard' },
    { name: 'Maize', label: lang === 'hi' ? 'मक्का (Maize)' : 'Maize' },
    { name: 'Chickpea', label: lang === 'hi' ? 'चना (Chickpea)' : 'Chickpea' }
  ];

  const stages: Array<{ id: CropGrowthStage; label: string }> = [
    { id: 'SOWING_GERMINATION', label: lang === 'hi' ? 'बुवाई / अंकुरण' : 'Sowing & Germination' },
    { id: 'VEGETATIVE', label: lang === 'hi' ? 'वानस्पतिक वृद्धि' : 'Vegetative Stage' },
    { id: 'FLOWERING', label: lang === 'hi' ? 'फूल आने की अवस्था' : 'Flowering Stage' },
    { id: 'GRAIN_FRUIT_FILLING', label: lang === 'hi' ? 'दाना / फल भराव' : 'Grain / Fruit Filling' },
    { id: 'MATURITY_HARVEST', label: lang === 'hi' ? 'परिपक्वता / कटाई' : 'Maturity & Harvest' }
  ];

  const soils: Array<{ id: SoilType; label: string }> = [
    { id: 'CLAY_HEAVY', label: lang === 'hi' ? 'काली / चिकनी भारी मिट्टी' : 'Clay / Heavy Soil' },
    { id: 'SANDY_LIGHT', label: lang === 'hi' ? 'बलुई / हल्की रेतीली मिट्टी' : 'Sandy / Light Soil' },
    { id: 'LOAM_ALLUVIAL', label: lang === 'hi' ? 'दोमट / जलोढ़ मिट्टी' : 'Loam / Alluvial Soil' }
  ];

  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [selectedStage, setSelectedStage] = useState<CropGrowthStage>('FLOWERING');
  const [selectedSoil, setSelectedSoil] = useState<SoilType>('CLAY_HEAVY');
  const [advisory, setAdvisory] = useState<CropRiskEvaluationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchAdvisory() {
      setLoading(true);
      try {
        const res = await fetch('/api/crop-risk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop_name: selectedCrop,
            growth_stage: selectedStage,
            soil_type: selectedSoil,
            alert_color: alertColor,
            weather: currentWeather
          })
        });
        const data = await res.json();
        if (isMounted && data.success) {
          setAdvisory(data.advisory);
        }
      } catch (err) {
        console.error('Failed to evaluate crop risk:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAdvisory();
    return () => { isMounted = false; };
  }, [selectedCrop, selectedStage, selectedSoil, alertColor, currentWeather]);

  const getRiskBadgeColor = (level?: string) => {
    switch (level) {
      case 'Severe': return 'bg-red-600 text-white border-red-700';
      case 'High': return 'bg-orange-600 text-white border-orange-700';
      case 'Moderate': return 'bg-amber-500 text-slate-950 border-amber-600';
      default: return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 space-y-6">
      {/* Top Header & Required AI Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              AI Agricultural Weather-Risk Model
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic agromet risk synthesis matching crop stage, soil permeability, and meteorological hazards.
          </p>
        </div>

        {/* MANDATORY DISCLAIMER BADGE */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide self-start md:self-auto">
          <Info className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>AI-generated advisory, not an official warning</span>
        </div>
      </div>

      {/* Selectors Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
        {/* Crop Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            Standing Crop
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {crops.map((c) => (
              <option key={c.name} value={c.name}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Growth Stage Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Growth Stage
          </label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as CropGrowthStage)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stages.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Soil Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Field Soil Type
          </label>
          <select
            value={selectedSoil}
            onChange={(e) => setSelectedSoil(e.target.value as SoilType)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {soils.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advisory Output Card */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Sparkles className="w-8 h-8 animate-spin mx-auto text-amber-400/60" />
          <p className="text-xs font-medium">Synthesizing agromet rules for {selectedCrop}...</p>
        </div>
      ) : advisory ? (
        <div className="space-y-6">
          {/* Risk Level Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider uppercase border shadow-sm ${getRiskBadgeColor(advisory.risk_level)}`}>
                {advisory.risk_level} Risk
              </span>
              <VoiceAudioPlayer
                textToSpeak={`${selectedCrop} फ़सल के लिए मौसम जोखिम: ${advisory.risk_level}। ${advisory.primary_risk}। बचाव के मुख्य उपाय: ${advisory.precautions.join(', ')}`}
                lang={lang}
                size="sm"
              />
              <span className="text-xs font-bold text-slate-300">
                Trigger: {advisory.alert_type_inferred.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Source Provenance */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              {advisory.is_verified_source ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-semibold">{advisory.source_provenance}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300/90 font-mono text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                    advisory_unverified
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Primary Risk Statement */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Agronomic Risk Assessment:
            </h3>
            <p className="text-sm md:text-base font-semibold text-white leading-relaxed">
              {advisory.primary_risk}
            </p>
          </div>

          {/* Recommended Precautions Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Prioritized Preventive Actions:
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {advisory.precautions.map((precaution, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs md:text-sm text-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-snug">{precaution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Plant Disease Triggers from DB */}
          {advisory.associated_diseases && advisory.associated_diseases.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Cross-Referenced Favourable Disease Triggers (Disease DB):
                </h3>
              </div>
              <p className="text-xs text-slate-300">
                Current atmospheric moisture and thermal profile match known incubation criteria for:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {advisory.associated_diseases.map((d, i) => (
                  <Link
                    key={i}
                    href={d.url || `/diseases`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 transition"
                  >
                    <span>{d.name}</span>
                    {d.scientific_name && (
                      <span className="text-[10px] italic text-slate-400">({d.scientific_name})</span>
                    )}
                    <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
