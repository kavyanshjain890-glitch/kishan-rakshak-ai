'use client';

import React, { useEffect, useState } from 'react';
import { History, Shield, Database, Clock } from 'lucide-react';
import { AuditLog } from '@/lib/types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-logs?limit=100')
      .then(r => r.json())
      .then(res => {
        if (res.success) setLogs(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-7 h-7 text-emerald-600" />
          Administrative Audit Trail
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Immutable log of all database mutations, verification transitions, duplicate rejections, and bulk operations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing last <strong className="text-slate-900">{logs.length}</strong> audited events</span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">APPEND_ONLY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Payload / State Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-sans">Loading audit logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-sans">No audit records recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                        log.action === 'VERIFY' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'UNVERIFY' ? 'bg-amber-100 text-amber-800' :
                        log.action === 'INSERT' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                        log.action === 'BULK_IMPORT' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">{log.table_name}</td>
                    <td className="px-4 py-2.5 text-slate-500 truncate max-w-[120px]" title={log.record_id}>
                      {log.record_id}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">
                      {log.actor_name || 'Admin Officer'}
                    </td>
                    <td className="px-4 py-2.5 max-w-xs truncate text-slate-600 font-mono text-[10px]" title={JSON.stringify(log.new_values || log.old_values)}>
                      {JSON.stringify(log.new_values || log.old_values)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
