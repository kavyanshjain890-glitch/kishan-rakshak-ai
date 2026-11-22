'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Sprout, 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  CloudSun, 
  FlaskConical, 
  Leaf, 
  ExternalLink, 
  PhoneCall, 
  HelpCircle,
  Globe2,
  Calendar,
  AlertOctagon,
  Clock,
  Shield
} from 'lucide-react';
import { PlantDisease, DiseaseTreatment } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import VoiceAudioPlayer from '@/components/voice/VoiceAudioPlayer';

interface DiseaseDetailData extends PlantDisease {
  treatments: DiseaseTreatment[];
}

export default function DiseaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { lang, setLang, t } = useLanguage();

  const [disease, setDisease] = useState<DiseaseDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/diseases/${id}`)
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setDisease(res.data);
        } else {
          setError(res.error || 'Failed to load disease');
        }
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Sprout className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading verified advisory...</p>
        </div>
      </div>
    );
  }

  if (error || !disease) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md shadow-sm space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Disease Record Not Found</h2>
          <p className="text-xs text-slate-500">{error || 'Unable to locate the requested advisory.'}</p>
          <Link
            href="/diseases"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  // Multilingual content resolution
  const isHindi = lang === 'hi';
  const isRajasthani = lang === 'hi-RJ';

  const localizedName = isHindi && disease.translations?.hi?.disease_name
    ? disease.translations.hi.disease_name
    : isRajasthani && disease.translations?.['hi-RJ']?.disease_name
    ? disease.translations['hi-RJ'].disease_name
    : disease.disease_name;

  const localizedSymptomsEarly = isHindi && disease.translations?.hi?.symptoms_early
    ? disease.translations.hi.symptoms_early
    : isRajasthani && disease.translations?.['hi-RJ']?.symptoms_early
    ? disease.translations['hi-RJ'].symptoms_early
    : disease.symptoms_early;

  const localizedSymptomsAdvanced = isHindi && disease.translations?.hi?.symptoms_advanced
    ? disease.translations.hi.symptoms_advanced
    : isRajasthani && disease.translations?.['hi-RJ']?.symptoms_advanced
    ? disease.translations['hi-RJ'].symptoms_advanced
    : disease.symptoms_advanced;

  const localizedCauses = isHindi && disease.translations?.hi?.causes
    ? disease.translations.hi.causes
    : disease.causes;

  const localizedPrevention = isHindi && disease.translations?.hi?.prevention
    ? disease.translations.hi.prevention
    : isRajasthani && disease.translations?.['hi-RJ']?.prevention
    ? disease.translations['hi-RJ'].prevention
    : disease.prevention;

  const localizedOrganic = isHindi && disease.translations?.hi?.organic_treatment
    ? disease.translations.hi.organic_treatment
    : isRajasthani && disease.translations?.['hi-RJ']?.organic_treatment
    ? disease.translations['hi-RJ'].organic_treatment
    : disease.organic_treatment;

  const localizedChemical = isHindi && disease.translations?.hi?.chemical_treatment
    ? disease.translations.hi.chemical_treatment
    : isRajasthani && disease.translations?.['hi-RJ']?.chemical_treatment
    ? disease.translations['hi-RJ'].chemical_treatment
    : disease.chemical_treatment;

  // Filter treatments: Organic & Biological first, Chemical last
  const bioTreatments = disease.treatments.filter(t => t.treatment_type === 'Biological' || t.treatment_type === 'Organic');
  const chemTreatments = disease.treatments.filter(t => t.treatment_type === 'Chemical');

  const refImages = Array.isArray(disease.reference_images) ? disease.reference_images : [];
  const verifiedSources = Array.isArray(disease.verified_sources) ? disease.verified_sources : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header with Language Switcher */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/diseases"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-700 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToLibrary}</span>
          </Link>

          {/* Global Language Switcher */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Title Header Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              {disease.crop_name} ({disease.crop_category})
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {disease.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              disease.severity === 'Severe' ? 'bg-red-100 text-red-800' :
              disease.severity === 'High' ? 'bg-amber-100 text-amber-800' :
              disease.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-slate-100 text-slate-700'
            }`}>
              {t.severity}: {disease.severity}
            </span>

            {/* Official Verification Badge */}
            {disease.verified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold ml-auto shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t.verifiedOfficial}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold ml-auto">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                {t.pendingStub}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                {localizedName}
              </h1>
              {disease.scientific_name && (
                <p className="text-sm md:text-base text-slate-500 italic font-mono mt-1">
                  {t.scientificName}: {disease.scientific_name}
                </p>
              )}
            </div>

            <VoiceAudioPlayer
              textToSpeak={`${localizedName}. ${t.symptomsEarly}: ${localizedSymptomsEarly || ''}. ${t.organicTitle}: ${localizedOrganic || ''}`}
              lang={lang}
            />
          </div>

          {/* Verification Metadata Box */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.verifiedBy}: <strong className="text-slate-800">{disease.verified_by_name || 'DPPQ&S Agricultural Directorate'}</strong></span>
            </div>
            {disease.verified_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Verified: {new Date(disease.verified_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reference Image Gallery with License Attribution */}
        {refImages.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Reference Field Photography</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {refImages.map((img: any, idx: number) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={img.url}
                    alt={img.caption || disease.disease_name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-3 text-xs bg-slate-900 text-white space-y-0.5">
                    <p className="font-semibold text-slate-200">{img.caption}</p>
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                      <span>Source: {img.credit}</span>
                      <span>{img.license}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Symptoms Section: Early vs Advanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b pb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{t.symptomsEarly}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {localizedSymptomsEarly || <span className="text-amber-700 italic">{t.notYetVerified}</span>}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b pb-2">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>{t.symptomsAdvanced}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {localizedSymptomsAdvanced || <span className="text-amber-700 italic">{t.notYetVerified}</span>}
            </p>
          </div>
        </div>

        {/* Causes & Favourable Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">{t.causes}</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {localizedCauses || <span className="text-amber-700 italic">{t.notYetVerified}</span>}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b pb-2">
              <CloudSun className="w-4 h-4 text-blue-600" />
              <span>{t.favourableWeather}</span>
            </div>
            {disease.favourable_weather && (disease.favourable_weather as any).temperature_min ? (
              <div className="space-y-2 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border">
                    <span className="text-slate-400 block font-semibold">Temperature:</span>
                    <strong className="text-slate-900 text-sm">{(disease.favourable_weather as any).temperature_min}°C – {(disease.favourable_weather as any).temperature_max}°C</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border">
                    <span className="text-slate-400 block font-semibold">Humidity:</span>
                    <strong className="text-slate-900 text-sm">&gt; {(disease.favourable_weather as any).humidity_min}%</strong>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">{(disease.favourable_weather as any).rainfall_relation}</p>
              </div>
            ) : (
              <p className="text-sm text-amber-700 italic">{t.notYetVerified}</p>
            )}
          </div>
        </div>

        {/* Prevention & Cultural Management */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2">{t.prevention}</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {localizedPrevention || <span className="text-amber-700 italic">{t.notYetVerified}</span>}
          </p>
        </div>

        {/* SECTION 4: ORGANIC & BIOLOGICAL SOLUTIONS (ORDERED FIRST) */}
        <div className="bg-emerald-50/70 p-6 md:p-8 rounded-3xl border-2 border-emerald-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-700" />
              <h2 className="text-lg md:text-xl font-extrabold text-emerald-950">
                {t.organicTitle}
              </h2>
            </div>
            <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1 rounded-full shadow-xs">
              {t.organicFirstBadge}
            </span>
          </div>

          <p className="text-sm text-emerald-900 leading-relaxed">
            {localizedOrganic || <span className="text-amber-800 italic">{t.notYetVerified}</span>}
          </p>

          {/* Granular Bio Treatments */}
          {bioTreatments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {bioTreatments.map((treatment) => (
                <div key={treatment.id} className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{treatment.method_name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {treatment.treatment_type}
                    </span>
                  </div>
                  {treatment.dosage && (
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-400">{t.dosage}:</span>{' '}
                      <strong className="text-emerald-900">{treatment.dosage}</strong>
                    </div>
                  )}
                  {treatment.application_method && (
                    <div className="text-xs text-slate-500">
                      <span>Method: {treatment.application_method}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: CHEMICAL MANAGEMENT (STRICT SOURCED ONLY - RULE 8) */}
        {chemTreatments.length > 0 || disease.chemical_treatment ? (
          <div className="bg-amber-50/60 p-6 md:p-8 rounded-3xl border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-amber-700" />
                <h2 className="text-lg md:text-xl font-extrabold text-amber-950">
                  {t.chemicalTitle}
                </h2>
              </div>
              <span className="text-xs bg-amber-700 text-white font-bold px-3 py-1 rounded-full shadow-xs">
                Official CIB&RC Label Only
              </span>
            </div>

            {/* Mandatory Safety Notice */}
            <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs font-semibold flex items-start gap-3 leading-relaxed">
              <AlertTriangle className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
              <span>{t.chemicalWarning}</span>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed">
              {localizedChemical}
            </p>

            {/* Granular Chemical Treatments */}
            {chemTreatments.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {chemTreatments.map((treatment) => (
                  <div key={treatment.id} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{treatment.method_name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Chemical
                      </span>
                    </div>
                    {treatment.dosage && (
                      <div className="text-xs text-slate-700">
                        <span className="font-semibold text-slate-400">{t.dosage}:</span>{' '}
                        <strong className="text-slate-900">{treatment.dosage}</strong>
                      </div>
                    )}
                    {treatment.safety_interval_days && (
                      <div className="text-xs text-amber-800 font-semibold">
                        <span>{t.waitingPeriod}: {treatment.safety_interval_days} {t.days}</span>
                      </div>
                    )}
                    <a
                      href={treatment.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold hover:underline mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Official Recommendation Bulletin
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Official Sourced Citations List */}
        {verifiedSources.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>{t.sourcesCitations}</span>
            </h2>
            <div className="divide-y divide-slate-100">
              {verifiedSources.map((source: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{source.title}</span>
                    <span className="text-slate-500 block">{source.authority} ({source.publication_year || 'Official'})</span>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-semibold hover:bg-emerald-50 hover:text-emerald-800 transition"
                  >
                    <span>Read Bulletin</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOT SURE? CONTACT KVK CALL-TO-ACTION */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Agricultural Extension Support
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              {t.kvkTitle}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {t.kvkText}
            </p>
          </div>

          <a
            href="https://icar.org.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 text-slate-950 font-extrabold text-sm rounded-2xl hover:bg-emerald-400 transition shadow-md whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4" />
            {t.kvkButton}
          </a>
        </div>
      </main>
    </div>
  );
}
