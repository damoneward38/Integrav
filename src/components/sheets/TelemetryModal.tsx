import React, { useState, useEffect } from 'react';
import { Activity, X, Compass, Wifi, BatteryCharging, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TelemetryModal: React.FC = () => {
  const { setActiveSheet } = useApp();
  const [pitch, setPitch] = useState(12.4);
  const [roll, setRoll] = useState(-3.8);
  const [yaw, setYaw] = useState(148.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setPitch((prev) => +(prev + (Math.random() - 0.5) * 0.4).toFixed(1));
      setRoll((prev) => +(prev + (Math.random() - 0.5) * 0.3).toFixed(1));
      setYaw((prev) => +(prev + (Math.random() - 0.5) * 0.6).toFixed(1));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160e2a] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 space-y-3.5 text-left shadow-2xl relative">
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <Activity className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Rig Sensor & IMU Telemetry
            </h3>
          </div>
          <button
            onClick={() => setActiveSheet(null)}
            className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gyro Readout */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-400" />
              Hardware Gyroscope & Accelerometer
            </span>
            <span className="text-sky-300">120 Hz Polling</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-black/50">
              <span className="text-[10px] text-slate-400 block font-mono">PITCH</span>
              <span className="text-sm font-bold font-mono text-white">{pitch}°</span>
            </div>
            <div className="p-2 rounded-xl bg-black/50">
              <span className="text-[10px] text-slate-400 block font-mono">ROLL</span>
              <span className="text-sm font-bold font-mono text-white">{roll}°</span>
            </div>
            <div className="p-2 rounded-xl bg-black/50">
              <span className="text-[10px] text-slate-400 block font-mono">YAW</span>
              <span className="text-sm font-bold font-mono text-white">{yaw}°</span>
            </div>
          </div>
        </div>

        {/* Network & Battery Status */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>UDP Jitter</span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-emerald-400">0.8 ms</span>
            <p className="text-[10px] text-slate-500">Zero packet drops</p>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Device Thermal</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-sm font-bold text-slate-200">Nominal 34°C</span>
            <p className="text-[10px] text-slate-500">No thermal throttling</p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveSheet(null)}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-sky-600 hover:bg-sky-500 transition shadow-lg shadow-sky-900/20"
          >
            Close Telemetry Feed
          </button>
        </div>
      </div>
    </div>
  );
};
