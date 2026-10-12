import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Terminal, 
  Sparkles, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Sliders,
  Layers,
  Clapperboard,
  FolderDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askStudioBrain, BrainResponse } from '../services/aiBrainService';
import { BrainMessage } from '../types';

export const AiBrainCommandPage: React.FC = () => {
  const { 
    twin, 
    machineBridge, 
    takes, 
    renderJobs, 
    setActivePage, 
    dispatchRender, 
    updateBlendshape, 
    triggerPingTest, 
    showToast 
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<BrainMessage[]>([
    {
      id: 'msg_0',
      role: 'system',
      content: 'INTÉGRAV STUDIO CORE BRAIN v3.2 initialized. Connected to local workstation rig Damone-Studio-Rig (RTX 4090 · 24GB VRAM · 4ms ping). Omniscient technical director active. How can I direct your pipeline today?',
      timestamp: '12:00 PM',
    },
    {
      id: 'msg_1',
      role: 'assistant',
      content: `I have complete oversight of your workstation and pipeline. Demond Ward's synthetic twin is calibrated with 52 ARKit blendshapes (${twin.likenessFidelity}% likeness fidelity). ${takes.length} encrypted body takes stored. 1 Karma XPU render job currently in flight. Ready to direct likeness cloning, mocap, or dispatch 4K EXR renders.`,
      timestamp: '12:01 PM',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: BrainMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response: BrainResponse = await askStudioBrain(text, {
        twin,
        machine: machineBridge,
        takesCount: takes.length,
        rendersCount: renderJobs.length,
      });

      // Execute embedded action if any
      let actionLabel: string | undefined;
      if (response.commandToExecute) {
        const { action, params } = response.commandToExecute;
        if (action === 'navigate') {
          setActivePage(params);
          actionLabel = `Navigated to ${params}`;
          showToast(`AI Brain directed navigation to ${params}`, 'info');
        } else if (action === 'render') {
          dispatchRender({
            name: `${params}_KarmaXPU_FinalBeauty`,
            frameStart: 1001,
            frameEnd: 1120,
            currentFrame: 1001,
            resolution: '3840x2160 (4K DCI)',
            renderEngine: 'Karma XPU',
            passes: ['Beauty', 'Cryptomatte', 'Depth (Z)', 'AO'],
            outputFile: `/Volumes/VFX_RAID/Takes/${params}_final.exr`,
            nodeName: machineBridge.machineName,
          });
          actionLabel = `Render Job Dispatched: ${params}`;
        } else if (action === 'ping') {
          triggerPingTest();
          actionLabel = 'Ping Test Executed';
        } else if (action === 'blendshape') {
          updateBlendshape('smileLeft', 0.85);
          updateBlendshape('smileRight', 0.85);
          updateBlendshape('jawOpen', 0.2);
          actionLabel = 'ARKit Blendshapes Calibrated';
          showToast('AI Brain calibrated facial blendshapes to smile stance', 'success');
        } else if (action === 'export') {
          setActivePage('pipeline');
          actionLabel = 'Opened USD Pipeline Exporter';
        } else if (action === 'clone') {
          setActivePage('cloner');
          actionLabel = 'Launched Likeness Cloner';
        }
      }

      const assistantMsg: BrainMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionExecuted: actionLabel,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Virtual Stage & Green Screen', prompt: 'Switch stage background to Cyberpunk Concert Arena with volumetric lasers' },
    { label: 'Cartoon Mode for Songs & Movies', prompt: 'Activate faithful cartoon mode with stylized shader for song and movie takes' },
    { label: 'Upgraded Commercial Plans', prompt: 'Review upgraded studio licensing plans and commercial pricing tiers' },
    { label: 'Live Camera Cloner', prompt: 'Turn on camera and record my live likeness and voice cadence' },
    { label: 'Generate 3D Kick Motion', prompt: 'Generate 3D skeletal motion for spinning martial arts roundhouse kick' },
    { label: 'Autonomous Clone Mimic', prompt: 'Perform wrap announcement with autonomous clone speech and facial gestures' },
    { label: 'Raw Asset Ingest', prompt: 'Open raw media ingest portal to upload TrueDepth photogrammetry and mocap' },
    { label: 'System Rig & RTX 4090', prompt: 'Inspect workstation hardware specs, GPU VRAM, and houly-pipe socket' },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Studio AI Brain & Technical Director
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Omniscient Copilot
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end intelligence: instructs workflows, controls computer hardware, and mimics persona likeness
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Brain Synchronized to {machineBridge.machineName}</span>
          </span>
        </div>
      </div>

      {/* Quick Prompts Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((qp) => (
          <button
            key={qp.label}
            onClick={() => handleSend(qp.prompt)}
            className="py-1.5 px-3 rounded-xl bg-[#140e26] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Zap className="w-3 h-3 text-purple-400" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Main Terminal & Dialogue Container */}
      <div className="rounded-3xl bg-[#0f0920] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[560px]">
        
        {/* Terminal Header Bar */}
        <div className="px-5 py-3 bg-[#130c2a] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>integrav-brain-daemon // host: {machineBridge.ip}:{machineBridge.port} // mode: autonomous</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
            <span>RTX 4090: {machineBridge.gpuTempC}°C · {machineBridge.pingMs}ms</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : msg.role === 'system'
                    ? 'bg-black/60 border border-white/10 text-slate-300 rounded-tl-none font-mono'
                    : 'bg-[#181030] border border-white/10 text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.actionExecuted && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Action Executed: {msg.actionExecuted}</span>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 font-mono text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-purple-300 font-mono">
              <div className="w-8 h-8 rounded-xl bg-purple-600/40 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 text-purple-200" />
              </div>
              <span>Brain reasoning over workstation telemetry & pipeline sockets...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Terminal Input Bar */}
        <div className="p-4 bg-[#130c2a] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Instruct the Studio Brain... (e.g. 'Dispatch 4K render', 'Clone likeness', 'Run benchmark ping')"
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-900/30 transition disabled:opacity-50 cursor-pointer"
            >
              <span>Direct</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
