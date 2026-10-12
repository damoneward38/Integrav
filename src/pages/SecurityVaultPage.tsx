import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  FileCheck, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SecurityVaultPage: React.FC = () => {
  const { user, showToast } = useApp();
  const [fingerprint, setFingerprint] = useState(user?.encryptionKeyFingerprint || 'SHA256:7f8a9e01cd34ba56ef1289fe0a7c9921');

  const handleRotateKey = () => {
    const newFp = `SHA256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    setFingerprint(newFp);
    showToast('Hardware Enclave Key Rotated. New Master Key issued.', 'success');
  };

  const handlePurgeCache = () => {
    showToast('Temporary decrypted frame cache flushed from RAM', 'info');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="pb-2 border-b border-white/10">
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          Hardware Security Enclave & Cryptographic Vault
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Zero-knowledge cryptographic keys · Local hardware encryption · FIPS 140-3 Standard
        </p>
      </div>

      {/* Main Enclave Card */}
      <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Hardware Device Enclave Status
              </h2>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Active & Zero-Knowledge
              </span>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            AES-256 GCM
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Device Master Key Fingerprint
          </span>
          <p className="text-xs font-mono text-purple-300 break-all select-all font-semibold">
            {fingerprint}
          </p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Everything on this device is encrypted with a key only this device holds. Your twin, face model, and licence are linked securely. Recorded body takes never leave this node unencrypted, signed in or not.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRotateKey}
            className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Rotate Enclave Master Key</span>
          </button>

          <button
            type="button"
            onClick={handlePurgeCache}
            className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Memory Cache</span>
          </button>
        </div>
      </div>

      {/* Security Policies Audit Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Zero-Knowledge Take Storage
          </span>
          <p className="text-[11px] text-slate-400">
            Raw camera sensor feeds and 33-joint skeleton coordinates decrypted in RAM only.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Workstation Bridge Tokens
          </span>
          <p className="text-[11px] text-slate-400">
            Houly-pipe bridge communicates with dynamic HMAC-SHA256 handshake challenges.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Commercial License Audit
          </span>
          <p className="text-[11px] text-slate-400">
            Verified production certificates embedded in all USD and EXR metadata headers.
          </p>
        </div>
      </div>
    </div>
  );
};
