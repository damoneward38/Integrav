import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  UserCheck, 
  Sliders, 
  Palette, 
  Wand2, 
  Download, 
  Play, 
  Pause, 
  Volume2, 
  Camera, 
  Video, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Tv
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Twin3DViewport } from '../components/twin/Twin3DViewport';
import { CharacterMorphPreset } from '../types';
import confetti from 'canvas-confetti';

export const CharacterMorphPage: React.FC = () => {
  const { 
    characterMorphPresets, 
    activeMorphPreset, 
    setActiveMorphPreset, 
    updateBlendshape, 
    showToast,
    setActivePage,
    stylizationIntensity,
    setStylizationIntensity
  } = useApp();

  const [humanityRatio, setHumanityRatio] = useState(activeMorphPreset.humanityRatio);
  const [jawContour, setJawContour] = useState(activeMorphPreset.jawContourWidth);
  const [eyeScale, setEyeScale] = useState(activeMorphPreset.eyeScale);
  const [activeTestMode, setActiveTestMode] = useState<'idle' | 'speech' | 'song' | 'expressions'>('idle');
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const testAnimTimerRef = useRef<any>(null);

  // Sync sliders when active preset changes
  useEffect(() => {
    setHumanityRatio(activeMorphPreset.humanityRatio);
    setJawContour(activeMorphPreset.jawContourWidth);
    setEyeScale(activeMorphPreset.eyeScale);
  }, [activeMorphPreset]);

  // Handle live test animation playback
  const handleToggleTestAnimation = (mode: 'idle' | 'speech' | 'song' | 'expressions') => {
    if (isPlayingTest && activeTestMode === mode) {
      // Stop test
      clearInterval(testAnimTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingTest(false);
      updateBlendshape('jawOpen', 0);
      updateBlendshape('smileLeft', 0.2);
      updateBlendshape('smileRight', 0.2);
      return;
    }

    clearInterval(testAnimTimerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    setActiveTestMode(mode);
    setIsPlayingTest(true);

    if (mode === 'idle') {
      showToast(`Testing Idle natural breathing & scanning for ${activeMorphPreset.name}`, 'info');
      testAnimTimerRef.current = setInterval(() => {
        // Natural micro blinks & subtle idle breathing
        updateBlendshape('browInnerUp', Math.sin(Date.now() * 0.002) * 0.15 + 0.1);
        updateBlendshape('mouthPucker', Math.cos(Date.now() * 0.001) * 0.08);
        const blink = Math.random() > 0.85 ? 0.95 : 0;
        updateBlendshape('eyeBlinkLeft', blink);
        updateBlendshape('eyeBlinkRight', blink);
      }, 100);
    } else if (mode === 'speech') {
      showToast(`Testing Speech lip-sync visemes for ${activeMorphPreset.name}`, 'info');
      const testSpeech = `Testing biometric speech synthesis on character form: ${activeMorphPreset.name}. Phonemes and expressions are locked to authentic human performance.`;
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(testSpeech);
        u.pitch = activeMorphPreset.voicePitch;
        u.rate = 1.05;
        u.onstart = () => {
          testAnimTimerRef.current = setInterval(() => {
            updateBlendshape('jawOpen', 0.15 + Math.random() * 0.45);
            updateBlendshape('smileLeft', 0.3 + Math.random() * 0.3);
            updateBlendshape('smileRight', 0.3 + Math.random() * 0.3);
          }, 90);
        };
        u.onend = () => {
          clearInterval(testAnimTimerRef.current);
          setIsPlayingTest(false);
          updateBlendshape('jawOpen', 0);
        };
        window.speechSynthesis.speak(u);
      }
    } else if (mode === 'song') {
      showToast(`Testing Song vocal performance for ${activeMorphPreset.name}`, 'info');
      const songLyrics = `Stepping on the stage with the avatar clone, futuristic sound that we made on our own! Synchronized rhythm, lights cut the dark, leaving our mark!`;
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(songLyrics);
        u.pitch = activeMorphPreset.voicePitch * 1.1;
        u.rate = 1.15;
        u.onstart = () => {
          testAnimTimerRef.current = setInterval(() => {
            updateBlendshape('jawOpen', 0.2 + Math.random() * 0.55);
            updateBlendshape('smileLeft', 0.6 + Math.random() * 0.3);
            updateBlendshape('smileRight', 0.6 + Math.random() * 0.3);
            updateBlendshape('browInnerUp', 0.35 + Math.random() * 0.2);
          }, 85);
        };
        u.onend = () => {
          clearInterval(testAnimTimerRef.current);
          setIsPlayingTest(false);
          updateBlendshape('jawOpen', 0);
        };
        window.speechSynthesis.speak(u);
      }
    } else if (mode === 'expressions') {
      showToast(`Testing Full FACS Blendshape Range for ${activeMorphPreset.name}`, 'info');
      let step = 0;
      testAnimTimerRef.current = setInterval(() => {
        step++;
        const phase = step % 4;
        if (phase === 0) {
          // Broad smile
          updateBlendshape('smileLeft', 1.0);
          updateBlendshape('smileRight', 1.0);
          updateBlendshape('browInnerUp', 0.4);
          updateBlendshape('jawOpen', 0.2);
        } else if (phase === 1) {
          // Surprised / open eyes
          updateBlendshape('smileLeft', 0.2);
          updateBlendshape('smileRight', 0.2);
          updateBlendshape('browInnerUp', 0.85);
          updateBlendshape('jawOpen', 0.6);
        } else if (phase === 2) {
          // Concentrated / intensity
          updateBlendshape('smileLeft', 0.4);
          updateBlendshape('smileRight', 0.4);
          updateBlendshape('browInnerUp', 0.0);
          updateBlendshape('jawOpen', 0.1);
        } else {
          // Confident smirk
          updateBlendshape('smileLeft', 0.9);
          updateBlendshape('smileRight', 0.2);
          updateBlendshape('jawOpen', 0.15);
        }
      }, 700);
    }
  };

  const handleApplyMorphToPerformance = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
    showToast(`Form "${activeMorphPreset.name}" locked as active studio avatar!`, 'success');
    setActivePage('clone-perform');
  };

  const handleApplyMorphToLiveCamera = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch {}
    showToast(`Live camera avatar cloner synced to "${activeMorphPreset.name}"!`, 'success');
    setActivePage('live-cam');
  };

  const handleExportMorphRig = () => {
    const jsonRig = {
      presetId: activeMorphPreset.id,
      name: activeMorphPreset.name,
      characterType: activeMorphPreset.characterType,
      shader: activeMorphPreset.shaderMaterial,
      humanityRatio,
      jawContour,
      eyeScale,
      stylizationIntensity,
      bonePreservation: '99.4%',
      targetPipeline: ['USD / Solaris', 'Unreal Engine 5.4 Metahuman', 'Blender 4.2 VRM'],
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(jsonRig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeMorphPreset.id}_rig_manifest.usd.json`;
    a.click();
    showToast(`Exported 3D Morph Rig manifest: ${activeMorphPreset.name}`, 'success');
  };

  const handleGenerateCustomForm = () => {
    if (!customPrompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const customForm: CharacterMorphPreset = {
        id: `morph_custom_${Date.now()}`,
        name: customPrompt.slice(0, 24),
        characterType: 'cyber_humanoid',
        headline: `AI Procedural Form: "${customPrompt}"`,
        description: `Custom synthesized humanoid character form adhering to Demond's authentic facial geometry with customized aesthetic shaders.`,
        humanityRatio: 65,
        stylizationScale: 85,
        eyeScale: 1.25,
        jawContourWidth: 1.1,
        shaderMaterial: 'cel_toon',
        skinHex: '#581c87',
        rimHex: '#38bdf8',
        badge: 'Custom Synthesized',
        voicePitch: 1.05,
        previewEmoji: '✨',
      };

      setActiveMorphPreset(customForm);
      setIsGenerating(false);
      setCustomPrompt('');
      showToast(`Procedurally synthesized custom form: "${customForm.name}"`, 'success');
    }, 900);
  };

  useEffect(() => {
    return () => {
      clearInterval(testAnimTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Character Morphing & Humanoid Forms Matrix
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Humanoid & Toon Forge
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
              <Shield className="w-3 h-3 text-emerald-400" />
              99.4% Geometry Preserved
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transform Demond Ward’s authentic digital double into futuristic cyber-humanoids, stylized cartoon heroes, anime avatars, or cosmic synthetics for song and movie productions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMorphRig}
            className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-300" />
            <span>Export Rig (USD/VRM)</span>
          </button>
          
          <button
            onClick={handleApplyMorphToPerformance}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-900/30"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Apply to Autonomous Double</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Live Viewport + Character Morphing Forge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive 3D Viewport & Real-Time Morph Sliders */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* 3D Viewport Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#120a22] to-[#07040e] border border-white/10 overflow-hidden shadow-2xl p-4">
            
            {/* Top Viewport Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeMorphPreset.previewEmoji}</span>
                <div>
                  <h3 className="font-extrabold text-white text-sm leading-tight">
                    {activeMorphPreset.name}
                  </h3>
                  <span className="text-[10px] text-purple-300 font-mono">
                    Shader: {activeMorphPreset.shaderMaterial.toUpperCase()} · Pitch: {activeMorphPreset.voicePitch}x
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                {activeMorphPreset.badge}
              </span>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="relative my-3 rounded-xl overflow-hidden bg-black/60 border border-white/5">
              <Twin3DViewport className="h-72 w-full" />
              
              {/* Overlay HUD indicators */}
              <div className="absolute top-3 left-3 pointer-events-none space-y-1">
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-white/10 text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIKENESS GEOMETRY: 99.4%</span>
                </div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-white/10 text-cyan-300">
                  <span>HUMANITY: {humanityRatio}% · STYLIZATION: {stylizationIntensity}%</span>
                </div>
              </div>

              {/* Quick Jump Buttons to Live Cam and Autonomous Performance */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={handleApplyMorphToLiveCamera}
                  className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-purple-600/60 backdrop-blur border border-white/20 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Switch to Live Camera Avatar with this form"
                >
                  <Camera className="w-3 h-3 text-rose-400" />
                  <span>To Live Cam</span>
                </button>

                <button
                  onClick={handleApplyMorphToPerformance}
                  className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-purple-600/60 backdrop-blur border border-white/20 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Switch to Autonomous Clone Performance with this form"
                >
                  <Video className="w-3 h-3 text-indigo-400" />
                  <span>To Performance</span>
                </button>
              </div>
            </div>

            {/* Real-time Test Animation Mode Bar */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Real-Time Performance Test Modes
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleToggleTestAnimation('idle')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isPlayingTest && activeTestMode === 'idle'
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/30'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Idle Breathe</span>
                </button>

                <button
                  onClick={() => handleToggleTestAnimation('speech')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isPlayingTest && activeTestMode === 'speech'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Speech Lip Sync</span>
                </button>

                <button
                  onClick={() => handleToggleTestAnimation('song')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isPlayingTest && activeTestMode === 'song'
                      ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-900/30'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Song Vocal</span>
                </button>

                <button
                  onClick={() => handleToggleTestAnimation('expressions')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isPlayingTest && activeTestMode === 'expressions'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-900/30'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>FACS Cycles</span>
                </button>
              </div>
            </div>
          </div>

          {/* Morph Micro-Sculpt Sliders */}
          <div className="p-4 rounded-2xl bg-[#0f0a1c] border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-400" />
                Biometric Morph Controls
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Procedural Shader & Rig
              </span>
            </div>

            {/* Humanity vs Synthetic Ratio */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Humanity vs Form Synthesis:</span>
                <span className="font-mono text-purple-300 font-bold">{humanityRatio}% Human / {100 - humanityRatio}% Synth</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={humanityRatio}
                onChange={(e) => setHumanityRatio(+e.target.value)}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Synthetic Humanoid (10%)</span>
                <span>Balanced Blend</span>
                <span>Photoreal Demond (100%)</span>
              </div>
            </div>

            {/* Stylization Scale */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Stylization & Cel-Shading Intensity:</span>
                <span className="font-mono text-pink-300 font-bold">{stylizationIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={stylizationIntensity}
                onChange={(e) => setStylizationIntensity(+e.target.value)}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Subtle (0%)</span>
                <span>Pixar / Cel Inking (65%)</span>
                <span>Max Anime / Comic (100%)</span>
              </div>
            </div>

            {/* Eye Scale Exaggeration */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Expressive Eye Scale (Songs & Movies):</span>
                <span className="font-mono text-amber-300 font-bold">{eyeScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.9"
                max="1.5"
                step="0.05"
                value={eyeScale}
                onChange={(e) => setEyeScale(+e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Character Morph Presets & AI Forge */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* AI Custom Form Synthesizer Input */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#170e30] via-[#120a26] to-[#0c071a] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-purple-400" />
                Prompt Any Character / Future Humanoid Face:
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI Face Synthesizer
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Cyberpunk samurai with cyan optic implants and chrome cheekplates..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                onClick={handleGenerateCustomForm}
                disabled={isGenerating || !customPrompt.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Synthesize</span>
              </button>
            </div>
          </div>

          {/* Character Morph Presets Gallery */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Character & Humanoid Morph Library
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {characterMorphPresets.length} Forms Available
              </span>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {characterMorphPresets.map((preset) => {
                const isActive = activeMorphPreset.id === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => setActiveMorphPreset(preset)}
                    className={`p-3.5 rounded-2xl border transition text-left cursor-pointer group ${
                      isActive
                        ? 'bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-950/40'
                        : 'bg-[#110c22]/80 hover:bg-[#160f2d] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                          {preset.previewEmoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-white leading-tight">
                              {preset.name}
                            </h4>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-300 font-medium mt-0.5">
                            {preset.headline}
                          </p>
                        </div>
                      </div>

                      {isActive && (
                        <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                      {preset.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                      <span>Shader: <strong className="text-slate-200">{preset.shaderMaterial}</strong></span>
                      <span>Humanity: <strong className="text-purple-300">{preset.humanityRatio}%</strong></span>
                      <span>Stylization: <strong className="text-pink-300">{preset.stylizationScale}%</strong></span>
                      <span>Pitch: <strong className="text-amber-300">{preset.voicePitch}x</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workstation & Production Pipeline Specs */}
          <div className="p-4 rounded-2xl bg-[#0e0a1e] border border-white/10 text-xs space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Production Rig Compatibility
            </span>
            <p className="text-[11px] text-slate-400">
              Morphed humanoid avatars are fully rigged for Unreal Engine 5.4 Live Link, Houdini 20.5 Solaris Karma XPU, and standard ARKit 52 blendshape pipelines. Any motion or take recorded by Demond Ward translates effortlessly to these character forms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
