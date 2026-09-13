import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Plus, 
  Store, 
  Home, 
  Truck, 
  ArrowRight,
  Filter 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RequirementsPage: React.FC = () => {
  const { 
    requirements, 
    setActiveModal, 
    setCurrentView, 
    role, 
    currentUser, 
    products, 
    language 
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [supplyClaimedId, setSupplyClaimedId] = useState<string | null>(null);

  const buyerCategories = ['All', 'hotel', 'restaurant', 'supermarket', 'shop', 'consumer'];

  const filteredRequirements = requirements.filter(r => 
    filterCategory === 'All' || r.buyerCategory === filterCategory
  );

  const handleFarmerClaim = (reqId: string) => {
    setSupplyClaimedId(reqId);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      setCurrentView('smart-matches');
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-300 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-wider">
            ⭐ Main Innovation • Reverse Supply Discovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'ta' ? 'கொள்முதல் தேவைகள் (Buyer Requirements)' : 'Open Buyer Purchase Requirements'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Instead of farmers struggling to hunt for buyers, hotels and shops post exactly what produce they need. Our AI matches farmers with guaranteed direct demand.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('post-requirement')}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs transition shadow-md flex items-center gap-2 hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Purchase Requirement</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Buyer Type:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {buyerCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filterCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'All' ? 'All Buyer Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRequirements.map(req => (
          <div
            key={req.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Top Row: Crop & Category */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight">
                    {req.productName}
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold">{req.tamilProductName}</span>
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {req.buyerCategory}
                </span>
              </div>

              {/* Requirement Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Quantity Needed:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {req.requiredQuantity} {req.unit}
                  </span>
                </div>

                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 block font-medium">Max Budget:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    ₹{req.maxBudgetPerUnit} / {req.unit}
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Needed By:</span>
                  <span className="font-bold text-slate-900">{req.requiredByDate}</span>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Delivery Mode:</span>
                  <span className="font-bold text-slate-900 capitalize">{req.deliveryPreference}</span>
                </div>
              </div>

              {/* Buyer & Destination */}
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Store className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{req.buyerName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{req.deliveryLocation}</span>
                </div>
              </div>

              {/* Additional notes */}
              {req.additionalNotes && (
                <p className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl">
                  "{req.additionalNotes}"
                </p>
              )}
            </div>

            {/* AI Match CTA / Supply Fulfillment */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  AI Matching Active
                </span>
                <span className="text-[10px] text-slate-400">0% Middleman Fees</span>
              </div>

              {supplyClaimedId === req.id ? (
                <div className="bg-emerald-100 text-emerald-900 font-bold py-2 rounded-xl text-xs text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Supply Claimed! Loading AI Match...</span>
                </div>
              ) : (
                <button
                  onClick={() => handleFarmerClaim(req.id)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>I Can Supply This Produce!</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
