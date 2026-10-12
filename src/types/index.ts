export type AppPage = 
  | 'command' 
  | 'live-cam'
  | 'motion-gen'
  | 'clone-perform'
  | 'morph'
  | 'checkout'
  | 'ingest'
  | 'brain'
  | 'cloner'
  | 'voice'
  | 'orchestrator'
  | 'system'
  | 'twin' 
  | 'takes' 
  | 'fleet' 
  | 'bridge' 
  | 'pipeline' 
  | 'vault' 
  | 'licensing';

export interface RecordedVideoTake {
  id: string;
  blobUrl: string;
  durationSeconds: number;
  timestamp: string;
  sizeBytes: number;
  title: string;
  mimeType: string;
  stageName?: string;
  renderMode?: 'photoreal' | 'cartoon';
  mimicExtracted?: boolean;
  blendshapeCount?: number;
  fidelityBoostPercent?: number;
  motionJointsExtracted?: number;
}

export interface GeneratedMotionClip {
  id: string;
  prompt: string;
  durationSeconds: number;
  fps: number;
  motionType: string;
  jointFrames: number[][][]; // array of frames, each frame has 33 joints [x, y, z]
  timestamp: string;
}

export type CloneRenderMode = 'photoreal' | 'cartoon' | 'wireframe';

export interface VirtualStage {
  id: string;
  name: string;
  category: 'Green Screen' | 'Concert' | 'Film Studio' | 'Music Studio' | 'Sci-Fi' | 'Cinematic' | 'Custom';
  prompt: string;
  description: string;
  lightingTint: string; // Hex color for rim/ambient lighting
  bgStyle: string; // CSS background style / gradient
  isCustom?: boolean;
}

export interface SongMoviePreset {
  id: string;
  title: string;
  type: 'song' | 'movie' | 'monologue' | 'broadcast';
  artistOrCharacter: string;
  scriptOrLyrics: string;
  stageId: string;
  renderMode: 'photoreal' | 'cartoon';
  tempoBpm?: number;
  tags: string[];
}

export interface CharacterMorphPreset {
  id: string;
  name: string;
  characterType: 'demond_original' | 'cyber_humanoid' | 'cartoon_hero' | 'anime_warrior' | 'quantum_astral' | 'comic_halftone' | 'hologram_synth';
  headline: string;
  description: string;
  humanityRatio: number; // 0 to 100
  stylizationScale: number; // 0 to 100
  eyeScale: number; // 0.8 to 1.6
  jawContourWidth: number; // 0.7 to 1.4
  shaderMaterial: 'photoreal_sss' | 'cel_toon' | 'cyber_titanium' | 'astral_glow' | 'comic_halftone' | 'holographic';
  skinHex: string;
  rimHex: string;
  badge: string;
  voicePitch: number;
  previewEmoji: string;
}

export interface CheckoutOrder {
  id: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'annual';
  price: number;
  addOns: string[];
  couponCode?: string;
  discount: number;
  tax: number;
  total: number;
  customerName: string;
  customerEmail: string;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'crypto' | 'wire';
  licenseKey: string;
  timestamp: string;
  status: 'completed' | 'processing';
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  handle: string;
  isLocalOnly: boolean;
  avatarUrl: string;
  encryptionKeyFingerprint: string;
  twinId: string;
  licenceType: 'Solo Creator' | 'Studio Pro' | 'Enterprise VFX' | 'Local Vault';
  licenceKey: string;
  licenceExpiry: string;
  seatsCount: number;
}

export interface DigitalTwin {
  id: string;
  name: string;
  version: string;
  meshPolyCount: number;
  blendshapesCount: number;
  skinShader: 'Photorealistic SSS' | 'Stylized Clay' | 'Topology Wire' | 'Biometric Depth';
  wireframeActive: boolean;
  blendshapes: {
    jawOpen: number;
    smileLeft: number;
    smileRight: number;
    browInnerUp: number;
    eyeBlinkLeft: number;
    eyeBlinkRight: number;
    mouthPucker: number;
    cheekPuff: number;
  };
  likenessFidelity: number; // e.g. 98.6%
  asymmetryFactor: number;
  microWrinkles: boolean;
  lastCalibrated: string;
  faceModelStatus: 'Verified ARKit' | 'Calibrating' | 'Needs Rescan';
  cloningTrainingHours: number;
  trainingIterations: number;
}

export interface BodyTake {
  id: string;
  takeNumber: number;
  title: string;
  timestamp: string;
  durationSeconds: number;
  fps: number;
  fileSizeBytes: number;
  jointsTracked: number;
  format: 'USD' | 'BVH' | 'FBX';
  isLocalEncrypted: boolean;
  motionType: 'Combat' | 'Walk Cycle' | 'Stunt' | 'Dialogue' | 'Custom';
  thumbnailUrl?: string;
  videoUrl?: string;
  performer: string;
}

export interface RenderJob {
  id: string;
  name: string;
  status: 'rendering' | 'completed' | 'queued' | 'failed';
  progress: number;
  frameStart: number;
  frameEnd: number;
  currentFrame: number;
  resolution: string;
  renderEngine: 'Karma XPU' | 'Unreal 5.4' | 'Mantra';
  passes: string[];
  outputFile: string;
  nodeName: string;
  startedAt: string;
  estimatedSecsRemaining: number;
}

export interface MachineBridge {
  isConnected: boolean;
  ip: string;
  port: number;
  machineName: string;
  gpuModel: string;
  vramTotalGb: number;
  vramUsedGb: number;
  gpuTempC: number;
  bridgeVersion: string;
  pingMs: number;
  activeDcc: 'Houdini 20.5 Solaris' | 'Unreal Engine 5.4' | 'Blender 4.2' | 'None';
  storagePath: string;
  hqueueStatus: 'Ready' | 'Busy' | 'Offline';
  cpuModel: string;
  ramTotalGb: number;
  ramUsedGb: number;
  pcieBandwidth: string;
  diskIoSpeed: string;
  ipcSocket: string;
}

export interface CommercialPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  audience: string;
  features: string[];
  specs: {
    renderNodes: string;
    blendshapes: string;
    bridgeLatency: string;
    encryption: string;
    exportFormats: string;
  };
  isPopular?: boolean;
}

export interface BrainMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionExecuted?: string;
}
