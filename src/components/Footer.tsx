import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Award, ShieldCheck, Heart, Phone, Mail, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setRole, language, setLanguage, setActiveModal } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white font-black text-lg">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span>FARVIA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              “From Farmer to Buyer, Fair and Direct.”
            </p>
            <div className="inline-flex items-center gap-1.5 bg-slate-800 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-bold border border-slate-700">
              <Award className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026</span>
            </div>
          </div>

          {/* Core Portals */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Marketplace Portals
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setRole('farmer');
                    setCurrentView('farmer-dashboard');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Farmer Dashboard (விவசாயி)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('buyer');
                    setCurrentView('buyer-dashboard');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Buyer & Procurement Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="hover:text-emerald-400 transition"
                >
                  Direct Produce Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('requirements')}
                  className="hover:text-emerald-400 transition"
                >
                  Buyer Requirements Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('surplus')}
                  className="hover:text-emerald-400 transition"
                >
                  Surplus Produce Clearance Deals
                </button>
              </li>
            </ul>
          </div>

          {/* AI Engines & Analytics */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              AI Engines & Trust
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('smart-matches')}
                  className="hover:text-emerald-400 transition"
                >
                  AI Smart Location Matching Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('fair-price')}
                  className="hover:text-emerald-400 transition"
                >
                  Mandi Benchmark Fair Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('price-transparency')}
                  className="hover:text-emerald-400 transition"
                >
                  Where Your Money Goes (Breakdown)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('impact')}
                  className="hover:text-emerald-400 transition"
                >
                  SIH Socio-Economic Impact
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="hover:text-emerald-400 transition"
                >
                  Farmer Land Patta/Chitta KYC
                </button>
              </li>
            </ul>
          </div>

          {/* Accessibility & Languages */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Rural Accessibility
            </h4>
            <p className="text-[11px] text-slate-400">
              Designed specifically with voice-first workflows and multilingual interfaces for farmers with diverse literacy levels.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('ta')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  language === 'ta' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  language === 'en' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  language === 'hi' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                हिन्दी
              </button>
            </div>
            <button
              onClick={() => setActiveModal('voice-assistant')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold py-2 rounded-xl text-xs transition"
            >
              🎙️ Open Tamil Voice Assistant
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p>
            © 2026 FARVIA • Smart India Hackathon Agricultural Supply Chain Innovation.
          </p>
          <div className="flex items-center gap-4">
            <span>Zero Broker Commissions</span>
            <span>•</span>
            <span>Direct UPI Settlement</span>
            <span>•</span>
            <span>100% Farm Fresh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
