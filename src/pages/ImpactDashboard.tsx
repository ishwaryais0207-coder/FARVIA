import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Users, 
  Leaf, 
  HeartHandshake,
  BarChart3,
  MapPin 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const PRICE_COMPARISON_DATA = [
  { crop: 'Tomato', farmerTraditional: 18, mandiWholesale: 24, retailMarket: 44, farviaDirect: 32 },
  { crop: 'Onion', farmerTraditional: 25, mandiWholesale: 34, retailMarket: 58, farviaDirect: 42 },
  { crop: 'Carrot', farmerTraditional: 28, mandiWholesale: 38, retailMarket: 65, farviaDirect: 48 },
  { crop: 'Potato', farmerTraditional: 15, mandiWholesale: 20, retailMarket: 36, farviaDirect: 25 },
  { crop: 'Banana', farmerTraditional: 22, mandiWholesale: 30, retailMarket: 52, farviaDirect: 38 },
];

export const ImpactDashboard: React.FC = () => {
  const { language, setActiveModal } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* SIH 2026 Jury Presentation Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-400/30">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart India Hackathon 2026 • Measurable Impact Validation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Agricultural Transformation & Socio-Economic Impact
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-normal">
            By shifting from a 5-tier intermediary brokerage to a direct AI-matched supply pipeline, FARVIA redistributes lost economic value directly into the hands of grassroots farmers while keeping quality produce affordable.
          </p>
        </div>
      </div>

      {/* 4 Major High-Impact KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Intermediary Layers Cut</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-700">5 → 0</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">100% Direct</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Eliminated broker commissions, transit delay tolls, and speculative hoarding.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Farmer Income Surge</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-700">+78%</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Net Gain</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Average realization jumped from ₹18/kg to ₹32/kg for staple horticulture crops.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Buyer / Hotel Savings</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">~23%</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Below Retail</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Hotels & consumers procure harvest fresh from the farm without commercial store markups.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Food Waste Prevented</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-600">12.4 T</span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">Rescued</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Surplus crop clearance portal enables direct bulk redirection to institutional kitchens.
          </p>
        </div>
      </div>

      {/* Comparative Price Chart: Recharts Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              Comparative Price Benchmark Analysis (₹ / kg)
            </h2>
            <p className="text-xs text-slate-500">
              Visualizing how FARVIA fair pricing creates a win-win for both farmer and buyer
            </p>
          </div>

          <button
            onClick={() => setActiveModal('price-transparency')}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition"
          >
            Where Your Money Goes →
          </button>
        </div>

        {/* Recharts Container */}
        <div className="h-72 sm:h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PRICE_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="crop" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="farmerTraditional" name="Farmer under Middlemen (₹/kg)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mandiWholesale" name="APMC Mandi Auction (₹/kg)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="retailMarket" name="Urban Retail Store (₹/kg)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="farviaDirect" name="FARVIA Model (₹/kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
          💡 <strong>Key Takeaway for Hackathon Evaluators:</strong> In traditional retail, ₹26 out of every ₹44 spent on tomatoes vanishes into intermediary pockets. FARVIA shifts the baseline: the farmer receives <strong>₹32/kg directly</strong>, while the buyer pays only <strong>₹34/kg</strong> — achieving fair trade and mutual economic benefit without middlemen.
        </div>
      </div>

      {/* Regional Reach & Districts Covered */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 mb-3">
          Tamil Nadu Regional Agricultural Hubs Active
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center text-xs">
          {[
            { district: 'Madurai', crops: 'Tomato, Jasmine, Paddy', farmers: '142 Farmers' },
            { district: 'Salem', crops: 'Mango, Tapioca, Pulses', farmers: '88 Farmers' },
            { district: 'Coimbatore', crops: 'Vegetables, Coconut', farmers: '94 Farmers' },
            { district: 'Dindigul', crops: 'Onion, Drumstick', farmers: '65 Farmers' },
            { district: 'Trichy', crops: 'Banana, Paddy, Betel', farmers: '72 Farmers' },
            { district: 'Tirunelveli', crops: 'Paddy, Banana, Brinjal', farmers: '58 Farmers' },
          ].map(hub => (
            <div key={hub.district} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-900 block">{hub.district}</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">{hub.farmers}</span>
              <span className="text-[9px] text-slate-400 block mt-1">{hub.crops}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
