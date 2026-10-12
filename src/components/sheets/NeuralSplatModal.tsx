import React, { useState } from 'react';
import { Sparkles, X, Orbit, Eye, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NeuralSplatModal: React.FC = () => {
  const { setActiveSheet } = useApp();
  const [pointDensity, setPointDensity] = useState('1.2M Splats');
  const [viewMode, setViewMode] = useState<'Ellipsoids' | 'RGB Radiance' | 'Depth Field'>('RGB Radiance');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160e2a] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 space-y-3.5 text-left shadow-2xl relative">
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-fuchsia-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              3D Gaussian Splatting / NeRF
            </h3>
          </div>
          <button
            onClick={() => setActiveSheet(null)}
            className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Splat Orbit Simulation Viewport */}
        <div className="relative w-full h-52 rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.2)_0%,transparent_70%)]" />

          {/* Procedural Point Cloud Grid */}
          <div className="relative w-36 h-36 border border-fuchsia-500/30 rounded-full animate-spin [animation-duration:15s] flex items-center justify-center">
            <div className="w-24 h-24 border border-cyan-400/30 rounded-full animate-spin [animation-duration:8s] flex items-center justify-center">
              <div className="w-12 h-12 bg-fuchsia-500/40 rounded-full blur-md animate-pulse" />
            </div>
          </div>

          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-fuchsia-300 border border-white/10">
            <Orbit className="w-3 h-3 animate-spin" />
            <span>Real-time Splat Radiance · 60 FPS</span>
          </div>

          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
            Density: {pointDensity}
          </div>
        </div>

        {/* View Mode */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">
            Visualization Pass
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['RGB Radiance', 'Ellipsoids', 'Depth Field'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  viewMode === m
                    ? 'bg-fuchsia-600 text-white shadow-sm'
                    : 'bg-black/40 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveSheet(null)}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-fuchsia-600 hover:bg-fuchsia-500 transition shadow-lg shadow-fuchsia-900/20"
          >
            Export Splat PLY / SPZ File
          </button>
        </div>
      </div>
    </div>
  );
};
