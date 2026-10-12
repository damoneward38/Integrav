import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  Camera, 
  Download, 
  Video, 
  UserCheck, 
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  Film,
  Music,
  Palette,
  Wand2,
  Tv,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_AVATAR, SONG_MOVIE_PRESETS } from '../data/mockData';
import { Twin3DViewport } from '../components/twin/Twin3DViewport';
import { VirtualStage, SongMoviePreset } from '../types';
import confetti from 'canvas-confetti';

export const AutonomousClonePerformancePage: React.FC = () => {
  const { 
    twin, 
    updateBlendshape, 
    recordedVideoTakes, 
    trainTwinModel, 
    showToast,
    virtualStages,
    activeStage,
    setActiveStage,
    cloneRenderMode,
    setCloneRenderMode,
    stylizationIntensity,
    setStylizationIntensity,
    addCustomStage,
    autoMimicMemory,
    activeMorphPreset,
    setActivePage
  } = useApp();

  const [prompt, setPrompt] = useState(
    "Wrap announcement: Look directly into camera, smile broadly, announce that today's production is successfully completed, and give a confident nod."
  );
  const [speechScript, setSpeechScript] = useState(
    "Stepping on the stage, lasers cut through the dark. Built this from the ground up, we left our own mark. Digital clone in the cut, synchronized flow, lights flashing bright everywhere we go!"
  );
  const [isPerforming, setIsPerforming] = useState(false);
  const [activePreset, setActivePreset] = useState<SongMoviePreset | null>(SONG_MOVIE_PRESETS[0]);
  const [selectedMimicTake, setSelectedMimicTake] = useState(autoMimicMemory[0] || null);
  const [isReenactingMimic, setIsReenactingMimic] = useState(false);
  const [isIdleActive, setIsIdleActive] = useState(true);
  const [customStagePrompt, setCustomStagePrompt] = useState('');
  const [isSynthesizingStage, setIsSynthesizingStage] = useState(false);

  const idleTimerRef = useRef<any>(null);

  const visemeTimerRef = useRef<any>(null);

  // Apply a song or movie preset
  const handleSelectPreset = (preset: SongMoviePreset) => {
    setActivePreset(preset);
    setSpeechScript(preset.scriptOrLyrics);
    setPrompt(`${preset.type === 'song' ? 'Music video performance' : 'Cinema scene'}: ${preset.title} by ${preset.artistOrCharacter}`);
    setCloneRenderMode(preset.renderMode);
    
    const matchingStage = virtualStages.find((s) => s.id === preset.stageId);
    if (matchingStage) {
      setActiveStage(matchingStage);
    }

    showToast(`Loaded "${preset.title}" (${preset.type.toUpperCase()}) in ${preset.renderMode.toUpperCase()} mode`, 'info');
  };

  const handleStartPerformance = () => {
    if (isPerforming) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      clearInterval(visemeTimerRef.current);
      setIsPerforming(false);
      updateBlendshape('jawOpen', 0);
      updateBlendshape('smileLeft', 0);
      updateBlendshape('smileRight', 0);
      return;
    }

    setIsPerforming(true);
    showToast(
      cloneRenderMode === 'cartoon' 
        ? 'Cartoon clone performing song/movie monologue with synced visemes...'
        : 'Photoreal digital double performing prompt...',
      'info'
    );

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechScript);
      utterance.pitch = activePreset?.type === 'song' ? 1.05 : 0.95;
      utterance.rate = activePreset?.type === 'song' ? 1.1 : 1.0;

      utterance.onstart = () => {
        // Modulate dynamic facial expressions and rhythm head bob
        updateBlendshape('smileLeft', 0.85);
        updateBlendshape('smileRight', 0.85);
        updateBlendshape('browInnerUp', 0.35);

        visemeTimerRef.current = setInterval(() => {
          updateBlendshape('jawOpen', 0.15 + Math.random() * 0.45);
          updateBlendshape('mouthPucker', Math.random() * 0.25);
          updateBlendshape('eyeBlinkLeft', Math.random() > 0.88 ? 0.9 : 0);
          updateBlendshape('eyeBlinkRight', Math.random() > 0.88 ? 0.9 : 0);
        }, 95);
      };

      utterance.onend = () => {
        setIsPerforming(false);
        clearInterval(visemeTimerRef.current);
        updateBlendshape('jawOpen', 0);
        updateBlendshape('smileLeft', 0.5);
        updateBlendshape('smileRight', 0.5);
        showToast('Autonomous performance completed. Ready for export!', 'success');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      };

      utterance.onerror = () => {
        setIsPerforming(false);
        clearInterval(visemeTimerRef.current);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRetrainFromTake = () => {
    trainTwinModel(1.0);
    showToast('Ingested 1.0 hours of live takes into persona cloning weights (+0.2% fidelity)', 'success');
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleExportPerformance = () => {
    const filename = `take_${Date.now()}_${activePreset?.title.replace(/[^a-zA-Z0-9]/g, '_') || 'performance'}_${cloneRenderMode}.mov`;
    const dummyBlob = new Blob([`INTÉGRAV MASTER EXPORT\nPerformer: Demond Ward\nStage: ${activeStage.name}\nMode: ${cloneRenderMode}\nScript: ${speechScript}`], { type: 'text/plain' });
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    showToast(`Exported production master: ${filename} (Song & Movie Ready)`, 'success');
  };

  const handleToggleIdlePresence = () => {
    if (isIdleActive) {
      clearInterval(idleTimerRef.current);
      setIsIdleActive(false);
      showToast('Avatar idle breathing paused', 'info');
    } else {
      setIsIdleActive(true);
      showToast('Avatar natural idle breathing & scanning activated', 'info');
    }
  };

  const handleReenactMimicTake = (take: any) => {
    setSelectedMimicTake(take);
    setIsReenactingMimic(true);
    showToast(`Avatar reenacting recorded take: "${take.title}" (${take.duration}s)`, 'info');

    let counter = 0;
    const durationTicks = Math.round(take.duration * 10);
    const mimicInterval = setInterval(() => {
      counter++;
      // Re-enact natural dynamic facial keyframes from the recording
      updateBlendshape('smileLeft', 0.2 + Math.sin(counter * 0.2) * 0.35);
      updateBlendshape('smileRight', 0.2 + Math.sin(counter * 0.2) * 0.35);
      updateBlendshape('jawOpen', Math.max(0, Math.sin(counter * 0.4) * 0.4));
      updateBlendshape('browInnerUp', Math.cos(counter * 0.15) * 0.25 + 0.1);
      if (counter % 12 === 0) {
        updateBlendshape('eyeBlinkLeft', 0.9);
        updateBlendshape('eyeBlinkRight', 0.9);
      } else {
        updateBlendshape('eyeBlinkLeft', 0);
        updateBlendshape('eyeBlinkRight', 0);
      }

      if (counter >= durationTicks) {
        clearInterval(mimicInterval);
        setIsReenactingMimic(false);
        updateBlendshape('jawOpen', 0);
        showToast(`Completed mimic replay for "${take.title}". Biometrics locked.`, 'success');
      }
    }, 100);
  };

  useEffect(() => {
    if (isIdleActive && !isPerforming && !isReenactingMimic) {
      idleTimerRef.current = setInterval(() => {
        const time = Date.now() * 0.001;
        updateBlendshape('browInnerUp', 0.1 + Math.sin(time * 0.8) * 0.1);
        updateBlendshape('mouthPucker', Math.sin(time * 0.5) * 0.05);
        if (Math.random() > 0.92) {
          updateBlendshape('eyeBlinkLeft', 0.85);
          updateBlendshape('eyeBlinkRight', 0.85);
          setTimeout(() => {
            updateBlendshape('eyeBlinkLeft', 0);
            updateBlendshape('eyeBlinkRight', 0);
          }, 120);
        }
      }, 150);
    }
    return () => clearInterval(idleTimerRef.current);
  }, [isIdleActive, isPerforming, isReenactingMimic]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      clearInterval(visemeTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Cloned Digital Double Autonomous Performance
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Bot className="w-3 h-3 text-purple-400" />
              Autonomous Double
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1 font-bold">
              <Music className="w-3 h-3 text-pink-400" />
              Songs & Movies Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Whatever prompt, lyrics, or movie dialogue you give, your digital clone automatically performs, gestures, and sings without you having to perform it
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPerformance}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-900/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Master Clip</span>
          </button>

          <button
            onClick={handleRetrainFromTake}
            className="py-2 px-3.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
            <span>Ingest Takes (+0.2%)</span>
          </button>
        </div>
      </div>

      {/* Mode Bar: Photoreal vs Cartoon Animated Mode */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#170e30] via-[#120a26] to-[#0d071a] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-400" />
            Double Shader Mode:
          </span>

          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setCloneRenderMode('photoreal');
                showToast('Switched double to 1:1 Photoreal Neural mode', 'info');
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                cloneRenderMode === 'photoreal'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>1:1 Photoreal Self</span>
            </button>

            <button
              onClick={() => {
                setCloneRenderMode('cartoon');
                showToast('Switched double to Faithful Cartoon Mode (Song & Movie Ready)', 'success');
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                cloneRenderMode === 'cartoon'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cartoon Mode (Songs & Movies)</span>
            </button>
          </div>
        </div>

        {cloneRenderMode === 'cartoon' && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-pink-300">Stylization:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={stylizationIntensity}
              onChange={(e) => setStylizationIntensity(Number(e.target.value))}
              className="w-28 accent-pink-500 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-300">{stylizationIntensity}%</span>
            <span className="text-[10px] text-slate-400 font-mono">
              (A little bit off, but unmistakably Demond Ward)
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Active Stage: <strong className="text-purple-300">{activeStage.name}</strong></span>
        </div>
      </div>

      {/* Song & Movie Production Presets Strip */}
      <div className="p-4 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Song & Movie Ready Performance Presets
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">1-Click Autoplay Demos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SONG_MOVIE_PRESETS.map((preset) => {
            const isSelected = activePreset?.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-purple-900/40 to-pink-900/20 border-pink-500/50 shadow-lg'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-purple-300">
                      {preset.type === 'song' ? '🎵 Song Verse' : '🎬 Movie Scene'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">{preset.renderMode}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {preset.artistOrCharacter}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-400">
                  <span>{preset.tags[0]}</span>
                  <span>·</span>
                  <span className="text-pink-300">Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Form & Character Morph Matrix Bar */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#170e30] via-[#120a26] to-[#0c071a] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-xl shrink-0">
            {activeMorphPreset.previewEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Active Avatar Form:</span>
              <span className="text-xs font-mono font-bold text-purple-300">{activeMorphPreset.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {activeMorphPreset.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {activeMorphPreset.headline} · Geometry Preserved: 99.4%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('morph')}
            className="py-2 px-3.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Change Character Form / Humanoid Faces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Mimic Memory Vault & Recorded Ingest Strip */}
      <div className="p-4 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Auto-Translated Persona Mimic Vault (Stored Recordings)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Every take you record automatically translates here. The AI holds and stores your exact movements, speech cadence, and facial biometrics to replay on command.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleIdlePresence}
              className={`py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isIdleActive
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isIdleActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>Living Idle Presence: {isIdleActive ? 'ON' : 'PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Mimic Takes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {autoMimicMemory.map((take) => {
            const isSelected = selectedMimicTake?.takeId === take.takeId;

            return (
              <div
                key={take.takeId}
                className={`p-3 rounded-2xl border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-md'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-400 font-bold">{take.fidelityScore}% Biometric Match</span>
                    <span>{take.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{take.title}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {take.duration}s · 33 Joint Tracking · {take.stageName || 'Studio Stage'}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-300">{take.renderMode || 'photoreal'}</span>

                  <button
                    onClick={() => handleReenactMimicTake(take)}
                    disabled={isReenactingMimic}
                    className="py-1 px-2.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer disabled:opacity-40"
                  >
                    <Play className="w-3 h-3 fill-emerald-200" />
                    <span>Reenact Mimic Take</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Stage Display (Side-by-Side: Real You Reference vs Cloned You Double) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Real Footage Reference (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                Real You (Ground Truth Reference)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Live Hardware Take</span>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/5">
              {recordedVideoTakes.length > 0 ? (
                <video
                  src={recordedVideoTakes[0].blobUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={DEFAULT_AVATAR}
                  alt="Real Ground Truth"
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded">
                Physical Camera Reference
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              The AI cloner extracts your authentic facial structure, eye geometry, and voice cadence so whether in photoreal or cartoon mode, it stays unmistakably you.
            </p>
          </div>
        </div>

        {/* Right: AI Cloned Double on Virtual Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Cloned Double ({cloneRenderMode === 'cartoon' ? 'Cartoon Mode' : 'Photoreal Self'})
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${isPerforming ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse' : 'bg-black/40 text-slate-400 border-white/5'}`}>
                {isPerforming ? 'PERFORMING NOW' : 'SYNCHRONIZED'}
              </span>
            </div>

            {/* Real 3D Viewport on Stage Background */}
            <div 
              className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl"
              style={{ background: activeStage.bgStyle }}
            >
              <Twin3DViewport className="h-full w-full" />

              {/* Stage Overlay Label */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeStage.lightingTint }} />
                <span>Stage: {activeStage.name}</span>
              </div>

              {isPerforming && (
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-pink-500/40 text-xs font-mono text-pink-200 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
                  <span>Lip-Sync Active // Song & Dialogue Audio Stream</span>
                </div>
              )}
            </div>

            {/* Quick Stage Switcher Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {virtualStages.map((stg) => {
                const isSelected = activeStage.id === stg.id;
                return (
                  <button
                    key={stg.id}
                    onClick={() => {
                      setActiveStage(stg);
                      showToast(`Double moved to stage: ${stg.name}`, 'info');
                    }}
                    className={`py-1 px-2.5 rounded-lg border shrink-0 transition flex items-center gap-1.5 text-[11px] font-mono ${
                      isSelected
                        ? 'bg-purple-600/40 border-purple-500 text-white'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stg.lightingTint }} />
                    <span className="truncate max-w-[120px]">{stg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Action & Dialogue Director Prompt Box */}
      <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Instruct Your Cloned Persona (Songs, Monologues, & Movies)
          </h2>
          <span className="text-xs font-mono text-slate-400">Prompt & Lyrics $\rightarrow$ Autonomous Action</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Physical Performance & Choreography Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Look into camera with rhythm bounce, sing the chorus, smile confidently..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
              Lyrics or Movie Dialogue to Speak / Sing
            </label>
            <input
              type="text"
              value={speechScript}
              onChange={(e) => setSpeechScript(e.target.value)}
              placeholder="e.g. Type song lyrics or cinematic monologue..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Custom Stage Prompt Input for Performance */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <div className="relative flex-1">
            <input
              type="text"
              value={customStagePrompt}
              onChange={(e) => setCustomStagePrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomStage()}
              placeholder="Type any custom stage background you want behind your clone (e.g. 'Coachella mainstage', 'Broadway theater')..."
              className="w-full py-2 px-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 font-mono"
            />
          </div>

          <button
            onClick={handleGenerateCustomStage}
            disabled={isSynthesizingStage || !customStagePrompt.trim()}
            className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 disabled:opacity-40"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Generate Stage</span>
          </button>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setPrompt("Song verse: rhythm cadence, direct gaze, dynamic head bounce");
                setSpeechScript("Built this clone from the ground up, no faking this! Intégrav systems in the studio, everything we do is pure gold.");
              }}
              className="text-[11px] text-purple-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/5"
            >
              🎵 Song Verse Preset
            </button>
            <button
              type="button"
              onClick={() => {
                setPrompt("Sci-Fi Blockbuster: Dramatic pause, intense gaze, cinematic delivery");
                setSpeechScript("The entire digital double cluster is live. Every system is synchronized across the universe.");
              }}
              className="text-[11px] text-pink-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/5"
            >
              🎬 Movie Monologue Preset
            </button>
          </div>

          <button
            type="button"
            onClick={handleStartPerformance}
            className={`py-3 px-6 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg ${
              isPerforming
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white shadow-pink-900/30'
            }`}
          >
            {isPerforming ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Halt Autonomous Double</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Perform Song / Scene Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
