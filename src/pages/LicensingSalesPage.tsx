import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  FileText,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommercialPlan } from '../types';

export const LicensingSalesPage: React.FC = () => {
  const { user, commercialPlans, updateLicensePlan, setSelectedPlanForCheckout, setActivePage, showToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleSelectPlan = (plan: CommercialPlan) => {
    setSelectedPlanForCheckout(plan);
    setActivePage('checkout');
    showToast(`Redirecting to secure checkout for ${plan.name}...`, 'info');
  };

  const handleDownloadCertificate = () => {
    const cert = `==========================================================\nINTÉGRAV COMMERCIAL PRODUCTION LICENSE CERTIFICATE\n==========================================================\nLicensee: ${user?.name || 'Demond Ward'}\nEmail: ${user?.email}\nPlan Tier: ${user?.licenceType || 'Studio Pro'}\nLicense Key: ${user?.licenceKey || 'INT-STUDIO-PRO-9842-8812-US'}\nValid Until: ${user?.licenceExpiry || '2028-12-31'}\nHardware Fingerprint: ${user?.encryptionKeyFingerprint}\nAuthorized Workstations: ${user?.seatsCount || 5} Seats\nCompliance: FIPS 140-3 Hardware Enclave Validated\nPixar USD, Houdini Solaris, and Unreal Engine 5.4 LiveLink Rights Granted.\nIssued by Intégrav VFX Systems.\n==========================================================`;
    const blob = new Blob([cert], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integrav_license_certificate_${user?.licenceType?.toLowerCase().replace(/\s+/g, '_')}.txt`;
    a.click();
    showToast('Downloaded official Intégrav Commercial License Certificate', 'success');
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Commercial Production Licensing & Plans
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-grade licensing for independent creators, boutique VFX houses, and major studios
          </p>
        </div>

        <button
          onClick={handleDownloadCertificate}
          className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-purple-900/20"
        >
          <FileText className="w-4 h-4" />
          <span>Download License Certificate</span>
        </button>
      </div>

      {/* Active License Overview Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1c1236] via-[#140c2a] to-[#0f0920] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Current Active License:</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 font-mono">
                {user?.licenceType || 'Studio Pro'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Key: <span className="text-purple-300 select-all">{user?.licenceKey}</span> · Valid Through: {user?.licenceExpiry}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-mono">Seats Licensed</span>
            <span className="text-sm font-bold text-white font-mono">{user?.seatsCount || 5} Workstations</span>
          </div>
        </div>
      </div>

      {/* Monthly / Annual Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
          Monthly Billing
        </span>

        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className="w-12 h-6 rounded-full bg-purple-600/40 border border-purple-500/40 p-0.5 transition"
        >
          <div
            className={`w-5 h-5 rounded-full bg-purple-500 transition-transform ${
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>

        <span className={`text-xs font-medium flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
          <span>Annual Billing</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Save 20%
          </span>
        </span>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {commercialPlans.map((plan) => {
          const isCurrent = user?.licenceType === plan.name;
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 transition relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#1c1236] to-[#120c24] border-purple-500/50 shadow-2xl shadow-purple-900/20'
                  : 'bg-[#120c24] border-white/10'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Studio Recommended
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[36px]">
                  {plan.audience}
                </p>

                <div className="my-5 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    / seat / month
                  </span>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-white/10 text-slate-400 cursor-default'
                      : plan.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isCurrent ? (
                    <span>Active License</span>
                  ) : (
                    <>
                      <span>Upgrade to {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Comparison Matrix */}
      <div className="p-6 rounded-3xl bg-[#120c24] border border-white/10 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Technical Specifications Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-bold uppercase">Specification</th>
                <th className="py-3 px-4 font-bold uppercase">Solo Creator</th>
                <th className="py-3 px-4 font-bold uppercase text-purple-300">Studio Pro</th>
                <th className="py-3 px-4 font-bold uppercase">Enterprise VFX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-slate-300">
              <tr>
                <td className="py-3 px-4 text-white font-medium">Virtual Stage & Green Screen</td>
                <td className="py-3 px-4">4K Green Screen + Presets</td>
                <td className="py-3 px-4 text-purple-200">Real-Time AI Stage Switcher (Any Prompt)</td>
                <td className="py-3 px-4">8K LED Volume / Infinite Stages</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Shader Engine</td>
                <td className="py-3 px-4">Photoreal + Cartoon Cel</td>
                <td className="py-3 px-4 text-purple-200">Photoreal + Faithful Cartoon Animated (Songs/Films)</td>
                <td className="py-3 px-4">Custom Studio Shader Pipelines</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Song & Movie Rights</td>
                <td className="py-3 px-4">Indie Commercial License</td>
                <td className="py-3 px-4 text-purple-200">Full Song, Video & Film Master Rights</td>
                <td className="py-3 px-4">Global Major Motion Picture Perpetual</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Render Nodes</td>
                <td className="py-3 px-4">1 Local GPU Rig</td>
                <td className="py-3 px-4 text-purple-200">16 Distributed Nodes</td>
                <td className="py-3 px-4">Unlimited Scalability</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Blendshapes</td>
                <td className="py-3 px-4">52 ARKit Certified</td>
                <td className="py-3 px-4 text-purple-200">Unlimited Custom FACS</td>
                <td className="py-3 px-4">Neural FACS Topology</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Bridge Latency</td>
                <td className="py-3 px-4">&lt; 4ms Subnet</td>
                <td className="py-3 px-4 text-purple-200">&lt; 2ms Fiber / UDP</td>
                <td className="py-3 px-4">&lt; 1ms InfiniBand</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Encryption Standard</td>
                <td className="py-3 px-4">FIPS 140-3 Enclave</td>
                <td className="py-3 px-4 text-purple-200">Zero-Knowledge Cluster Enclave</td>
                <td className="py-3 px-4">Air-Gapped Hardware HSM</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">USD / DCC Export</td>
                <td className="py-3 px-4">USD, BVH, FBX</td>
                <td className="py-3 px-4 text-purple-200">All Formats + LiveLink & EXR</td>
                <td className="py-3 px-4">All Formats + Custom C++ SDK</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
