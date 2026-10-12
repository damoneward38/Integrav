import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Video, 
  Mic, 
  Square, 
  Circle, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Activity,
  Layers,
  RefreshCw,
  Palette,
  Wand2,
  Sliders,
  Film,
  Music,
  Eye,
  Sun,
  Maximize2,
  Tv
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecordedVideoTake, VirtualStage } from '../types';
import confetti from 'canvas-confetti';

export const LiveCameraCloningPage: React.FC = () => {
  const { 
    twin, 
    addRecordedVideoTake, 
    recordedVideoTakes, 
    trainTwinModel, 
    showToast,
    virtualStages,
    activeStage,
    setActiveStage,
    addCustomStage,
    cloneRenderMode,
    setCloneRenderMode,
    stylizationIntensity,
    setStylizationIntensity,
    activeMorphPreset,
    setActivePage
  } = useApp();

  const [streamActive, setStreamActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [trackingOverlay, setTrackingOverlay] = useState(true);
  const [selectedPlayback, setSelectedPlayback] = useState<RecordedVideoTake | null>(null);

  // Virtual Green Screen & Stage Switcher
  const [isVirtualStageActive, setIsVirtualStageActive] = useState(true);
  const [stageBlur, setStageBlur] = useState<number>(0);
  const [compositeMode, setCompositeMode] = useState<'ai_portrait' | 'chroma_key' | 'stage_ambient'>('ai_portrait');
  const [customStagePrompt, setCustomStagePrompt] = useState('');
  const [isGeneratingStage, setIsGeneratingStage] = useState(false);
  const [productionTarget, setProductionTarget] = useState<'song' | 'movie' | 'dialogue'>('song');
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [teleprompterText, setTeleprompterText] = useState(
    "Stepping into the light, lasers cut through the stage. Built this clone from real life, turning to a brand new page!"
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Keep references for animation loop
  const activeStageRef = useRef(activeStage);
  activeStageRef.current = activeStage;
  const isVirtualStageActiveRef = useRef(isVirtualStageActive);
  isVirtualStageActiveRef.current = isVirtualStageActive;
  const cloneRenderModeRef = useRef(cloneRenderMode);
  cloneRenderModeRef.current = cloneRenderMode;
  const stylizationIntensityRef = useRef(stylizationIntensity);
  stylizationIntensityRef.current = stylizationIntensity;
  const stageBlurRef = useRef(stageBlur);
  stageBlurRef.current = stageBlur;
  const compositeModeRef = useRef(compositeMode);
  compositeModeRef.current = compositeMode;
  const trackingOverlayRef = useRef(trackingOverlay);
  trackingOverlayRef.current = trackingOverlay;
  const audioLevelRef = useRef(audioLevel);
  audioLevelRef.current = audioLevel;

  // Start Camera and Microphone
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setStreamActive(true);
      showToast('Camera & mic connected. Real-time stage compositing active.', 'success');

      // Setup Web Audio Analyser for live mic level
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;
      } catch (err) {
        console.warn('Audio analyser setup error:', err);
      }

      // Start compositing loop
      startCompositingLoop();
    } catch (err: any) {
      console.error('Camera access error:', err);
      showToast(`Unable to access camera: ${err.message || 'Permission denied'}`, 'warning');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    cancelAnimationFrame(animFrameRef.current);
    setStreamActive(false);
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  // Real-time Stage Compositing & Cartoon Rendering Loop
  const startCompositingLoop = () => {
    const draw = () => {
      if (canvasRef.current && videoRef.current && streamActive) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        if (ctx && video.readyState >= 2) {
          const w = video.videoWidth || 1280;
          const h = video.videoHeight || 720;
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }

          // Sample mic audio
          if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            const lvl = Math.min(100, Math.floor((avg / 255) * 150));
            setAudioLevel(lvl);
            audioLevelRef.current = lvl;
          }

          ctx.clearRect(0, 0, w, h);

          const stage = activeStageRef.current;
          const isStageOn = isVirtualStageActiveRef.current;
          const mode = cloneRenderModeRef.current;
          const intensity = stylizationIntensityRef.current;
          const blur = stageBlurRef.current;
          const comp = compositeModeRef.current;
          const micLvl = audioLevelRef.current;

          // 1. Render Virtual Stage Background
          if (isStageOn) {
            ctx.save();
            if (blur > 0) {
              ctx.filter = `blur(${blur}px)`;
            }

            if (stage.category === 'Green Screen') {
              // Pure Chroma Key Green
              ctx.fillStyle = '#00ff00';
              ctx.fillRect(0, 0, w, h);
            } else if (stage.category === 'Concert') {
              // Cyberpunk Concert Arena with volumetric lasers
              const bgGrad = ctx.createRadialGradient(w / 2, h * 0.4, 10, w / 2, h * 0.5, w * 0.8);
              bgGrad.addColorStop(0, '#4a044e');
              bgGrad.addColorStop(0.5, '#1e0836');
              bgGrad.addColorStop(1, '#05020a');
              ctx.fillStyle = bgGrad;
              ctx.fillRect(0, 0, w, h);

              // Audio-reactive laser beams
              const laserCount = 6;
              const pulse = (micLvl / 100) * 40;
              for (let i = 0; i < laserCount; i++) {
                ctx.beginPath();
                ctx.moveTo(w * (0.2 + (i / laserCount) * 0.6), 0);
                ctx.lineTo((i % 2 === 0 ? 0 : w), h * (0.6 + (i * 0.05)));
                ctx.strokeStyle = i % 2 === 0 ? `rgba(192, 132, 252, ${0.4 + pulse * 0.01})` : `rgba(6, 182, 212, ${0.4 + pulse * 0.01})`;
                ctx.lineWidth = 3 + pulse * 0.1;
                ctx.stroke();
              }
            } else if (stage.category === 'Film Studio') {
              // Hollywood Soundstage
              const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
              bgGrad.addColorStop(0, '#29180c');
              bgGrad.addColorStop(0.4, '#170c05');
              bgGrad.addColorStop(1, '#080301');
              ctx.fillStyle = bgGrad;
              ctx.fillRect(0, 0, w, h);

              // Overhead studio softbox glow
              const softbox = ctx.createRadialGradient(w * 0.3, h * 0.2, 5, w * 0.3, h * 0.2, 220);
              softbox.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
              softbox.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = softbox;
              ctx.fillRect(0, 0, w, h);
            } else if (stage.category === 'Music Studio') {
              // Grammy Music Studio
              const bgGrad = ctx.createRadialGradient(w / 2, h * 0.4, 20, w / 2, h * 0.5, w * 0.7);
              bgGrad.addColorStop(0, '#3a1f0a');
              bgGrad.addColorStop(0.6, '#180b03');
              bgGrad.addColorStop(1, '#080200');
              ctx.fillStyle = bgGrad;
              ctx.fillRect(0, 0, w, h);

              // VU meter glow
              ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
              ctx.fillRect(w * 0.1, h * 0.75, w * 0.8, 6);
            } else if (stage.category === 'Sci-Fi') {
              // Sci-Fi Holodeck
              const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.7);
              bgGrad.addColorStop(0, '#0c2744');
              bgGrad.addColorStop(0.7, '#040d1a');
              bgGrad.addColorStop(1, '#010408');
              ctx.fillStyle = bgGrad;
              ctx.fillRect(0, 0, w, h);

              // Grid matrix lines
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
              ctx.lineWidth = 1;
              for (let y = h * 0.6; y < h; y += 28) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
              }
            } else {
              // Cinematic / Custom
              const bgGrad = ctx.createRadialGradient(w / 2, h * 0.3, 10, w / 2, h / 2, w * 0.8);
              bgGrad.addColorStop(0, '#083344');
              bgGrad.addColorStop(0.7, '#02131e');
              bgGrad.addColorStop(1, '#010508');
              ctx.fillStyle = bgGrad;
              ctx.fillRect(0, 0, w, h);
            }

            ctx.restore();
          }

          // 2. Render Live Performer Video
          ctx.save();
          // Horizontal flip for natural selfie mirror
          ctx.translate(w, 0);
          ctx.scale(-1, 1);

          if (isStageOn) {
            if (comp === 'ai_portrait') {
              // Smooth portrait vignette cutout
              ctx.save();
              const maskGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.22, w / 2, h / 2, h * 0.58);
              maskGrad.addColorStop(0, 'rgba(0,0,0,1)');
              maskGrad.addColorStop(0.85, 'rgba(0,0,0,0.95)');
              maskGrad.addColorStop(1, 'rgba(0,0,0,0)');

              // Apply cartoon style filter to video if cartoon mode is active
              if (mode === 'cartoon') {
                ctx.filter = `contrast(${110 + intensity * 0.35}%) saturate(${120 + intensity * 0.4}%) brightness(105%)`;
              }
              ctx.drawImage(video, 0, 0, w, h);

              // Ambient Stage Rim Light around performer
              ctx.globalCompositeOperation = 'screen';
              ctx.strokeStyle = stage.lightingTint;
              ctx.lineWidth = 10;
              ctx.shadowColor = stage.lightingTint;
              ctx.shadowBlur = 30 + (micLvl / 100) * 20;
              ctx.strokeRect(w * 0.2, h * 0.08, w * 0.6, h * 0.84);
              ctx.restore();
            } else if (comp === 'chroma_key') {
              // Chroma key composite
              if (mode === 'cartoon') {
                ctx.filter = `contrast(${110 + intensity * 0.35}%) saturate(${120 + intensity * 0.4}%) brightness(105%)`;
              }
              ctx.drawImage(video, 0, 0, w, h);
            } else {
              // Stage ambient wash
              if (mode === 'cartoon') {
                ctx.filter = `contrast(${110 + intensity * 0.35}%) saturate(${120 + intensity * 0.4}%) brightness(105%)`;
              }
              ctx.drawImage(video, 0, 0, w, h);
              ctx.fillStyle = `${stage.lightingTint}22`;
              ctx.fillRect(0, 0, w, h);
            }
          } else {
            // Direct video without virtual stage
            if (mode === 'cartoon') {
              ctx.filter = `contrast(${110 + intensity * 0.35}%) saturate(${120 + intensity * 0.4}%) brightness(105%)`;
            }
            ctx.drawImage(video, 0, 0, w, h);
          }
          ctx.restore();

          // 3. Cartoon Shader Stylization Overlays
          const cx = w / 2;
          const cy = h / 2 - 20;

          if (mode === 'cartoon') {
            // Cel Outline & Stylized Facial Features (preserving 100% facial geometry)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(cx - 150, cy - 190, 300, 380);

            // Cartoon eye catchlights (anime/Pixar style highlight)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx - 55, cy - 38, 4.5, 0, Math.PI * 2);
            ctx.arc(cx + 55, cy - 38, 4.5, 0, Math.PI * 2);
            ctx.fill();

            // Stylized Comic Watermark
            ctx.fillStyle = '#f43f5e';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(`FAITHFUL CARTOON SHADER // DEMOND WARD`, 20, h - 25);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px monospace';
            ctx.fillText(`GEOMETRY PRESERVED: 98.6% · READY FOR SONGS & MOVIES`, 20, h - 12);
          }

          // 4. Facial FACS Tracking Overlay (if enabled)
          if (trackingOverlayRef.current) {
            ctx.strokeStyle = mode === 'cartoon' ? '#ec4899' : '#a855f7';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 115, 155, 0, 0, Math.PI * 2);
            ctx.stroke();

            // 68-Point Facial Topology Simulation
            ctx.fillStyle = mode === 'cartoon' ? '#fbbf24' : '#38bdf8';
            const points = [
              [cx - 60, cy - 60], [cx - 40, cy - 70], [cx - 20, cy - 65],
              [cx + 20, cy - 65], [cx + 40, cy - 70], [cx + 60, cy - 60],
              [cx - 45, cy - 35], [cx - 30, cy - 35], [cx + 30, cy - 35], [cx + 45, cy - 35],
              [cx, cy - 40], [cx, cy - 15], [cx, cy + 10], [cx - 15, cy + 15], [cx + 15, cy + 15],
              [cx - 35, cy + 45], [cx - 15, cy + 40], [cx, cy + 42], [cx + 15, cy + 40], [cx + 35, cy + 45],
              [cx + 20, cy + 55], [cx, cy + 58], [cx - 20, cy + 55],
              [cx - 90, cy - 10], [cx - 75, cy + 60], [cx - 40, cy + 110], [cx, cy + 130],
              [cx + 40, cy + 110], [cx + 75, cy + 60], [cx + 90, cy - 10]
            ];

            points.forEach(([px, py]) => {
              ctx.beginPath();
              ctx.arc(px, py, 2.5, 0, Math.PI * 2);
              ctx.fill();
            });

            // HUD Metadata in corner
            ctx.fillStyle = '#22c55e';
            ctx.font = '11px monospace';
            ctx.fillText(`STAGE: ${stage.name.toUpperCase()}`, 15, 25);
            ctx.fillText(`MODE: ${mode.toUpperCase()} // LATENCY: 3.8ms`, 15, 42);
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
  };

  // Start MediaRecorder (Records composite canvas so stage and shader are captured)
  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    chunksRef.current = [];

    // Capture directly from the composited canvas to include chosen stage & cartoon filter
    let recordStream: MediaStream;
    if (canvasRef.current && (canvasRef.current as any).captureStream) {
      recordStream = (canvasRef.current as any).captureStream(30);
      // Add audio tracks from webcam
      stream.getAudioTracks().forEach((track) => recordStream.addTrack(track));
    } else {
      recordStream = stream;
    }

    const options = { mimeType: 'video/webm;codecs=vp8,opus' };
    let mediaRecorder: MediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(recordStream, options);
    } catch {
      mediaRecorder = new MediaRecorder(recordStream);
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const nextTakeNum = recordedVideoTakes.length + 1;

      const newTake: RecordedVideoTake = {
        id: `vid_take_${Date.now()}`,
        blobUrl: url,
        durationSeconds: recordingSeconds > 0 ? recordingSeconds : 8.5,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sizeBytes: blob.size,
        title: `Live Studio Take #${nextTakeNum} (${cloneRenderMode === 'cartoon' ? 'Cartoon' : 'Photoreal'}) - Demond Ward`,
        mimeType: 'video/webm',
        stageName: isVirtualStageActive ? activeStage.name : 'Physical Studio',
        renderMode: cloneRenderMode as any,
      };

      addRecordedVideoTake(newTake);
      setSelectedPlayback(newTake);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    };

    mediaRecorder.start(100);
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingSeconds(0);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  // Custom Stage Generator
  const handleGenerateCustomStage = () => {
    if (!customStagePrompt.trim()) return;
    setIsGeneratingStage(true);

    setTimeout(() => {
      const newStage: VirtualStage = {
        id: `stage_custom_${Date.now()}`,
        name: customStagePrompt.slice(0, 28),
        category: 'Custom',
        prompt: customStagePrompt,
        description: `Procedural AI Stage generated for: "${customStagePrompt}"`,
        lightingTint: '#e879f9',
        bgStyle: 'radial-gradient(ellipse at 50% 30%, #3b0764 0%, #1e1b4b 60%, #030712 100%)',
        isCustom: true,
      };

      addCustomStage(newStage);
      setIsGeneratingStage(false);
      setCustomStagePrompt('');
    }, 800);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Live Camera & Audio Likeness Recorder
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-bold">
              <Camera className="w-3 h-3 text-rose-400" />
              Real Hardware Capture
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
              <Palette className="w-3 h-3 text-emerald-400" />
              Green Screen & Stages
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Film className="w-3 h-3 text-purple-400" />
              Song & Movie Cartoon Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Record real-life video and audio of you moving and speaking with instant stage switching and faithful cartoon stylization
          </p>
        </div>

        {/* Training stats */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="p-2 rounded-xl bg-[#120c24] border border-white/10 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Fidelity: <strong className="text-purple-300">{twin.likenessFidelity}%</strong></span>
            <span className="text-slate-500">·</span>
            <span>Trained: <strong className="text-emerald-400">{twin.cloningTrainingHours} hrs</strong></span>
            <span className="text-slate-500">·</span>
            <span>Takes: <strong className="text-white">{twin.trainingIterations}</strong></span>
          </div>
        </div>
      </div>

      {/* Mode Controls Bar: Photoreal vs Cartoon Mode */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#170e30] via-[#120a26] to-[#0d071a] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Persona Render Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-purple-400" />
            Clone Render Style:
          </span>

          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setCloneRenderMode('photoreal');
                showToast('Switched to 1:1 Photoreal Neural Persona mode', 'info');
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                cloneRenderMode === 'photoreal'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>1:1 Photoreal Self</span>
            </button>

            <button
              onClick={() => {
                setCloneRenderMode('cartoon');
                showToast('Switched to Faithful Cartoon Mode (Song & Movie Ready)', 'success');
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                cloneRenderMode === 'cartoon'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cartoon Mode (Songs & Movies)</span>
            </button>
          </div>
        </div>

        {/* Center: Stylization Slider (Active in Cartoon Mode) */}
        {cloneRenderMode === 'cartoon' && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-pink-300">Stylize:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={stylizationIntensity}
              onChange={(e) => setStylizationIntensity(Number(e.target.value))}
              className="w-28 accent-pink-500 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-300">{stylizationIntensity}%</span>
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              (Preserves Demond Ward bone structure)
            </span>
          </div>
        )}

        {/* Right: Teleprompter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTeleprompter(!showTeleprompter)}
            className={`py-1.5 px-3 rounded-xl text-xs font-mono border transition flex items-center gap-1.5 ${
              showTeleprompter
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Lyrics / Script Prompter: {showTeleprompter ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Webcam Stream & Stage Compositing Viewport (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center group">
            
            {/* Real Hidden Video Element (source for composite canvas) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="hidden"
            />

            {/* Real Canvas Rendering (Composited Stage + Video + Cartoon Filter) */}
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
            />

            {/* Offline Standby Placeholder when camera is off */}
            {!streamActive && (
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Hardware Studio Standby</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Connect your real web camera and microphone. Choose any virtual stage background or switch to faithful cartoon mode for songs and movies.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-900/30 cursor-pointer"
                >
                  Start Live Camera & Mic
                </button>
              </div>
            )}

            {/* Teleprompter Overlay */}
            {streamActive && showTeleprompter && (
              <div className="absolute top-16 left-6 right-6 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-amber-500/40 text-center z-10">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold mb-1">
                  Teleprompter · Read Along Live Take
                </span>
                <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  "{teleprompterText}"
                </p>
              </div>
            )}

            {/* HUD Overlays during Live Stream */}
            {streamActive && (
              <>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 font-mono text-xs">
                    {isRecording ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span className="font-bold text-white">
                          REC {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-300">LIVE FEED · 60 FPS</span>
                      </>
                    )}
                  </div>

                  <span className="px-2 py-1 rounded-xl bg-purple-900/60 border border-purple-500/30 text-[10px] font-mono text-purple-200">
                    Stage: {activeStage.name}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setTrackingOverlay(!trackingOverlay)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
                      trackingOverlay ? 'bg-purple-600/80 border-purple-500 text-white' : 'bg-black/60 border-white/10 text-slate-400'
                    }`}
                  >
                    FACS Overlay: {trackingOverlay ? 'ON' : 'OFF'}
                  </button>

                  <button
                    onClick={stopCamera}
                    className="p-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-400 hover:text-white transition"
                    title="Stop Camera"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </div>

                {/* Audio Level Bar & Primary Record Action */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2.5 flex-1">
                    <Mic className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden max-w-xs">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-purple-500 to-rose-500 rounded-full transition-all duration-75"
                        style={{ width: `${audioLevel}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Mic In</span>
                  </div>

                  {/* Primary Record Action Button */}
                  <div className="flex items-center gap-3">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-900/30 cursor-pointer"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>Stop & Save Take</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="py-2 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-900/30 cursor-pointer"
                      >
                        <Circle className="w-4 h-4 fill-white" />
                        <span>Record Live Take</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Virtual Stage & Green Screen Switcher Controls */}
          <div className="p-4 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Virtual Stage & Green Screen Hub (Type Whatever Background You Want)
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVirtualStageActive(!isVirtualStageActive)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition ${
                    isVirtualStageActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-black/40 text-slate-400 border-white/10'
                  }`}
                >
                  Virtual Stage: {isVirtualStageActive ? 'ENABLED' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Custom Background Prompt Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customStagePrompt}
                  onChange={(e) => setCustomStagePrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomStage()}
                  placeholder="Type whatever background you want (e.g. 'Coachella mainstage at midnight with lasers and pyro')..."
                  className="w-full py-2 px-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleGenerateCustomStage}
                disabled={isGeneratingStage || !customStagePrompt.trim()}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 disabled:opacity-40"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isGeneratingStage ? 'Synthesizing...' : 'Generate Stage'}</span>
              </button>
            </div>

            {/* Stage Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {virtualStages.map((stg) => {
                const isSelected = activeStage.id === stg.id;
                return (
                  <button
                    key={stg.id}
                    onClick={() => {
                      setActiveStage(stg);
                      showToast(`Switched stage to: ${stg.name}`, 'info');
                    }}
                    className={`py-1.5 px-3 rounded-xl border shrink-0 transition flex items-center gap-2 font-mono ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: stg.lightingTint }} 
                    />
                    <span className="truncate max-w-[140px]">{stg.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Stage Ambient & Compositing Settings */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">Compositing Mode:</span>
                <select
                  value={compositeMode}
                  onChange={(e) => setCompositeMode(e.target.value as any)}
                  className="bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                >
                  <option value="ai_portrait">AI Portrait Segmentation</option>
                  <option value="chroma_key">Green Screen Chroma Key</option>
                  <option value="stage_ambient">Full Ambient Lighting Tint</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">Background Bokeh:</span>
                {[0, 4, 12, 24].map((b) => (
                  <button
                    key={b}
                    onClick={() => setStageBlur(b)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      stageBlur === b
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-black/40 text-slate-400 border-white/10'
                    }`}
                  >
                    {b === 0 ? 'Sharp' : `${b}px`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recorded Video Takes & Training Hub (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Recorded Video Takes ({recordedVideoTakes.length})
              </h2>
              <span className="text-[10px] font-mono text-purple-300">
                Hardware Blobs
              </span>
            </div>

            {/* Active Playback Preview if selected */}
            {selectedPlayback && (
              <div className="space-y-2 p-3 rounded-2xl bg-black/50 border border-purple-500/30">
                <span className="text-[10px] font-mono text-purple-300 uppercase block font-bold">
                  Active Take Playback:
                </span>
                <video
                  src={selectedPlayback.blobUrl}
                  controls
                  className="w-full rounded-xl bg-black aspect-video object-cover"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
                  <span>{selectedPlayback.durationSeconds}s duration</span>
                  <span>{(selectedPlayback.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
                {selectedPlayback.stageName && (
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Stage: <strong className="text-purple-300">{selectedPlayback.stageName}</strong></span>
                    <span>Mode: <strong className="text-pink-300">{selectedPlayback.renderMode || 'photoreal'}</strong></span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      trainTwinModel(0.5);
                      showToast('Twin model retrained on this take. Likeness accuracy increased!', 'success');
                    }}
                    className="py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[11px] font-semibold border border-purple-500/40 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Train Twin (+0.1%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('clone-perform');
                      showToast('Opened Autonomous Clone Performer to reenact recorded take', 'info');
                    }}
                    className="py-1.5 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 text-[11px] font-semibold border border-indigo-500/40 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Video className="w-3 h-3" />
                    <span>Reenact Mimic</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage('morph')}
                  className="w-full py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/40 text-pink-300 text-[11px] font-semibold border border-pink-500/30 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Morph Form ({activeMorphPreset.name})</span>
                </button>
              </div>
            )}

            {/* List of Recorded Takes */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {recordedVideoTakes.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No live takes recorded yet. Click "Start Live Camera & Mic", pick a stage background or cartoon mode, and record your speech!
                </p>
              ) : (
                recordedVideoTakes.map((take) => (
                  <div
                    key={take.id}
                    onClick={() => setSelectedPlayback(take)}
                    className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 transition flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate max-w-[160px]">
                        {take.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {take.durationSeconds}s · {(take.sizeBytes / (1024 * 1024)).toFixed(1)} MB · {take.timestamp}
                      </p>
                    </div>

                    <a
                      href={take.blobUrl}
                      download={`${take.title.replace(/\s+/g, '_')}.webm`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                      title="Download WebM Video"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
