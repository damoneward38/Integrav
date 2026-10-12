import React, { useState, useEffect } from 'react';
import { ScanFace, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_AVATAR } from '../../data/mockData';

export const FaceScannerModal: React.FC = () => {
  const { setActiveSheet } = useApp();
  const [scanning, setScanning] = useState(true);
  const [progress, setProgress] = useState(15);
  const [currentStep, setCurrentStep] = useState('Acquiring TrueDepth Point Cloud...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setCurrentStep('Calibrating 52 ARKit Blendshape Targets...');
    }, 700);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setCurrentStep('Fitting Subsurface Scattering & Skin Microgeometry...');
    }, 1400);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setCurrentStep('Topology Mesh Verified (48,620 Polys)');
      setScanning(false);
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160e2a] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 space-y-4 text-left shadow-2xl relative">
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <ScanFace className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              ARKit Depth Face Scanner
            </h3>
          </div>
          <button
            onClick={() => setActiveSheet(null)}
            className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewport with Scan Reticle Overlay */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
          <img
            src={DEFAULT_AVATAR}
            alt="Scanning Avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-cyan-900/15" />

          {/* Animated Scanning Beam */}
          {scanning && (
            <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
          )}

          {/* HUD Targets */}
          <div className="absolute inset-4 border border-cyan-400/30 rounded-xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between text-[9px] font-mono text-cyan-300">
              <span>+ DEPTH: 42.1cm</span>
              <span>FOV: 68°</span>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-cyan-300">
              <span>52 BLENDSHAPES</span>
              <span>POINT DENSITY: 30K</span>
            </div>
          </div>
        </div>

        {/* Progress status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5">
              {scanning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              {currentStep}
            </span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            disabled={scanning}
            onClick={() => setActiveSheet(null)}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 active:scale-98 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-900/20"
          >
            {scanning ? 'Calibrating Biometrics...' : 'Accept Face Calibration'}
          </button>
        </div>
      </div>
    </div>
  );
};
