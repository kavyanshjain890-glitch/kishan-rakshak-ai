'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  ArrowLeft, 
  Info, 
  ExternalLink,
  RefreshCw,
  Layers,
  Sprout,
  HelpCircle,
  Globe2,
  X,
  RotateCcw
} from 'lucide-react';
import { validateImageFile, compressAndStripExif, ProcessedImageResult } from '@/lib/image-processing';
import { saveDiagnosisOffline } from '@/lib/offline-storage';
import { DiagnosisResponse } from '@/lib/scanner-service';
import { Language } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import VoiceAudioPlayer from '@/components/voice/VoiceAudioPlayer';

export default function PlantDiseaseScannerPage() {
  const { lang, setLang, t } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [selectedPart, setSelectedPart] = useState<'Leaf' | 'Stem' | 'Root' | 'Fruit'>('Leaf');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedDetails, setProcessedDetails] = useState<ProcessedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Camera Viewfinder State (HTML5 getUserMedia)
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async (facing: 'user' | 'environment' = 'environment') => {
    setErrorMsg(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera is not supported on this device/browser.');
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setIsCameraActive(true);
      setCameraFacing(facing);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.warn('Video play error:', e));
        }
      }, 100);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const e = err as Error;
      setErrorMsg(`Camera access failed: ${e.message}. You can select an image file instead.`);
      // Fallback to file input
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureLivePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        stopCamera();
        try {
          setIsProcessing(true);
          const processed = await compressAndStripExif(file);
          setImagePreview(processed.dataUrl);
          setProcessedDetails(processed);
          setDiagnosis(null);
        } catch (err) {
          setErrorMsg((err as Error).message);
        } finally {
          setIsProcessing(false);
        }
      },
      'image/jpeg',
      0.9
    );
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const crops = [
    { name: 'Wheat', label: lang === 'gu' ? 'ઘઉં (Wheat)' : lang === 'mr' ? 'गहू (Wheat)' : lang === 'pa' ? 'ਕਣਕ (Wheat)' : lang === 'hi-RJ' ? 'कणक (गेहूं)' : lang === 'hi' ? 'गेहूं (Wheat)' : 'Wheat' },
    { name: 'Rice', label: lang === 'gu' ? 'ડાંગર / ચોખા (Rice)' : lang === 'mr' ? 'भात / तांदूळ (Rice)' : lang === 'pa' ? 'ਝੋਨਾ / ਚੌਲ (Rice)' : lang === 'hi-RJ' ? 'डांगर (चावल)' : lang === 'hi' ? 'धान / चावल (Rice)' : 'Rice' },
    { name: 'Tomato', label: lang === 'gu' ? 'ટમેટા (Tomato)' : lang === 'mr' ? 'टोमॅटो (Tomato)' : lang === 'pa' ? 'ਟਮਾਟਰ (Tomato)' : lang === 'hi' || lang === 'hi-RJ' ? 'टमाटर (Tomato)' : 'Tomato' },
    { name: 'Potato', label: lang === 'gu' ? 'બટાકા (Potato)' : lang === 'mr' ? 'बटाटा (Potato)' : lang === 'pa' ? 'ਆਲੂ (Potato)' : lang === 'hi-RJ' ? 'बट्टाटा (आलू)' : lang === 'hi' ? 'आलू (Potato)' : 'Potato' },
    { name: 'Cotton', label: lang === 'gu' ? 'કપાસ (Cotton)' : lang === 'mr' ? 'कापूस (Cotton)' : lang === 'pa' ? 'ਕਪਾਹ / ਨਰਮਾ (Cotton)' : lang === 'hi-RJ' ? 'रूई / बाण' : lang === 'hi' ? 'कपास (Cotton)' : 'Cotton' },
    { name: 'Mustard', label: lang === 'gu' ? 'રાય / સરસવ (Mustard)' : lang === 'mr' ? 'मोहरी (Mustard)' : lang === 'pa' ? 'ਸਰ੍ਹੋਂ (Mustard)' : lang === 'hi-RJ' ? 'राय / सरस्यूं' : lang === 'hi' ? 'सरसों (Mustard)' : 'Mustard' },
    { name: 'Maize', label: lang === 'gu' ? 'મકાઈ (Maize)' : lang === 'mr' ? 'मका (Maize)' : lang === 'pa' ? 'ਮੱਕੀ (Maize)' : lang === 'hi' || lang === 'hi-RJ' ? 'मक्का (Maize)' : 'Maize' },
    { name: 'Chilli', label: lang === 'gu' ? 'મરચાં (Chilli)' : lang === 'mr' ? 'मिरची (Chilli)' : lang === 'pa' ? 'ਮਿਰਚ (Chilli)' : lang === 'hi' || lang === 'hi-RJ' ? 'मिर्च (Chilli)' : 'Chilli' }
  ];

  const plantParts: Array<'Leaf' | 'Stem' | 'Root' | 'Fruit'> = ['Leaf', 'Stem', 'Root', 'Fruit'];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid file');
      return;
    }

    try {
      setIsProcessing(true);
      const processed = await compressAndStripExif(file);
      setImagePreview(processed.dataUrl);
      setProcessedDetails(processed);
      setDiagnosis(null);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const l = params.get('lang') as Language;
      if (l && ['en', 'hi', 'hi-RJ'].includes(l)) {
        setLang(l);
      }
      const sim = params.get('simulate');
      if (sim === 'uncertain') {
        handleRunDiagnosis(true, false);
      } else if (sim === 'confirmed') {
        const dummy = '/placeholder-scan.jpg';
        setImagePreview(dummy);
        handleRunDiagnosis(false, false, dummy);
      }
    }
  }, []);

  const handleRunDiagnosis = async (isTestLowQuality = false, isTestNonPlant = false, imageOverride?: string) => {
    const targetImage = imageOverride || imagePreview;
    if (!targetImage && !isTestLowQuality && !isTestNonPlant) {
      setErrorMsg('Please upload or capture a photo first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const effectiveLowQuality = isTestLowQuality || (processedDetails?.is_low_quality ?? false);
    const effectiveNonPlant = isTestNonPlant || (processedDetails?.is_non_plant ?? false);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_data: targetImage,
          crop_name: selectedCrop,
          plant_part: selectedPart,
          is_low_quality: effectiveLowQuality,
          is_non_plant: effectiveNonPlant,
          detection_reason: processedDetails?.detection_reason,
          metrics: processedDetails?.metrics,
          weather_context: {
            temperature: 28,
            humidity: 78,
            rainfall_prob: 40
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setDiagnosis(data.diagnosis);
        // Save to offline storage
        await saveDiagnosisOffline({
          id: data.diagnosis.id,
          timestamp: Date.now(),
          crop: selectedCrop,
          plantPart: selectedPart,
          thumbnailDataUrl: imagePreview ? imagePreview.substring(0, 1000) : '',
          topDisease: data.diagnosis.top_prediction,
          confidence: data.diagnosis.confidence_score,
          status: data.diagnosis.status === 'confirmed' ? 'confirmed' : 'uncertain',
          syncedToServer: true
        });
      } else {
        setErrorMsg(data.error || 'Failed to complete diagnosis.');
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              KR
            </Link>
            <div>
              <Link href="/" className="font-bold text-slate-900 text-base leading-tight hover:text-emerald-700 transition">
                {t.appName}
              </Link>
              <div className="text-xs text-emerald-700 font-medium hidden sm:block">
                AI Plant Disease Scanner & Diagnostic Lab
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

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-emerald-600" />
              AI Plant Disease Scanner
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Deep vision diagnosis fine-tuned on PlantVillage, PlantDoc & Paddy Doctor datasets.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            CIB&RC Registered Treatment Links
          </div>
        </div>

        {/* Input Selectors: Crop & Plant Part */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              1. Select Affected Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {crops.map((c) => (
                <option key={c.name} value={c.name}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              2. Select Plant Part
            </label>
            <div className="grid grid-cols-4 gap-2">
              {plantParts.map((part) => (
                <button
                  key={part}
                  type="button"
                  onClick={() => setSelectedPart(part)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition text-center ${
                    selectedPart === part
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload & Camera Box */}
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-300 shadow-xs space-y-4 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {imagePreview ? (
            <div className="space-y-4">
              <div className="relative inline-block rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-72">
                <img
                  src={imagePreview}
                  alt="Captured plant preview"
                  className="object-contain max-h-72 w-auto mx-auto"
                />
              </div>

              {processedDetails && (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-center gap-3">
                    <span>Dimensions: <strong>{processedDetails.width} &times; {processedDetails.height}px</strong></span>
                    <span>•</span>
                    <span>Original: <strong>{(processedDetails.originalSize / 1024).toFixed(0)} KB</strong></span>
                    <span>•</span>
                    <span>Compressed: <strong>{(processedDetails.compressedSize / 1024).toFixed(0)} KB</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">EXIF Metadata Stripped</span>
                  </div>

                  {/* Pre-Filter Quality & Plant Detection Badge */}
                  <div className="flex items-center gap-2 pt-1">
                    {processedDetails.detection_reason === 'human_detected' && (
                      <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-bold animate-pulse">
                        ⚠️ Human / Person Detected (Non-Crop Image)
                      </span>
                    )}
                    {processedDetails.detection_reason === 'non_plant_object' && (
                      <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-bold">
                        ⚠️ Non-Crop Object Detected (Plant ratio: {Math.round(processedDetails.metrics.plantRatio * 100)}%)
                      </span>
                    )}
                    {processedDetails.detection_reason === 'blurry_image' && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                        ⚠️ Blurry / Soft Focus Detected (Sharpness: {processedDetails.metrics.sharpnessScore})
                      </span>
                    )}
                    {processedDetails.detection_reason === 'valid_leaf' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
                        ✓ Crop Foliage Verified (Sharpness: {processedDetails.metrics.sharpnessScore})
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleRunDiagnosis()}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? 'Analyzing Plant Disease...' : 'Run AI Diagnosis'}
                </button>

                <button
                  onClick={() => {
                    setImagePreview(null);
                    setProcessedDetails(null);
                    setDiagnosis(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Retake / Change Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                <Camera className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Upload or Capture Plant Disease Photo
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Supports JPEG, PNG, or WebP up to 5MB. Client-side EXIF stripping preserves privacy.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startCamera('environment')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition transform active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  Take Camera Photo
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Select File from Device
                </button>
              </div>

              {/* Edge Case Simulator (Test Harness) */}
              <div className="pt-4 border-t border-slate-100 max-w-md mx-auto">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Test Harness: Simulate Edge Cases
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunDiagnosis(true, false)}
                    className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold hover:bg-amber-100"
                  >
                    Simulate Blurry / Low-Quality
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunDiagnosis(false, true)}
                    className="px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-900 text-xs font-semibold hover:bg-red-100"
                  >
                    Simulate Non-Plant Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Diagnosis Result Card */}
        {diagnosis && (
          <div className="space-y-6">
            {diagnosis.status === 'uncertain_under_threshold' ? (
              // UNCERTAIN PATH (CONFIDENCE < 0.65 OR NON-PLANT)
              <div className="bg-amber-50 rounded-3xl p-6 md:p-8 border-2 border-amber-300 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black text-xs uppercase tracking-wide">
                        Confidence Below Threshold ({Math.round(diagnosis.confidence_score * 100)}%)
                      </span>
                      <h2 className="text-xl font-black text-amber-950 mt-1">
                        Not Sure - Additional Inspection Required
                      </h2>
                    </div>
                  </div>
                  <VoiceAudioPlayer
                    textToSpeak="फ़ोटो से रोग की पहचान स्पष्ट नहीं हो सकी। कृपया साफ़, नज़दीक से और बिना धूप की छाया वाली तस्वीर लें, या किसान कॉल सेंटर 1800-180-1551 पर संपर्क करें।"
                    lang={lang}
                  />
                </div>

                <p className="text-xs md:text-sm text-amber-900 font-medium leading-relaxed">
                  The visual symptoms in this photograph could not be matched to a definitive pathogen pattern with &ge;65% confidence. To safeguard your crop and prevent pesticide misapplication, please follow these photography tips or contact local agricultural extension officers.
                </p>

                {/* Practical Photography Tips */}
                {diagnosis.kvk_guidance && (
                  <div className="bg-white/80 p-5 rounded-2xl border border-amber-200 space-y-3">
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-700" />
                      Recommended Photography Instructions:
                    </h3>
                    <ul className="space-y-2 text-xs text-amber-950">
                      {diagnosis.kvk_guidance.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Emergency KVK Path */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-600 text-white">
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-6 h-6 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Need Expert Diagnosis?</div>
                      <div className="text-xs text-amber-100">
                        Dial Toll-free Kisan Call Center: <strong>1800-180-1551</strong> (06:00 - 22:00)
                      </div>
                    </div>
                  </div>

                  <a
                    href="tel:18001801551"
                    className="px-4 py-2 bg-white text-amber-900 font-bold text-xs rounded-xl shadow-xs hover:bg-amber-50 transition shrink-0 text-center"
                  >
                    Call Kisan Helpline
                  </a>
                </div>
              </div>
            ) : (
              // CONFIRMED DIAGNOSIS PATH (CONFIDENCE >= 0.65)
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                        {Math.round(diagnosis.confidence_score * 100)}% Match Confidence
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {diagnosis.crop_identified} • {diagnosis.plant_part}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
                      {diagnosis.top_prediction}
                    </h2>
                    {diagnosis.recommended_treatment.scientific_name && (
                      <p className="text-sm italic text-slate-500 font-serif">
                        {diagnosis.recommended_treatment.scientific_name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <VoiceAudioPlayer
                      textToSpeak={`${diagnosis.top_prediction} रोग की पुष्टि। गंभीरता: ${diagnosis.severity_estimate}। मुख्य लक्षण: ${diagnosis.visible_symptoms.join(', ')}। जैविक रोकथाम: ${diagnosis.organic_prevention.join(', ')}`}
                      lang={lang}
                    />
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                      diagnosis.severity_estimate === 'Severe' ? 'bg-red-600 text-white' :
                      diagnosis.severity_estimate === 'High' ? 'bg-orange-600 text-white' :
                      diagnosis.severity_estimate === 'Medium' ? 'bg-amber-500 text-slate-950' :
                      'bg-emerald-600 text-white'
                    }`}>
                      {diagnosis.severity_estimate} Severity
                    </span>
                  </div>
                </div>

                {/* Top-3 Prediction Distribution Bars */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Model Prediction Probability Distribution (Top-3):
                  </h3>
                  <div className="space-y-2">
                    {diagnosis.predictions.map((p, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>{p.disease_name}</span>
                          <span>{p.percentage}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${i === 0 ? 'bg-emerald-600' : 'bg-slate-400'}`}
                            style={{ width: `${Math.round(p.confidence * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Detected Visual Symptoms:
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {diagnosis.visible_symptoms.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Recommendations - ORGANIC FIRST */}
                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Organic & Biological Treatment (Prioritized First):
                    </h3>
                    <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                      {diagnosis.organic_prevention.map((org, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{org}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CIB&RC Verified Link */}
                  {diagnosis.recommended_treatment.verified_url ? (
                    <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div>
                        <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                          Official CIB&RC Registered Management
                        </div>
                        <div className="text-sm font-semibold text-slate-200 mt-0.5">
                          View approved fungicides, exact waiting periods (PHI), and safety precautions for {diagnosis.top_prediction}.
                        </div>
                      </div>
                      <Link
                        href={diagnosis.recommended_treatment.verified_url}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shrink-0 transition"
                      >
                        <span>View Verified Protocol</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                      Chemical treatments require verified official registration. Please consult your local KVK extension officer.
                    </div>
                  )}

                  {/* CIB&RC Mandatory Compliance Note */}
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{diagnosis.recommended_treatment.cibrc_disclaimer}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Live Camera Viewfinder Modal (HTML5 getUserMedia) */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 backdrop-blur-md">
          {/* Top Bar */}
          <div className="w-full max-w-xl flex items-center justify-between text-white py-2 px-1">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">Live Crop Scanner Camera</span>
            </div>
            <button
              type="button"
              onClick={stopCamera}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
              title="Close Camera"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Viewfinder Container */}
          <div className="relative w-full max-w-xl aspect-[4/3] rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-500 shadow-2xl flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target Reticle / Leaf Alignment Box */}
            <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-3">
              <div className="text-[10px] font-bold text-emerald-300 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur">
                Leaf Target Frame
              </div>
              <div className="text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur text-center">
                Position the affected leaf inside this box
              </div>
            </div>
          </div>

          {/* Bottom Camera Controls */}
          <div className="w-full max-w-xl flex items-center justify-around py-4">
            {/* Flip / Switch Camera */}
            <button
              type="button"
              onClick={() => startCamera(cameraFacing === 'environment' ? 'user' : 'environment')}
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">Flip Cam</span>
            </button>

            {/* Big Shutter Button */}
            <button
              type="button"
              onClick={captureLivePhoto}
              className="w-20 h-20 rounded-full border-4 border-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-2xl transition transform active:scale-95"
              title="Capture Leaf Photo"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                <Camera className="w-7 h-7 text-emerald-700" />
              </div>
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={stopCamera}
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20">
                <X className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
