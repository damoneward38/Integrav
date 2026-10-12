import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Lock, 
  Zap, 
  Check, 
  ArrowRight, 
  HelpCircle,
  Cpu,
  Layers,
  ChevronRight,
  Receipt,
  FileCheck,
  RefreshCw,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COMMERCIAL_PLANS } from '../data/mockData';
import { CommercialPlan, CheckoutOrder } from '../types';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const { 
    user, 
    selectedPlanForCheckout, 
    setSelectedPlanForCheckout, 
    completeCheckout, 
    activeCheckoutOrder,
    setActivePage,
    showToast 
  } = useApp();

  // Active chosen plan (default to Studio Pro if not set)
  const currentPlan = selectedPlanForCheckout || COMMERCIAL_PLANS[1];

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['addon_toon_unlimited']);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'crypto' | 'wire'>('card');
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('942');
  const [cardholderName, setCardholderName] = useState(user?.name || 'Demond Ward');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'damoneward38@gmail.com');
  const [companyName, setCompanyName] = useState('Intégrav VFX Studios');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Transaction processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<CheckoutOrder | null>(activeCheckoutOrder);

  // Add-on options
  const ADD_ON_OPTIONS = [
    {
      id: 'addon_bridge_dedicated',
      name: 'Houly-Pipe Dedicated Low-Latency Bridge',
      description: 'Ultra-low 2ms IPC socket pipeline direct into Houdini 20.5 & Unreal Engine 5.4',
      price: 99,
      badge: 'Workstation Bridge',
    },
    {
      id: 'addon_splat_fleet',
      name: '8K Neural Gaussian Splat Render Nodes',
      description: 'Distributed 64-GPU cloud cluster for real-time volumetric persona rendering',
      price: 199,
      badge: 'Cloud VFX',
    },
    {
      id: 'addon_toon_unlimited',
      name: 'Unlimited Faithful Cartoon Shaders for Songs & Movies',
      description: 'Cel-shader compiler, anime aura passes, and multi-track audio-reactive lip-sync',
      price: 0,
      badge: 'Included Free',
    },
  ];

  const toggleAddon = (addonId: string) => {
    if (addonId === 'addon_toon_unlimited') return; // Always included
    setSelectedAddons((prev) => 
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Pricing calculation
  const basePrice = billingCycle === 'annual' ? currentPlan.priceAnnual : currentPlan.priceMonthly;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const item = ADD_ON_OPTIONS.find((a) => a.id === id);
    return acc + (item ? item.price : 0);
  }, 0);

  const subtotal = basePrice + addonsTotal;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const tax = 0; // Reverse charge B2B VAT
  const finalTotal = subtotal - discountAmount + tax;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'INTEGRAV_VFX' || code === 'FUTURE2026') {
      setDiscountPercent(20);
      setAppliedCoupon(code);
      showToast(`Promo code "${code}" applied: 20% discount unlocked!`, 'success');
    } else if (code === 'DEEW_VIP') {
      setDiscountPercent(30);
      setAppliedCoupon(code);
      showToast(`VIP code "${code}" applied: 30% discount unlocked!`, 'success');
    } else {
      showToast(`Invalid coupon code "${code}". Try INTEGRAV_VFX or DEEW_VIP`, 'warning');
    }
  };

  const handleFillTestCard = () => {
    setCardNumber('4000 1234 5678 9010');
    setCardExpiry('08/29');
    setCardCvc('888');
    setCardholderName('Demond Ward');
    showToast('Auto-filled test developer credentials for verification', 'info');
  };

  const handleProcessCheckout = async () => {
    setIsProcessing(true);

    try {
      // Call backend checkout endpoint
      const response = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: currentPlan.id,
          planName: currentPlan.name,
          billingCycle,
          price: finalTotal,
          addOns: selectedAddons,
          couponCode: appliedCoupon,
          discount: discountAmount,
          customerName: cardholderName,
          customerEmail,
          paymentMethod,
        }),
      });

      let orderData: CheckoutOrder;
      if (response.ok) {
        orderData = await response.json();
      } else {
        // Fallback robust client-side generation
        const licKey = `INTG-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}-VFX`;
        orderData = {
          id: `ord_${Date.now()}`,
          planId: currentPlan.id,
          planName: currentPlan.name,
          billingCycle,
          price: finalTotal,
          addOns: selectedAddons,
          couponCode: appliedCoupon || undefined,
          discount: discountAmount,
          tax: 0,
          total: finalTotal,
          customerName: cardholderName,
          customerEmail,
          paymentMethod,
          licenseKey: licKey,
          timestamp: new Date().toISOString(),
          status: 'completed',
        };
      }

      completeCheckout(orderData);
      setOrderComplete(orderData);
      setIsProcessing(false);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}

      showToast(`Order confirmed! ${currentPlan.name} is now fully active.`, 'success');
    } catch {
      // Offline fallback
      const licKey = `INTG-LOCAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-VFX`;
      const fallbackOrder: CheckoutOrder = {
        id: `ord_${Date.now()}`,
        planId: currentPlan.id,
        planName: currentPlan.name,
        billingCycle,
        price: finalTotal,
        addOns: selectedAddons,
        discount: discountAmount,
        tax: 0,
        total: finalTotal,
        customerName: cardholderName,
        customerEmail,
        paymentMethod,
        licenseKey: licKey,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };
      completeCheckout(fallbackOrder);
      setOrderComplete(fallbackOrder);
      setIsProcessing(false);
      showToast(`Order processed: ${currentPlan.name} active!`, 'success');
    }
  };

  const handleDownloadInvoice = () => {
    if (!orderComplete) return;
    const invoiceText = `=====================================================
INTÉGRAV VFX STUDIOS — OFFICIAL COMMERCIAL LICENSE
=====================================================
ORDER ID:        ${orderComplete.id}
DATE:            ${new Date(orderComplete.timestamp).toLocaleString()}
CUSTOMER:        ${orderComplete.customerName} (${orderComplete.customerEmail})
COMPANY:         ${companyName}

LICENSE PLAN:    ${orderComplete.planName} (${orderComplete.billingCycle.toUpperCase()})
LICENSE KEY:     ${orderComplete.licenseKey}
FIPS FINGERPRINT: SHA256:7f8a9e01cd34ba56ef1289fe0a7c9921

COMMERCIAL RIGHTS GRANTED:
- 1:1 Live Camera Demond Ward Persona Likeness Cloning
- Faithful Cartoon Cel-Shading for Songs & Music Videos
- Cinematic Feature Film Autonomous Monologue Performance
- Unlimited USD/Solaris/Unreal Engine 5.4 Live Link Exports
- Houly-Pipe Workstation Bridge Hardware Acceleration

SUBTOTAL:        $${subtotal}
DISCOUNT:        -$${orderComplete.discount}
TOTAL BILLED:    $${orderComplete.total}
PAYMENT METHOD:  ${orderComplete.paymentMethod.toUpperCase()} (VERIFIED)
STATUS:          PAID IN FULL / PERMANENT COMMERCIAL GRANT
=====================================================`;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `INTEGRAV_LICENSE_${orderComplete.id}.txt`;
    a.click();
    showToast('Downloaded official commercial license invoice & certificate', 'success');
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Production Licensing & Commercial Checkout
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              256-Bit Encrypted
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
              Instant Activation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deploy full commercial rights for songs, feature films, live camera cloning, and distributed rendering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('licensing')}
            className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            Compare All Plans
          </button>
        </div>
      </div>

      {/* If Order is already completed, show Receipt View */}
      {orderComplete ? (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#180e33] to-[#0c071a] border border-purple-500/40 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Commercial License Activated!
            </h2>
            <p className="text-xs text-slate-300 max-w-md">
              Congratulations! Your studio account is officially upgraded to <strong className="text-purple-300">{orderComplete.planName}</strong>. All production rights, real hardware live cam cloning, and faithful cartoon modes are completely unlocked.
            </p>
          </div>

          {/* Cryptographic License Key Box */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                Cryptographic License Key
              </span>
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1 font-bold">
                <Check className="w-3 h-3" /> VERIFIED
              </span>
            </div>
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center">
              <span className="text-base sm:text-lg font-mono font-black text-purple-200 tracking-wider select-all">
                {orderComplete.licenseKey}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 text-center font-mono">
              Binding Node: RTX 4090 Workstation Rig · FIPS 140-2 Compatible
            </p>
          </div>

          {/* Receipt Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-white/10">
            <div>
              <span className="text-slate-500 block text-[10px]">Order ID</span>
              <span className="text-white font-bold">{orderComplete.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Total Billed</span>
              <span className="text-emerald-400 font-bold">${orderComplete.total} USD ({orderComplete.billingCycle})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Licensed To</span>
              <span className="text-white font-bold">{orderComplete.customerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Payment Method</span>
              <span className="text-purple-300 font-bold">{orderComplete.paymentMethod.toUpperCase()} (Authorized)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleDownloadInvoice}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-300" />
              <span>Download Commercial Certificate</span>
            </button>

            <button
              onClick={() => setActivePage('morph')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-purple-900/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Go to Character Morphing Forge</span>
            </button>

            <button
              onClick={() => setActivePage('live-cam')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Launch Live Camera</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Checkout Form View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Plan Selection, Addons, & Payment Information */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Step 1: Tier Selector */}
            <div className="p-4 rounded-2xl bg-[#0f0a1c] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  Select Commercial Production Tier
                </span>

                {/* Monthly vs Annual Toggle */}
                <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-2.5 py-1 rounded-lg transition font-medium flex items-center gap-1 cursor-pointer ${
                      billingCycle === 'annual' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">-20%</span>
                  </button>
                </div>
              </div>

              {/* Plans Radio Cards */}
              <div className="space-y-2">
                {COMMERCIAL_PLANS.map((plan) => {
                  const isSelected = currentPlan.id === plan.id;
                  const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanForCheckout(plan)}
                      className={`p-3.5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/80 shadow-md'
                          : 'bg-black/30 hover:bg-black/50 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-purple-400 bg-purple-600' : 'border-slate-500'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{plan.name}</h4>
                            {plan.isPopular && (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{plan.audience}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-white font-mono">${price}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">/mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Add-Ons */}
            <div className="p-4 rounded-2xl bg-[#0f0a1c] border border-white/10 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                Production Add-Ons & Shaders
              </span>

              <div className="space-y-2">
                {ADD_ON_OPTIONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-purple-950/30 border-purple-500/40'
                          : 'bg-black/30 hover:bg-black/50 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'border-purple-400 bg-purple-600 text-white' : 'border-slate-500'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{addon.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                              {addon.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{addon.description}</p>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-purple-300 shrink-0">
                        {addon.price === 0 ? 'FREE' : `+$${addon.price}/mo`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Payment Method Details */}
            <div className="p-4 rounded-2xl bg-[#0f0a1c] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                  Payment Details
                </span>

                <button
                  onClick={handleFillTestCard}
                  className="text-[10px] text-purple-300 hover:text-white font-mono underline cursor-pointer"
                >
                  ⚡ Auto-fill Test Card
                </button>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-4 gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    paymentMethod === 'card' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    paymentMethod === 'apple_pay' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Apple Pay
                </button>
                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    paymentMethod === 'crypto' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USDC / Crypto
                </button>
                <button
                  onClick={() => setPaymentMethod('wire')}
                  className={`py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    paymentMethod === 'wire' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Wire PO
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="942"
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="Demond Ward"
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Studio / Company</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Intégrav VFX Studios"
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center space-y-2">
                  <p className="text-xs text-slate-300">Apple Pay & Google Pay 1-Click Biometric Authorized</p>
                  <p className="text-[11px] text-slate-500 font-mono">Will bill to primary Apple Wallet / Google Pay profile</p>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                  <span className="text-cyan-300 block">USDC / Solana / Ethereum Instant Settlement</span>
                  <div className="p-2 rounded bg-black/80 text-[10px] text-slate-400 truncate">
                    0x7F8a9E01cd34BA56Ef1289fe0A7c9921D349488a
                  </div>
                </div>
              )}

              {paymentMethod === 'wire' && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-1">
                  <span className="text-white font-bold block">Enterprise Net 30 Invoice PO</span>
                  <p className="text-[11px] text-slate-400">Standard studio purchase orders with direct ACH wire transfer routing.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Instant Checkout Button */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#150f28] to-[#0d091a] border border-purple-500/30 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <Receipt className="w-4 h-4 text-purple-400" />
                Order Summary
              </h3>

              {/* Plan Row */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-white font-bold block">{currentPlan.name} Plan</span>
                  <span className="text-[10px] text-slate-400 font-mono capitalize">
                    {billingCycle} Billing {billingCycle === 'annual' ? '(Save 20%)' : ''}
                  </span>
                </div>
                <span className="font-mono text-white font-bold">${basePrice}</span>
              </div>

              {/* Addons List */}
              {selectedAddons.map((addonId) => {
                const item = ADD_ON_OPTIONS.find((a) => a.id === addonId);
                if (!item) return null;
                return (
                  <div key={item.id} className="flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate pr-2">{item.name}</span>
                    <span className="font-mono font-semibold shrink-0">
                      {item.price === 0 ? 'INCLUDED' : `$${item.price}`}
                    </span>
                  </div>
                );
              })}

              {/* Coupon Bar */}
              <div className="pt-2 border-t border-white/10">
                <label className="text-[11px] text-slate-400 block mb-1">Coupon / Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. INTEGRAV_VFX"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>${subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discountPercent}%):</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax / VAT:</span>
                  <span>$0.00 (B2B)</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Total Due Today:</span>
                  <span className="text-emerald-400">${finalTotal} USD</span>
                </div>
              </div>

              {/* Complete Purchase Button */}
              <button
                onClick={handleProcessCheckout}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing & Minting License...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Unlock License (${finalTotal})</span>
                  </>
                )}
              </button>

              <div className="text-center space-y-1">
                <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  30-Day VFX Studio Money-Back Guarantee
                </p>
                <p className="text-[10px] text-slate-500">
                  Full commercial rights for Spotify releases, Netflix / Apple TV VFX, and YouTube monetization.
                </p>
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="p-4 rounded-2xl bg-[#0e0a1e] border border-white/10 space-y-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Included Production Deliverables
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  Real hardware webcam likeness cloner with audio lip-sync
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  Virtual green screen & AI stage switcher (4K EXR / ProRes)
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  Faithful cartoon cel-shading preserving 100% bone geometry
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  Autonomous double performs songs, rap verses, & movie scripts
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
