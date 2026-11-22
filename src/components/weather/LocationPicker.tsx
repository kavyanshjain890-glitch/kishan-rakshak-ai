'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Check } from 'lucide-react';
import { State, District, Village, indianStatesData } from '@/lib/locations';

interface LocationPickerProps {
  onLocationChange: (district: District, state: State, village?: Village) => void;
  selectedDistrictId?: string;
}

export default function LocationPicker({ onLocationChange, selectedDistrictId }: LocationPickerProps) {
  const [states] = useState<State[]>(indianStatesData);
  const [selectedStateId, setSelectedStateId] = useState<string>('rj');
  const [selectedDistId, setSelectedDistId] = useState<string>(selectedDistrictId || 'rj-jaipur');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('v-amber');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kr_selected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stateId) setSelectedStateId(parsed.stateId);
        if (parsed.districtId) setSelectedDistId(parsed.districtId);
        if (parsed.villageId) setSelectedVillageId(parsed.villageId);
      }
    } catch (e) {
      console.warn('LocalStorage location read error:', e);
    }
  }, []);

  const currentState = states.find(s => s.id === selectedStateId) || states[0];
  const currentDistricts = currentState.districts;
  const currentDistrict = currentDistricts.find(d => d.id === selectedDistId) || currentDistricts[0];
  const currentVillages = currentDistrict.villages;
  const currentVillage = currentVillages.find(v => v.id === selectedVillageId) || currentVillages[0];

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const s = states.find(x => x.id === stateId);
    if (s && s.districts.length > 0) {
      const d = s.districts[0];
      setSelectedDistId(d.id);
      const v = d.villages[0];
      if (v) setSelectedVillageId(v.id);
      saveAndNotify(s, d, v);
    }
  };

  const handleDistrictChange = (distId: string) => {
    setSelectedDistId(distId);
    const d = currentDistricts.find(x => x.id === distId);
    if (d) {
      const v = d.villages[0];
      if (v) setSelectedVillageId(v.id);
      saveAndNotify(currentState, d, v);
    }
  };

  const handleVillageChange = (villageId: string) => {
    setSelectedVillageId(villageId);
    const v = currentVillages.find(x => x.id === villageId);
    saveAndNotify(currentState, currentDistrict, v);
  };

  const saveAndNotify = (s: State, d: District, v?: Village) => {
    try {
      localStorage.setItem('kr_selected_location', JSON.stringify({
        stateId: s.id,
        districtId: d.id,
        villageId: v?.id,
        districtName: d.name,
        stateName: s.name
      }));
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
    onLocationChange(d, s, v);
  };

  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
        <MapPin className="w-4 h-4 text-emerald-600" />
        <span>Farmer Location Hierarchy: State → District → Village</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* State Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">State</label>
          <select
            value={selectedStateId}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        {/* District Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">District</label>
          <select
            value={selectedDistId}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            {currentDistricts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Village / Tehsil Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Village / Tehsil</label>
          <select
            value={selectedVillageId}
            onChange={(e) => handleVillageChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            {currentVillages.map((v) => (
              <option key={v.id} value={v.id}>{v.name} ({v.pincode})</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
