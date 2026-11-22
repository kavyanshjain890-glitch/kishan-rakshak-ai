'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Camera, 
  CloudSun, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Droplets, 
  Thermometer, 
  Wind, 
  PhoneCall, 
  ArrowRight, 
  Database, 
  Globe2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ExternalLink,
  Wifi,
  WifiOff,
  Sprout
} from 'lucide-react';
import { Language } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { CompleteWeatherPayload, AlertColor } from '@/lib/weather-service';
import WeatherRainfallChart from '@/components/dashboard/WeatherRainfallChart';
import { getOfflineDiagnoses, OfflineDiagnosisRecord } from '@/lib/offline-storage';
import { CropGrowthStage, SoilType } from '@/lib/types';
import VoiceAudioPlayer from '@/components/voice/VoiceAudioPlayer';

export default function FarmerDashboardHomePage() {
  const [mounted, setMounted] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const [weatherData, setWeatherData] = useState<CompleteWeatherPayload | null>(null);
  const [recentScans, setRecentScans] = useState<OfflineDiagnosisRecord[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeCrop, setActiveCrop] = useState<string>('Wheat');
  const [activeStage, setActiveStage] = useState<CropGrowthStage>('FLOWERING');
  const [cropRisk, setCropRisk] = useState<any | null>(null);

  // Monitor network status
  useEffect(() => {
    setMounted(true);
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch initial weather data (Jaipur default)
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather?district_id=rj-jaipur');
        const json = await res.json();
        if (json.success) {
          setWeatherData(json);
        }
      } catch (err) {
        console.warn('Weather fetch error:', err);
      }
    }
    fetchWeather();
  }, []);

  // Load recent offline/local diagnoses
  useEffect(() => {
    async function loadScans() {
      const scans = await getOfflineDiagnoses();
      setRecentScans(scans.slice(0, 4));
    }
    loadScans();
  }, []);

  // Fetch active crop risk
  useEffect(() => {
    async function fetchRisk() {
      try {
        const res = await fetch('/api/crop-risk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop_name: activeCrop,
            growth_stage: activeStage,
            soil_type: 'CLAY_HEAVY',
            alert_color: weatherData?.official_alert.warning_color || 'GREEN',
            weather: weatherData?.forecast.current
          })
        });
        const json = await res.json();
        if (json.success) {
          setCropRisk(json.advisory);
        }
      } catch (err) {
        console.warn('Crop risk fetch error:', err);
      }
    }
    fetchRisk();
  }, [activeCrop, activeStage, weatherData]);

  const alertColor = weatherData?.official_alert.warning_color || 'GREEN';

  // Helper for localized disease names in pilot list
  const getLocalizedDiseaseName = (enName: string) => {
    if (lang === 'hi-RJ') {
      if (enName === 'Rice Blast') return 'झोंका रोग (ब्लास्ट)';
      if (enName === 'Wheat Yellow Rust') return 'पीळी रोली (Yellow Rust)';
      if (enName === 'Tomato Late Blight') return 'पाछलो झुलसो (Late Blight)';
      if (enName === 'Potato Late Blight') return 'पाछलो झुलसो (आलू)';
      if (enName === 'Cotton Bacterial Blight') return 'जीवाणु झुलसो (कपास)';
    } else if (lang === 'hi') {
      if (enName === 'Rice Blast') return 'धान का झोंका रोग (ब्लास्ट)';
      if (enName === 'Wheat Yellow Rust') return 'गेहूं का पीला रतुआ';
      if (enName === 'Tomato Late Blight') return 'टमाटर का पिछेता झुलसा';
      if (enName === 'Potato Late Blight') return 'आलू का पिछेता झुलसा';
      if (enName === 'Cotton Bacterial Blight') return 'कपास का जीवाणु झुलसा';
    } else if (lang === 'gu') {
      if (enName === 'Rice Blast') return 'ડાંગરનો ગેરુ / બ્લાસ્ટ';
      if (enName === 'Wheat Yellow Rust') return 'ઘઉંનો પીળો ગેરુ (Yellow Rust)';
      if (enName === 'Tomato Late Blight') return 'ટમેટાનો પાછોતરો સુકારો';
      if (enName === 'Potato Late Blight') return 'બટાકાનો પાછોતરો સુકારો';
      if (enName === 'Cotton Bacterial Blight') return 'કપાસનો બેક્ટેરિયલ સુકારો';
    } else if (lang === 'mr') {
      if (enName === 'Rice Blast') return 'भातावरील करपा (Blast)';
      if (enName === 'Wheat Yellow Rust') return 'गव्हावरील पिवळा तांबेरा';
      if (enName === 'Tomato Late Blight') return 'टोमॅटोवरील उशिरा येणारा करपा';
      if (enName === 'Potato Late Blight') return 'बटाट्यावरील उशिरा येणारा करपा';
      if (enName === 'Cotton Bacterial Blight') return 'कापसावरील जिवाणूजन्य करपा';
    } else if (lang === 'pa') {
      if (enName === 'Rice Blast') return 'ਝੋਨੇ ਦਾ ਬਲਾਸਟ ਰੋਗ';
      if (enName === 'Wheat Yellow Rust') return 'ਕਣਕ ਦਾ ਪੀਲਾ ਰੱਤੂਆ (Yellow Rust)';
      if (enName === 'Tomato Late Blight') return 'ਟਮਾਟਰ ਦਾ ਪਿਛੇਤਾ ਝੁਲਸਾ';
      if (enName === 'Potato Late Blight') return 'ਆਲੂ ਦਾ ਪਿਛੇਤਾ ਝੁਲਸਾ';
      if (enName === 'Cotton Bacterial Blight') return 'ਨਰਮੇ ਦਾ ਬੈਕਟੀਰੀਅਲ ਝੁਲਸਾ';
    }
    return enName;
  };

  // Helper for localized crop names
  const getLocalizedCropName = (cropName: string) => {
    if (lang === 'hi-RJ') {
      if (cropName === 'Wheat') return 'कणक (गेहूं)';
      if (cropName === 'Rice') return 'डांगर (चावल)';
      if (cropName === 'Tomato') return 'टमाटर';
      if (cropName === 'Potato') return 'बट्टाटा (आलू)';
      if (cropName === 'Cotton') return 'रूई / बाण';
      if (cropName === 'Mustard') return 'राय / सरस्यूं';
    } else if (lang === 'hi') {
      if (cropName === 'Wheat') return 'गेहूं (Wheat)';
      if (cropName === 'Rice') return 'धान / चावल (Rice)';
      if (cropName === 'Tomato') return 'टमाटर (Tomato)';
      if (cropName === 'Potato') return 'आलू (Potato)';
      if (cropName === 'Cotton') return 'कपास (Cotton)';
      if (cropName === 'Mustard') return 'सरसों (Mustard)';
    } else if (lang === 'gu') {
      if (cropName === 'Wheat') return 'ઘઉં (Wheat)';
      if (cropName === 'Rice') return 'ડાંગર / ચોખા (Rice)';
      if (cropName === 'Tomato') return 'ટમેટા (Tomato)';
      if (cropName === 'Potato') return 'બટાકા (Potato)';
      if (cropName === 'Cotton') return 'કપાસ (Cotton)';
      if (cropName === 'Mustard') return 'રાય / સરસવ (Mustard)';
    } else if (lang === 'mr') {
      if (cropName === 'Wheat') return 'गहू (Wheat)';
      if (cropName === 'Rice') return 'भात / तांदूळ (Rice)';
      if (cropName === 'Tomato') return 'टोमॅटो (Tomato)';
      if (cropName === 'Potato') return 'बटाटा (Potato)';
      if (cropName === 'Cotton') return 'कापूस (Cotton)';
      if (cropName === 'Mustard') return 'मोहरी (Mustard)';
    } else if (lang === 'pa') {
      if (cropName === 'Wheat') return 'ਕਣਕ (Wheat)';
      if (cropName === 'Rice') return 'ਝੋਨਾ / ਚੌਲ (Rice)';
      if (cropName === 'Tomato') return 'ਟਮਾਟਰ (Tomato)';
      if (cropName === 'Potato') return 'ਆਲੂ (Potato)';
      if (cropName === 'Cotton') return 'ਕਪਾਹ / ਨਰਮਾ (Cotton)';
      if (cropName === 'Mustard') return 'ਸਰ੍ਹੋਂ (Mustard)';
    }
    return cropName;
  };

  // Helper for localized stage names
  const getLocalizedStageName = (stage: CropGrowthStage) => {
    if (lang === 'hi-RJ') {
      switch(stage) {
        case 'SOWING_GERMINATION': return 'बोवणी / अंकुरण';
        case 'VEGETATIVE': return 'बढ़ती अवस्था';
        case 'FLOWERING': return 'फूल आवण री अवस्था';
        case 'GRAIN_FRUIT_FILLING': return 'दाणो / फळ भराव';
        case 'MATURITY_HARVEST': return 'लावणी / कटाई';
      }
    } else if (lang === 'hi') {
      switch(stage) {
        case 'SOWING_GERMINATION': return 'बुवाई / अंकुरण';
        case 'VEGETATIVE': return 'वानस्पतिक वृद्धि';
        case 'FLOWERING': return 'फूल आने की अवस्था';
        case 'GRAIN_FRUIT_FILLING': return 'दाना / फल भराव';
        case 'MATURITY_HARVEST': return 'परिपक्वता / कटाई';
      }
    } else if (lang === 'gu') {
      switch(stage) {
        case 'SOWING_GERMINATION': return 'વાવણી / અંકુરણ';
        case 'VEGETATIVE': return 'વનસ્પતિ વૃદ્ધિ';
        case 'FLOWERING': return 'ફૂલ આવવાની અવસ્થા';
        case 'GRAIN_FRUIT_FILLING': return 'દાણા / ફળ ભરાવ';
        case 'MATURITY_HARVEST': return 'પાકવાની / લણણી અવસ્થા';
      }
    } else if (lang === 'mr') {
      switch(stage) {
        case 'SOWING_GERMINATION': return 'पेरणी / उगवण';
        case 'VEGETATIVE': return 'शाकीय वाढ अवस्था';
        case 'FLOWERING': return 'फुलोरा अवस्था';
        case 'GRAIN_FRUIT_FILLING': return 'दाणे / फळ भरणे';
        case 'MATURITY_HARVEST': return 'पक्वता / कापणी';
      }
    } else if (lang === 'pa') {
      switch(stage) {
        case 'SOWING_GERMINATION': return 'ਬਿਜਾਈ / ਜੰਮ';
        case 'VEGETATIVE': return 'ਵਾਧੇ ਦੀ ਅਵਸਥਾ';
        case 'FLOWERING': return 'ਫੁੱਲ ਆਉਣ ਦੀ ਅਵਸਥਾ';
        case 'GRAIN_FRUIT_FILLING': return 'ਦਾਣਾ / ਫਲ ਭਰਾਅ';
        case 'MATURITY_HARVEST': return 'ਪੱਕਣ / ਕਟਾਈ ਅਵਸਥਾ';
      }
    }
    switch(stage) {
      case 'SOWING_GERMINATION': return 'Sowing / Emergence';
      case 'VEGETATIVE': return 'Vegetative Stage';
      case 'FLOWERING': return 'Flowering Stage';
      case 'GRAIN_FRUIT_FILLING': return 'Grain / Fruit Filling';
      case 'MATURITY_HARVEST': return 'Maturity / Harvest';
    }
  };

  const pilotDiseases = [
    { name: 'Rice Blast', crop: 'Rice', id: '1', slug: 'blast', image: '/diseases/rice-blast.jpg' },
    { name: 'Wheat Yellow Rust', crop: 'Wheat', id: '2', slug: 'yellow-rust', image: '/diseases/wheat-rust.jpg' },
    { name: 'Tomato Late Blight', crop: 'Tomato', id: '3', slug: 'late-blight', image: '/diseases/tomato-blight.jpg' },
    { name: 'Potato Late Blight', crop: 'Potato', id: '4', slug: 'potato-blight', image: '/diseases/potato-blight.jpg' },
    { name: 'Cotton Bacterial Blight', crop: 'Cotton', id: '5', slug: 'bacterial-blight', image: '/diseases/cotton-blight.jpg' }
  ];

  const subHeadingText = lang === 'hi-RJ'
    ? 'किसान रक्षक एआई · राजस्थान फसल सुरक्षा कवच'
    : lang === 'hi'
    ? 'किसान रक्षक एआई · भारत फसल सुरक्षा कवच'
    : lang === 'gu'
    ? 'કિસાન રક્ષક એઆઈ · ગુજરાત પાક સુરક્ષા કવચ'
    : lang === 'mr'
    ? 'किसान रक्षक एआय · महाराष्ट्र पीक सुरक्षा कवच'
    : lang === 'pa'
    ? 'ਕਿਸਾਨ ਰੱਖਿਅਕ ਏਆਈ · ਪੰਜਾਬ ਫਸਲ ਸੁਰੱਖਿਆ ਕਵਚ'
    : 'Kishan Rakshak AI · India Crop Shield';

  const imdAlertLabel = lang === 'gu' ? 'સત્તાવાર હવામાન ચેતવણી' :
    lang === 'mr' ? 'अधिकृत हवामान इशारा' :
    lang === 'pa' ? 'ਸਰਕਾਰੀ ਮੌਸਮ ਚੇਤਾਵਨੀ' :
    lang === 'hi-RJ' || lang === 'hi' ? 'आधिकारिक मौसम चेतावणी' : 'Official IMD Alert';

  const imdDetailsText = lang === 'gu' ? 'વિગતો જુઓ →' :
    lang === 'mr' ? 'तपशील पहा →' :
    lang === 'pa' ? 'ਵੇਰਵੇ ਦੇਖੋ →' :
    lang === 'hi-RJ' ? 'पूरी जानकारी →' :
    lang === 'hi' ? 'विवरण देखें →' : 'Details →';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" suppressHydrationWarning>
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between" suppressHydrationWarning>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              KR
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base leading-tight" suppressHydrationWarning>
                {t.appName}
              </div>
              <div className="text-xs text-emerald-700 font-medium hidden sm:block" suppressHydrationWarning>
                {subHeadingText}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4" suppressHydrationWarning>
            {/* Location Pill */}
            <Link
              href="/weather"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span suppressHydrationWarning>{weatherData?.location.district || 'Jaipur'}, {weatherData?.location.state || 'RJ'}</span>
            </Link>

            {/* Online / Offline indicator */}
            <div 
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              suppressHydrationWarning
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span suppressHydrationWarning>{isOnline ? t.onlineSync : t.offlineMode}</span>
            </div>

            {/* Global Language Switcher */}
            <LanguageSwitcher />

            {/* Admin Link */}
            <Link
              href="/admin"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Emergency Weather Alert Bar (Driven by IMD Alert Level) */}
      {weatherData && (
        <div 
          className={`px-4 py-2.5 border-b text-xs font-bold transition-all ${
            alertColor === 'RED' ? 'bg-red-600 text-white border-red-700' :
            alertColor === 'ORANGE' ? 'bg-orange-600 text-white border-orange-700' :
            alertColor === 'YELLOW' ? 'bg-amber-100 text-amber-950 border-amber-300' :
            alertColor === 'UNAVAILABLE' ? 'bg-slate-200 text-slate-800 border-slate-300' :
            'bg-emerald-600 text-white border-emerald-700'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-black/20 text-[10px] tracking-wider uppercase font-black">
                {imdAlertLabel}
              </span>
              <span>
                {alertColor === 'UNAVAILABLE' 
                  ? (lang === 'hi-RJ' ? 'सरकारी मौसम री ताज़ा चेतावणी हाल कोनी' : lang === 'hi' ? 'आधिकारिक मौसम डेटा वर्तमान में अनुपलब्ध है' : 'Official weather data is currently unavailable')
                  : `${alertColor} Alert: ${weatherData.official_alert.hazard_type} in ${weatherData.location.district}`}
              </span>
            </div>
            <Link 
              href="/weather" 
              className="underline text-[11px] font-bold hover:opacity-80 shrink-0"
            >
              {imdDetailsText}
            </Link>
          </div>
        </div>
      )}

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex-1 w-full space-y-6">
        {/* Quick Launch Hero Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Scanner Launch */}
          <Link
            href="/scanner"
            className="group p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md hover:shadow-xl transition transform hover:-translate-y-0.5 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  AI Vision 1.0
                </span>
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight leading-snug">
                  {t.scanCrop}
                </h2>
                <p className="text-xs text-emerald-100 mt-1">
                  {t.scanDesc}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition">
                <span>{t.openScanner}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 2: Agro-Weather Hub */}
          <Link
            href="/weather"
            className="group p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                IMD & Open-Meteo
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {weatherData ? `${weatherData.forecast.current.temperature}°C` : '28°C'}
              </div>
              <h2 className="text-sm font-bold text-slate-800 mt-0.5">
                {t.weatherLive}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t.weatherDesc}
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition">
              <span>{t.viewWeather}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Disease Library */}
          <Link
            href="/diseases"
            className="group p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {lang === 'hi-RJ' ? '50+ फसलां जाँचेड़ी' : lang === 'hi' ? '50+ फसलें उपलब्ध' : '50+ Crops Seeded'}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {t.cropLibrary}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t.libraryDesc}
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition">
              <span>{t.browseLibrary}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* 2-Column Core Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Weather, Rainfall Chart & Crop Risk */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Weather Overview Card */}
            {weatherData && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-900">
                      {t.weatherOutlook}: {weatherData.location.district}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {t.updated}: {new Date(weatherData.forecast.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Weather Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <Thermometer className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <div className="text-base font-black text-slate-900">
                      {weatherData.forecast.current.temperature}°C
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{t.temperature}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <Droplets className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <div className="text-base font-black text-slate-900">
                      {weatherData.forecast.current.relative_humidity}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{t.humidity}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <Wind className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                    <div className="text-base font-black text-slate-900">
                      {weatherData.forecast.current.wind_speed} km/h
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{t.windSpeed}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <Droplets className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                    <div className="text-base font-black text-slate-900">
                      {weatherData.forecast.daily[0]?.precipitation_probability || 0}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{t.rainProb}</span>
                  </div>
                </div>

                {/* Rainfall & Risk Trend Chart */}
                <WeatherRainfallChart daily={weatherData.forecast.daily} lang={lang} />
              </div>
            )}

            {/* Standing Crop Weather-Risk Card */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">
                    {t.activeAdvisory}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {cropRisk && (
                    <VoiceAudioPlayer
                      textToSpeak={`${getLocalizedCropName(activeCrop)}: ${cropRisk.primary_risk}। बचाव के उपाय: ${cropRisk.precautions?.join(', ')}`}
                      lang={lang}
                      size="sm"
                    />
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                    {lang === 'hi-RJ' ? 'एआई सलाह, सरकारी चेतावणी कोनी' : lang === 'hi' ? 'एआई सलाह, आधिकारिक चेतावनी नहीं' : 'AI-generated advisory, not an official warning'}
                  </span>
                </div>
              </div>

              {/* Crop & Stage Selector Row */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    {t.selectCrop}
                  </label>
                  <select
                    value={activeCrop}
                    onChange={(e) => setActiveCrop(e.target.value)}
                    className="w-full bg-slate-800 text-white rounded-xl px-2.5 py-1.5 text-xs font-semibold border border-slate-700"
                  >
                    <option value="Wheat">{getLocalizedCropName('Wheat')}</option>
                    <option value="Rice">{getLocalizedCropName('Rice')}</option>
                    <option value="Tomato">{getLocalizedCropName('Tomato')}</option>
                    <option value="Potato">{getLocalizedCropName('Potato')}</option>
                    <option value="Cotton">{getLocalizedCropName('Cotton')}</option>
                    <option value="Mustard">{getLocalizedCropName('Mustard')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    {t.growthStage}
                  </label>
                  <select
                    value={activeStage}
                    onChange={(e) => setActiveStage(e.target.value as CropGrowthStage)}
                    className="w-full bg-slate-800 text-white rounded-xl px-2.5 py-1.5 text-xs font-semibold border border-slate-700"
                  >
                    <option value="SOWING_GERMINATION">{getLocalizedStageName('SOWING_GERMINATION')}</option>
                    <option value="VEGETATIVE">{getLocalizedStageName('VEGETATIVE')}</option>
                    <option value="FLOWERING">{getLocalizedStageName('FLOWERING')}</option>
                    <option value="GRAIN_FRUIT_FILLING">{getLocalizedStageName('GRAIN_FRUIT_FILLING')}</option>
                    <option value="MATURITY_HARVEST">{getLocalizedStageName('MATURITY_HARVEST')}</option>
                  </select>
                </div>
              </div>

              {/* Evaluated Output */}
              {cropRisk && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2.5 py-0.5 rounded-lg font-black uppercase text-[11px] ${
                      cropRisk.risk_level === 'Severe' ? 'bg-red-600 text-white' :
                      cropRisk.risk_level === 'High' ? 'bg-orange-600 text-white' :
                      cropRisk.risk_level === 'Moderate' ? 'bg-amber-500 text-slate-950' :
                      'bg-emerald-600 text-white'
                    }`}>
                      {cropRisk.risk_level} {lang === 'hi-RJ' || lang === 'hi' ? 'जोखिम' : 'Risk'}
                    </span>
                    <span className="text-[11px] text-slate-400 italic">
                      Source: {cropRisk.source_provenance}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                    {cropRisk.primary_risk}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t.fieldActions}
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {cropRisk.precautions.map((p: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Scanner History, Quick Disease Links & Emergency */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Scanner Action & Recent Scans */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    {t.recentScans}
                  </h3>
                </div>
                <Link
                  href="/scanner"
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  {t.newScan} &rarr;
                </Link>
              </div>

              {recentScans.length > 0 ? (
                <div className="space-y-2.5">
                  {recentScans.map((scan) => (
                    <div 
                      key={scan.id} 
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {scan.crop.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {getLocalizedDiseaseName(scan.topDisease)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {getLocalizedCropName(scan.crop)} • {scan.plantPart} • {new Date(scan.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          scan.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {scan.status === 'confirmed' ? `${Math.round(scan.confidence * 100)}%` : 'Uncertain'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 space-y-2">
                  <Camera className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">{t.noRecentScans}</p>
                  <Link
                    href="/scanner"
                    className="inline-block text-xs font-bold text-emerald-700 hover:underline"
                  >
                    {t.firstScan}
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Browse Pilot Diseases */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    {t.verifiedPilotDiseases}
                  </h3>
                </div>
                <Link
                  href="/diseases"
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  {t.allCropsLink} &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {pilotDiseases.map((d) => (
                  <Link
                    key={d.id}
                    href={`/diseases`}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex items-center justify-between text-xs group"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        {getLocalizedCropName(d.crop)}
                      </span>
                      <div className="font-bold text-slate-900 group-hover:text-emerald-800 transition">
                        {getLocalizedDiseaseName(d.name)}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-700 flex items-center gap-0.5">
                      {t.viewProtocol} &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Kisan Emergency Support Card */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white p-5 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t.emergencyHelpline}</h4>
                  <p className="text-[11px] text-amber-100">
                    {t.officialAssistance}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>{t.tollFree}</span>
                  <a href="tel:18001801551" className="underline text-sm font-black text-amber-200">
                    1800-180-1551
                  </a>
                </div>
                <div className="text-[10px] text-amber-100">
                  {t.helplineHours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">KISHAN RAKSHAK AI</span>
            <span>•</span>
            <span>{t.zeroHallucination}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <Link href="/weather" className="hover:text-emerald-700">{t.weatherHub}</Link>
            <Link href="/scanner" className="hover:text-emerald-700">{t.scanCrop}</Link>
            <Link href="/diseases" className="hover:text-emerald-700">{t.cropLibrary}</Link>
            <Link href="/admin" className="hover:text-emerald-700">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
