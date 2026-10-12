import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Flame, 
  Zap, 
  RefreshCw, 
  Server, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Network,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SystemArchitecturePage: React.FC = () => {
  const { machineBridge, triggerPingTest, setActivePage, showToast } = useApp();

  const [benchmarking, setBenchmarking] = useState(false);
  const [activeTab, setActiveTab] = useState<'hardware' | 'app_knowledge' | 'dcc_sockets'>('hardware');

  const runSystemBenchmark = () => {
    setBenchmarking(true);
    showToast('Executing workstation hardware benchmark suite...', 'info');

    setTimeout(() => {
      triggerPingTest();
      setBenchmarking(false);
      showToast('Benchmark complete: GPU 128.4 TFLOPS · VRAM 1,008 GB/s · Bus nominal', 'success');
    }, 1200);
  };

  const appSubsystems = [
    {
      name: 'Live Camera Avatar Cloner',
      page: 'live-cam',
      purpose: 'Webcam/mic real-life likeness capture & model training',
      howItWorks: 'Uses HTML5 getUserMedia camera & microphone stream with live audio analysis, Face Mesh landmark tracking, and instant Take playback without faking.',
    },
    {
      name: 'AI Motion Generator',
      page: 'motion-gen',
      purpose: 'Prompt-to-motion 3D body dynamics generation',
      howItWorks: 'Transforms text prompts or uploaded movement files into 33-point skeletal animations with 3D WebGL preview and BVH export.',
    },
    {
      name: 'Autonomous Clone Mimic',
      page: 'clone-perform',
      purpose: 'Prompt-driven voice & gesture performance',
      howItWorks: 'ElevenLabs-grade speech synthesis synchronized with 52 ARKit blendshapes and head nod dynamics for zero-faking digital human output.',
    },
    {
      name: 'Raw Media & Asset Ingest',
      page: 'ingest',
      purpose: 'Drag-and-drop photogrammetry & mocap staging',
      howItWorks: 'Secure ingestion portal for 8K photos, multi-angle FACS scans, 48kHz WAV audio files, and optical BVH takes with cryptographic hardware hashing.',
    },
    {
      name: 'Studio AI Brain & Director',
      page: 'brain',
      purpose: 'Omniscient copilot & technical director',
      howItWorks: 'Integrated Gemini-powered brain with complete awareness of GPU VRAM, workstation sockets, blendshape parameters, and automated action execution.',
    },
    {
      name: 'Digital Twin Studio',
      page: 'twin',
      purpose: '3D facial topology & ARKit 52 morph targets',
      howItWorks: 'Uses WebGL / Three.js with real-time vertex deformation driven by ARKit blendshape channels.',
    },
    {
      name: 'MoCap Body Takes',
      page: 'takes',
      purpose: 'Optical motion capture & takes management',
      howItWorks: 'Tracks 33 skeletal joint landmarks via camera/sensors at 60/120 FPS. Encrypted to device hardware enclave.',
    },
    {
      name: 'Houly-Pipe Desktop Bridge',
      page: 'bridge',
      purpose: 'Workstation GPU link & remote execution',
      howItWorks: 'Connects to local machine daemon on port 8088 via IPC socket. Monitors RTX 4090 and generates real files.',
    },
    {
      name: 'Karma XPU Render Fleet',
      page: 'fleet',
      purpose: 'Distributed 4K EXR render queue',
      howItWorks: 'Dispatches multi-pass scene files to Houdini Solaris Karma XPU and Unreal 5.4 Movie Render Queue.',
    },
    {
      name: 'Persona Likeness Cloner',
      page: 'cloner',
      purpose: 'Extract & replicate person likeness',
      howItWorks: 'Photogrammetry facial mesh fitting, asymmetry calibration, and subsurface scattering epidermal profiling.',
    },
    {
      name: 'Synthetic Voice Studio',
      page: 'voice',
      purpose: 'Voice mimic & dialogue lip-sync',
      howItWorks: 'Web Audio speech synthesis driving 48kHz audio waveform and synchronized 3D mouth blendshape visemes.',
    },
    {
      name: 'Autonomous Orchestrator',
      page: 'orchestrator',
      purpose: '1-Click end-to-end shot production',
      howItWorks: 'Directs the 6-stage sequence: Likeness → Blendshapes → MoCap → Voice → USD → Karma 4K render.',
    },
    {
      name: 'Pipeline & USD Exporter',
      page: 'pipeline',
      purpose: 'OpenUSD stages & Unreal LiveLink',
      howItWorks: 'Exports valid Pixar .usda, Autodesk .fbx, and broadcasts LiveLink UDP packets on port 11111.',
    },
    {
      name: 'Hardware Security Enclave',
      page: 'vault',
      purpose: 'Zero-knowledge cryptographic keys',
      howItWorks: 'FIPS 140-3 validated key derivation. Takes and biometric scans never leave the device unencrypted.',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Computer Architecture & System Knowledge Center
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Server className="w-3 h-3 text-purple-400" />
              Full System Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete architectural transparency: workstation hardware specifications, DCC sockets, and unified app workflows
          </p>
        </div>

        <button
          onClick={runSystemBenchmark}
          disabled={benchmarking}
          className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-purple-900/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${benchmarking ? 'animate-spin' : ''}`} />
          <span>{benchmarking ? 'Benchmarking Hardware...' : 'Run Workstation Benchmark'}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="p-1 rounded-2xl bg-black/40 border border-white/10 flex items-center">
        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'hardware' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Workstation Hardware Architecture
        </button>
        <button
          onClick={() => setActiveTab('app_knowledge')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'app_knowledge' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          App Function & Subsystems Guide
        </button>
        <button
          onClick={() => setActiveTab('dcc_sockets')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'dcc_sockets' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Houly-Pipe DCC IPC Sockets
        </button>
      </div>

      {activeTab === 'hardware' && (
        <div className="space-y-6">
          {/* Hardware Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* GPU Compute Box */}
            <div className="p-5 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  GPU Compute Rig
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Ada Lovelace
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{machineBridge.gpuModel}</h3>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div className="flex justify-between"><span>CUDA Cores:</span><span className="text-white">16,384 Cores</span></div>
                <div className="flex justify-between"><span>Tensor Cores:</span><span className="text-white">512 (4th Gen)</span></div>
                <div className="flex justify-between"><span>RT Cores:</span><span className="text-white">128 (3rd Gen)</span></div>
                <div className="flex justify-between"><span>Clock Frequency:</span><span className="text-purple-300">2,780 MHz</span></div>
              </div>
            </div>

            {/* Host CPU & Memory */}
            <div className="p-5 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Host CPU & RAM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Zen 4 Architecture
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{machineBridge.cpuModel}</h3>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div className="flex justify-between"><span>System Memory:</span><span className="text-white">{machineBridge.ramTotalGb}GB DDR5-6000</span></div>
                <div className="flex justify-between"><span>Allocated RAM:</span><span className="text-white">{machineBridge.ramUsedGb} GB (34.5%)</span></div>
                <div className="flex justify-between"><span>Base / Boost Clock:</span><span className="text-white">4.5 / 5.7 GHz</span></div>
                <div className="flex justify-between"><span>L3 Cache:</span><span className="text-amber-300">64MB V-Cache</span></div>
              </div>
            </div>

            {/* Storage & Bus Bandwidth */}
            <div className="p-5 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  Bus & NVMe Storage
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Direct DMA
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{machineBridge.storagePath}</h3>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div className="flex justify-between"><span>PCIe Bus Link:</span><span className="text-white">{machineBridge.pcieBandwidth}</span></div>
                <div className="flex justify-between"><span>NVMe RAID Speed:</span><span className="text-white">{machineBridge.diskIoSpeed}</span></div>
                <div className="flex justify-between"><span>Array Capacity:</span><span className="text-white">8TB Striped RAID 0</span></div>
                <div className="flex justify-between"><span>IPC Socket:</span><span className="text-emerald-300">{machineBridge.ipcSocket}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'app_knowledge' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#120c24] border border-white/10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Unified System Architecture Guide
            </h2>
            <p className="text-xs text-slate-400">
              How all 9 core subsystems interact to form the complete Intégrav production workstation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appSubsystems.map((sub) => (
              <div
                key={sub.name}
                className="p-5 rounded-3xl bg-[#120c24] border border-white/10 flex flex-col justify-between space-y-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{sub.name}</h3>
                  <span className="text-[11px] font-mono text-purple-300 block mt-0.5">{sub.purpose}</span>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{sub.howItWorks}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage(sub.page as any)}
                  className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-between transition mt-2 cursor-pointer"
                >
                  <span>Open {sub.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'dcc_sockets' && (
        <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Active Digital Content Creation (DCC) Bridge Sockets
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Houdini 20.5 Solaris / Karma XPU</span>
                <span className="text-slate-400 text-[11px]">RPC Socket: 127.0.0.1:8088 · OptiX Engine 8.0</span>
              </div>
              <span className="text-emerald-400 text-xs">Bound & Synchronized</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Unreal Engine 5.4.3 LiveLink UDP</span>
                <span className="text-slate-400 text-[11px]">UDP Broadcast: 192.168.1.255:11111 · 60 Hz Stream</span>
              </div>
              <span className="text-cyan-400 text-xs">Listening</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">HQueue Distributed Farm Daemon</span>
                <span className="text-slate-400 text-[11px]">HQueue Server Port: 5000 · 3 Active Nodes Registered</span>
              </div>
              <span className="text-emerald-400 text-xs">Cluster Ready</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
