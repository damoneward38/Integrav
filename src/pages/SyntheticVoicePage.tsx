import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic2, 
  Play, 
  Pause, 
  Volume2, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Download,
  RotateCcw,
  AudioWaveform
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SyntheticVoicePage: React.FC = () => {
  const { twin, updateBlendshape, showToast } = useApp();

  const [script, setScript] = useState(
    "Welcome to the Intégrav VFX Workstation. My synthetic likeness, ARKit 52 facial blendshapes, and Houly-Pipe bridge connection are fully synchronized."
  );
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [voiceProfile, setVoiceProfile] = useState<'Demond Ward Studio Voice' | 'Cinematic Narrator' | 'Technical Director'>('Demond Ward Studio Voice');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeViseme, setActiveViseme] = useState('AA');

  const visemeIntervalRef = useRef<any>(null);

  const visemeMap = ['AA', 'EE', 'IH', 'OH', 'OO', 'CH', 'FF', 'MM', 'SS', 'TH'];

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser environment', 'warning');
      return;
    }

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      clearInterval(visemeIntervalRef.current);
      updateBlendshape('jawOpen', 0);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.pitch = pitch;
    utterance.rate = rate;

    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const deepVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Natural')) || voices[0];
    if (deepVoice) utterance.voice = deepVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      showToast('Synthesizing speech & driving real-time 3D viseme blendshapes', 'info');

      // Drive dynamic visemes & mouth opening in sync with speech
      visemeIntervalRef.current = setInterval(() => {
        const randomViseme = visemeMap[Math.floor(Math.random() * visemeMap.length)];
        setActiveViseme(randomViseme);

        // Modulate jaw open & mouth pucker
        const jawAmount = 0.15 + Math.random() * 0.45;
        updateBlendshape('jawOpen', jawAmount);
        updateBlendshape('mouthPucker', Math.random() * 0.25);
      }, 120);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      clearInterval(visemeIntervalRef.current);
      updateBlendshape('jawOpen', 0);
      updateBlendshape('mouthPucker', 0);
      showToast('Dialogue synthesis complete', 'success');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      clearInterval(visemeIntervalRef.current);
      updateBlendshape('jawOpen', 0);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearInterval(visemeIntervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Synthetic Voice & Dialogue Mimic Studio
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Real-Time Visemes
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Drive speech synthesis with real-time ARKit facial visemes and phoneme audio waveforms
          </p>
        </div>

        <button
          onClick={() => {
            const blob = new Blob([`Intégrav Synthesized Dialogue Audio Track\nScript: "${script}"\nVisemes: 48kHz Sync\nSubject: Demond Ward`], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `integrav_dialogue_track.txt`;
            a.click();
            showToast('Exported dialogue track manifest', 'success');
          }}
          className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audio Track</span>
        </button>
      </div>

      {/* Main Split: Left Audio & Script, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Script Editor & Live Audio Waveform (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Audio Waveform Display */}
          <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                48kHz 24-bit PCM Master Channel
              </span>
              <span className={`px-2 py-0.5 rounded-full border ${isSpeaking ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-black/40 text-slate-400 border-white/5'}`}>
                {isSpeaking ? 'TRANSMITTING VISMES' : 'IDLE STANDBY'}
              </span>
            </div>

            {/* Dynamic Equalizer Bars */}
            <div className="h-28 rounded-2xl bg-black/60 border border-white/5 p-4 flex items-end justify-between gap-1">
              {[35, 60, 85, 45, 95, 40, 75, 90, 65, 40, 80, 95, 55, 70, 50, 85, 95, 40, 65, 80, 50, 90, 75, 60].map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-full transition-all duration-100 ${
                    isSpeaking 
                      ? 'bg-gradient-to-t from-purple-600 via-fuchsia-500 to-cyan-400' 
                      : 'bg-purple-900/30'
                  }`}
                  style={{ height: `${isSpeaking ? Math.max(15, Math.floor(h * Math.random())) : 10}%` }}
                />
              ))}
            </div>

            {/* Active Viseme Readout */}
            <div className="flex items-center justify-between text-xs font-mono p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-slate-400">Current ARKit Lip Viseme Target:</span>
              <span className="text-sm font-bold text-white bg-purple-600/40 border border-purple-500/40 px-3 py-1 rounded-xl">
                /{activeViseme}/
              </span>
            </div>
          </div>

          {/* Script Input Box */}
          <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white block">
              Dialogue Script
            </label>
            <textarea
              rows={4}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Type any dialogue script here..."
              className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:border-purple-500 font-mono resize-none"
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-mono">Sample Scripts:</span>
              <button
                type="button"
                onClick={() => setScript("Welcome to the Intégrav VFX Workstation. My synthetic likeness, ARKit 52 facial blendshapes, and Houly-Pipe bridge connection are fully synchronized.")}
                className="text-[11px] text-purple-300 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/5"
              >
                Pipeline Greeting
              </button>
              <button
                type="button"
                onClick={() => setScript("Attention studio crew: Take 42 has completed with zero dropped frames. Karma XPU is rendering the 4K multi-layer beauty pass.")}
                className="text-[11px] text-purple-300 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/5"
              >
                Production Alert
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Voice Timbre & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-white/10">
              Vocal Mimic Parameters
            </h2>

            {/* Profile Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Persona Voice Profile
              </label>
              <select
                value={voiceProfile}
                onChange={(e) => setVoiceProfile(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="Demond Ward Studio Voice">Demond Ward (Studio Profile v1)</option>
                <option value="Cinematic Narrator">Cinematic Narrator (Trailer Tone)</option>
                <option value="Technical Director">Technical Director (Command Voice)</option>
              </select>
            </div>

            {/* Pitch Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Voice Pitch</span>
                <span className="font-mono text-purple-300 font-bold">{pitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.4"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
              />
            </div>

            {/* Speed Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Cadence / Speed</span>
                <span className="font-mono text-purple-300 font-bold">{rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
              />
            </div>

            {/* Big Action Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleSpeak}
                className={`w-full py-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                  isSpeaking
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                    : 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Stop Speech & Release Visemes</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Synthesize Dialogue & Drive Lip-Sync</span>
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
