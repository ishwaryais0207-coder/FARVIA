import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardNotificationBar } from '../components/DashboardNotificationBar';
import { 
  Search, 
  Layers, 
  Sparkles, 
  Truck, 
  Star, 
  MapPin, 
  Calendar, 
  Plus, 
  Percent, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2 
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const { 
    currentUser, 
    products, 
    requirements, 
    orders, 
    setActiveModal, 
    setActiveOrderForTracking,
    setActiveProductForDetails,
    setCurrentView,
    setIsNotificationCenterOpen,
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // My requirements
  const myReqs = requirements.filter(r => r.buyerId === currentUser.id);

  // My orders
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);

  // Surplus products
  const surplusDeals = products.filter(p => p.isSurplus).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Buyer Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 font-extrabold text-2xl flex items-center justify-center border border-amber-200 shadow-inner">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentUser.name}
              </h1>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {currentUser.buyerCategory || 'Hotel & Catering'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              📍 {currentUser.location} • Procurement Verified • Direct Sourcing Model
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            id="buyer-post-requirement-btn"
            onClick={() => setActiveModal('post-requirement')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs shadow-md shadow-amber-600/20 transition hover:scale-105 active:scale-95"
          >
            <Layers className="w-4 h-4" />
            <span>Post Purchase Requirement (Main Innovation)</span>
          </button>

          <button
            onClick={() => setCurrentView('marketplace')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-2xl text-xs transition"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Explore Farm Marketplace</span>
          </button>
        </div>
      </div>

      {/* Live Mock Notification Center & Instant Simulator Triggers */}
      <DashboardNotificationBar 
        onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)} 
      />

      {/* Metrics Row: Active Needs, Savings vs Mandi, Active Deliveries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Requirements */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Purchase Requirements</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">{myReqs.length} Open Posts</span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              AI has auto-matched 5 candidate farmers nearby
            </span>
          </div>
          <button
            onClick={() => setCurrentView('smart-matches')}
            className="text-[10px] text-emerald-700 font-bold hover:underline text-left flex items-center gap-1"
          >
            <span>Review AI Farmer Matches</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Procurement Savings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Procurement Savings vs Retail</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-700">~23% Cost Cut</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              Eliminated ₹12/kg in intermediate broker commissions
            </span>
          </div>
          <button
            onClick={() => setActiveModal('price-transparency')}
            className="text-[10px] text-emerald-700 font-bold hover:underline text-left"
          >
            View supply chain breakdown →
          </button>
        </div>

        {/* Live Logistics */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Fleet Deliveries</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">
              {myOrders.filter(o => o.status === 'In Transit').length} In Transit
            </span>
            <span className="text-[11px] text-blue-600 font-bold block mt-0.5">
              Live GPS Fleet arriving in ~24 mins
            </span>
          </div>
          <button
            onClick={() => {
              const inTransit = myOrders.find(o => o.status === 'In Transit') || myOrders[0];
              if (inTransit) {
                setActiveOrderForTracking(inTransit);
                setActiveModal('logistics-tracker');
              }
            }}
            className="text-[10px] text-blue-700 font-bold hover:underline text-left"
          >
            Launch live GPS map →
          </button>
        </div>
      </div>

      {/* Main Content: Active Requirements + Suggested Farmers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Active Requirements with AI Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    My Posted Requirements & AI Matches
                  </h2>
                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full">
                    Reverse Discovery
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Requirements you posted for which our AI continuously scans nearby farmer harvests
                </p>
              </div>
              <button
                onClick={() => setActiveModal('post-requirement')}
                className="bg-amber-50 text-amber-950 hover:bg-amber-100 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-amber-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post New</span>
              </button>
            </div>

            <div className="space-y-3">
              {myReqs.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition text-xs space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {req.productName} ({req.tamilProductName})
                      </span>
                      <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2 py-0.5 rounded">
                        Budget: Max ₹{req.maxBudgetPerUnit}/{req.unit}
                      </span>
                      <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        Needed: {req.requiredQuantity} {req.unit}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Required by: <strong>{req.requiredByDate}</strong>
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px]">
                    Delivery: {req.deliveryLocation} ({req.deliveryPreference} delivery)
                  </p>

                  {/* AI Smart Match Callout inside the requirement */}
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-emerald-950 font-bold text-[11px]">
                        AI Found 94% Match: Farmer Murugan (Melur, 8 km away) has 100 kg at ₹28/kg!
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentView('smart-matches')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded-lg text-[10px] shrink-0 transition"
                    >
                      Inspect Match Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders & Delivery Tracking */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Active Direct Procurement Orders
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time status of orders placed directly with farmers
                </p>
              </div>
              <button
                onClick={() => setCurrentView('orders')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                All Orders ({myOrders.length})
              </button>
            </div>

            <div className="space-y-3">
              {myOrders.map(ord => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={ord.item.imageUrl} alt={ord.item.productName} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {ord.item.quantity} {ord.item.unit} {ord.item.productName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'In Transit' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        Farmer: {ord.farmerName} ({ord.farmerLocation}) • Total: ₹{ord.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.paymentStatus === 'Pending' ? (
                      <button
                        onClick={() => {
                          setActiveModal('upi-payment');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition"
                      >
                        Pay ₹{ord.totalAmount} via UPI
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveOrderForTracking(ord);
                          setActiveModal('logistics-tracker');
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live Fleet</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Surplus Produce Deals & Quick Sourcing */}
        <div className="space-y-4">
          {/* Surplus Clearance Alert Card */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-300 rounded-3xl p-5 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-950 text-sm flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-600" />
                Surplus Produce (Bulk Deals)
              </span>
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                25% Off
              </span>
            </div>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Help prevent agricultural food waste. Farmers have listed high-volume excess harvest ready for quick pickup.
            </p>

            <div className="space-y-2">
              {surplusDeals.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setActiveProductForDetails(prod);
                    setActiveModal('product-details');
                  }}
                  className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between cursor-pointer hover:border-amber-400 transition"
                >
                  <div className="flex items-center gap-2">
                    <img src={prod.imageUrl} alt={prod.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 block">{prod.name}</span>
                      <span className="text-[10px] text-slate-500">{prod.quantity} {prod.unit} • {prod.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-700 block">₹{prod.expectedPrice}/{prod.unit}</span>
                    <span className="text-[9px] text-amber-600 font-bold">25% below retail</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('surplus')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition text-center block shadow-xs"
            >
              Browse All Surplus Deals
            </button>
          </div>

          {/* Direct Sourcing Trust & Guarantee */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FARVIA Buyer Guarantee</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              • 100% farm-gate freshness with zero days spent in intermediary warehouses.
              • Direct UPI payment settlements straight to the farmer's bank account.
              • Real-time delivery fleet tracking with contactable driver and verified weights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
