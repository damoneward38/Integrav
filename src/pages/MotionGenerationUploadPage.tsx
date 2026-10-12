import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Zap, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  FileCode, 
  RotateCcw,
  Sliders,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GeneratedMotionClip } from '../types';

export const MotionGenerationUploadPage: React.FC = () => {
  const { addGeneratedMotionClip, addTake, showToast } = useApp();

  const [prompt, setPrompt] = useState('Dodge to the right, execute a spinning back roundhouse kick, and return to balanced combat ready stance');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(120);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; type: string }>>([
    { name: 'Take_042_SpinningKick.bvh', size: '24.8 MB', type: 'BVH Skeletal MoCap' },
    { name: 'Stunt_Double_Dodge_Reference.mp4', size: '68.2 MB', type: 'Video Reference' },
  ]);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const jointsGroupRef = useRef<THREE.Group | null>(null);

  // 3D Skeleton Visualizer using Three.js
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0818);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(6, 12, 0xa855f7, 0x2e1f4d);
    gridHelper.position.y = -0.8;
    scene.add(gridHelper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xa855f7, 3, 10);
    pointLight.position.set(2, 3, 2);
    scene.add(pointLight);

    // 33-Joint Skeleton Rig
    const skeletonGroup = new THREE.Group();
    scene.add(skeletonGroup);
    jointsGroupRef.current = skeletonGroup;

    // Joint spheres
    const jointSpheres: THREE.Mesh[] = [];
    const sphereGeom = new THREE.SphereGeometry(0.045, 12, 12);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.2 });

    for (let i = 0; i < 20; i++) {
      const jointMesh = new THREE.Mesh(sphereGeom, i === 0 ? headMat : sphereMat);
      skeletonGroup.add(jointMesh);
      jointSpheres.push(jointMesh);
    }

    // Bone lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0xa855f7, linewidth: 2 });
    const lineGeom = new THREE.BufferGeometry();
    const linePositions = new Float32Array(20 * 3 * 2);
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeom, lineMat);
    skeletonGroup.add(linesMesh);

    // Drag Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let rotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      rotY += deltaX * 0.008;
      skeletonGroup.rotation.y = rotY;
    };
    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    let frame = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isPlaying) {
        frame = (frame + 1) % 120;
        setCurrentFrame(frame);
      }

      // Procedural martial arts & breathing motion equation
      const t = (frame / 120) * Math.PI * 2;
      const kickT = Math.sin(t);
      const spineSway = Math.cos(t * 2) * 0.05;

      // Update 20 primary skeletal keyframe coordinates
      const positions: [number, number, number][] = [
        [0, 0.95 + spineSway, 0], // 0: Head
        [0, 0.75 + spineSway, 0], // 1: Neck
        [0, 0.45 + spineSway, 0], // 2: Chest
        [0, 0.15 + spineSway, 0], // 3: Pelvis
        // Left Arm
        [-0.25, 0.7 + spineSway, 0.1 * kickT], // 4: Left Shoulder
        [-0.45, 0.45 + spineSway, 0.2 * kickT], // 5: Left Elbow
        [-0.55, 0.25 + spineSway, 0.3 * kickT], // 6: Left Wrist
        // Right Arm (Punch / Guard)
        [0.25, 0.7 + spineSway, -0.1 * kickT], // 7: Right Shoulder
        [0.45, 0.55 + spineSway, 0.4 * Math.cos(t)], // 8: Right Elbow
        [0.6, 0.65 + spineSway, 0.7 * Math.cos(t)], // 9: Right Wrist (Strike)
        // Left Leg (Plant)
        [-0.18, 0.1, 0], // 10: Left Hip
        [-0.2, -0.3, 0.1], // 11: Left Knee
        [-0.2, -0.75, 0.15], // 12: Left Ankle
        // Right Leg (Roundhouse Kick Arc!)
        [0.18, 0.1, 0], // 13: Right Hip
        [0.3 + 0.4 * Math.sin(t), 0.1 + 0.5 * Math.max(0, Math.sin(t)), 0.5 * Math.sin(t)], // 14: Right Knee
        [0.4 + 0.8 * Math.sin(t), 0.2 + 0.8 * Math.max(0, Math.sin(t)), 0.9 * Math.sin(t)], // 15: Right Ankle
      ];

      // Update spheres
      for (let i = 0; i < positions.length && i < jointSpheres.length; i++) {
        jointSpheres[i].position.set(positions[i][0], positions[i][1], positions[i][2]);
      }

      // Update bones
      const posAttr = lineGeom.attributes.position;
      const bones = [
        [0, 1], [1, 2], [2, 3], // Spine
        [1, 4], [4, 5], [5, 6], // Left Arm
        [1, 7], [7, 8], [8, 9], // Right Arm
        [3, 10], [10, 11], [11, 12], // Left Leg
        [3, 13], [13, 14], [14, 15], // Right Leg
      ];

      let ptr = 0;
      bones.forEach(([p1, p2]) => {
        if (p1 < positions.length && p2 < positions.length) {
          posAttr.setXYZ(ptr++, positions[p1][0], positions[p1][1], positions[p1][2]);
          posAttr.setXYZ(ptr++, positions[p2][0], positions[p2][1], positions[p2][2]);
        }
      });
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Text-to-Motion Generation Trigger
  const handleGenerateMotion = () => {
    setIsGenerating(true);
    showToast(`AI generating 3D skeletal motion: "${prompt.slice(0, 35)}..."`, 'info');

    setTimeout(() => {
      setIsGenerating(false);
      const newClip: GeneratedMotionClip = {
        id: `motion_${Date.now()}`,
        prompt,
        durationSeconds: 4.0,
        fps: 60,
        motionType: 'Dynamic Combat',
        jointFrames: [],
        timestamp: 'Just now',
      };
      addGeneratedMotionClip(newClip);
      showToast('Procedural 3D motion synthesized and loaded into 3D viewport!', 'success');
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const mb = (f.size / (1024 * 1024)).toFixed(1);
      setUploadedFiles((prev) => [
        { name: f.name, size: `${mb} MB`, type: f.type || 'MoCap Raw' },
        ...prev,
      ]);
    }

    showToast(`Uploaded ${files.length} motion & reference files to Enclave vault`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Prompt-to-Motion & Motion Dropzone Ingest
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <Zap className="w-3 h-3 text-purple-400" />
              Text-to-Motion AI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Drop in motion capture files or type any natural language prompt to automatically generate full 3D skeletal performances
          </p>
        </div>

        <button
          onClick={() => {
            const bvhText = `HIERARCHY\nROOT Hips\n{\n  OFFSET 0.00 0.00 0.00\n  CHANNELS 6 Xposition Yposition Zposition Zrotation Xrotation Yrotation\n}\nMOTION\nFrames: 120\nFrame Time: 0.016667\n`;
            const blob = new Blob([bvhText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `integrav_generated_motion.bvh`;
            a.click();
            showToast('Downloaded generated 3D BVH motion file', 'success');
          }}
          className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Generated BVH</span>
        </button>
      </div>

      {/* Main Split: Left 3D Skeleton Visualizer, Right Prompt & Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Skeleton Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0c0818] shadow-2xl h-[440px]">
            <div ref={canvasContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Viewport Overlay Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-xs font-mono bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-purple-200 border border-white/10">
                33-Joint Skeleton Rig · 60 FPS
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-xs font-mono text-slate-300">
                  Frame {currentFrame} / {totalFrames}
                </span>
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                Drag to Orbit 3D Angle
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Prompt & Motion Dropzone (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Prompt to Motion Generator Box */}
          <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-purple-300">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Prompt Body Motion
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Type what the body should do. The AI synthesizes joint kinematics and timings without needing camera input.
            </p>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Dodge right, high jump kick, defensive block..."
              className="w-full p-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:border-purple-500 font-mono resize-none"
            />

            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
              <span>Quick Presets:</span>
              <button
                type="button"
                onClick={() => setPrompt('Martial arts spinning roundhouse kick with counter-balance arm swing')}
                className="text-purple-300 hover:text-white px-2 py-0.5 rounded bg-white/5"
              >
                Combat Kick
              </button>
              <button
                type="button"
                onClick={() => setPrompt('Confident slow walking stride towards camera, stopping with folded arms')}
                className="text-purple-300 hover:text-white px-2 py-0.5 rounded bg-white/5"
              >
                Hero Walk
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerateMotion}
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <span>Synthesizing Skeletal Motion...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Motion from Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Real Motion & Reference Dropzone Ingest */}
          <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Motion & Footage Dropzone
            </h2>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files) {
                  for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    const f = e.dataTransfer.files[i];
                    setUploadedFiles(prev => [{ name: f.name, size: `${(f.size/(1024*1024)).toFixed(1)} MB`, type: 'Dropped Motion File' }, ...prev]);
                  }
                  showToast('Files ingested into Enclave vault', 'success');
                }
              }}
              className={`p-6 rounded-2xl border-2 border-dashed text-center transition cursor-pointer relative ${
                dragOver ? 'border-purple-400 bg-purple-950/20' : 'border-white/15 bg-black/40 hover:border-purple-500/40'
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Drop BVH, FBX, or MP4 Takes Here</p>
              <p className="text-[10px] text-slate-400 mt-1">or browse files from your workstation</p>
            </div>

            {/* Uploaded Ingest Queue */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div className="truncate max-w-[180px]">
                    <span className="text-white font-medium block truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{file.type}</span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-bold">{file.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
