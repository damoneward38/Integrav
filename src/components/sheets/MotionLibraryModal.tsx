import React, { useState } from 'react';
import { Zap, X, Play, CheckCircle2, Download, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MotionLibraryModal: React.FC = () => {
  const { setActiveSheet } = useApp();
  const [retargetingId, setRetargetingId] = useState<string | null>(null);

  const presets = [
    { id: 'p1', title: 'Spinning Hook Kick', duration: '3.8s', frames: 228, category: 'Combat' },
    { id: 'p2', title: 'Parkour Vault & Roll', duration: '4.2s', frames: 252, category: 'Stunt' },
    { id: 'p3', title: 'Casual Stride Walk Cycle (Loop)', duration: '2.0s', frames: 120, category: 'Locomotion' },
    { id: 'p4', title: 'Sword Draw to High Guard', duration: '5.1s', frames: 306, category: 'Combat' },
  ];

  const handleRetarget = (id: string) => {
    setRetargetingId(id);
    setTimeout(() => {
      setRetargetingId(null);
      setActiveSheet(null);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160e2a] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 space-y-3.5 text-left shadow-2xl relative">
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400">
            <Zap className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Motion Retargeting Library
            </h3>
          </div>
          <button
            onClick={() => setActiveSheet(null)}
            className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Select motion clip to retarget onto Dee W's digital twin skeleton. Solves joint lengths and prevents foot sliding.
        </p>

        <div className="space-y-2">
          {presets.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 hover:border-blue-500/30 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white">{p.title}</h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {p.category}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {p.duration} · {p.frames} Frames @ 60 FPS
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRetarget(p.id)}
                className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                {retargetingId === p.id ? (
                  <span>Retargeting...</span>
                ) : (
                  <>
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
