import React, { useState } from 'react';
import { Mic2, X, Play, Volume2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VoiceSyncModal: React.FC = () => {
  const { setActiveSheet } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePhoneme, setActivePhoneme] = useState('AA');

  const phonemes = ['AA', 'EE', 'IH', 'OH', 'OO', 'CH', 'FF', 'MM', 'SS', 'TH'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160e2a] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 space-y-3.5 text-left shadow-2xl relative">
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-violet-400">
            <Mic2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Synthetic Voice & Lip Sync
            </h3>
          </div>
          <button
            onClick={() => setActiveSheet(null)}
            className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Waveform Visualizer Mockup */}
        <div className="h-28 rounded-2xl bg-black/60 border border-white/10 p-3 flex flex-col justify-between">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>48kHz 24-bit PCM Waveform</span>
            <span className="text-violet-300">Latent Viseme Track</span>
          </div>

          {/* Equalizer bars */}
          <div className="flex items-end justify-center gap-1 h-14">
            {[40, 65, 80, 45, 95, 30, 70, 85, 60, 40, 75, 90, 50, 65, 45, 80, 95, 35, 60, 75].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-violet-600 to-fuchsia-400"
                style={{ height: `${isPlaying ? (h * Math.random()).toFixed(0) : h * 0.7}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-violet-300">
            <span>Current Viseme Target:</span>
            <span className="font-bold text-xs bg-violet-600/30 px-2 py-0.5 rounded border border-violet-500/30">
              /{activePhoneme}/
            </span>
          </div>
        </div>

        {/* Phoneme selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">
            Phoneme Viseme Mapping
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {phonemes.map((ph) => (
              <button
                key={ph}
                onClick={() => setActivePhoneme(ph)}
                className={`py-1.5 rounded-xl text-center text-xs font-mono font-bold transition ${
                  activePhoneme === ph
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-black/40 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                /{ph}/
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-white bg-violet-600 hover:bg-violet-500 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlaying ? 'Pause Voice Sync' : 'Test Speech Sync'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
