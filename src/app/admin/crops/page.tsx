'use client';

import React, { useEffect, useState } from 'react';
import { Wheat, Plus, Search, MapPin, Tag, Sprout, X } from 'lucide-react';
import { Crop, CropCategory } from '@/lib/types';

export default function CropsAdminPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Crop Form
  const [name, setName] = useState('');
  const [scientific, setScientific] = useState('');
  const [category, setCategory] = useState<CropCategory>('Cereals');
  const [region, setRegion] = useState('All-India');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCrops = () => {
    setLoading(true);
    fetch('/api/admin/crops')
      .then(r => r.json())
      .then(res => {
        if (res.success) setCrops(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          scientific_name: scientific,
          category,
          region,
          description
        })
      });
      const json = await res.json();
      if (json.success) {
        setAddModalOpen(false);
        setName('');
        setScientific('');
        setDescription('');
        fetchCrops();
      } else {
        alert(json.error);
      }
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const categories: string[] = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Fruits', 'Vegetables', 'Cash crops', 'Other'];
  const regions: string[] = ['All', 'All-India', 'Rajasthan'];

  const filteredCrops = crops.filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedRegion !== 'All' && c.region !== selectedRegion) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || (c.scientific_name && c.scientific_name.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wheat className="w-7 h-7 text-emerald-600" />
            Crops Master Catalog
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Registered crops across Cereals, Pulses, Oilseeds, Fruits, Vegetables, Cash crops, and Regional Crops (e.g. Rajasthan).
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Crop
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crops by name or scientific name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Region:</span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedRegion === reg ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                selectedCategory === cat ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">Loading crop catalog...</div>
        ) : filteredCrops.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">No crops found matching filters.</div>
        ) : (
          filteredCrops.map((crop) => (
            <div key={crop.id} className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{crop.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    crop.region === 'Rajasthan' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {crop.region}
                  </span>
                </div>
                {crop.scientific_name && (
                  <p className="text-xs text-slate-400 italic font-mono mt-0.5">{crop.scientific_name}</p>
                )}
                {crop.description && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{crop.description}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {crop.category}
                </span>
                <span className="text-[11px] text-slate-400">Master Record</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Crop Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Add Master Crop
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Safflower"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scientific Name</label>
                <input
                  type="text"
                  placeholder="e.g. Carthamus tinctorius"
                  value={scientific}
                  onChange={(e) => setScientific(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Cereals">Cereals</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Oilseeds">Oilseeds</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Cash crops">Cash crops</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Region</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  placeholder="Agronomic importance and seasons..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-3">
                <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-slate-600">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-semibold">
                  {submitting ? 'Saving...' : 'Add Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
