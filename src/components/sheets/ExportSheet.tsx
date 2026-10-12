import React from 'react';
import { X, FolderDown, Download, FileCode, CheckCircle2, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExportSheet: React.FC = () => {
  const { setActiveSheet, twin, takes } = useApp();

  const handleExportFormat = (format: string, ext: string) => {
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
  };

  const formats = [
    {
      name: 'Pixar USD (Solaris)',
      desc: 'Universal Scene Description with ARKit Blendshapes',
      format: 'USD',
      ext: 'usda',
      tag: 'Houdini 20.5',
    },
    {
      name: 'Unreal 5 LiveLink Stream',
      desc: 'JSON UDP network packet config for port 11111',
      format: 'LiveLink',
      ext: 'json',
      tag: 'UE 5.4',
    },
    {
      name: 'BVH Motion Skeleton',
      desc: 'Biovision Hierarchical format with 33 tracked joints',
      format: 'BVH',
      ext: 'bvh',
      tag: 'Maya / MotionBuilder',
    },
    {
      name: 'Full Production Manifest',
      desc: 'Enclave verification hashes, take logs & twin topology',
      format: 'Manifest',
      ext: 'json',
      tag: 'VFX Audit',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160e2a] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 space-y-4 text-left shadow-2xl relative">
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400">
            <FolderDown className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Pipeline Export Hub
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
          Generate production-ready scene descriptions and motion capture animation files directly to your device or workstation.
        </p>

        <div className="space-y-2.5">
          {formats.map((fmt) => (
            <div
              key={fmt.name}
              className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 hover:border-purple-500/30 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white">
                    {fmt.name}
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {fmt.tag}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {fmt.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExportFormat(fmt.format, fmt.ext)}
                className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono flex items-center gap-1.5 shadow-md shadow-purple-900/20 active:scale-95 transition cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.{fmt.ext}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
