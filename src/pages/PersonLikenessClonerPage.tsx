import React, { useState } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Download, 
  ScanFace,
  Eye,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_AVATAR } from '../data/mockData';
import confetti from 'canvas-confetti';

export const PersonLikenessClonerPage: React.FC = () => {
  const { twin, showToast } = useApp();
  
  const [fidelity, setFidelity] = useState(twin.likenessFidelity || 98.6);
  const [asymmetry, setAsymmetry] = useState(twin.asymmetryFactor || 0.14);
  const [microWrinkles, setMicroWrinkles] = useState(twin.microWrinkles ?? true);
  const [skinMelanin, setSkinMelanin] = useState('Deep Warm Bronze (Fitzpatrick V)');
  const [cloningStatus, setCloningStatus] = useState<'idle' | 'analyzing' | 'fitting' | 'completed'>('idle');
  const [progress, setProgress] = useState(100);

  const handleStartClone = () => {
    setCloningStatus('analyzing');
    setProgress(25);
    showToast('Analyzing multi-angle photogrammetry facial landmarks...', 'info');

    setTimeout(() => {
      setCloningStatus('fitting');
      setProgress(70);
      showToast('Solving 52 ARKit FACS blendshape targets and dermal subsurface...', 'info');
    }, 1000);

    setTimeout(() => {
      setCloningStatus('completed');
      setProgress(100);
      setFidelity(99.4);
      showToast('Likeness & Persona Cloned Successfully! Fidelity at 99.4%.', 'success');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }, 2200);
  };

  const handleExportClonePackage = () => {
    const manifest = `INTÉGRAV CLONED PERSONA ASSET BUNDLE\nSubject: Demond Ward\nLikeness Fidelity: ${fidelity}%\nFacial Mesh: 48,620 Quads\nBlendshapes: 52 ARKit Certified Targets\nSubsurface Scatter Profile: ${skinMelanin}\nAsymmetry Deviation: ${asymmetry * 100}%\nHardware Enclave Certified: Yes\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([manifest], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demond_ward_cloned_persona_v3.txt`;
    a.click();
    showToast('Downloaded Cloned Persona Asset Package', 'success');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Persona Likeness & Digital Human Cloner
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Biometric Cloner
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Extract, duplicate, and mimic the exact image, likeness, facial geometry, and expression nuances of the person
          </p>
        </div>

        <button
          onClick={handleExportClonePackage}
          className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Cloned Package</span>
        </button>
      </div>

      {/* Main Split: Left Reference Capture Slots, Right Likeness Synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Reference Image & Likeness Extraction (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Primary Reference Likeness
              </h2>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Biometrics Extracted
              </span>
            </div>

            {/* Main Avatar Photo Showcase */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-black border border-white/10 group shadow-2xl">
              <img
                src={DEFAULT_AVATAR}
                alt="Cloned Persona Likeness"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

              {/* Wireframe Topology Reticle */}
              <div className="absolute inset-4 border border-purple-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between text-[10px] font-mono text-purple-200">
                  <span>+ BIOMETRIC TARGET: DEMOND WARD</span>
                  <span>FACS DENSITY: 48.6K</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-purple-200">
                  <span>SUBSURFACE: FITZPATRICK V</span>
                  <span>FIDELITY: {fidelity}%</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-200">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  Hardware Enclave Protected
                </span>
                <span className="text-purple-300">52 ARKit Blendshapes Mapped</span>
              </div>
            </div>

            {/* 3 Secondary Angle Thumbnails */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Front Profile</span>
                <span className="text-[11px] font-semibold text-emerald-300">Aligned (0.0mm)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">45° Semi-Profile</span>
                <span className="text-[11px] font-semibold text-emerald-300">Aligned (0.2mm)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Left Lateral</span>
                <span className="text-[11px] font-semibold text-emerald-300">Aligned (0.1mm)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Likeness Tuning & Clone Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-purple-300">
                <Sliders className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Likeness & Mimic Calibration
                </h2>
              </div>
              <span className="text-xs font-mono text-purple-300 font-bold">
                {fidelity}% Precision
              </span>
            </div>

            {/* Fidelity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Likeness Fidelity Target</span>
                <span className="font-mono text-purple-300 font-bold">{fidelity}% Match</span>
              </div>
              <input
                type="range"
                min="80"
                max="99.9"
                step="0.1"
                value={fidelity}
                onChange={(e) => setFidelity(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 font-mono block">
                Adjusts volumetric bone structure and soft-tissue deformation accuracy.
              </span>
            </div>

            {/* Asymmetry Factor Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Natural Asymmetry Deviation</span>
                <span className="font-mono text-purple-300 font-bold">{(asymmetry * 100).toFixed(0)}% Asymmetric</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.01"
                value={asymmetry}
                onChange={(e) => setAsymmetry(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 font-mono block">
                Introduces authentic human facial asymmetry (prevents synthetic uncanny valley).
              </span>
            </div>

            {/* Subsurface Melanin Tone */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Subsurface Melanin & Epidermal Tone
              </label>
              <select
                value={skinMelanin}
                onChange={(e) => setSkinMelanin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="Deep Warm Bronze (Fitzpatrick V)">Deep Warm Bronze (Fitzpatrick V - Demond Ward)</option>
                <option value="Rich Espresso (Fitzpatrick VI)">Rich Espresso (Fitzpatrick VI)</option>
                <option value="Golden Olive (Fitzpatrick IV)">Golden Olive (Fitzpatrick IV)</option>
                <option value="Neutral Medium (Fitzpatrick III)">Neutral Medium (Fitzpatrick III)</option>
              </select>
            </div>

            {/* Micro-wrinkle toggle */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Micro-Wrinkles & Pore Normal Maps</span>
                <span className="text-[11px] text-slate-400">8K Displacement displacement maps from photogrammetry</span>
              </div>
              <button
                onClick={() => setMicroWrinkles(!microWrinkles)}
                className={`w-11 h-6 rounded-full transition p-0.5 ${microWrinkles ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${microWrinkles ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Action Button: Clone Persona */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartClone}
                disabled={cloningStatus === 'analyzing' || cloningStatus === 'fitting'}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {cloningStatus === 'analyzing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Facial Topology (25%)...</span>
                  </>
                ) : cloningStatus === 'fitting' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Solving ARKit 52 FACS Blendshapes (70%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute Complete Likeness Clone</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
