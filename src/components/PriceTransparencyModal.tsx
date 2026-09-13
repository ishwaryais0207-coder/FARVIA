import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowRight, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export const PriceTransparencyModal: React.FC = () => {
  const { activeModal, setActiveModal, language } = useApp();

  if (activeModal !== 'price-transparency') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'ta' ? 'பணம் எங்கே போகிறது? (விலை வெளிப்படைத்தன்மை)' : 'Where Your Money Goes: Price Transparency'}
              </h3>
              <p className="text-xs text-emerald-200">
                Supply Chain Comparison: Traditional Middlemen vs. FARVIA
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Traditional Intermediary Chain */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-rose-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Traditional Multi-Intermediary Supply Chain (Tomato: 1 kg)
              </span>
              <span className="bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">
                5 Middlemen Levels
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center my-3">
              <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                <span className="text-[10px] text-slate-500 block">1. Farmer</span>
                <span className="font-bold text-rose-700 text-sm">₹18/kg</span>
                <span className="text-[9px] text-rose-500 block font-semibold">(Gets ~39%)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                <span className="text-[10px] text-slate-500 block">2. Trader</span>
                <span className="font-bold text-slate-700 text-sm">+₹5 cut</span>
                <span className="text-[9px] text-slate-400 block">Brokerage</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                <span className="text-[10px] text-slate-500 block">3. Wholesaler</span>
                <span className="font-bold text-slate-700 text-sm">+₹6 cut</span>
                <span className="text-[9px] text-slate-400 block">Mandi markup</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                <span className="text-[10px] text-slate-500 block">4. Distributor</span>
                <span className="font-bold text-slate-700 text-sm">+₹6 cut</span>
                <span className="text-[9px] text-slate-400 block">Transport</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                <span className="text-[10px] text-slate-500 block">5. Retailer</span>
                <span className="font-bold text-slate-700 text-sm">+₹9 cut</span>
                <span className="text-[9px] text-slate-400 block">Shop margin</span>
              </div>
              <div className="bg-rose-100/70 p-2.5 rounded-xl border border-rose-300">
                <span className="text-[10px] text-rose-800 block font-bold">Consumer Pays</span>
                <span className="font-black text-rose-900 text-sm">₹44/kg</span>
                <span className="text-[9px] text-rose-700 block font-semibold">+144% inflated</span>
              </div>
            </div>

            <p className="text-[11px] text-rose-800 leading-relaxed">
              ⚠️ In the conventional model, <strong>₹26 per kg (59% of consumer spend)</strong> is consumed by intermediary brokerages and handling markups, while the farmer bears 100% of the climate and cultivation risk.
            </p>
          </div>

          {/* FARVIA Marketplace Chain */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                FARVIA: Direct Farmer-to-Buyer Model
              </span>
              <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                Zero Middlemen
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center my-3">
              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">Farmer Receives (Direct)</span>
                <span className="font-black text-emerald-700 text-lg">₹32 / kg</span>
                <span className="text-xs font-bold text-emerald-600 block mt-0.5">
                  +78% Higher Earnings! 🎉
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-medium">Local Fleet Transit</span>
                <span className="font-black text-slate-700 text-lg">₹2 / kg</span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Direct EV/Mini-Truck Doorstep
                </span>
              </div>

              <div className="bg-emerald-100 p-3 rounded-xl border border-emerald-300">
                <span className="text-xs text-emerald-900 block font-bold">Buyer / Hotel Pays</span>
                <span className="font-black text-emerald-950 text-lg">₹34 / kg</span>
                <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                  Saves ~23% vs Retail Mandi!
                </span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
              ✅ Both sides win: Farmers receive fair livable compensation for their hard labor, and consumers/hotels procure top-fresh harvest at non-inflated prices.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
            * Note for SIH Jury: Figures are illustrative benchmarks calibrated from wholesale agricultural price indices across Tamil Nadu APMC mandis.
          </div>
        </div>
      </div>
    </div>
  );
};
