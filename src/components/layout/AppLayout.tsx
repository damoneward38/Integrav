import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bot,
  UserCheck, 
  Sparkles, 
  Mic2, 
  PlayCircle, 
  Clapperboard, 
  Layers, 
  Cpu, 
  FolderDown, 
  ShieldCheck, 
  CreditCard,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  Server,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Camera,
  Zap,
  Upload,
  Video,
  Wand2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppPage } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    activePage, 
    setActivePage, 
    user, 
    signOut, 
    machineBridge, 
    toasts, 
    dismissToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems: Array<{ id: AppPage; label: string; icon: any; badge?: string; badgeColor?: string; group?: string }> = [
    // Autonomous Intelligence & Director
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'brain', label: 'Studio AI Brain', icon: Bot, badge: 'Copilot', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'orchestrator', label: 'Autonomous Pipeline', icon: PlayCircle, badge: '1-Click', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'system', label: 'Computer Architecture', icon: Server, badge: 'RTX 4090' },

    // Real-Life Avatar Cloning & Motion
    { id: 'live-cam', label: 'Live Camera Avatar Clone', icon: Camera, badge: 'Live REC', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'motion-gen', label: 'AI Motion Generator', icon: Zap, badge: 'Prompt-3D', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'clone-perform', label: 'Clone Autonomous Mimic', icon: Video, badge: 'ElevenLabs', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'morph', label: 'Character & Humanoid Morph', icon: Wand2, badge: 'Toon/Cyber', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'ingest', label: 'Raw Asset Ingest & Drop', icon: Upload, badge: 'Photogrammetry' },

    // Likeness & Motion Capture
    { id: 'cloner', label: 'Likeness & Persona Cloner', icon: Sparkles, badge: '99.4%' },
    { id: 'twin', label: 'Digital Twin 3D Viewport', icon: UserCheck, badge: 'ARKit 52' },
    { id: 'voice', label: 'Synthetic Voice Studio', icon: Mic2, badge: '48kHz' },
    { id: 'takes', label: 'MoCap Body Takes', icon: Clapperboard, badge: '60 FPS' },

    // Workstation & Fleet Rendering
    { id: 'fleet', label: 'Fleet & Cloud Renders', icon: Layers, badge: 'Karma XPU' },
    { 
      id: 'bridge', 
      label: 'Houly-Pipe Bridge', 
      icon: Cpu, 
      badge: machineBridge.isConnected ? `${machineBridge.pingMs}ms` : 'Offline',
      badgeColor: machineBridge.isConnected ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-400' 
    },
    { id: 'pipeline', label: 'Pipeline & Exports', icon: FolderDown },
    { id: 'vault', label: 'Hardware Enclave', icon: ShieldCheck, badge: 'FIPS 140' },
    { id: 'licensing', label: 'Licensing & Pricing', icon: CreditCard, badge: 'Commercial' },
    { id: 'checkout', label: 'Commercial Checkout', icon: CreditCard, badge: 'Order & Pay', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  ];

  const getPageTitle = (page: AppPage) => {
    switch (page) {
      case 'command': return 'Command Center & Telemetry';
      case 'brain': return 'Studio AI Brain & Technical Director';
      case 'orchestrator': return 'Autonomous Pipeline Orchestrator';
      case 'system': return 'Computer Architecture & System Knowledge';
      case 'live-cam': return 'Live Camera Real-Life Avatar Cloner';
      case 'motion-gen': return 'AI Motion Drop-In & Body Movement Generator';
      case 'clone-perform': return 'Autonomous Clone Performer & Mimic';
      case 'morph': return 'Character Morphing & Humanoid Forms Matrix';
      case 'checkout': return 'Commercial Production Licensing & Checkout';
      case 'ingest': return 'Raw Media, Photogrammetry & MoCap Ingest';
      case 'cloner': return 'Persona Likeness & Digital Human Cloner';
      case 'twin': return 'Digital Twin 3D Viewport & Biometrics';
      case 'voice': return 'Synthetic Voice & Dialogue Mimic Studio';
      case 'takes': return 'Optical Motion Capture & Takes Timeline';
      case 'fleet': return 'Distributed Render Fleet & Karma Cluster';
      case 'bridge': return 'Houly-Pipe Desktop Bridge & MachineView';
      case 'pipeline': return 'Production Pipeline & USD Exporter';
      case 'vault': return 'Hardware Security Enclave & Keys';
      case 'licensing': return 'Commercial Production Licensing & Plans';
    }
  };

  return (
    <div className="min-h-screen bg-[#090714] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      
      {/* Top Professional Header Bar */}
      <header className="h-16 px-6 bg-[#0e0a1e]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-6 shrink-0 z-30 sticky top-0">
        
        {/* Left: Brand + Breadcrumbs */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActivePage('command')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-105 transition">
              <span className="text-sm font-black text-white font-mono">IN</span>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                Intégrav
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                VFX Studio Workstation
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium pl-4 border-l border-white/10">
            <span>Studio</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold">{getPageTitle(activePage)}</span>
          </div>
        </div>

        {/* Center: Search & Quick Command Palette */}
        <div className="hidden lg:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search takes, renders, USD nodes, or blendshapes... (Cmd+K)"
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>

        {/* Right: AI Brain Trigger, Bridge Telemetry & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick AI Brain Button */}
          <button
            onClick={() => setActivePage('brain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activePage === 'brain'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Brain</span>
          </button>

          {/* Bridge Telemetry Pill */}
          <button
            onClick={() => setActivePage('bridge')}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition cursor-pointer ${
              machineBridge.isConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/30'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Click to inspect Houly-Pipe Workstation Bridge & MachineView"
          >
            <span className={`w-2 h-2 rounded-full ${machineBridge.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>houly-pipe: {machineBridge.isConnected ? `${machineBridge.pingMs}ms` : 'Disconnected'}</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {toasts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 p-3 rounded-2xl bg-[#140e26] border border-white/10 shadow-2xl z-50 text-left space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-white">System Notifications</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {toasts.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">No new notifications</p>
                  ) : (
                    toasts.map((t) => (
                      <div key={t.id} className="p-2 rounded-xl bg-black/40 text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p>{t.message}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{t.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Lockup */}
          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <div 
              onClick={() => setActivePage('licensing')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition"
              title="View account license & seats"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-400/40 bg-black">
                <img
                  src={user?.avatarUrl}
                  alt={user?.name || 'User'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-white block leading-tight">
                  {user?.name || 'Demond Ward'}
                </span>
                <span className="text-[10px] text-purple-300 font-mono block">
                  {user?.licenceType || 'Studio Pro'}
                </span>
              </div>
            </div>

            <button
              onClick={signOut}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body: Sidebar + Dynamic Page Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Professional Studio Sidebar */}
        <aside className="w-64 bg-[#0d091b] border-r border-white/10 flex flex-col justify-between shrink-0 hidden md:flex">
          
          {/* Main Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Workstation Subsystems
            </div>

            {navItems
              .filter((item) => !searchQuery.trim() || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer group ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white border-white/30' : 'bg-black/40 text-slate-400 border-white/5')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Workstation Rig Hardware Status Box */}
          <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#16102a] to-[#0f0b1e] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Active GPU Rig
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white truncate">
                {machineBridge.machineName}
              </h4>
              <p className="text-[11px] text-purple-300 font-mono">
                RTX 4090 · 18.6 / 24 GB
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Houdini Solaris + UE 5.4 Live
              </p>
            </div>

            <button
              onClick={() => setActivePage('system')}
              className="w-full mt-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium transition text-center block"
            >
              Hardware Diagnostics
            </button>
          </div>
        </aside>

        {/* Dynamic Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#080511] p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Toast Notification Feed */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto p-3.5 rounded-2xl bg-[#17102c] border border-purple-500/30 shadow-2xl text-xs text-slate-200 flex items-center justify-between gap-3 min-w-[280px] max-w-sm animate-in slide-in-from-bottom-5"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-purple-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
