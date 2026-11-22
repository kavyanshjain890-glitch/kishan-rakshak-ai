'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Sprout, 
  Search, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Upload, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Edit2,
  Trash2,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { PlantDisease, Crop, DiseaseCategory, DiseaseSeverity } from '@/lib/types';

export default function DiseasesAdminPage() {
  const [diseases, setDiseases] = useState<PlantDisease[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedVerified, setSelectedVerified] = useState('All');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<PlantDisease | null>(null);

  // Add Form State & Duplicate Check
  const [formCropId, setFormCropId] = useState('');
  const [formName, setFormName] = useState('');
  const [formScientific, setFormScientific] = useState('');
  const [formCategory, setFormCategory] = useState<DiseaseCategory>('Fungal');
  const [formSeverity, setFormSeverity] = useState<DiseaseSeverity>('Medium');
  const [formSymptomsEarly, setFormSymptomsEarly] = useState('');
  const [formSymptomsAdv, setFormSymptomsAdv] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Bulk Import State
  const [bulkText, setBulkText] = useState('');
  const [bulkResult, setBulkResult] = useState<{ inserted: number; skippedDuplicates: number; errors: string[] } | null>(null);

  // Load Crops
  useEffect(() => {
    fetch('/api/admin/crops')
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setCrops(res.data);
          if (res.data.length > 0 && !formCropId) {
            setFormCropId(res.data[0].id);
          }
        }
      });
  }, [formCropId]);

  // Fetch Diseases
  const fetchDiseases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (selectedCrop !== 'All') params.append('crop_id', selectedCrop);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedSeverity !== 'All') params.append('severity', selectedSeverity);
      if (selectedVerified !== 'All') params.append('verified', selectedVerified);

      const res = await fetch(`/api/admin/diseases?${params.toString()}`);
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
  }, [page, pageSize, searchQuery, selectedCrop, selectedCategory, selectedSeverity, selectedVerified]);

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  // Live Duplicate Check
  useEffect(() => {
    if (!formCropId || !formName.trim() || !addModalOpen) {
      setDuplicateWarning(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/diseases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ check_only: true, crop_id: formCropId, disease_name: formName })
        });
        const json = await res.json();
        if (json.is_duplicate) {
          setDuplicateWarning(`Warning: A disease named "${formName.trim()}" already exists for the selected crop!`);
        } else {
          setDuplicateWarning(null);
        }
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formCropId, formName, addModalOpen]);

  // Verify / Unverify Workflow
  const handleToggleVerify = async (disease: PlantDisease) => {
    const nextStatus = !disease.verified;
    try {
      const res = await fetch(`/api/admin/diseases/${disease.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: nextStatus })
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage({
          text: `Disease "${disease.disease_name}" has been ${nextStatus ? 'VERIFIED' : 'UNVERIFIED'}.`,
          type: 'success'
        });
        // Optimistic update
        setDiseases(prev => prev.map(d => d.id === disease.id ? { ...d, verified: nextStatus, verified_at: nextStatus ? new Date().toISOString() : null } : d));
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setActionMessage({ text: json.error, type: 'error' });
      }
    } catch (e) {
      setActionMessage({ text: (e as Error).message, type: 'error' });
    }
  };

  // Add Disease Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicateWarning) {
      alert('Cannot create duplicate disease record for the same crop.');
      return;
    }

    setFormSubmitting(true);
    try {
      const res = await fetch('/api/admin/diseases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_id: formCropId,
          disease_name: formName,
          scientific_name: formScientific,
          category: formCategory,
          severity: formSeverity,
          symptoms_early: formSymptomsEarly,
          symptoms_advanced: formSymptomsAdv,
          verified: false
        })
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ text: `Disease "${formName}" created successfully as unverified stub.`, type: 'success' });
        setAddModalOpen(false);
        setFormName('');
        setFormScientific('');
        setFormSymptomsEarly('');
        setFormSymptomsAdv('');
        fetchDiseases();
      } else {
        setActionMessage({ text: json.error, type: 'error' });
      }
    } catch (err) {
      setActionMessage({ text: (err as Error).message, type: 'error' });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Edit Disease Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDisease) return;

    setFormSubmitting(true);
    try {
      const res = await fetch(`/api/admin/diseases/${editingDisease.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDisease)
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ text: `Disease "${editingDisease.disease_name}" updated.`, type: 'success' });
        setEditModalOpen(false);
        setEditingDisease(null);
        fetchDiseases();
      } else {
        setActionMessage({ text: json.error, type: 'error' });
      }
    } catch (err) {
      setActionMessage({ text: (err as Error).message, type: 'error' });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Disease
  const handleDelete = async (disease: PlantDisease) => {
    if (!confirm(`Are you sure you want to delete "${disease.disease_name}"? This action will be audited.`)) return;

    try {
      const res = await fetch(`/api/admin/diseases/${disease.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ text: `Disease "${disease.disease_name}" deleted.`, type: 'success' });
        fetchDiseases();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bulk Import
  const handleBulkSubmit = async () => {
    if (!bulkText.trim()) return;

    // Parse CSV or JSON
    let records: Array<{ crop_name: string; disease_name: string; category?: string; severity?: string }> = [];

    if (bulkText.trim().startsWith('[')) {
      try {
        records = JSON.parse(bulkText);
      } catch {
        alert('Invalid JSON format');
        return;
      }
    } else {
      const lines = bulkText.trim().split('\n');
      for (const line of lines) {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          records.push({
            crop_name: parts[0],
            disease_name: parts[1],
            category: parts[2] || 'Fungal',
            severity: parts[3] || 'Medium'
          });
        }
      }
    }

    try {
      const res = await fetch('/api/admin/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });
      const json = await res.json();
      if (json.success) {
        setBulkResult({
          inserted: json.inserted,
          skippedDuplicates: json.skippedDuplicates,
          errors: json.errors || []
        });
        fetchDiseases();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sprout className="w-7 h-7 text-emerald-600" />
            Plant Diseases Registry
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Official crop disease master table with unique constraints, full-text search, and verify workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setBulkModalOpen(true); setBulkResult(null); }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition shadow-sm"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            Bulk Import
          </button>
          <button
            onClick={() => { setAddModalOpen(true); setDuplicateWarning(null); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Disease
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between ${
          actionMessage.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Full-Text Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Full-text search (disease, crop, symptoms)..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Crop Filter */}
          <div>
            <select
              value={selectedCrop}
              onChange={(e) => { setSelectedCrop(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="All">All Crops ({crops.length})</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
              ))}
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              value={selectedVerified}
              onChange={(e) => { setSelectedVerified(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Stubs</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Severity:</span>
          {['All', 'Low', 'Medium', 'High', 'Severe'].map((sev) => (
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

          <span className="text-slate-400 font-semibold ml-4 mr-1">Category:</span>
          {['All', 'Fungal', 'Bacterial', 'Viral', 'Nematode'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedCategory === cat ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Found <strong className="text-slate-900">{total}</strong> diseases matching criteria</span>
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Disease & Scientific Name</th>
                <th className="px-4 py-3">Crop Target</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">RLS Status</th>
                <th className="px-4 py-3">Verification Details</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">Loading records...</td>
                </tr>
              ) : diseases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">No diseases found matching filters.</td>
                </tr>
              ) : (
                diseases.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{d.disease_name}</div>
                      {d.scientific_name && (
                        <div className="text-xs text-slate-400 italic font-mono">{d.scientific_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {d.crop_name || 'Crop'}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.crop_category}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        d.category === 'Fungal' ? 'bg-amber-50 text-amber-800' :
                        d.category === 'Bacterial' ? 'bg-blue-50 text-blue-800' :
                        d.category === 'Viral' ? 'bg-purple-50 text-purple-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {d.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        d.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                        d.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        d.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {d.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {d.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Pending Stub
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {d.verified ? (
                        <div>
                          <div className="text-slate-800 font-medium">{d.verified_by_name || 'Admin Officer'}</div>
                          <div className="text-[10px] text-slate-400">{d.verified_at ? new Date(d.verified_at).toLocaleDateString() : 'Active'}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Hidden from farmers</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleVerify(d)}
                          title={d.verified ? 'Unverify record' : 'Verify record'}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            d.verified 
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' 
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {d.verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => { setEditingDisease(d); setEditModalOpen(true); }}
                          title="Edit disease"
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d)}
                          title="Delete disease"
                          className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ADD DISEASE MODAL (WITH LIVE DUPLICATE DETECTION) */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Add Plant Disease
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Crop *</label>
                <select
                  value={formCropId}
                  onChange={(e) => setFormCropId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Disease Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Powdery Mildew"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
                {duplicateWarning && (
                  <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{duplicateWarning}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-slate-900"
                  >
                    <option value="Fungal">Fungal</option>
                    <option value="Bacterial">Bacterial</option>
                    <option value="Viral">Viral</option>
                    <option value="Nematode">Nematode</option>
                    <option value="Physiological">Physiological</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scientific Name</label>
                <input
                  type="text"
                  placeholder="e.g. Erysiphe cichoracearum"
                  value={formScientific}
                  onChange={(e) => setFormScientific(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Early Symptoms</label>
                <textarea
                  placeholder="Initial leaf spots, lesions, or chlorosis..."
                  value={formSymptomsEarly}
                  onChange={(e) => setFormSymptomsEarly(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Boolean(duplicateWarning) || formSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 disabled:opacity-40"
                >
                  {formSubmitting ? 'Saving...' : 'Create Stub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && editingDisease && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Edit Disease: {editingDisease.disease_name}</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Disease Name</label>
                <input
                  type="text"
                  value={editingDisease.disease_name}
                  onChange={(e) => setEditingDisease({ ...editingDisease, disease_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingDisease.category}
                    onChange={(e) => setEditingDisease({ ...editingDisease, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Fungal">Fungal</option>
                    <option value="Bacterial">Bacterial</option>
                    <option value="Viral">Viral</option>
                    <option value="Nematode">Nematode</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={editingDisease.severity}
                    onChange={(e) => setEditingDisease({ ...editingDisease, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scientific Name</label>
                <input
                  type="text"
                  value={editingDisease.scientific_name || ''}
                  onChange={(e) => setEditingDisease({ ...editingDisease, scientific_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Symptoms Description</label>
                <textarea
                  value={editingDisease.symptoms_early || ''}
                  onChange={(e) => setEditingDisease({ ...editingDisease, symptoms_early: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-3">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600">
                  Cancel
                </button>
                <button type="submit" disabled={formSubmitting} className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-semibold">
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK IMPORT MODAL */}
      {bulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                Bulk Import Diseases (CSV / JSON)
              </h3>
              <button onClick={() => setBulkModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Format: CSV lines in <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">crop_name,disease_name,category,severity</code> format or a JSON array.
            </p>

            <textarea
              rows={8}
              placeholder={`Rice,Bacterial Leaf Streak,Bacterial,Medium\nWheat,Head Scab,Fungal,High\nTomato,Buckeye Rot,Fungal,Medium`}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full p-3 font-mono text-xs border rounded-xl bg-slate-50 text-slate-900 focus:bg-white"
            />

            {bulkResult && (
              <div className="p-3 rounded-xl bg-slate-100 text-xs space-y-1">
                <div className="text-emerald-700 font-bold">✓ Successfully inserted: {bulkResult.inserted}</div>
                <div className="text-amber-700 font-semibold">⚠ Skipped duplicates: {bulkResult.skippedDuplicates}</div>
                {bulkResult.errors.length > 0 && (
                  <div className="text-red-600">Errors: {bulkResult.errors.join('; ')}</div>
                )}
              </div>
            )}

            <div className="pt-3 border-t flex items-center justify-end gap-3">
              <button type="button" onClick={() => setBulkModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 text-sm">
                Close
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800"
              >
                Execute Bulk Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
