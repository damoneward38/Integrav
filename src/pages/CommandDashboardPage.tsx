import React from 'react';
import { 
  UserCheck, 
  Clapperboard, 
  Layers, 
  Cpu, 
  ScanFace, 
  Mic2, 
  KeyRound, 
  Video, 
  Sparkles, 
  FolderDown, 
  Activity, 
  ArrowUpRight,
  Server,
  Zap,
  Play,
  Download,
  Film,
  HardDrive,
  CreditCard,
  CheckCircle2,
  Lock,
  Camera,
  Upload,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_AVATAR, STAGE_IMAGE } from '../data/mockData';

export const CommandDashboardPage: React.FC = () => {
  const { 
    user, 
    setActivePage, 
    setActiveModal, 
    setSelectedTakeId,
    twin, 
    takes, 
    renderJobs, 
    machineBridge 
  } = useApp();

  const totalTakeBytes = takes.reduce((acc, t) => acc + t.fileSizeBytes, 0);
  const totalTakeMb = (totalTakeBytes / (1024 * 1024)).toFixed(1);

  const commandCards = [
    {
      id: 'live-camera',
      title: 'Live Camera Avatar Clone',
      desc: 'Real-time webcam & microphone capture to clone your live likeness',
      icon: Camera,
      color: 'from-rose-500/10 to-red-500/10 hover:from-rose-500/20 hover:to-red-500/20',
      border: 'border-rose-500/30 hover:border-rose-500/50',
      iconColor: 'text-rose-400',
      onClick: () => setActivePage('live-cam'),
      tag: 'Real-Life REC',
    },
    {
      id: 'motion-gen',
      title: 'AI Motion Generator',
      desc: 'Prompt-to-motion drop in — auto-generates 3D skeletal dynamics',
      icon: Zap,
      color: 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20',
      border: 'border-amber-500/30 hover:border-amber-500/50',
      iconColor: 'text-amber-400',
      onClick: () => setActivePage('motion-gen'),
      tag: 'Prompt-to-3D',
    },
    {
      id: 'clone-perform',
      title: 'Autonomous Clone Mimic',
      desc: 'Performs prompts & dialogue in real-time with your exact persona',
      icon: Video,
      color: 'from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20',
      border: 'border-indigo-500/30 hover:border-indigo-500/50',
      iconColor: 'text-indigo-400',
      onClick: () => setActivePage('clone-perform'),
      tag: 'ElevenLabs AI',
    },
    {
      id: 'asset-ingest',
      title: 'Raw Media & Asset Ingest',
      desc: 'Upload 8K photogrammetry scans, audio voiceprints & BVH takes',
      icon: Upload,
      color: 'from-cyan-500/10 to-teal-500/10 hover:from-cyan-500/20 hover:to-teal-500/20',
      border: 'border-cyan-500/30 hover:border-cyan-500/50',
      iconColor: 'text-cyan-400',
      onClick: () => setActivePage('ingest'),
      tag: 'Drop Upload',
    },
    {
      id: 'ai-brain',
      title: 'Studio AI Brain & Director',
      desc: 'Omniscient copilot with complete host computer and system knowledge',
      icon: Bot,
      color: 'from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20',
      border: 'border-purple-500/30 hover:border-purple-500/50',
      iconColor: 'text-purple-400',
      onClick: () => setActivePage('brain'),
      tag: 'Omniscient',
    },
    {
      id: 'system-architecture',
      title: 'Computer Architecture Rig',
      desc: 'RTX 4090 24GB VRAM, Ryzen 9, NVMe RAID & Houly-pipe socket',
      icon: Server,
      color: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20',
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      iconColor: 'text-emerald-400',
      onClick: () => setActivePage('system'),
      tag: 'Hardware Rig',
    },
    {
      id: 'twin-studio',
      title: 'Digital Twin Studio',
      desc: '3D facial topology & ARKit 52 blendshapes',
      icon: UserCheck,
      color: 'from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconColor: 'text-purple-400',
      onClick: () => setActivePage('twin'),
      tag: '52 Shapes Active',
    },
    {
      id: 'body-takes',
      title: 'Body Takes & MoCap',
      desc: `${takes.length} takes recorded · ${totalTakeMb} MB on device`,
      icon: Clapperboard,
      color: 'from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20',
      border: 'border-pink-500/20 hover:border-pink-500/40',
      iconColor: 'text-pink-400',
      onClick: () => setActivePage('takes'),
      tag: '60/120 FPS',
    },
    {
      id: 'houly-pipe',
      title: 'Houly-Pipe Desktop Bridge',
      desc: machineBridge.isConnected
        ? `${machineBridge.machineName} · ${machineBridge.pingMs}ms ping`
        : 'Connect local GPU workstation',
      icon: Cpu,
      color: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconColor: 'text-emerald-400',
      onClick: () => setActivePage('bridge'),
      tag: machineBridge.isConnected ? 'RTX 4090 Live' : 'Offline',
    },
    {
      id: 'fleet-renders',
      title: 'Fleet Cloud Renderer',
      desc: `${renderJobs.filter(j => j.status === 'rendering').length} active rendering · Karma XPU`,
      icon: Layers,
      color: 'from-indigo-500/10 to-blue-500/10 hover:from-indigo-500/20 hover:to-blue-500/20',
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      iconColor: 'text-indigo-400',
      onClick: () => setActivePage('fleet'),
      tag: '4K EXR Queue',
    },
    {
      id: 'pipeline-export',
      title: 'Pipeline Exporter',
      desc: 'Pixar USD, Autodesk FBX, BVH & LiveLink stream',
      icon: FolderDown,
      color: 'from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20',
      border: 'border-teal-500/20 hover:border-teal-500/40',
      iconColor: 'text-teal-400',
      onClick: () => setActivePage('pipeline'),
      tag: 'Solaris Ready',
    },
    {
      id: 'hardware-vault',
      title: 'Secure Enclave Vault',
      desc: 'Hardware device encryption keys & zero-knowledge store',
      icon: KeyRound,
      color: 'from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconColor: 'text-amber-400',
      onClick: () => setActivePage('vault'),
      tag: 'FIPS 140-3',
    },
    {
      id: 'face-scanner',
      title: 'ARKit Depth Face Scanner',
      desc: 'TrueDepth photogrammetry & facial topology scan',
      icon: ScanFace,
      color: 'from-cyan-500/10 to-sky-500/10 hover:from-cyan-500/20 hover:to-sky-500/20',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconColor: 'text-cyan-400',
      onClick: () => setActiveModal('face-scanner'),
      tag: 'TrueDepth',
    },
    {
      id: 'voice-sync',
      title: 'Voice & Lip Sync',
      desc: '48kHz phoneme audio wave to viseme mapping',
      icon: Mic2,
      color: 'from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20',
      border: 'border-violet-500/20 hover:border-violet-500/40',
      iconColor: 'text-violet-400',
      onClick: () => setActiveModal('voice-sync'),
      tag: 'Visemes',
    },
    {
      id: 'vp-director',
      title: 'Virtual Production Stage',
      desc: 'LED volume soundstage, camera lenses & HDRI light',
      icon: Video,
      color: 'from-rose-500/10 to-red-500/10 hover:from-rose-500/20 hover:to-red-500/20',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconColor: 'text-rose-400',
      onClick: () => setActiveModal('vp-director'),
      tag: 'LED Volume',
    },
    {
      id: 'neural-splat',
      title: 'Neural Splat / NeRF',
      desc: '3D Gaussian volume point cloud & radiance viewer',
      icon: Sparkles,
      color: 'from-fuchsia-500/10 to-pink-500/10 hover:from-fuchsia-500/20 hover:to-pink-500/20',
      border: 'border-fuchsia-500/20 hover:border-fuchsia-500/40',
      iconColor: 'text-fuchsia-400',
      onClick: () => setActiveModal('neural-splat'),
      tag: '1.2M Radiance',
    },
    {
      id: 'motion-library',
      title: 'Motion Retarget Library',
      desc: 'Combat, parkour & stunt animation clips',
      icon: Zap,
      color: 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconColor: 'text-blue-400',
      onClick: () => setActiveModal('motion-library'),
      tag: 'Retargeting',
    },
    {
      id: 'licensing-plans',
      title: 'Licensing & Pricing',
      desc: 'Commercial studio tiers, seats, and production keys',
      icon: CreditCard,
      color: 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconColor: 'text-amber-400',
      onClick: () => setActivePage('licensing'),
      tag: user?.licenceType || 'Studio Pro',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Welcome & Master Status Hero Banner */}
      <div className="relative p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-[#170e30] via-[#120a26] to-[#0c081a] border border-white/10 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-xl bg-black shrink-0">
              <img
                src={user?.avatarUrl || DEFAULT_AVATAR}
                alt="Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                  {user?.name || 'Demond Ward'}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 font-mono">
                  {user?.licenceType || 'Studio Pro'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Workstation ID: <span className="text-slate-200">{machineBridge.machineName}</span> · License: <span className="text-purple-300">{user?.licenceKey}</span>
              </p>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActivePage('live-cam')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-900/20 active:scale-98 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera Clone</span>
            </button>

            <button
              onClick={() => setActivePage('motion-gen')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-amber-900/20 active:scale-98 transition cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>AI Motion Generator</span>
            </button>

            <button
              onClick={() => setActivePage('clone-perform')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-900/20 active:scale-98 transition cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Autonomous Mimic</span>
            </button>

            <button
              onClick={() => setActivePage('ingest')}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 active:scale-98 transition cursor-pointer"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Asset Ingest</span>
            </button>

            <button
              onClick={() => setActivePage('brain')}
              className="py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 text-xs font-semibold flex items-center gap-2 border border-purple-500/30 active:scale-98 transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Studio AI Brain</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Telemetry Metrics Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Workstation Rig</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${machineBridge.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-sm font-bold text-white font-mono">{machineBridge.gpuModel.split('(')[0]}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{machineBridge.pingMs}ms latency · {machineBridge.ip}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Synthetic Twin</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-purple-300 font-mono">52 ARKit Blendshapes</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{twin.meshPolyCount.toLocaleString()} Polys · {twin.skinShader}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Encrypted Takes</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-pink-300 font-mono">{takes.length} Takes ({totalTakeMb} MB)</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">60 FPS · Hardware Enclave Locked</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Render Fleet</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-emerald-400 font-mono">Karma XPU Active</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">4K DCI Multi-layer EXR 32-bit</span>
          </div>
        </div>
      </div>

      {/* Breakthrough Autonomous Features Highlight Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-black/40 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous Production Engine · Virtual Stages & Song/Movie Cloner
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">Fully Operational</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live webcam/mic likeness cloning, virtual green screen stage switcher (type any background), faithful cartoon mode for songs and movies, text-to-3D motion generator, and upgraded studio licensing.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setActivePage('live-cam')}
            className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Green Screen & Stages</span>
          </button>
          <button
            onClick={() => setActivePage('clone-perform')}
            className="px-3 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Songs & Movies</span>
          </button>
          <button
            onClick={() => setActivePage('licensing')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Upgraded Pricing</span>
          </button>
        </div>
      </div>

      {/* Subsystems Feature Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Workstation Subsystems & Modules
            </h2>
            <p className="text-xs text-slate-400">
              All 18 modules for virtual production, motion capture, camera cloning, and rendering.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All Routers Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {commandCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={card.onClick}
                className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} text-left flex flex-col justify-between hover:scale-[1.01] active:scale-[0.99] transition shadow-sm cursor-pointer min-h-[130px] group`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className={`p-2 rounded-xl bg-black/40 border border-white/5 ${card.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-black/30 px-2 py-0.5 rounded border border-white/5 group-hover:text-white transition">
                    {card.tag}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-xs font-bold text-white tracking-tight group-hover:text-purple-300 transition">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {card.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Recent Takes & Active Renders Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left: Recent Motion Takes Table (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-pink-400">
              <Film className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Recent Motion Capture Takes</h3>
            </div>
            <button
              onClick={() => setActivePage('takes')}
              className="text-xs text-purple-300 hover:text-purple-200 font-medium transition"
            >
              View All ({takes.length})
            </button>
          </div>

          <div className="space-y-2">
            {takes.slice(0, 3).map((take) => {
              const mb = (take.fileSizeBytes / (1024 * 1024)).toFixed(1);
              return (
                <div
                  key={take.id}
                  onClick={() => {
                    setSelectedTakeId(take.id);
                    setActiveModal('take-detail');
                  }}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 flex items-center justify-between gap-3 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-purple-500/30">
                      #{take.takeNumber}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white group-hover:text-purple-300 transition truncate">
                        {take.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {take.durationSeconds}s @ {take.fps} FPS · {take.jointsTracked} Joints · {mb} MB
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 shrink-0">
                    {take.format}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Render Fleet Summary (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Layers className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Karma XPU Queue</h3>
            </div>
            <button
              onClick={() => setActivePage('fleet')}
              className="text-xs text-purple-300 hover:text-purple-200 font-medium transition"
            >
              Full Queue
            </button>
          </div>

          <div className="space-y-3">
            {renderJobs.map((job) => (
              <div key={job.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white truncate max-w-[180px]">{job.name}</span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${job.status === 'rendering' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {job.status === 'rendering' ? `${job.progress}%` : 'Done'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${job.status === 'rendering' ? 'bg-purple-500' : 'bg-emerald-500'}`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Frame {job.currentFrame}/{job.frameEnd}</span>
                  <span>{job.renderEngine}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
