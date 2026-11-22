'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Search, 
  Wheat, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Globe2, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import VoiceSearchBar from '@/components/voice/VoiceSearchBar';
import { PlantDisease, Crop } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function DiseasesLibraryPage() {
  const { lang, setLang, t } = useLanguage();

  const [diseases, setDiseases] = useState<PlantDisease[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropCategory, setSelectedCropCategory] = useState('All');
  const [selectedCropId, setSelectedCropId] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedVerified, setSelectedVerified] = useState('All');

  // Load Crops
  useEffect(() => {
    fetch('/api/admin/crops')
      .then(r => r.json())
      .then(res => {
        if (res.success) setCrops(res.data);
      });
  }, []);

  const fetchDiseases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (selectedCropId !== 'All') params.append('crop_id', selectedCropId);
      if (selectedCropCategory !== 'All') params.append('crop_category', selectedCropCategory);
      if (selectedSeverity !== 'All') params.append('severity', selectedSeverity);
      if (selectedVerified !== 'All') params.append('verified', selectedVerified);

      const res = await fetch(`/api/diseases?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setDiseases(json.data);
        setTotal(json.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, selectedCropId, selectedCropCategory, selectedSeverity, selectedVerified]);

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const cropCategories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Fruits', 'Vegetables', 'Cash crops', 'Other'];
  const severities = ['All', 'Low', 'Medium', 'High', 'Severe'];

  const totalPages = Math.ceil(total / pageSize) || 1;

  // Helper for localized disease name
  const getLocalizedName = (d: PlantDisease) => {
    if (lang === 'hi' && d.translations?.hi?.disease_name) {
      return d.translations.hi.disease_name;
    }
    if (lang === 'hi-RJ' && d.translations?.['hi-RJ']?.disease_name) {
      return d.translations['hi-RJ'].disease_name;
    }
    return d.disease_name;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header with Multilingual Switcher */}
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
                {t.browseDiseases}
              </div>
            </div>
          </div>

          {/* Global Language Selector */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition hidden md:inline-flex"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Banner Title */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sprout className="w-7 h-7 text-emerald-600" />
            {t.browseDiseases}
          </h1>
          <p className="text-sm text-slate-500 max-w-3xl">
            {t.tagline}. All official chemical treatments strictly adhere to CIB&RC registrations. Organic and biological methods are listed first.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <VoiceSearchBar 
                initialValue={searchQuery}
                onSearch={(q) => { setSearchQuery(q); setPage(1); }}
                lang={lang}
              />
            </div>

            <div>
              <select
                value={selectedCropId}
                onChange={(e) => { setSelectedCropId(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
              >
                <option value="All">{t.allCrops} ({crops.length})</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedVerified}
                onChange={(e) => { setSelectedVerified(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
              >
                <option value="All">All Entries (Verified & Stubs)</option>
                <option value="true">{t.verifiedOfficial}</option>
                <option value="false">{t.pendingStub}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Crop Type:</span>
            {cropCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCropCategory(cat); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedCropCategory === cat ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}

            <span className="text-slate-400 font-semibold ml-auto mr-1">Severity:</span>
            {severities.map((sev) => (
              <button
                key={sev}
                onClick={() => { setSelectedSeverity(sev); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  selectedSeverity === sev ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Diseases Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong className="text-slate-900">{diseases.length}</strong> of <strong className="text-slate-900">{total}</strong> diseases</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading plant disease library...</div>
          ) : diseases.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No diseases found matching filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or switching filters to view all entries.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCropId('All'); setSelectedCropCategory('All'); setSelectedSeverity('All'); setSelectedVerified('All'); }}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diseases.map((disease) => {
                const displayName = getLocalizedName(disease);
                return (
                  <Link
                    key={disease.id}
                    href={`/diseases/${disease.id}`}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image header if available, or placeholder banner */}
                      <div className="h-40 bg-gradient-to-tr from-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
                        {disease.reference_images && (disease.reference_images as any)[0]?.url ? (
                          <img
                            src={(disease.reference_images as any)[0].url}
                            alt={disease.disease_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                          />
                        ) : (
                          <div className="text-center text-slate-400 p-4">
                            <Sprout className="w-10 h-10 mx-auto text-emerald-500/60 mb-1" />
                            <span className="text-xs font-mono">Reference Photo Pending</span>
                          </div>
                        )}

                        {/* Severity Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs ${
                            disease.severity === 'Severe' ? 'bg-red-600 text-white' :
                            disease.severity === 'High' ? 'bg-amber-600 text-white' :
                            disease.severity === 'Medium' ? 'bg-yellow-500 text-slate-900' :
                            'bg-slate-200 text-slate-800'
                          }`}>
                            {disease.severity}
                          </span>
                        </div>

                        {/* Verified Status Badge */}
                        <div className="absolute top-3 right-3">
                          {disease.verified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Official Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500 text-slate-950">
                              <AlertTriangle className="w-3 h-3" />
                              Pending Stub
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {disease.crop_name}
                          </span>
                          <span className="text-xs text-slate-400">· {disease.category}</span>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition leading-snug">
                            {displayName}
                          </h3>
                          {disease.scientific_name && (
                            <p className="text-xs text-slate-400 italic font-mono mt-0.5 truncate">
                              {disease.scientific_name}
                            </p>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {disease.symptoms_early || t.notYetVerified}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                      <span>View Complete Advisory & Treatment</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs text-slate-600">
              <div>
                Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none font-medium flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none font-medium flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
