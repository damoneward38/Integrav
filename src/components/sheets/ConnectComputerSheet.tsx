import React, { useState } from 'react';
import { Server, Wifi, Cpu, CheckCircle2, ArrowRight, X, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConnectComputerSheet: React.FC = () => {
  const { machineBridge, connectBridge, setActiveSheet } = useApp();
  const [ip, setIp] = useState(machineBridge.ip || '192.168.1.105');
  const [port, setPort] = useState(machineBridge.port ? String(machineBridge.port) : '8088');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'damone-rig' | 'mac-studio'>('damone-rig');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    const ok = await connectBridge(ip, parseInt(port) || 8088);
    setIsConnecting(false);
    if (ok) {
      setActiveSheet('machine-view');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160f29] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 text-left shadow-2xl relative">
        {/* Grab bar */}
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-2 mb-3 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-300">
            <Server className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Connect Computer Bridge
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
          Link to <span className="font-mono text-purple-300">houly-pipe</span> running on your workstation. Enables remote Karma XPU rendering, live USD scene updates, and measured figures.
        </p>

        {/* Local Discovery Presets */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Discovered Local Rigs
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedPreset('damone-rig');
                setIp('192.168.1.105');
                setPort('8088');
              }}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedPreset === 'damone-rig'
                  ? 'bg-purple-900/30 border-purple-500/60'
                  : 'bg-black/40 border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Damone-Studio-Rig</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">RTX 4090 · 24GB</p>
              <p className="text-[9px] text-purple-300 font-mono mt-0.5">192.168.1.105:8088</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPreset('mac-studio');
                setIp('192.168.1.188');
                setPort('8088');
              }}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedPreset === 'mac-studio'
                  ? 'bg-purple-900/30 border-purple-500/60'
                  : 'bg-black/40 border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Mac Studio M2 Ultra</span>
                <span className="w-2 h-2 rounded-full bg-slate-500" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">192GB Unified RAM</p>
              <p className="text-[9px] text-purple-300 font-mono mt-0.5">192.168.1.188:8088</p>
            </button>
          </div>
        </div>

        {/* Manual IP / Port Input */}
        <form onSubmit={handleConnect} className="space-y-3 pt-1">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Bridge IP Address
              </label>
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.105"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Port
              </label>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="8088"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 cursor-pointer disabled:opacity-80"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Handshaking with houly-pipe...</span>
              </>
            ) : (
              <>
                <span>Connect & Open MachineView</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
