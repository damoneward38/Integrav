import React, { useState } from 'react';
import { 
  Upload, 
  FileCheck, 
  Trash2, 
  Download, 
  Image, 
  Video, 
  Mic, 
  Layers, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AssetIngestUploadPage: React.FC = () => {
  const { twin, trainTwinModel, showToast } = useApp();
  const [dragOver, setDragOver] = useState(false);

  const [ingestedFiles, setIngestedFiles] = useState<Array<{
    id: string;
    name: string;
    type: 'Photo' | 'Video' | 'Voice' | 'MoCap';
    size: string;
    status: string;
    enclaveVerified: boolean;
    timestamp: string;
  }>>([
    { id: 'f1', name: 'Demond_Ward_Front_TrueDepth_8K.png', type: 'Photo', size: '14.2 MB', status: 'FACS Solved', enclaveVerified: true, timestamp: 'Today, 11:20 AM' },
    { id: 'f2', name: 'Demond_Ward_45Deg_Lateral_Scan.png', type: 'Photo', size: '12.8 MB', status: 'FACS Solved', enclaveVerified: true, timestamp: 'Today, 11:22 AM' },
    { id: 'f3', name: 'Speech_Cadence_Interview_Take_01.wav', type: 'Voice', size: '42.5 MB', status: 'Phonemes Mapped', enclaveVerified: true, timestamp: 'Yesterday, 4:10 PM' },
    { id: 'f4', name: 'Combat_Roundhouse_Optical_Raw.bvh', type: 'MoCap', size: '24.8 MB', status: 'Rig Bound', enclaveVerified: true, timestamp: 'Yesterday, 3:45 PM' },
    { id: 'f5', name: 'Physical_Lighting_Reference_Take.mp4', type: 'Video', size: '188.4 MB', status: 'Color Graded', enclaveVerified: true, timestamp: '2 days ago' },
  ]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const mb = (f.size / (1024 * 1024)).toFixed(1);
      let cat: 'Photo' | 'Video' | 'Voice' | 'MoCap' = 'Photo';
      if (f.name.endsWith('.mp4') || f.name.endsWith('.mov')) cat = 'Video';
      else if (f.name.endsWith('.wav') || f.name.endsWith('.mp3')) cat = 'Voice';
      else if (f.name.endsWith('.bvh') || f.name.endsWith('.fbx')) cat = 'MoCap';

      const newFile = {
        id: `f_${Date.now()}_${i}`,
        name: f.name,
        type: cat,
        size: `${mb} MB`,
        status: 'Ingested into Enclave',
        enclaveVerified: true,
        timestamp: 'Just now',
      };
      setIngestedFiles((prev) => [newFile, ...prev]);
    }

    trainTwinModel(0.4);
    showToast(`Successfully ingested ${files.length} production asset files into Enclave vault`, 'success');
  };

  const handleDelete = (id: string) => {
    setIngestedFiles((prev) => prev.filter((f) => f.id !== id));
    showToast('File purged from local storage', 'info');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Production Asset Ingest & Training Upload
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Upload className="w-3 h-3 text-purple-400" />
              Vault Ingest
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload multi-angle reference photos, raw video takes, voice recordings, and motion data to power your digital clone
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>FIPS 140-3 Hardware Encrypted</span>
          </span>
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`p-10 rounded-3xl border-2 border-dashed transition text-center relative cursor-pointer ${
          dragOver ? 'border-purple-400 bg-purple-950/30 shadow-2xl shadow-purple-900/30' : 'border-white/15 bg-[#120c24] hover:border-purple-500/50'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-white">
          Drop Production Files & Training Data Here
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Supports PNG/JPG photos, MP4/MOV videos, WAV/MP3 speech, and BVH/FBX/USD mocap files. All uploads are encrypted with your device key.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] font-mono text-purple-300">
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">Multi-Angle Photos</span>
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">Real Video Footage</span>
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">Voice Master Tracks</span>
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">Skeletal MoCap Files</span>
        </div>
      </div>

      {/* Ingested Assets Table */}
      <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Ingested Enclave Assets ({ingestedFiles.length})
          </h2>
          <span className="text-xs font-mono text-slate-400">Total: 282.7 MB Ingested</span>
        </div>

        <div className="space-y-2">
          {ingestedFiles.map((file) => (
            <div
              key={file.id}
              className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-4 hover:border-purple-500/30 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 shrink-0">
                  {file.type === 'Photo' && <Image className="w-4 h-4" />}
                  {file.type === 'Video' && <Video className="w-4 h-4" />}
                  {file.type === 'Voice' && <Mic className="w-4 h-4" />}
                  {file.type === 'MoCap' && <Layers className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                    <span>{file.type}</span>
                    <span>·</span>
                    <span>{file.size}</span>
                    <span>·</span>
                    <span>{file.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {file.status}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(file.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                  title="Purge File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
