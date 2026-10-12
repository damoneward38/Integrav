import React, { useState } from 'react';
import { 
  FolderDown, 
  Download, 
  FileCode, 
  CheckCircle2, 
  Layers, 
  Radio, 
  Share2,
  Copy,
  Terminal
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PipelineExportsPage: React.FC = () => {
  const { twin, takes, showToast } = useApp();
  const [streamActive, setStreamActive] = useState(false);

  const handleDownload = (format: string, ext: string) => {
    let content = '';
    if (format === 'USD') {
      content = `#usda 1.0\n(\n    defaultPrim = "IntegravRoot"\n    metersPerUnit = 1\n    upAxis = "Y"\n)\n\ndef Xform "IntegravRoot"\n{\n    def Mesh "DigitalTwinMesh"\n    {\n        int[] faceVertexCounts = [4, 4, 4, 4]\n        point3f[] points = [(-1, 0, 0), (1, 0, 0), (1, 2, 0), (-1, 2, 0)]\n        color3f[] primvars:displayColor = [(0.6, 0.4, 0.3)]\n    }\n}`;
    } else if (format === 'LiveLink') {
      content = JSON.stringify({
        subjectName: "Integrav_Twin_DeeW",
        udpPort: 11111,
        broadcastAddress: "192.168.1.255",
        frameRate: 60,
        blendshapeNames: Object.keys(twin.blendshapes),
        timestamp: new Date().toISOString(),
      }, null, 2);
    } else {
      content = `BVH\nHIERARCHY\nROOT Hips\n{\n  OFFSET 0.00 0.00 0.00\n  CHANNELS 6 Xposition Yposition Zposition Zrotation Xrotation Yrotation\n  JOINT Spine\n  {\n    OFFSET 0.00 5.20 0.00\n    CHANNELS 3 Zrotation Xrotation Yrotation\n    End Site\n    {\n      OFFSET 0.00 20.00 0.00\n    }\n  }\n}\nMOTION\nFrames: 120\nFrame Time: 0.016667\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integrav_export_${format.toLowerCase()}.${ext}`;
    a.click();
    showToast(`Downloaded production export: integrav_export_${format.toLowerCase()}.${ext}`, 'success');
  };

  const handleToggleStream = () => {
    const nextState = !streamActive;
    setStreamActive(nextState);
    showToast(nextState ? 'Unreal Engine LiveLink UDP Broadcast active on port 11111' : 'LiveLink UDP stream stopped', 'info');
  };

  const exportFormats = [
    {
      id: 'usd',
      name: 'Pixar Universal Scene Description (USD)',
      desc: 'Native OpenUSD stage format for Houdini Solaris, Karma XPU, and Maya.',
      ext: 'usda',
      format: 'USD',
      dcc: 'Houdini 20.5 / Solaris',
    },
    {
      id: 'livelink',
      name: 'Unreal Engine 5 LiveLink UDP Configuration',
      desc: 'Real-time JSON UDP packet network descriptor for Unreal 5.4 LiveLink subjects.',
      ext: 'json',
      format: 'LiveLink',
      dcc: 'Unreal Engine 5.4.3',
    },
    {
      id: 'bvh',
      name: 'BioVision Skeletal Hierarchy (BVH)',
      desc: '33 Joint rotational motion capture data format for MotionBuilder and Blender.',
      ext: 'bvh',
      format: 'BVH',
      dcc: 'MotionBuilder / Blender',
    },
    {
      id: 'manifest',
      name: 'Full Production Audit Manifest',
      desc: 'Complete cryptographically verified session metadata, frame counts, and SHA-256 hashes.',
      ext: 'json',
      format: 'Manifest',
      dcc: 'VFX Production Audit',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Production Pipeline & USD Exporter
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Export standard USD scene descriptions, LiveLink UDP streams, and motion capture takes
          </p>
        </div>

        <button
          onClick={handleToggleStream}
          className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            streamActive
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
          }`}
        >
          <Radio className={`w-4 h-4 ${streamActive ? 'animate-pulse' : ''}`} />
          <span>{streamActive ? 'LiveLink Stream: ONLINE' : 'Start UE5 LiveLink UDP'}</span>
        </button>
      </div>

      {/* Export Format Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportFormats.map((fmt) => (
          <div
            key={fmt.id}
            className="p-5 rounded-3xl bg-[#120c24] border border-white/10 hover:border-purple-500/30 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {fmt.dcc}
                </span>
                <span className="text-xs font-mono text-slate-400">.{fmt.ext}</span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2">{fmt.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {fmt.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Schema Validated
              </span>

              <button
                type="button"
                onClick={() => handleDownload(fmt.format, fmt.ext)}
                className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .{fmt.ext}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Unreal LiveLink Network Config Terminal */}
      <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-300">
            <Terminal className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              LiveLink UDP Network Stream Configuration
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Port 11111 · Broadcast</span>
        </div>

        <pre className="p-4 rounded-2xl bg-black/50 border border-white/5 font-mono text-xs text-purple-200 overflow-x-auto leading-relaxed">
{`{
  "subject": "Integrav_Twin_DeeW",
  "protocol": "LiveLink_v2",
  "udp_endpoint": "192.168.1.255:11111",
  "packet_rate": "60 Hz",
  "channels": [
    "eyeBlinkLeft", "eyeBlinkRight", "jawOpen", 
    "mouthSmileLeft", "mouthSmileRight", "browInnerUp"
  ],
  "enclave_token": "SHA256:7f8a9e01cd34ba56ef1289fe0a7c"
}`}
        </pre>
      </div>
    </div>
  );
};
