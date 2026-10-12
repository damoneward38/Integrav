import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';

export const Twin3DViewport: React.FC<{ 
  className?: string;
  forceMode?: 'photoreal' | 'cartoon' | 'wireframe';
  stageTint?: string;
}> = ({ className = 'h-64', forceMode, stageTint }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { twin, cloneRenderMode, activeStage, stylizationIntensity, activeMorphPreset } = useApp();

  const currentMode = forceMode || cloneRenderMode;
  const currentTint = stageTint || activeStage.lightingTint;

  // Keep ref to blendshapes to update without re-init scene
  const blendshapesRef = useRef(twin.blendshapes);
  blendshapesRef.current = twin.blendshapes;
  const wireframeRef = useRef(twin.wireframeActive);
  wireframeRef.current = twin.wireframeActive;
  const modeRef = useRef(currentMode);
  modeRef.current = currentMode;
  const tintRef = useRef(currentTint);
  tintRef.current = currentTint;
  const intensityRef = useRef(stylizationIntensity);
  intensityRef.current = stylizationIntensity;
  const morphRef = useRef(activeMorphPreset);
  morphRef.current = activeMorphPreset;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 260;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent to show stage background gradient behind canvas

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting setup (Cinematic Rim & Key lights matching stage tint)
    const ambientLight = new THREE.AmbientLight(0x2d1b4e, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0e6, 2.2);
    keyLight.position.set(2, 3, 2);
    scene.add(keyLight);

    const stageRimLight = new THREE.PointLight(new THREE.Color(tintRef.current), 4.5, 12);
    stageRimLight.position.set(-2.5, 1, -1);
    scene.add(stageRimLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 3.0, 10);
    fillLight.position.set(2.5, -0.5, -1);
    scene.add(fillLight);

    // 3. 3D Head Geometry & Morph Targets
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    // Create stylized head sculpt geometry using Sphere with subdivisions
    const headGeometry = new THREE.SphereGeometry(1, 36, 32);
    headGeometry.scale(0.85, 1.15, 0.95); // Natural human head proportions

    // Store base vertices to apply procedural ARKit blendshapes
    const basePositions = headGeometry.attributes.position.clone();
    
    // Skin material
    const material = new THREE.MeshStandardMaterial({
      color: 0x3d2720,
      roughness: 0.35,
      metalness: 0.05,
      wireframe: wireframeRef.current,
    });

    const headMesh = new THREE.Mesh(headGeometry, material);
    headGroup.add(headMesh);

    // Add 3D Eyes
    const eyeGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.3, 0.15, 0.82);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.3, 0.15, 0.82);
    headGroup.add(rightEye);

    // Add Iris reflections
    const irisGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const leftIris = new THREE.Mesh(irisGeom, irisMat);
    leftIris.position.set(-0.3, 0.15, 0.93);
    headGroup.add(leftIris);

    const rightIris = new THREE.Mesh(irisGeom, irisMat);
    rightIris.position.set(0.3, 0.15, 0.93);
    headGroup.add(rightIris);

    // Orbit Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotX = 0;
    let rotY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      rotY += deltaX * 0.008;
      rotX = Math.max(-0.6, Math.min(0.6, rotX + deltaY * 0.008));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Idle natural subtle head sway if not dragging
      if (!isDragging) {
        headGroup.rotation.y = rotY + Math.sin(elapsedTime * 0.8) * 0.05;
        headGroup.rotation.x = rotX + Math.cos(elapsedTime * 0.6) * 0.03;
      } else {
        headGroup.rotation.y = rotY;
        headGroup.rotation.x = rotX;
      }

      // Update wireframe & shader mode state
      const morph = morphRef.current;
      material.wireframe = wireframeRef.current || modeRef.current === 'wireframe';
      
      if (wireframeRef.current || modeRef.current === 'wireframe') {
        material.color.setHex(0xa855f7);
        material.metalness = 0.1;
        material.roughness = 0.5;
      } else if (morph && morph.characterType !== 'demond_original') {
        // Active Character & Humanoid Morphing
        try {
          material.color.set(morph.skinHex);
        } catch {
          material.color.setHex(0x452b24);
        }

        if (morph.shaderMaterial === 'cyber_titanium') {
          material.metalness = 0.85;
          material.roughness = 0.25;
        } else if (morph.shaderMaterial === 'cel_toon' || morph.shaderMaterial === 'comic_halftone') {
          material.metalness = 0.05;
          material.roughness = 0.92;
        } else if (morph.shaderMaterial === 'astral_glow') {
          material.metalness = 0.3;
          material.roughness = 0.4;
        } else if (morph.shaderMaterial === 'holographic') {
          material.metalness = 0.9;
          material.roughness = 0.1;
          material.wireframe = true;
        } else {
          material.metalness = 0.05;
          material.roughness = 0.4;
        }
      } else if (modeRef.current === 'cartoon') {
        // Faithful Cartoon Mode: stylized animated tones preserving exact bone structure
        material.metalness = 0.05;
        material.roughness = 0.85;
        material.color.setHex(0x9a5a43);
      } else {
        // Photoreal Mode: natural skin reflectance
        material.metalness = 0.05;
        material.roughness = 0.35;
        material.color.setHex(0x452b24);
      }

      // Synchronize stage rim light color
      try {
        const rimColor = morph?.rimHex || tintRef.current;
        stageRimLight.color.set(rimColor);
      } catch {
        // fallback
      }

      // Deform vertices based on blendshapes (Jaw Open, Smile, Brow)
      const bs = blendshapesRef.current;
      const posAttr = headGeometry.attributes.position;
      const basePos = basePositions.array as Float32Array;
      const currentPos = posAttr.array as Float32Array;

      for (let i = 0; i < posAttr.count; i++) {
        const x = basePos[i * 3];
        const y = basePos[i * 3 + 1];
        const z = basePos[i * 3 + 2];

        let dx = 0;
        let dy = 0;
        let dz = 0;

        // Jaw Open deformation (bottom half of face moves down and slightly forward)
        if (y < -0.2 && z > 0) {
          const jawWeight = Math.max(0, -y - 0.2);
          dy -= bs.jawOpen * jawWeight * 0.45;
          dz += bs.jawOpen * jawWeight * 0.1;
        }

        // Smile Left (x < -0.1, y near mouth)
        if (x < -0.1 && y > -0.5 && y < 0.1 && z > 0.5) {
          dx -= bs.smileLeft * 0.12;
          dy += bs.smileLeft * 0.08;
        }

        // Smile Right (x > 0.1, y near mouth)
        if (x > 0.1 && y > -0.5 && y < 0.1 && z > 0.5) {
          dx += bs.smileRight * 0.12;
          dy += bs.smileRight * 0.08;
        }

        // Brow inner up (y > 0.4, x between -0.4 and 0.4, z > 0.6)
        if (y > 0.35 && y < 0.7 && Math.abs(x) < 0.35 && z > 0.5) {
          dy += bs.browInnerUp * 0.14;
        }

        currentPos[i * 3] = x + dx;
        currentPos[i * 3 + 1] = y + dy;
        currentPos[i * 3 + 2] = z + dz;
      }

      posAttr.needsUpdate = true;
      headGeometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full ${className} rounded-2xl overflow-hidden bg-[#0d0918] border border-white/10 group`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Viewport HUD overlay */}
      <div className="absolute top-2 left-3 pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-mono text-purple-200 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
          ARKit 52 LiveLink · 60 FPS
        </span>
      </div>

      <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
        Drag to Orbit · Tilt Angle
      </div>
    </div>
  );
};
