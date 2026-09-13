import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, CheckCircle2, ChevronRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SIH_STEPS = [
  { step: 1, title: 'Step 1: Farmer Logs in', desc: 'Murugan (Farmer, Madurai) active on dashboard', role: 'farmer', view: 'farmer-dashboard' },
  { step: 2, title: 'Step 2: Voice Input (Tamil)', desc: 'User speaks: "என்னிடம் 100 கிலோ தக்காளி இருக்கு. கிலோ 30 ரூபாய்க்கு விற்கணும்."', role: 'farmer', modal: 'voice-assistant' },
  { step: 3, title: 'Step 3: Speech Parsed', desc: 'System parses: Tomato, 100 kg, ₹30/kg', role: 'farmer', modal: 'add-product' },
  { step: 4, title: 'Step 4: Product Published', desc: 'Farmer confirms & publishes country tomatoes to marketplace', role: 'farmer', view: 'marketplace' },
  { step: 5, title: 'Step 5: Buyer Posts Requirement', desc: 'Hotel Saravana Bhavan posts: "Need 100 kg tomato tomorrow (Max ₹30)"', role: 'buyer', modal: 'post-requirement' },
  { step: 6, title: 'Step 6: AI Smart Matching', desc: 'AI algorithm discovers nearby Farmer Murugan (8 km away)', role: 'buyer', view: 'smart-matches' },
  { step: 7, title: 'Step 7: 94% Match Score', desc: 'Explains: "Nearby farmer with sufficient quantity and fair-market price"', role: 'buyer', view: 'smart-matches' },
  { step: 8, title: 'Step 8: AI Fair Price', desc: 'AI recommends fair selling range ₹29–₹32/kg with Mandi comparison', role: 'buyer', view: 'fair-price' },
  { step: 9, title: 'Step 9: Buyer Selects Farmer', desc: 'Buyer clicks Direct Buy to order 100 kg Tomato', role: 'buyer', modal: 'direct-buy' },
  { step: 10, title: 'Step 10: Business Delivery', desc: 'Bulk delivery chosen for hotel; assigned to local fleet', role: 'buyer', view: 'orders' },
  { step: 11, title: 'Step 11: Digital UPI Payment', desc: 'Instant UPI sandbox transaction verified with Txn ID', role: 'buyer', modal: 'upi-payment' },
  { step: 12, title: 'Step 12: Order Confirmed', desc: 'Live logistics tracking activated with driver vehicle details', role: 'buyer', modal: 'logistics-tracker' },
  { step: 13, title: 'Step 13: 5-Star Ratings', desc: 'Both parties rate freshness and direct pricing', role: 'buyer', modal: 'rate-order' },
  { step: 14, title: 'Step 14: Earnings & Impact', desc: 'Dashboard records farmer revenue uplift (+78%) and waste saved', role: 'farmer', view: 'impact' },
];

export const SihDemoBar: React.FC = () => {
  const { 
    sihStep, 
    setSihStep, 
    setRole, 
    setCurrentView, 
    setActiveModal, 
    resetToDemoData,
    createOrder,
    orders
  } = useApp();

  const currentStepData = SIH_STEPS.find(s => s.step === sihStep) || SIH_STEPS[0];

  const handleExecuteStep = (stepNum: number) => {
    const s = SIH_STEPS.find(item => item.step === stepNum);
    if (!s) return;
    setSihStep(stepNum);

    if (s.role) setRole(s.role as any);
    if (s.view) setCurrentView(s.view);
    if (s.modal) setActiveModal(s.modal);
    else setActiveModal(null);

    // Special triggers for SIH demo flow
    if (stepNum === 11) {
      // Open UPI payment for first active order
      setActiveModal('upi-payment');
    } else if (stepNum === 12) {
      setActiveModal('logistics-tracker');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } else if (stepNum === 14) {
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleNext = () => {
    if (sihStep < 14) {
      handleExecuteStep(sihStep + 1);
    } else {
      handleExecuteStep(1);
    }
  };

  return (
    <div id="sih-demo-bar" className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border-b border-emerald-700/50 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>SIH 2026 Evaluation Mode</span>
          </div>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            14-Step Presentation Walkthrough:
          </span>
        </div>

        {/* Current Active Step Pill */}
        <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
          <span className="bg-emerald-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded">
            {currentStepData.step}/14
          </span>
          <div className="text-xs">
            <span className="font-semibold text-emerald-200">{currentStepData.title}</span>
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="text-slate-300 hidden md:inline">{currentStepData.desc}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="sih-next-step-btn"
            onClick={handleNext}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-md transition shadow hover:shadow-emerald-500/20"
          >
            <span>{sihStep === 14 ? 'Finish / Restart Flow' : 'Next Demo Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="sih-reset-btn"
            onClick={resetToDemoData}
            title="Reset to fresh demo state"
            className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1.5 rounded-md text-xs transition border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
