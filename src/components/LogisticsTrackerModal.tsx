import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation,
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LogisticsTrackerModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    activeOrderForTracking, 
    updateOrderStatus,
    orders 
  } = useApp();

  const currentOrder = activeOrderForTracking || orders[0];
  const [stage, setStage] = useState(currentOrder?.deliveryTracking.currentStage || 4);
  const [distanceRemaining, setDistanceRemaining] = useState(currentOrder?.deliveryTracking.liveDistanceKm || 3.4);

  if (activeModal !== 'logistics-tracker' || !currentOrder) return null;

  const stages = [
    { num: 1, label: 'Order Placed', time: '10:00 AM', done: stage >= 1 },
    { num: 2, label: 'Farmer Confirmed', time: '10:15 AM', done: stage >= 2 },
    { num: 3, label: 'Packed & Dispatched', time: '11:00 AM', done: stage >= 3 },
    { num: 4, label: 'In Transit (Live GPS)', time: '11:30 AM', done: stage >= 4 },
    { num: 5, label: 'Delivered', time: stage === 5 ? 'Just Now' : 'Est. 11:55 AM', done: stage >= 5 },
  ];

  const handleAdvanceStage = () => {
    if (stage < 5) {
      const nextStage = stage + 1;
      setStage(nextStage);
      if (nextStage === 5) {
        setDistanceRemaining(0);
        updateOrderStatus(currentOrder.id, 'Delivered');
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      } else if (nextStage === 4) {
        setDistanceRemaining(2.1);
        updateOrderStatus(currentOrder.id, 'In Transit');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Live Logistics & Fleet Tracking</h3>
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                  Order #{currentOrder.id}
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Direct Farm-to-Doorstep Agro Logistics
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

        {/* Map / Route Visualization Graphic */}
        <div className="relative bg-slate-900 h-48 sm:h-56 p-4 overflow-hidden flex flex-col justify-between">
          {/* Simulated Map Grid Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Top route badge */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white">
            <div className="bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GPS Connected (Tata Ace Vehicle Fleet)</span>
            </div>
            <div className="bg-emerald-500 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs">
              {stage === 5 ? 'Arrived at Destination' : `ETA: ~${Math.max(5, Math.round(distanceRemaining * 6))} mins`}
            </div>
          </div>

          {/* Graphical Route with Nodes */}
          <div className="relative z-10 my-auto flex items-center justify-between px-6">
            {/* Origin Node: Farm */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-300 mt-1">Farm Origin</span>
              <span className="text-[10px] text-slate-400">{currentOrder.farmerLocation}</span>
            </div>

            {/* Connecting Road with animated vehicle */}
            <div className="flex-1 mx-3 relative flex items-center">
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-700" 
                  style={{ width: `${(stage / 5) * 100}%` }}
                />
              </div>

              {/* Moving Vehicle Marker */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-white transition-all duration-700"
                style={{ left: `${Math.min(95, Math.max(10, (stage / 5) * 100))}%` }}
              >
                <Truck className="w-4 h-4" />
              </div>
            </div>

            {/* Destination Node: Buyer */}
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg ${
                stage === 5 ? 'bg-emerald-600' : 'bg-slate-700'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-200 mt-1">Buyer Location</span>
              <span className="text-[10px] text-slate-400">{currentOrder.buyerLocation}</span>
            </div>
          </div>

          {/* Bottom Live Metrics */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
            <span>Distance Remaining: <strong className="text-white">{distanceRemaining} km</strong></span>
            <span>Produce: <strong className="text-emerald-400">{currentOrder.item.quantity} {currentOrder.item.unit} {currentOrder.item.productName}</strong></span>
          </div>
        </div>

        {/* Driver Details Card */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                🚚
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-sm">
                  {currentOrder.deliveryTracking.driverName}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {currentOrder.deliveryTracking.vehicleNumber}
                </span>
              </div>
            </div>

            <a
              href={`tel:${currentOrder.deliveryTracking.driverPhone}`}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl font-bold transition shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Fleet</span>
            </a>
          </div>

          {/* Stepper Checklist */}
          <div className="space-y-2 text-xs">
            {stages.map(s => (
              <div
                key={s.num}
                className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                  s.done ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'bg-slate-50/70 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    s.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.done ? '✓' : s.num}
                  </div>
                  <span>{s.label}</span>
                </div>
                <span className="text-[11px] text-slate-400">{s.time}</span>
              </div>
            ))}
          </div>

          {/* Advance Step Button for SIH Prototype Demonstration */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Interactive demonstration controller
            </span>
            {stage < 5 ? (
              <button
                onClick={handleAdvanceStage}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate Next Logistics Stage</span>
              </button>
            ) : (
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Delivery Successfully Completed!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
