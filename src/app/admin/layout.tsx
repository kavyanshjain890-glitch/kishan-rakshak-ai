'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  ShieldCheck, 
  LayoutDashboard, 
  History, 
  Menu, 
  X, 
  ArrowLeft,
  Wheat,
  SlidersHorizontal
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Plant Diseases', href: '/admin/diseases', icon: Sprout },
    { name: 'Crops Registry', href: '/admin/crops', icon: Wheat },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            KR
          </div>
          <span className="font-bold text-sm">Kishan Rakshak Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-20 transition-transform duration-200
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            KR
          </div>
          <div>
            <h1 className="font-bold text-sm text-white leading-tight">KISHAN RAKSHAK</h1>
            <p className="text-xs text-emerald-400 font-medium">Official Admin Portal</p>
          </div>
        </div>

        {/* User Role Badge */}
        <div className="px-5 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-200">Admin Role Active</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
            SECURE
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition
                  ${active 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public View
          </Link>
          <div className="text-[11px] text-slate-500">
            Phase 1 Foundation · Supabase RLS
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
