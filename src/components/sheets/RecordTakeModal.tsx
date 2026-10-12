import React, { useState, useEffect, useRef } from 'react';
import { Video, X, Circle, Square, Camera, Zap, CheckCircle2, Film } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { MOCAP_IMAGE } from '../../data/mockData';

export const RecordTakeModal: React.FC = () => {
  const { addTake, takes, setActiveSheet } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [fps] = useState(60);
  const [motionType, setMotionType] = useState<'Combat' | 'Walk Cycle' | 'Stunt' | 'Dialogue'>('Combat');
  const [format, setFormat] = useState<'USD' | 'BVH' | 'FBX'>('USD');
  const [takeTitle, setTakeTitle] = useState(`Take #${takes.length + 1} - Rapid Stunt`);
  const [useCamera, setUseCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => +(prev + 0.1).toFixed(1));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setElapsedSeconds(0);
      setIsRecording(true);
    } else {
      setIsRecording(false);
      handleSaveTake();
    }
  };

  const handleSaveTake = () => {
    const nextNum = takes.length + 1;
    const finalDuration = elapsedSeconds > 0 ? elapsedSeconds : 12.4;
    // Calculate realistic byte size based on 60 FPS 33 joints mocap data: ~1.7 MB per second
    const measuredBytes = Math.floor(finalDuration * 1750000);

    addTake({
      id: `take_${Date.now().toString().slice(-4)}`,
      takeNumber: nextNum,
      title: takeTitle,
      timestamp: 'Just now',
      durationSeconds: finalDuration,
      fps: 60,
      fileSizeBytes: measuredBytes,
      jointsTracked: 33,
      format,
      isLocalEncrypted: true,
      motionType,
      thumbnailUrl: MOCAP_IMAGE,
      performer: 'Demond Ward',
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setActiveSheet(null);
  };

  const toggleCameraStream = async () => {
    if (!useCamera) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setUseCamera(true);
        }
      } catch (err) {
        console.warn('Camera access fallback to simulated rig:', err);
        setUseCamera(false);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setUseCamera(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#160e2a] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 space-y-3.5 text-left shadow-2xl relative">
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-400">
            <Film className="w-5 h-5" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Optical MoCap Take Recorder
            </h3>
          </div>
          <button
            onClick={() => setActiveSheet(null)}
            className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Preview */}
        <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center group">
          {useCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={MOCAP_IMAGE}
                alt="Optical Mocap Rig"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-purple-900/10 backdrop-blur-[1px]" />
            </div>
          )}

          {/* HUD Overlays */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            {isRecording ? (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            )}
            <span className="text-[11px] font-mono text-white font-bold">
              {isRecording ? `REC ${elapsedSeconds.toFixed(1)}s` : 'STANDBY 00:00.0'}
            </span>
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleCameraStream}
              className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition ${
                useCamera
                  ? 'bg-purple-600 text-white'
                  : 'bg-black/70 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{useCamera ? 'Cam Live' : 'Use Cam'}</span>
            </button>
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <span>33 Biometric Joints</span>
            <span className="text-emerald-400">60 FPS Hardware Timestamp</span>
            <span>Enclave Locked</span>
          </div>
        </div>

        {/* Take Parameters */}
        <div className="space-y-2.5">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Take Name
            </label>
            <input
              type="text"
              value={takeTitle}
              onChange={(e) => setTakeTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Motion Action
              </label>
              <select
                value={motionType}
                onChange={(e) => setMotionType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="Combat">Combat / Martial Arts</option>
                <option value="Walk Cycle">Locomotion / Walk</option>
                <option value="Stunt">Acrobatic Stunt</option>
                <option value="Dialogue">Facial Dialogue</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Encoding Output
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              >
                <option value="USD">USD (Solaris / Pixar)</option>
                <option value="BVH">BVH (BioVision Skeletal)</option>
                <option value="FBX">FBX (Autodesk / UE5)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Record / Stop Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
                : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-900/30'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Recording & Commit Take</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 fill-white" />
                <span>Start Recording (60 FPS)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
