import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Loader2, 
  KeyRound, 
  ArrowRight,
  Lock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STAGE_IMAGE, DEFAULT_AVATAR } from '../../data/mockData';

export const AuthPage: React.FC = () => {
  const { signIn, signUp, signInLocalOnly, isAuthenticating, authError } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('damoneward38@gmail.com');
  const [password, setPassword] = useState('313DAMONEWARD');
  const [name, setName] = useState('Demond Ward');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      await signIn(email, password);
    } else {
      await signUp(email, password, name);
    }
  };

  return (
    <div className="min-h-screen bg-[#080512] text-slate-100 flex flex-col justify-center items-center p-4 lg:p-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Standard Split Container (1200px max width) */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#110b24]/90 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Cinematic Branding & Production Features (7 cols on lg) */}
        <div className="lg:col-span-7 relative p-8 lg:p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1b1137] to-[#0e0820]">
          {/* Background stage backdrop image with gradient scrim */}
          <div className="absolute inset-0 z-0">
            <img
              src={STAGE_IMAGE}
              alt="Intégrav Virtual Production Stage"
              className="w-full h-full object-cover opacity-25"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0820] via-[#0e0820]/70 to-transparent" />
          </div>

          {/* Top Brand Mark */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <span className="text-base font-black text-white font-mono">IN</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white leading-none">
                Intégrav
              </h2>
              <span className="text-xs text-purple-300 font-mono tracking-wider uppercase">
                VFX & Synthetic Twin Workstation
              </span>
            </div>
          </div>

          {/* Middle Value Proposition */}
          <div className="relative z-10 my-8 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-md leading-snug">
              Your digital twin, fleets, and motion capture takes — encrypted and connected.
            </h1>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Standardized studio environment with sub-4ms Houly-Pipe bridge connection, real-time 3D facial topology, and Karma XPU render queue.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-hang sign in with hardware enclave key validation</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pixar USD, Autodesk FBX, and Unreal Engine 5.4 LiveLink</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real 4K multi-layer EXR renders and verified measured figures</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Enclave Certification */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10 font-mono">
            <span className="flex items-center gap-1.5 text-purple-300">
              <Lock className="w-3.5 h-3.5" />
              FIPS 140-3 Enclave Encrypted
            </span>
            <span>Commercial Production Standard</span>
          </div>
        </div>

        {/* Right Side: Professional Authentication Form (5 cols on lg) */}
        <div className="lg:col-span-5 p-8 lg:p-10 bg-[#140e29] flex flex-col justify-between text-left relative z-10">
          
          <div>
            {/* Segmented Mode Toggle */}
            <div className="p-1 rounded-2xl bg-black/40 border border-white/10 flex items-center mb-6">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                  mode === 'signin'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                  mode === 'signup'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create account
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {mode === 'signin' ? 'Welcome to Intégrav' : 'Create Studio Account'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'signin'
                  ? 'Sign in to access your digital twin, rigs, and render fleets.'
                  : 'Get started with high-throughput motion capture & rendering.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Demond Ward"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="damoneward38@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
                  {authError}
                </div>
              )}

              {/* Instant Sign In Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Intégrav' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {mode === 'signin' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-slate-400 hover:text-purple-300 transition"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>

          {/* Device Only Local Vault Option */}
          <div className="pt-6 border-t border-white/10 text-center space-y-1 mt-6">
            <button
              type="button"
              onClick={signInLocalOnly}
              className="text-xs font-semibold text-purple-300 hover:text-purple-200 underline underline-offset-4 cursor-pointer transition"
            >
              Use on this device only (Local Vault)
            </button>
            <p className="text-[11px] text-slate-400 leading-tight">
              Without an account, takes and twin data remain encrypted to this browser session only.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#17102b] border border-white/10 text-left space-y-3.5">
            <div className="flex items-center gap-2 text-purple-300">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Reset Credentials</h3>
            </div>
            
            {resetSent ? (
              <div className="space-y-3 py-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-200">
                  Recovery token and authentication challenge link sent to <br />
                  <span className="font-mono text-purple-300">{email}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSent(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400">
                  Enter your email to verify your enclave identity recovery token:
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
