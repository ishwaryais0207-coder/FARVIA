import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { 
  Sprout, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Mic, 
  TrendingUp, 
  Truck, 
  Layers, 
  Award,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    setRole, 
    setCurrentView, 
    language, 
    setActiveModal,
    products,
    requirements 
  } = useApp();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          {/* SIH 2026 Problem Statement Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-300 shadow-xs">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Smart India Hackathon 2026 • Agricultural Supply Chain Innovation</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight max-w-4xl mx-auto">
            {t('heroTitle', language)}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle', language)}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="hero-farmer-btn"
              onClick={() => {
                setRole('farmer');
                setCurrentView('farmer-dashboard');
              }}
              className="flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition shadow-lg shadow-emerald-800/20 hover:scale-105 active:scale-95"
            >
              <Sprout className="w-5 h-5 text-emerald-300" />
              <span>I'm a Farmer (விவசாயி)</span>
            </button>

            <button
              id="hero-buyer-btn"
              onClick={() => {
                setRole('buyer');
                setCurrentView('buyer-dashboard');
              }}
              className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>I'm a Buyer / Hotel / Store</span>
            </button>

            <button
              id="hero-voice-btn"
              onClick={() => setActiveModal('voice-assistant')}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3.5 rounded-2xl text-sm transition shadow-md hover:scale-105"
            >
              <Mic className="w-5 h-5" />
              <span>Try Tamil Voice Assistant</span>
            </button>
          </div>

          {/* Live Quick Counter */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs">
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="font-black text-xl text-emerald-700 block">450+</span>
              <span className="text-slate-500 font-medium">Verified Tamil Farmers</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="font-black text-xl text-slate-900 block">₹3.4 Cr</span>
              <span className="text-slate-500 font-medium">Direct Transactions</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="font-black text-xl text-emerald-700 block">+78%</span>
              <span className="text-slate-500 font-medium">Farmer Revenue Gain</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="font-black text-xl text-amber-600 block">12.4 Tonnes</span>
              <span className="text-slate-500 font-medium">Surplus Food Saved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Supply Chain Comparison Section (Section 19 & 27) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Agricultural Dilemma
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Why Direct Matching Changes Everything
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Conventional agricultural supply chains introduce 4 to 6 tiers of traders, leaving the farmer with less than a third of the final retail price.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Traditional Supply Chain Box */}
            <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-rose-900 text-sm flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Traditional Multi-Tier Intermediary Model
                  </span>
                  <span className="bg-rose-200 text-rose-900 font-bold text-[10px] px-2 py-0.5 rounded">
                    5 Cut Points
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-rose-100">
                    <span className="font-medium text-slate-700">1. Rural Farmer</span>
                    <span className="font-bold text-rose-700">Receives only ₹18 / kg</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/70 p-2 rounded-xl text-slate-500 text-[11px]">
                    <span>2. Village Trader Brokerage</span>
                    <span>+₹5 / kg markup</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/70 p-2 rounded-xl text-slate-500 text-[11px]">
                    <span>3. APMC Mandi Wholesaler</span>
                    <span>+₹6 / kg auction cut</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/70 p-2 rounded-xl text-slate-500 text-[11px]">
                    <span>4. City Distributor / Transport</span>
                    <span>+₹6 / kg transit margin</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/70 p-2 rounded-xl text-slate-500 text-[11px]">
                    <span>5. Neighborhood Retail Shop</span>
                    <span>+₹9 / kg retail margin</span>
                  </div>
                  <div className="flex items-center justify-between bg-rose-200/80 p-2.5 rounded-xl text-rose-950 font-bold">
                    <span>Final Consumer / Hotel Pays:</span>
                    <span className="font-black text-sm">₹44 / kg</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200 text-[11px] text-rose-800">
                ❌ <strong>59% of consumer money is lost</strong> to middle brokerages. Perishables often rot in transit delays.
              </div>
            </div>

            {/* FARVIA Box */}
            <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-300 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    FARVIA AI-Powered Marketplace
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-bold text-[10px] px-2 py-0.5 rounded">
                    Direct Trade
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Farmer Direct Earnings</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">+78% income boost</span>
                    </div>
                    <span className="font-black text-emerald-700 text-base">₹32 / kg</span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-100 text-slate-600">
                    <div>
                      <span className="font-semibold block text-[11px]">Optimized Electric/Mini Fleet Transit</span>
                      <span className="text-[10px] text-slate-400">Direct farm gate pickup</span>
                    </div>
                    <span className="font-bold text-slate-800">₹2 / kg</span>
                  </div>

                  <div className="flex items-center justify-between bg-emerald-100 p-3 rounded-xl border border-emerald-300 text-emerald-950 font-bold">
                    <div>
                      <span className="block text-xs">Buyer / Hotel Purchase Price:</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Fresh harvest from yesterday</span>
                    </div>
                    <span className="font-black text-emerald-900 text-base">₹34 / kg (Saves 23%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between">
                <span className="text-[11px] text-emerald-900 font-bold">
                  ✅ Transparent, AI fair-priced, and verified via digital UPI.
                </span>
                <button
                  onClick={() => setActiveModal('price-transparency')}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline"
                >
                  View Breakdown
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Innovation Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-black text-slate-900">
            Engineered for Rural Accessibility & Scale
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Built specifically to empower farmers of varying literacy levels with smart tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Buyer Requirement Posting */}
          <div 
            onClick={() => {
              setRole('buyer');
              setCurrentView('requirements');
            }}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Main Innovation
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              Buyer Requirement Posting
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Buyers post exact needs (e.g., 100 kg Tomato tomorrow). The AI algorithm auto-discovers and notifies nearby farmers with matching volume.
            </p>
          </div>

          {/* Card 2: Voice-First in Tamil */}
          <div 
            onClick={() => setActiveModal('voice-assistant')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Rural Accessibility
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              Tamil Voice-First Interface
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Farmers speak in natural Tamil: "என்னிடம் 100 கிலோ தக்காளி இருக்கு...". The system parses crop, quantity, and price with audio confirmation.
            </p>
          </div>

          {/* Card 3: AI Smart Matching & Fair Price */}
          <div 
            onClick={() => setCurrentView('smart-matches')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Explainable AI
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              94% Match & Fair Price Range
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Dynamic multi-factor scoring factoring proximity, quantity, harvest freshness, and regional Mandi rates without fake black-box claims.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Direct from Farms */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Fresh Harvests Listed Today
            </h2>
            <p className="text-xs text-slate-500">
              Directly available from farmers across Tamil Nadu
            </p>
          </div>
          <button
            onClick={() => setCurrentView('marketplace')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Explore Full Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map(prod => (
            <div
              key={prod.id}
              onClick={() => {
                setRole('buyer');
                setCurrentView('marketplace');
              }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="relative h-36">
                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute bottom-2 left-2 bg-slate-950/70 text-white font-bold text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {prod.location}
                </span>
                {prod.isSurplus && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md shadow">
                    Surplus Deal
                  </span>
                )}
              </div>
              <div className="p-3 text-xs">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                  <span className="font-black text-emerald-700 text-sm">₹{prod.expectedPrice}/{prod.unit}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Available: {prod.quantity} {prod.unit}</span>
                  <span className="text-emerald-600 font-semibold">{prod.farmerRating}★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
