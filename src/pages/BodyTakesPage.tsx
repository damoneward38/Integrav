import React, { useState } from 'react';
import { 
  Clapperboard, 
  Play, 
  Trash2, 
  Download, 
  Lock, 
  Plus, 
  Search, 
  Film, 
  Activity, 
  CheckCircle2,
  Filter,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCAP_IMAGE } from '../data/mockData';

export const BodyTakesPage: React.FC = () => {
  const { takes, deleteTake, setSelectedTakeId, setActiveModal, showToast } = useApp();
  const [filter, setFilter] = useState<'All' | 'Combat' | 'Stunt' | 'Dialogue'>('All');
  const [search, setSearch] = useState('');

  const filteredTakes = takes.filter((t) => {
    const matchesFilter = filter === 'All' || t.motionType === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalBytes = takes.reduce((acc, t) => acc + t.fileSizeBytes, 0);
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);

  const handleExportTake = (takeTitle: string, format: string) => {
    const textContent = `Intégrav Verified MoCap Take Data\nTake Title: ${takeTitle}\nFormat: ${format}\nRig: Demond Ward Synthetic Twin\nJoints Tracked: 33 Landmarks\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${takeTitle.replace(/\s+/g, '_')}.${format.toLowerCase()}`;
    a.click();
    showToast(`Downloaded take ${takeTitle}.${format.toLowerCase()}`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Optical Motion Capture & Takes Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {takes.length} Encrypted takes · {totalMb} MB encrypted on device hardware enclave · 60/120 FPS
          </p>
        </div>

        <button
          onClick={() => setActiveModal('record-take')}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-pink-900/20 active:scale-98 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch MoCap Recorder</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-[#120c24] border border-white/10">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['All', 'Combat', 'Stunt', 'Dialogue'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                filter === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search take name..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>
      </div>

      {/* Takes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTakes.map((take) => {
          const mb = (take.fileSizeBytes / (1024 * 1024)).toFixed(1);

          return (
            <div
              key={take.id}
              className="p-4 rounded-3xl bg-[#120c24] border border-white/10 hover:border-purple-500/40 transition flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Media Thumbnail */}
                <div 
                  onClick={() => {
                    setSelectedTakeId(take.id);
                    setActiveModal('take-detail');
                  }}
                  className="relative w-full h-44 rounded-2xl overflow-hidden bg-black mb-3 cursor-pointer"
                >
                  {take.thumbnailUrl ? (
                    <img
                      src={take.thumbnailUrl}
                      alt={take.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-950 to-black text-purple-300">
                      <Activity className="w-12 h-12 stroke-[1.2]" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    <span className="text-[10px] font-mono text-white font-bold">
                      Take #{take.takeNumber}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 text-[10px] font-mono bg-purple-600/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md">
                    {take.format}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-slate-200">
                    <span>{take.durationSeconds}s · {take.fps} FPS</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Encrypted
                    </span>
                  </div>
                </div>

                {/* Title & Metadata */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition line-clamp-1">
                    {take.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                    <span>{take.jointsTracked} Joints Tracked</span>
                    <span>·</span>
                    <span>{mb} MB Payload</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTakeId(take.id);
                    setActiveModal('take-detail');
                  }}
                  className="py-1.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Scrubber</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleExportTake(take.title, take.format)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                    title={`Download ${take.format}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteTake(take.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                    title="Delete Take"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
