import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  Plus, 
  Download, 
  Clock, 
  CheckCircle2, 
  Cpu, 
  Film,
  Sliders,
  HardDrive
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STAGE_IMAGE } from '../data/mockData';

export const FleetRendersPage: React.FC = () => {
  const { renderJobs, dispatchRender, showToast } = useApp();
  const [activePass, setActivePass] = useState<'Beauty' | 'Cryptomatte' | 'Depth' | 'AO'>('Beauty');
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  // Form fields
  const [jobName, setJobName] = useState('Take_042_KarmaXPU_FinalBeauty_v3');
  const [engine, setEngine] = useState<'Karma XPU' | 'Unreal 5.4' | 'Mantra'>('Karma XPU');
  const [resolution, setResolution] = useState('3840x2160 (4K DCI)');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchRender({
      name: jobName,
      frameStart: 1001,
      frameEnd: 1100,
      currentFrame: 1001,
      resolution,
      renderEngine: engine,
      passes: ['Beauty', 'Cryptomatte', 'Depth (Z)', 'AO'],
      outputFile: `/Volumes/VFX_RAID/Takes/${jobName}.exr`,
      nodeName: 'Damone-Studio-Rig (RTX 4090)',
    });
    setShowDispatchModal(false);
  };

  const handleDownloadExr = (name: string, resolution: string) => {
    const textContent = `Intégrav Karma XPU Multi-Layer EXR Output\nJob: ${name}\nResolution: ${resolution}\nColor Space: ACEScg\nChannels: R, G, B, A, CryptoObject, CryptoMaterial, Z, AO\nVerified Figure: 142.8 MB 32-bit Float Multi-layer`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.exr.txt`;
    a.click();
    showToast(`Downloaded render manifest for ${name}`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Distributed Render Fleet & Karma Cluster
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Distributed Houdini 20.5 Karma XPU & Unreal 5.4 Movie Render Queue
          </p>
        </div>

        <button
          onClick={() => setShowDispatchModal(true)}
          className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-900/30 active:scale-98 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch New Render</span>
        </button>
      </div>

      {/* Cluster Nodes Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#120c24] border border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white">Damone-Studio-Rig</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">RTX 4090 · 24GB VRAM (Primary Node)</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Rendering 74%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#120c24] border border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-bold text-white">Cloud-Fleet-A100-01</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">NVIDIA A100 80GB (Failover)</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
            Idle Standby
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#120c24] border border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-bold text-white">Cloud-Fleet-A100-02</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">NVIDIA A100 80GB (Failover)</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
            Idle Standby
          </span>
        </div>
      </div>

      {/* Frame Pass Inspector Strip */}
      <div className="p-4 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            4K EXR Multi-Pass Composite Inspector
          </span>
          <span className="text-xs font-mono text-purple-300">
            Active: {activePass} Channel
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['Beauty', 'Cryptomatte', 'Depth', 'AO'] as const).map((pass) => (
            <button
              key={pass}
              onClick={() => {
                setActivePass(pass);
                showToast(`Switched composite preview to ${pass} pass`, 'info');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold transition ${
                activePass === pass
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-black/40 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {pass} Pass
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Queue Table */}
      <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Active Production Jobs ({renderJobs.length})
        </h2>

        <div className="space-y-3">
          {renderJobs.map((job) => {
            const isRendering = job.status === 'rendering';

            return (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 hover:border-purple-500/30 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{job.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Engine: {job.renderEngine} · Res: {job.resolution} · Rig: {job.nodeName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isRendering ? (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Rendering {job.progress}%
                      </span>
                    ) : (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Finished (Verified)
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDownloadExr(job.name, job.resolution)}
                      className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Fetch EXR</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isRendering ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mt-1.5">
                    <span>Frame {job.currentFrame} / {job.frameEnd}</span>
                    <span>Started {job.startedAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateJob}
            className="w-full max-w-md p-6 rounded-3xl bg-[#17102b] border border-white/10 space-y-4 text-left shadow-2xl"
          >
            <div className="flex items-center gap-2 text-purple-300">
              <Layers className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Dispatch Job to GPU Cluster</h3>
            </div>

            <div>
              <label className="text-xs uppercase font-bold text-slate-400 block mb-1">
                Render Job Title
              </label>
              <input
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase font-bold text-slate-400 block mb-1">
                Render Engine Pipeline
              </label>
              <select
                value={engine}
                onChange={(e) => setEngine(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="Karma XPU">Houdini 20.5 Karma XPU (GPU OptiX)</option>
                <option value="Unreal 5.4">Unreal Engine 5.4 Movie Render Queue</option>
                <option value="Mantra">Houdini Mantra (CPU Deep Spec)</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase font-bold text-slate-400 block mb-1">
                Resolution & Aspect Ratio
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="3840x2160 (4K DCI)">3840x2160 (4K DCI)</option>
                <option value="1920x1080 (HD)">1920x1080 (HD)</option>
                <option value="4096x4096 (Square Texture)">4096x4096 (Square Texture)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg shadow-purple-900/30"
              >
                Start Render Job
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
