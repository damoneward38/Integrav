import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './components/auth/AuthPage';

// Standardized Studio Pages
import { CommandDashboardPage } from './pages/CommandDashboardPage';
import { LiveCameraCloningPage } from './pages/LiveCameraCloningPage';
import { MotionGenerationUploadPage } from './pages/MotionGenerationUploadPage';
import { AutonomousClonePerformancePage } from './pages/AutonomousClonePerformancePage';
import { AssetIngestUploadPage } from './pages/AssetIngestUploadPage';
import { AiBrainCommandPage } from './pages/AiBrainCommandPage';
import { PersonLikenessClonerPage } from './pages/PersonLikenessClonerPage';
import { SyntheticVoicePage } from './pages/SyntheticVoicePage';
import { AutonomousOrchestratorPage } from './pages/AutonomousOrchestratorPage';
import { SystemArchitecturePage } from './pages/SystemArchitecturePage';
import { TwinStudioPage } from './pages/TwinStudioPage';
import { BodyTakesPage } from './pages/BodyTakesPage';
import { FleetRendersPage } from './pages/FleetRendersPage';
import { MachineViewBridgePage } from './pages/MachineViewBridgePage';
import { PipelineExportsPage } from './pages/PipelineExportsPage';
import { SecurityVaultPage } from './pages/SecurityVaultPage';
import { LicensingSalesPage } from './pages/LicensingSalesPage';
import { CharacterMorphPage } from './pages/CharacterMorphPage';
import { CheckoutPage } from './pages/CheckoutPage';

// Contextual Modals & Tools
import { FaceScannerModal } from './components/sheets/FaceScannerModal';
import { VoiceSyncModal } from './components/sheets/VoiceSyncModal';
import { VirtualProductionModal } from './components/sheets/VirtualProductionModal';
import { NeuralSplatModal } from './components/sheets/NeuralSplatModal';
import { MotionLibraryModal } from './components/sheets/MotionLibraryModal';
import { TelemetryModal } from './components/sheets/TelemetryModal';
import { RecordTakeModal } from './components/sheets/RecordTakeModal';
import { TakeDetailModal } from './components/sheets/TakeDetailModal';
import { ExportSheet } from './components/sheets/ExportSheet';
import { ConnectComputerSheet } from './components/sheets/ConnectComputerSheet';
import { MachineViewModal } from './components/sheets/MachineViewModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, activePage, activeModal } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <AppLayout>
      {/* Dynamic Page Router */}
      {activePage === 'command' && <CommandDashboardPage />}
      {activePage === 'live-cam' && <LiveCameraCloningPage />}
      {activePage === 'motion-gen' && <MotionGenerationUploadPage />}
      {activePage === 'clone-perform' && <AutonomousClonePerformancePage />}
      {activePage === 'morph' && <CharacterMorphPage />}
      {activePage === 'checkout' && <CheckoutPage />}
      {activePage === 'ingest' && <AssetIngestUploadPage />}
      {activePage === 'brain' && <AiBrainCommandPage />}
      {activePage === 'cloner' && <PersonLikenessClonerPage />}
      {activePage === 'voice' && <SyntheticVoicePage />}
      {activePage === 'orchestrator' && <AutonomousOrchestratorPage />}
      {activePage === 'system' && <SystemArchitecturePage />}
      {activePage === 'twin' && <TwinStudioPage />}
      {activePage === 'takes' && <BodyTakesPage />}
      {activePage === 'fleet' && <FleetRendersPage />}
      {activePage === 'bridge' && <MachineViewBridgePage />}
      {activePage === 'pipeline' && <PipelineExportsPage />}
      {activePage === 'vault' && <SecurityVaultPage />}
      {activePage === 'licensing' && <LicensingSalesPage />}

      {/* Contextual Modals */}
      {activeModal === 'face-scanner' && <FaceScannerModal />}
      {activeModal === 'voice-sync' && <VoiceSyncModal />}
      {activeModal === 'vp-director' && <VirtualProductionModal />}
      {activeModal === 'neural-splat' && <NeuralSplatModal />}
      {activeModal === 'motion-library' && <MotionLibraryModal />}
      {activeModal === 'telemetry' && <TelemetryModal />}
      {activeModal === 'record-take' && <RecordTakeModal />}
      {activeModal === 'take-detail' && <TakeDetailModal />}
      {activeModal === 'export' && <ExportSheet />}
      {activeModal === 'connect-computer' && <ConnectComputerSheet />}
      {activeModal === 'machine-view' && <MachineViewModal />}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
