'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Wheat, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  PlusCircle, 
  Upload, 
  ShieldCheck, 
  Database,
  History
} from 'lucide-react';
import { PlantDisease, Crop, AuditLog } from '@/lib/types';

export default function AdminOverviewPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [diseases, setDiseases] = useState<PlantDisease[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, dRes, aRes] = await Promise.all([
          fetch('/api/admin/crops').then(r => r.json()),
          fetch('/api/admin/diseases?pageSize=100').then(r => r.json()),
          fetch('/api/admin/audit-logs?limit=5').then(r => r.json())
        ]);

        if (cRes.success) setCrops(cRes.data);
        if (dRes.success) {
          setDiseases(dRes.data);
          setTotalCount(dRes.total);
        }
        if (aRes.success) setAuditLogs(aRes.data);
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const verifiedCount = diseases.filter(d => d.verified).length;
  const unverifiedCount = totalCount - verifiedCount;
  const rajasthanCrops = crops.filter(c => c.region === 'Rajasthan');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Phase 1 Foundation Live
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Governance & Data Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage official crops, plant disease registry, verification workflows, and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/diseases"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add / Verify Disease
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Crops</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : crops.length}</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">{rajasthanCrops.length} Rajasthan regional</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Wheat className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Diseases</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : totalCount}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Across all crop master categories</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Official</p>
            <p className="text-3xl font-black text-emerald-700 mt-1">{loading ? '...' : verifiedCount}</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Visible to farmers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Stubs</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{loading ? '...' : unverifiedCount}</p>
            <p className="text-xs text-amber-700 mt-1 font-medium">Hidden from public by RLS</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Compliance Rule Alert Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Project Governance Active (Rules 6 & 8):</span> All 58 seeded disease records are initialized as stubs with <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono font-bold">verified = false</code> and no treatments. They remain completely hidden from farmers under Supabase Row Level Security until verified by an authorised admin in Phase 2 using cited official DPPQ&S / ICAR sources.
        </div>
      </div>

      {/* Quick Action & Audit Trail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Navigation Cards */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Administrative Modules</h2>

          <Link
            href="/admin/diseases"
            className="block p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Disease Master & Verification</h3>
                  <p className="text-xs text-slate-500">Search, filter, verify, and add diseases</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
          </Link>

          <Link
            href="/admin/crops"
            className="block p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Wheat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Crop Catalog</h3>
                  <p className="text-xs text-slate-500">View 50+ master crops and varieties</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </div>
          </Link>

          <Link
            href="/admin/audit-logs"
            className="block p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Audit Trail</h3>
                  <p className="text-xs text-slate-500">Immutable log of all changes</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </div>
          </Link>
        </div>

        {/* Recent Audit Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Recent Audit Activities
            </h2>
            <Link href="/admin/audit-logs" className="text-xs text-emerald-600 font-semibold hover:underline">
              View All Logs
            </Link>
          </div>

          {auditLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No recent audit records found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`
                      px-2 py-0.5 rounded font-mono font-bold uppercase
                      ${log.action === 'VERIFY' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'UNVERIFY' ? 'bg-amber-100 text-amber-800' :
                        log.action === 'INSERT' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'}
                    `}>
                      {log.action}
                    </span>
                    <span className="font-medium text-slate-700">
                      Table: <span className="font-mono text-slate-900">{log.table_name}</span>
                    </span>
                  </div>
                  <div className="text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
