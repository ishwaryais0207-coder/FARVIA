import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Percent, 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  HeartHandshake 
} from 'lucide-react';

export const SurplusProducePage: React.FC = () => {
  const { 
    products, 
    setActiveModal, 
    setActiveProductForDetails, 
    language 
  } = useApp();

  const surplusProducts = products.filter(p => p.isSurplus);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full backdrop-blur-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-200" />
            <span>Zero Agricultural Food Waste Initiative</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {language === 'ta' ? 'உபரி விளைச்சல் & நேரடி சலுகை' : 'Surplus Produce Clearance Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-normal">
            When farmers harvest bumper yields, perishables risk rotting if not cleared fast. Here, hotels, canteens, restaurants, and food processors procure fresh crops at 20–30% discounts while ensuring farmers recover full production costs!
          </p>
        </div>
      </div>

      {/* Impact Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Food Waste Prevented</span>
          <span className="text-2xl font-black text-amber-600 block mt-1">12,450 kg</span>
          <span className="text-[10px] text-slate-400">Rescued from rotting in farm fields</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Buyer Bulk Savings</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">~25% Discount</span>
          <span className="text-[10px] text-slate-400">Lower procurement expenses for hotels</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Farmer Cost Recovery</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">100% Guaranteed</span>
          <span className="text-[10px] text-slate-400">Immediate cash flow through UPI</span>
        </div>
      </div>

      {/* Surplus Produce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {surplusProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border-2 border-amber-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-md">
                  ⚡ Surplus Clearance ({product.surplusDiscountPercent || 25}% Off)
                </span>
                <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white font-bold text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {product.quantity} {product.unit} available
                </span>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 leading-tight">{product.name}</h3>
                    <span className="text-xs text-slate-500">{product.tamilName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xl text-amber-600">₹{product.expectedPrice}</span>
                    <span className="text-[10px] text-slate-400 line-through ml-1">₹{product.marketAveragePrice}</span>
                    <span className="text-[10px] text-slate-500 block">/ {product.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Farmer: {product.farmerName}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {product.location}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 leading-snug">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => {
                  setActiveProductForDetails(product);
                  setActiveModal('product-details');
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Procure Bulk Surplus Batch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
