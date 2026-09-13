import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateFairPrice } from '../utils/fairPriceEngine';
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  Info 
} from 'lucide-react';

export const FairPriceAnalyticsPage: React.FC = () => {
  const { language } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [testPrice, setTestPrice] = useState(30);

  const priceAnalysis = calculateFairPrice(selectedCrop, testPrice, 'Madurai');

  const cropList = ['Tomato', 'Onion', 'Potato', 'Banana', 'Brinjal', 'Carrot', 'Paddy', 'Mango'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-400/30">
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span>APMC Mandi Benchmarked • Transparent Algorithm</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {language === 'ta' ? 'AI நியாய விலை பகுப்பாய்வு மையம்' : 'AI Fair Price Recommendation Engine'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-normal">
            Unlike opaque proprietary models, our Fair Price Engine openly factors wholesale mandi auctions, regional retail markups, arrival volumes, and buyer demand forecasts so both farmers and buyers trade with confidence.
          </p>
        </div>
      </div>

      {/* Crop Selector & Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Calculator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            Simulate Fair Price Analysis
          </h3>

          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-700">Select Agricultural Crop:</label>
            <div className="grid grid-cols-2 gap-2">
              {cropList.map(crop => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-2.5 rounded-xl border text-left font-bold transition text-xs ${
                    selectedCrop === crop
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2">
            <label className="font-semibold text-slate-700">Test Your Price (₹ / kg):</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="100"
                value={testPrice}
                onChange={(e) => setTestPrice(Number(e.target.value))}
                className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="font-black text-base text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 min-w-[75px] text-center">
                ₹{testPrice}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Pricing Verdict:
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                priceAnalysis.verdict === 'Fair & Competitive'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : priceAnalysis.verdict === 'Underpriced'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {priceAnalysis.verdict}
              </span>
              <span className="text-slate-600 font-medium">
                {priceAnalysis.verdict === 'Fair & Competitive'
                  ? 'Healthy profit for farmer, attractive for buyer'
                  : priceAnalysis.verdict === 'Underpriced'
                  ? 'Farmer could earn more based on demand'
                  : 'Slightly above regional average'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Factor Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedCrop} — Mandi & Market Dynamics
                </h3>
                <span className="text-xs text-slate-500">Benchmark location: Madurai / Central Tamil Nadu APMC</span>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-500/30 px-4 py-2 rounded-2xl text-right">
                <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold block">
                  AI Recommended Range
                </span>
                <span className="text-xl font-black text-emerald-700">
                  ₹{priceAnalysis.recommendedMin} – ₹{priceAnalysis.recommendedMax} / kg
                </span>
              </div>
            </div>

            {/* Mandi vs Retail Comparison Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-medium">Mandi Wholesale Rate:</span>
                <span className="font-bold text-slate-900 text-base">₹{priceAnalysis.mandiWholesaleRate} / kg</span>
                <span className="text-[10px] text-slate-400 block">Auction floor price</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-medium">City Retail Price:</span>
                <span className="font-bold text-slate-900 text-base">₹{priceAnalysis.averageRetailPrice} / kg</span>
                <span className="text-[10px] text-slate-400 block">Supermarket rate</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-medium">Regional Supply:</span>
                <span className="font-bold text-slate-900 text-base">{priceAnalysis.supplyFactor}</span>
                <span className="text-[10px] text-slate-400 block">Active farm volume</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-medium">Demand Forecast:</span>
                <span className="font-bold text-emerald-700 text-base">{priceAnalysis.demandFactor} (+18%)</span>
                <span className="text-[10px] text-slate-400 block">Hotels & retail surge</span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Algorithm Justification:
              </span>
              <p className="text-emerald-900 text-sm leading-relaxed font-medium">
                {priceAnalysis.explanation}
              </p>
            </div>

            {/* Transparent Rules of the Engine */}
            <div className="pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600">
              <span className="font-bold text-slate-900 block">Transparent Algorithm Principles:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Guarantees farmer receives at least <strong>25% more</strong> than the lowest mandi distress-sale price.</li>
                <li>Ensures institutional buyers pay at least <strong>15–20% less</strong> than fragmented retail markets.</li>
                <li>Accounts for daily mandi arrival volumes fetched from government agricultural market feeds.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
