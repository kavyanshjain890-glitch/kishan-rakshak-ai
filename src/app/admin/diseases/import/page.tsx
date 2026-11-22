'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileCheck, ShieldAlert, ArrowLeft, Check, AlertCircle, Save, BookOpen } from 'lucide-react';
import { Crop } from '@/lib/types';

export default function DraftFromSourcePage() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form Fields
  const [cropName, setCropName] = useState('Rice');
  const [diseaseName, setDiseaseName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState('Fungal');
  const [severity, setSeverity] = useState('Medium');

  // Source Citations (MANDATORY)
  const [sourceName, setSourceName] = useState('Directorate of Plant Protection, Quarantine & Storage (DPPQ&S)');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  // Diagnostic Content
  const [symptomsEarly, setSymptomsEarly] = useState('');
  const [symptomsAdvanced, setSymptomsAdvanced] = useState('');
  const [causes, setCauses] = useState('');
  const [favourableWeatherText, setFavourableWeatherText] = useState('');
  const [prevention, setPrevention] = useState('');

  // Organic Solutions First
  const [organicMethodName, setOrganicMethodName] = useState('');
  const [organicDosage, setOrganicDosage] = useState('');
  const [organicTreatment, setOrganicTreatment] = useState('');

  // Chemical Treatments
  const [chemicalName, setChemicalName] = useState('');
  const [chemicalDosage, setChemicalDosage] = useState('');
  const [chemicalTreatment, setChemicalTreatment] = useState('');
  const [safetyIntervalDays, setSafetyIntervalDays] = useState('30');

  useEffect(() => {
    fetch('/api/admin/crops')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data.length > 0) {
          setCrops(res.data);
          setCropName(res.data[0].name);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceUrl.trim().startsWith('http')) {
      setStatusMessage({ text: 'Rule 8 Violation: You must provide a valid official government or university source_url (http/https).', type: 'error' });
      return;
    }

    if (chemicalTreatment.trim() && !chemicalDosage.trim()) {
      setStatusMessage({ text: 'Compliance Error: Chemical treatments must specify the exact CIB&RC approved dosage.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/diseases/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_name: cropName,
          disease_name: diseaseName,
          scientific_name: scientificName,
          category,
          severity,
          source_name: sourceName,
          source_title: sourceTitle,
          source_url: sourceUrl,
          symptoms_early: symptomsEarly,
          symptoms_advanced: symptomsAdvanced,
          causes,
          favourable_weather_text: favourableWeatherText,
          prevention,
          organic_method_name: organicMethodName,
          organic_dosage: organicDosage,
          organic_treatment: organicTreatment,
          chemical_name: chemicalName,
          chemical_dosage: chemicalDosage,
          chemical_treatment: chemicalTreatment,
          safety_interval_days: safetyIntervalDays,
        })
      });

      const json = await res.json();
      if (json.success) {
        setStatusMessage({ text: `Successfully drafted & verified "${diseaseName}" from cited source!`, type: 'success' });
        setTimeout(() => {
          router.push('/admin/diseases');
        }, 1500);
      } else {
        setStatusMessage({ text: json.error, type: 'error' });
      }
    } catch (err: unknown) {
      setStatusMessage({ text: (err as Error).message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <Link href="/admin/diseases" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Disease Registry
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-emerald-600" />
            Draft Disease from Approved Official Source
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Strict Sourcing Protocol: Pesticide dosages must never be entered from memory. Every field must cite an official DPPQ&S, ICAR, or SAU package.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 ${
          statusMessage.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'
        }`}>
          {statusMessage.type === 'success' ? <Check className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Official Source Verification (Mandatory First) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold border-b pb-3">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>1. Mandatory Official Source Citation (Rule 8)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Authorised Authority *</label>
              <select
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium text-slate-800"
                required
              >
                <option value="Directorate of Plant Protection, Quarantine & Storage (DPPQ&S)">DPPQ&S (Govt of India)</option>
                <option value="ICAR - Central Research Institute">ICAR Research Institute (e.g. IIWBR, IIHR, CPRI)</option>
                <option value="State Agricultural University (SAU)">State Agricultural University (SAU Package)</option>
                <option value="CIB&RC Registered Pesticide Database">CIB&RC Registered Label</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document / Package Title *</label>
              <input
                type="text"
                placeholder="e.g. IPM Package for Rice 2021"
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Source URL (PDF or Portal) *</label>
              <input
                type="url"
                placeholder="https://ppqs.gov.in/sites/default/files/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Identity & Taxonomy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-3">2. Crop Target & Disease Identification</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Crop *</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 font-semibold"
                required
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Disease Name *</label>
              <input
                type="text"
                placeholder="e.g. Stem Rot"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scientific Name</label>
              <input
                type="text"
                placeholder="e.g. Sclerotium oryzae"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Severity & Category</label>
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-slate-50 border rounded-xl text-xs"
                >
                  <option value="Fungal">Fungal</option>
                  <option value="Bacterial">Bacterial</option>
                  <option value="Viral">Viral</option>
                  <option value="Nematode">Nematode</option>
                </select>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Symptoms & Favourable Weather */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-3">3. Diagnostics, Symptoms & Favourable Weather</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Early Symptoms</label>
              <textarea
                rows={3}
                placeholder="Initial lesions, leaf spots, discoloration..."
                value={symptomsEarly}
                onChange={(e) => setSymptomsEarly(e.target.value)}
                className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Advanced Symptoms</label>
              <textarea
                rows={3}
                placeholder="Necrosis, wilting, panicle/fruit damage, drying..."
                value={symptomsAdvanced}
                onChange={(e) => setSymptomsAdvanced(e.target.value)}
                className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pathogen Causes & Survival</label>
              <textarea
                rows={2}
                placeholder="How pathogen overwinters and primary inoculum..."
                value={causes}
                onChange={(e) => setCauses(e.target.value)}
                className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Favourable Weather Conditions</label>
              <textarea
                rows={2}
                placeholder="Optimal temperature range, humidity, rain triggers..."
                value={favourableWeatherText}
                onChange={(e) => setFavourableWeatherText(e.target.value)}
                className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Organic & Biological Management (Ordered First) */}
        <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <h2 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              4. Organic & Biological Solutions (Listed First by Rule)
            </h2>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded uppercase">
              Priority 1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Bio-Agent / Organic Method Name</label>
              <input
                type="text"
                placeholder="e.g. Pseudomonas fluorescens or Trichoderma harzianum"
                value={organicMethodName}
                onChange={(e) => setOrganicMethodName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Recommended Bio Dosage</label>
              <input
                type="text"
                placeholder="e.g. 10g/kg seed or 2g/L foliar spray"
                value={organicDosage}
                onChange={(e) => setOrganicDosage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Detailed Biological & Cultural Guidance</label>
              <textarea
                rows={3}
                placeholder="Application steps, timing, bio-priming, compost preparation..."
                value={organicTreatment}
                onChange={(e) => setOrganicTreatment(e.target.value)}
                className="w-full p-3 bg-white border border-emerald-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Chemical Management (Strict Validation) */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              5. Chemical Management (Strict Sourced Only - Rule 8)
            </h2>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded uppercase">
              Last Resort
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Active Ingredient & Formulation</label>
              <input
                type="text"
                placeholder="e.g. Tricyclazole 75% WP"
                value={chemicalName}
                onChange={(e) => setChemicalName(e.target.value)}
                className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CIB&RC Registered Dosage</label>
              <input
                type="text"
                placeholder="e.g. 0.6g per litre of water (300g/ha)"
                value={chemicalDosage}
                onChange={(e) => setChemicalDosage(e.target.value)}
                className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Safety Interval (Days Before Harvest)</label>
              <input
                type="number"
                placeholder="30"
                value={safetyIntervalDays}
                onChange={(e) => setSafetyIntervalDays(e.target.value)}
                className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chemical Application Guidelines</label>
              <textarea
                rows={2}
                placeholder="Specific timing, threshold levels, resistance management..."
                value={chemicalTreatment}
                onChange={(e) => setChemicalTreatment(e.target.value)}
                className="w-full p-3 bg-white border rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit & Save */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Link href="/admin/diseases" className="px-5 py-2.5 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-100">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Validating & Saving...' : 'Save & Verify Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
