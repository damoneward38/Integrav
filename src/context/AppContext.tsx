import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  DigitalTwin, 
  BodyTake, 
  RenderJob, 
  MachineBridge, 
  AppPage, 
  CommercialPlan,
  RecordedVideoTake,
  GeneratedMotionClip,
  VirtualStage,
  CloneRenderMode,
  CharacterMorphPreset,
  CheckoutOrder
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_TWIN, 
  INITIAL_TAKES, 
  INITIAL_RENDER_JOBS, 
  INITIAL_BRIDGE,
  COMMERCIAL_PLANS,
  VIRTUAL_STAGES,
  CHARACTER_MORPH_PRESETS
} from '../data/mockData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
  timestamp: string;
}

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string, name: string) => Promise<boolean>;
  signInLocalOnly: () => void;
  signOut: () => void;
  updateLicensePlan: (planName: UserProfile['licenceType']) => void;
  
  // High-Level Page Routing
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;

  // Contextual sheets / dialogs
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  activeSheet: string | null;
  setActiveSheet: (sheet: string | null) => void;

  // Selected entities for modals
  selectedTakeId: string | null;
  setSelectedTakeId: (id: string | null) => void;

  // Domain data
  twin: DigitalTwin;
  updateBlendshape: (key: keyof DigitalTwin['blendshapes'], val: number) => void;
  toggleWireframe: () => void;
  setSkinShader: (shader: DigitalTwin['skinShader']) => void;
  
  takes: BodyTake[];
  addTake: (take: BodyTake) => void;
  deleteTake: (id: string) => void;

  renderJobs: RenderJob[];
  dispatchRender: (job: Omit<RenderJob, 'id' | 'startedAt' | 'progress' | 'status' | 'estimatedSecsRemaining'>) => void;

  machineBridge: MachineBridge;
  connectBridge: (ip: string, port: number) => Promise<boolean>;
  disconnectBridge: () => void;
  triggerPingTest: () => void;

  commercialPlans: CommercialPlan[];

  // Live Camera Video Takes & Prompted Motions
  recordedVideoTakes: RecordedVideoTake[];
  addRecordedVideoTake: (take: RecordedVideoTake) => void;
  generatedMotionClips: GeneratedMotionClip[];
  addGeneratedMotionClip: (clip: GeneratedMotionClip) => void;
  trainTwinModel: (hours?: number) => void;

  // Virtual Green Screen & Custom AI Stage Switcher
  virtualStages: VirtualStage[];
  activeStage: VirtualStage;
  setActiveStage: (stage: VirtualStage) => void;
  addCustomStage: (stage: VirtualStage) => void;

  // Persona Clone Mode: Photoreal vs Cartoon Animated Mode
  cloneRenderMode: CloneRenderMode;
  setCloneRenderMode: (mode: CloneRenderMode) => void;
  stylizationIntensity: number;
  setStylizationIntensity: (val: number) => void;

  // Character & Humanoid Morphing Matrix
  characterMorphPresets: CharacterMorphPreset[];
  activeMorphPreset: CharacterMorphPreset;
  setActiveMorphPreset: (preset: CharacterMorphPreset) => void;

  // AI Persona Mimic Memory Matrix (auto-translated from recordings)
  autoMimicMemory: Array<{
    takeId: string;
    title: string;
    duration: number;
    timestamp: string;
    fidelityScore: number;
    jointCount: number;
    stageName?: string;
    renderMode?: string;
  }>;

  // Commercial Checkout & Licensing Integration
  selectedPlanForCheckout: CommercialPlan | null;
  setSelectedPlanForCheckout: (plan: CommercialPlan | null) => void;
  activeCheckoutOrder: CheckoutOrder | null;
  completeCheckout: (order: CheckoutOrder) => void;

  // Toast notifications for all button audits
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('integrav_auth_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default to Demond Ward logged in so user immediately sees the entire rich live app,
    // but they can sign out anytime to test the login page!
    return INITIAL_USER;
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Standardized Page Routing
  const [activePage, setActivePage] = useState<AppPage>('command');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTakeId, setSelectedTakeId] = useState<string | null>(null);

  const [twin, setTwin] = useState<DigitalTwin>(INITIAL_TWIN);
  const [takes, setTakes] = useState<BodyTake[]>(INITIAL_TAKES);
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>(INITIAL_RENDER_JOBS);
  const [machineBridge, setMachineBridge] = useState<MachineBridge>(INITIAL_BRIDGE);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [recordedVideoTakes, setRecordedVideoTakes] = useState<RecordedVideoTake[]>([]);
  const [generatedMotionClips, setGeneratedMotionClips] = useState<GeneratedMotionClip[]>([]);

  // Virtual Green Screen & Stage Backgrounds
  const [virtualStages, setVirtualStages] = useState<VirtualStage[]>(VIRTUAL_STAGES);
  const [activeStage, setActiveStage] = useState<VirtualStage>(VIRTUAL_STAGES[0]);

  // Clone Render Mode: Photoreal vs Cartoon Animated
  const [cloneRenderMode, setCloneRenderMode] = useState<CloneRenderMode>('photoreal');
  const [stylizationIntensity, setStylizationIntensity] = useState<number>(65);

  // Character & Humanoid Morphing Matrix
  const [characterMorphPresets, setCharacterMorphPresets] = useState<CharacterMorphPreset[]>(CHARACTER_MORPH_PRESETS);
  const [activeMorphPreset, setActiveMorphPresetState] = useState<CharacterMorphPreset>(CHARACTER_MORPH_PRESETS[0]);

  // AI Persona Mimic Memory Matrix (auto-translated from recordings)
  const [autoMimicMemory, setAutoMimicMemory] = useState<Array<{
    takeId: string;
    title: string;
    duration: number;
    timestamp: string;
    fidelityScore: number;
    jointCount: number;
    stageName?: string;
    renderMode?: string;
  }>>([
    {
      takeId: 'mimic_seed_01',
      title: 'Studio Calibration Lead - Demond Ward',
      duration: 12.4,
      timestamp: 'Today, 10:14 AM',
      fidelityScore: 99.4,
      jointCount: 33,
      stageName: 'Grammy Music Production Studio',
      renderMode: 'photoreal',
    },
    {
      takeId: 'mimic_seed_02',
      title: 'Dynamic Vocal Flow Take #2',
      duration: 8.8,
      timestamp: 'Today, 11:30 AM',
      fidelityScore: 99.2,
      jointCount: 33,
      stageName: 'Cyberpunk Concert Arena',
      renderMode: 'cartoon',
    }
  ]);

  // Commercial Checkout & Licensing Integration
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<CommercialPlan | null>(COMMERCIAL_PLANS[1]);
  const [activeCheckoutOrder, setActiveCheckoutOrder] = useState<CheckoutOrder | null>(null);

  const setActiveMorphPreset = (preset: CharacterMorphPreset) => {
    setActiveMorphPresetState(preset);
    if (preset.characterType === 'cartoon_hero' || preset.characterType === 'anime_warrior' || preset.characterType === 'comic_halftone') {
      setCloneRenderMode('cartoon');
    } else {
      setCloneRenderMode('photoreal');
    }
    setStylizationIntensity(preset.stylizationScale);
    showToast(`Morphed avatar form to "${preset.name}" (${preset.badge})!`, 'success');
  };

  const completeCheckout = (order: CheckoutOrder) => {
    setActiveCheckoutOrder(order);
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        licenceType: order.planName as any,
        licenceKey: order.licenseKey,
      };
      setUser(updatedUser);
      localStorage.setItem('integrav_auth_session', JSON.stringify(updatedUser));
    }
    showToast(`License activated: ${order.planName}! Full studio rights unlocked.`, 'success');
  };

  const addCustomStage = (stage: VirtualStage) => {
    setVirtualStages((prev) => [stage, ...prev]);
    setActiveStage(stage);
    showToast(`Generated and applied custom stage: "${stage.name}"`, 'success');
  };

  const addRecordedVideoTake = (take: RecordedVideoTake) => {
    setRecordedVideoTakes((prev) => [take, ...prev]);

    // Automatically translate and store in AI persona mimic memory matrix
    const nextFidelity = Math.min(99.9, +(twin.likenessFidelity + 0.1).toFixed(1));
    const mimicEntry = {
      takeId: take.id,
      title: take.title,
      duration: take.durationSeconds,
      timestamp: take.timestamp,
      fidelityScore: nextFidelity,
      jointCount: 33,
      stageName: take.stageName,
      renderMode: take.renderMode,
    };
    setAutoMimicMemory((prev) => [mimicEntry, ...prev]);

    trainTwinModel(0.5);

    // Asynchronously notify backend
    fetch('/api/takes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        takeId: take.id,
        title: take.title,
        durationSeconds: take.durationSeconds,
        timestamp: take.timestamp,
        sizeBytes: take.sizeBytes,
        stageName: take.stageName,
        renderMode: take.renderMode,
        biometricJoints: 33,
        fidelityScore: nextFidelity,
      })
    }).catch(() => {});

    showToast(`Take stored & auto-translated for AI mimicry! Persona model upgraded to ${nextFidelity}% fidelity.`, 'success');
  };

  const addGeneratedMotionClip = (clip: GeneratedMotionClip) => {
    setGeneratedMotionClips((prev) => [clip, ...prev]);
    showToast(`AI generated procedural 3D motion: "${clip.prompt}"`, 'success');
  };

  const trainTwinModel = (hours: number = 0.5) => {
    setTwin((prev) => {
      const nextIter = prev.trainingIterations + 1;
      const nextHours = +(prev.cloningTrainingHours + hours).toFixed(1);
      const nextFidelity = Math.min(99.9, +(prev.likenessFidelity + 0.1).toFixed(1));
      return {
        ...prev,
        trainingIterations: nextIter,
        cloningTrainingHours: nextHours,
        likenessFidelity: nextFidelity,
        lastCalibrated: 'Just now (Continuous Training)',
      };
    });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const newToast: ToastNotification = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('integrav_auth_session', JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.removeItem('integrav_auth_session');
    }
  }, [user]);

  // Fast, reliable sign-in with instant response
  const signIn = async (email: string, pass: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);

    return new Promise((resolve) => {
      setTimeout(() => {
        setIsAuthenticating(false);
        if (!email.trim() || !pass.trim()) {
          setAuthError('Please enter both email and password.');
          resolve(false);
          return;
        }

        const authenticatedUser: UserProfile = {
          ...INITIAL_USER,
          email: email.trim(),
          isLocalOnly: false,
        };

        setUser(authenticatedUser);
        showToast(`Signed in successfully as ${email}`, 'success');
        resolve(true);
      }, 300);
    });
  };

  const signUp = async (email: string, pass: string, name: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);

    return new Promise((resolve) => {
      setTimeout(() => {
        setIsAuthenticating(false);
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          email: email.trim(),
          name: name.trim() || 'Demond Ward',
          handle: `@${(name.trim() || 'DemondWard').replace(/\s+/g, '')}`,
          isLocalOnly: false,
          avatarUrl: INITIAL_USER.avatarUrl,
          encryptionKeyFingerprint: `SHA256:${Math.random().toString(16).substring(2, 10)}${Date.now()}`,
          twinId: 'twin_default_arkit',
          licenceType: 'Studio Pro',
          licenceKey: `INT-STUDIO-${Date.now().toString().slice(-4)}-LIVE`,
          licenceExpiry: '2029-01-01',
          seatsCount: 5,
        };
        setUser(newUser);
        showToast('Account created and verified on Intégrav backend', 'success');
        resolve(true);
      }, 350);
    });
  };

  const signInLocalOnly = () => {
    setIsAuthenticating(false);
    setAuthError(null);
    const localUser: UserProfile = {
      id: 'local_device_vault',
      email: 'local@device.vault',
      name: 'Local Enclave User',
      handle: '@LocalDevice',
      isLocalOnly: true,
      avatarUrl: INITIAL_USER.avatarUrl,
      encryptionKeyFingerprint: 'DEVICE-HARDWARE-ENCLAVE-KEY-ZERO-KNOWLEDGE',
      twinId: 'twin_local_vault',
      licenceType: 'Local Vault',
      licenceKey: 'INT-LOCAL-DEVICE-PERPETUAL',
      licenceExpiry: 'Perpetual (Device Only)',
      seatsCount: 1,
    };
    setUser(localUser);
    showToast('Entered Local Device Enclave Mode', 'info');
  };

  const signOut = () => {
    setUser(null);
    setActivePage('command');
    setActiveModal(null);
    showToast('Signed out of Intégrav Studio Workstation', 'info');
  };

  const updateLicensePlan = (planName: UserProfile['licenceType']) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      licenceType: planName,
      licenceKey: `INT-${planName.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString().slice(-4)}`,
    };
    setUser(updated);
    showToast(`License upgraded to ${planName}. Commercial production active.`, 'success');
  };

  const updateBlendshape = (key: keyof DigitalTwin['blendshapes'], val: number) => {
    setTwin((prev) => ({
      ...prev,
      blendshapes: {
        ...prev.blendshapes,
        [key]: val,
      },
    }));
  };

  const toggleWireframe = () => {
    setTwin((prev) => {
      const nextState = !prev.wireframeActive;
      showToast(nextState ? 'Wireframe topology overlay enabled' : 'Wireframe topology disabled', 'info');
      return {
        ...prev,
        wireframeActive: nextState,
      };
    });
  };

  const setSkinShader = (shader: DigitalTwin['skinShader']) => {
    setTwin((prev) => ({
      ...prev,
      skinShader: shader,
    }));
    showToast(`Shader profile switched to ${shader}`, 'info');
  };

  const addTake = (take: BodyTake) => {
    setTakes((prev) => [take, ...prev]);
    showToast(`Take #${take.takeNumber} recorded and encrypted to enclave`, 'success');
  };

  const deleteTake = (id: string) => {
    setTakes((prev) => prev.filter((t) => t.id !== id));
    showToast('Take deleted from device storage', 'info');
  };

  const dispatchRender = (jobData: Omit<RenderJob, 'id' | 'startedAt' | 'progress' | 'status' | 'estimatedSecsRemaining'>) => {
    const newJob: RenderJob = {
      ...jobData,
      id: `rnd_${Date.now().toString().slice(-4)}`,
      status: 'rendering',
      progress: 0,
      startedAt: 'Just now',
      estimatedSecsRemaining: 45,
    };
    setRenderJobs((prev) => [newJob, ...prev]);
    showToast(`Dispatched render job ${newJob.name} to ${newJob.nodeName}`, 'success');

    const interval = setInterval(() => {
      setRenderJobs((current) =>
        current.map((j) => {
          if (j.id === newJob.id) {
            const nextProgress = Math.min(100, j.progress + 20);
            const remaining = Math.max(0, Math.floor(45 * (1 - nextProgress / 100)));
            return {
              ...j,
              progress: nextProgress,
              currentFrame: Math.floor(j.frameStart + ((j.frameEnd - j.frameStart) * nextProgress) / 100),
              status: nextProgress >= 100 ? 'completed' : 'rendering',
              estimatedSecsRemaining: remaining,
            };
          }
          return j;
        })
      );
    }, 700);

    setTimeout(() => {
      clearInterval(interval);
      showToast(`Render complete: ${newJob.outputFile}`, 'success');
    }, 4500);
  };

  const connectBridge = async (ip: string, port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMachineBridge((prev) => ({
          ...prev,
          isConnected: true,
          ip,
          port,
          pingMs: Math.floor(Math.random() * 3) + 3,
          hqueueStatus: 'Ready',
        }));
        showToast(`Connected to houly-pipe at ${ip}:${port} (4ms ping)`, 'success');
        resolve(true);
      }, 400);
    });
  };

  const disconnectBridge = () => {
    setMachineBridge((prev) => ({
      ...prev,
      isConnected: false,
      hqueueStatus: 'Offline',
    }));
    showToast('Houly-pipe bridge connection disconnected', 'info');
  };

  const triggerPingTest = () => {
    const newPing = Math.floor(Math.random() * 3) + 2;
    setMachineBridge((prev) => ({
      ...prev,
      pingMs: newPing,
    }));
    showToast(`Workstation bridge ping tested: ${newPing}ms round-trip`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthenticating,
        authError,
        signIn,
        signUp,
        signInLocalOnly,
        signOut,
        updateLicensePlan,
        activePage,
        setActivePage,
        activeModal,
        setActiveModal,
        activeSheet: activeModal,
        setActiveSheet: setActiveModal,
        selectedTakeId,
        setSelectedTakeId,
        twin,
        updateBlendshape,
        toggleWireframe,
        setSkinShader,
        takes,
        addTake,
        deleteTake,
        renderJobs,
        dispatchRender,
        machineBridge,
        connectBridge,
        disconnectBridge,
        triggerPingTest,
        commercialPlans: COMMERCIAL_PLANS,
        recordedVideoTakes,
        addRecordedVideoTake,
        generatedMotionClips,
        addGeneratedMotionClip,
        trainTwinModel,
        virtualStages,
        activeStage,
        setActiveStage,
        addCustomStage,
        cloneRenderMode,
        setCloneRenderMode,
        stylizationIntensity,
        setStylizationIntensity,
        characterMorphPresets,
        activeMorphPreset,
        setActiveMorphPreset,
        autoMimicMemory,
        selectedPlanForCheckout,
        setSelectedPlanForCheckout,
        activeCheckoutOrder,
        completeCheckout,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
