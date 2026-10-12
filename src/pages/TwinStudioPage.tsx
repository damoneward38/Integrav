import React, { useState } from 'react';
import { 
  Eye, 
  ScanFace, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Download,
  Sun,
  Layers,
  Activity,
  Smile,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Twin3DViewport } from '../components/twin/Twin3DViewport';

export const TwinStudioPage: React.FC = () => {
  const { 
    twin, 
    updateBlendshape, 
    toggleWireframe, 
    setSkinShader, 
    setActiveModal,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'blendshapes' | 'shaders' | 'lighting'>('blendshapes');

  const applyExpressionPreset = (preset: 'neutral' | 'smile' | 'shocked' | 'determined') => {
    if (preset === 'neutral') {
      updateBlendshape('jawOpen', 0);
      updateBlendshape('smileLeft', 0);
      updateBlendshape('smileRight', 0);
      updateBlendshape('browInnerUp', 0);
      updateBlendshape('eyeBlinkLeft', 0);
      updateBlendshape('eyeBlinkRight', 0);
      updateBlendshape('mouthPucker', 0);
      updateBlendshape('cheekPuff', 0);
      showToast('Expression set to Neutral Reference', 'info');
    } else if (preset === 'smile') {
      updateBlendshape('jawOpen', 0.1);
      updateBlendshape('smileLeft', 0.85);
      updateBlendshape('smileRight', 0.85);
      updateBlendshape('browInnerUp', 0.2);
      updateBlendshape('mouthPucker', 0);
      showToast('Expression preset applied: Natural Smile', 'info');
    } else if (preset === 'shocked') {
      updateBlendshape('jawOpen', 0.75);
      updateBlendshape('smileLeft', 0);
      updateBlendshape('smileRight', 0);
      updateBlendshape('browInnerUp', 0.9);
      updateBlendshape('eyeBlinkLeft', 0);
      updateBlendshape('eyeBlinkRight', 0);
      showToast('Expression preset applied: Shocked / Jaw Drop', 'info');
    } else if (preset === 'determined') {
      updateBlendshape('jawOpen', 0.05);
      updateBlendshape('smileLeft', 0.1);
      updateBlendshape('smileRight', 0.1);
      updateBlendshape('browInnerUp', -0.3);
      updateBlendshape('mouthPucker', 0.2);
      showToast('Expression preset applied: Determined Stance', 'info');
    }
  };

  const shaderOptions: Array<typeof twin.skinShader> = [
    'Photorealistic SSS',
    'Stylized Clay',
    'Topology Wire',
    'Biometric Depth',
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Digital Twin 3D Viewport & Biometrics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time WebGL mesh deformation · {twin.meshPolyCount.toLocaleString()} Polygons · ARKit 52 Blendshapes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('face-scanner')}
            className="py-2 px-3.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <ScanFace className="w-4 h-4 text-purple-300" />
            <span>TrueDepth Rescan</span>
          </button>

          <button
            onClick={() => {
              const usda = `#usda 1.0\ndef Mesh "${twin.name.replace(/\s+/g, '_')}" {\n  int[] faceVertexCounts = [4]\n  point3f[] points = [(-1,0,0), (1,0,0), (1,2,0), (-1,2,0)]\n}`;
              const blob = new Blob([usda], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${twin.name.replace(/\s+/g, '_')}.usda`;
              a.click();
              showToast('Exported Digital Twin USD to disk', 'success');
            }}
            className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export USD</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workstation Split: Left 3D Viewport, Right Parameter Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Interactive Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0c0817] shadow-xl">
            {/* Three.js Canvas */}
            <Twin3DViewport className="h-[440px] sm:h-[520px]" />
            
            {/* Viewport Floating Quick Tools */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-auto">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
                <button
                  onClick={toggleWireframe}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    twin.wireframeActive
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{twin.wireframeActive ? 'Wireframe ON' : 'Topology Wireframe'}</span>
                </button>

                <button
                  onClick={() => applyExpressionPreset('neutral')}
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5"
                  title="Reset to Neutral"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Rest Pose</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
                {(['neutral', 'smile', 'shocked', 'determined'] as const).map((expr) => (
                  <button
                    key={expr}
                    onClick={() => applyExpressionPreset(expr)}
                    className="py-1 px-2.5 rounded-lg text-[11px] font-mono capitalize text-slate-300 hover:text-white hover:bg-white/10 transition"
                  >
                    {expr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Biometric Spec Bar */}
          <div className="p-4 rounded-2xl bg-[#120c24] border border-white/10 grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Topology Density</span>
              <span className="text-xs font-bold text-white font-mono">{twin.meshPolyCount.toLocaleString()} Quads</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">ARKit Calibration</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{twin.faceModelStatus}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Hardware Timestamp</span>
              <span className="text-xs font-bold text-purple-300 font-mono">{twin.lastCalibrated}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Control Deck & Blendshape Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Deck Tabs */}
          <div className="p-1 rounded-2xl bg-black/40 border border-white/10 flex items-center">
            <button
              onClick={() => setActiveTab('blendshapes')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                activeTab === 'blendshapes' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Blendshapes (52)
            </button>
            <button
              onClick={() => setActiveTab('shaders')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                activeTab === 'shaders' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Shader Material
            </button>
          </div>

          {activeTab === 'blendshapes' && (
            <div className="p-5 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-purple-300">
                  <Sliders className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    ARKit Morph Sliders
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  LiveLink Channel Active
                </span>
              </div>

              {/* Sliders */}
              <div className="space-y-3.5 pt-1">
                {/* Jaw Open */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Jaw Open (mouthOpen)</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(twin.blendshapes.jawOpen * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={twin.blendshapes.jawOpen}
                    onChange={(e) => updateBlendshape('jawOpen', parseFloat(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Smile Left */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Smile Left (mouthSmileLeft)</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(twin.blendshapes.smileLeft * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={twin.blendshapes.smileLeft}
                    onChange={(e) => updateBlendshape('smileLeft', parseFloat(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Smile Right */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Smile Right (mouthSmileRight)</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(twin.blendshapes.smileRight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={twin.blendshapes.smileRight}
                    onChange={(e) => updateBlendshape('smileRight', parseFloat(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Brow Inner Up */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Brow Inner Up (browInnerUp)</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(twin.blendshapes.browInnerUp * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={twin.blendshapes.browInnerUp}
                    onChange={(e) => updateBlendshape('browInnerUp', parseFloat(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Eye Blink */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Eye Blink (eyeBlinkLeft/Right)</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(twin.blendshapes.eyeBlinkLeft * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={twin.blendshapes.eyeBlinkLeft}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateBlendshape('eyeBlinkLeft', val);
                      updateBlendshape('eyeBlinkRight', val);
                    }}
                    className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Mouth Pucker */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Mouth Pucker (mouthPucker)</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(twin.blendshapes.mouthPucker * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={twin.blendshapes.mouthPucker}
                    onChange={(e) => updateBlendshape('mouthPucker', parseFloat(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-black/60 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shaders' && (
            <div className="p-5 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Subsurface Scattering & Shaders
              </h3>
              
              <div className="space-y-2">
                {shaderOptions.map((shader) => (
                  <button
                    key={shader}
                    onClick={() => setSkinShader(shader)}
                    className={`w-full p-3 rounded-2xl text-left border text-xs font-medium transition flex items-center justify-between ${
                      twin.skinShader === shader
                        ? 'bg-purple-900/40 border-purple-500 text-white shadow-md'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{shader}</span>
                    {twin.skinShader === shader && (
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
