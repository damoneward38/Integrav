import React, { useState } from 'react';
import { Video, X, Camera, Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STAGE_IMAGE } from '../../data/mockData';

export const VirtualProductionModal: React.FC = () => {
  const { setActiveSheet } = useApp();
  const [focalLength, setFocalLength] = useState('35mm');
  const [hdriLighting, setHdriLighting] = useState<'Moody Cyberpunk' | 'Golden Hour' | 'Sci-Fi Hangar'>('Moody Cyberpunk');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160e2a] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 space-y-3.5 text-left shadow-2xl relative">
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400">
            <Video className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Virtual Production Director
            </h3>
          </div>
          <button
            onClick={() => setActiveSheet(null)}
            className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black border border-white/10">
          <img
            src={STAGE_IMAGE}
            alt="VP Volume"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute top-2 left-2 text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded border border-white/10">
            LED Volume Wall · Genlock Synced
          </div>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-rose-300">
            Camera Frustum: {focalLength} · HDRI: {hdriLighting}
          </div>
        </div>

        {/* Focal length buttons */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">
            Camera Lens Preset
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['24mm', '35mm', '50mm', '85mm'].map((fl) => (
              <button
                key={fl}
                onClick={() => setFocalLength(fl)}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  focalLength === fl
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-black/40 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {fl}
              </button>
            ))}
          </div>
        </div>

        {/* HDRI lighting */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">
            Stage HDRI Environment
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Moody Cyberpunk', 'Golden Hour', 'Sci-Fi Hangar'] as const).map((hdri) => (
              <button
                key={hdri}
                onClick={() => setHdriLighting(hdri)}
                className={`p-2 rounded-xl text-left border text-[11px] font-medium transition ${
                  hdriLighting === hdri
                    ? 'bg-rose-900/40 border-rose-500 text-white'
                    : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {hdri}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveSheet(null)}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-500 transition shadow-lg shadow-rose-900/20"
          >
            Apply to Volume Wall
          </button>
        </div>
      </div>
    </div>
  );
};
