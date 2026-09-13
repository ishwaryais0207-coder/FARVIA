import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Layers, Sparkles, CheckCircle2, Truck, Home, Store } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PostRequirementModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    postRequirement, 
    currentUser, 
    language,
    setCurrentView 
  } = useApp();

  const [productName, setProductName] = useState('Tomato');
  const [tamilProductName, setTamilProductName] = useState('தக்காளி');
  const [requiredQuantity, setRequiredQuantity] = useState(100);
  const [unit, setUnit] = useState<'kg' | 'tonne' | 'quintal' | 'box'>('kg');
  const [maxBudgetPerUnit, setMaxBudgetPerUnit] = useState(30);
  const [requiredByDate, setRequiredByDate] = useState('Tomorrow');
  const [deliveryLocation, setDeliveryLocation] = useState(currentUser.location || 'Town Hall Road, Madurai');
  const [deliveryPreference, setDeliveryPreference] = useState<'business' | 'home' | 'pickup'>('business');
  const [additionalNotes, setAdditionalNotes] = useState('Need firm country tomatoes for commercial kitchen. Early morning delivery preferred.');

  if (activeModal !== 'post-requirement') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq = postRequirement({
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerCategory: currentUser.buyerCategory || 'hotel',
      buyerPhone: currentUser.phone,
      productName,
      tamilProductName,
      requiredQuantity: Number(requiredQuantity),
      unit,
      maxBudgetPerUnit: Number(maxBudgetPerUnit),
      requiredByDate,
      deliveryLocation,
      coordinates: currentUser.coordinates,
      deliveryPreference,
      additionalNotes,
    });

    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    setActiveModal(null);
    setCurrentView('smart-matches');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">
                  {language === 'ta' ? 'கொள்முதல் தேவை கோரிக்கை (Post Requirement)' : 'Post Buyer Purchase Requirement'}
                </h3>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  Main Innovation
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                AI immediately alerts & matches nearby farmers with optimal produce
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick preset banner for SIH demo flow */}
          <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-950 block text-xs">
                💡 SIH Demonstration Example (Step 5):
              </span>
              <span className="text-[11px] text-amber-900">
                Hotel needs: <strong>100 kg Tomato tomorrow (Max ₹30/kg)</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setProductName('Tomato');
                setTamilProductName('தக்காளி');
                setRequiredQuantity(100);
                setMaxBudgetPerUnit(30);
                setRequiredByDate('Tomorrow');
                setDeliveryPreference('business');
              }}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition shadow-xs"
            >
              Fill Demo Preset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Product */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Required Agricultural Product:</label>
              <select
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  if (e.target.value === 'Tomato') setTamilProductName('தக்காளி');
                  if (e.target.value === 'Onion') setTamilProductName('வெங்காயம்');
                  if (e.target.value === 'Carrot') setTamilProductName('கேரட்');
                  if (e.target.value === 'Potato') setTamilProductName('உருளைக்கிழங்கு');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              >
                <option value="Tomato">Tomato (தக்காளி)</option>
                <option value="Onion">Onion (வெங்காயம்)</option>
                <option value="Carrot">Carrot (கேரட்)</option>
                <option value="Potato">Potato (உருளைக்கிழங்கு)</option>
                <option value="Banana">Banana (வாழைப்பழம்)</option>
                <option value="Brinjal">Brinjal (கத்தரிக்காய்)</option>
                <option value="Paddy">Paddy (நெல்)</option>
                <option value="Mango">Mango (மாம்பழம்)</option>
              </select>
            </div>

            {/* Quantity & Unit */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Required Quantity:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  required
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(Number(e.target.value))}
                  className="w-2/3 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-sm"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-1/3 px-2 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="tonne">tonne</option>
                  <option value="quintal">quintal</option>
                  <option value="box">box</option>
                </select>
              </div>
            </div>

            {/* Maximum Budget */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Maximum Budget Limit (₹ / {unit}):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={maxBudgetPerUnit}
                  onChange={(e) => setMaxBudgetPerUnit(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-sm text-emerald-800"
                />
              </div>
            </div>

            {/* Required Date */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Needed By Date:</label>
              <input
                type="text"
                value={requiredByDate}
                onChange={(e) => setRequiredByDate(e.target.value)}
                placeholder="e.g. Tomorrow, 2026-09-12"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
              />
            </div>

            {/* Delivery Location */}
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Delivery / Receiving Destination:</label>
              <input
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Delivery Preference (Home, Business, Farm Pickup) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Delivery & Logistics Preference:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryPreference('business')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  deliveryPreference === 'business'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-xs">Business Bulk</span>
                  <span className="text-[10px] text-slate-400">Hotels, Restaurants, Shops</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryPreference('home')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  deliveryPreference === 'home'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-xs">Home Delivery</span>
                  <span className="text-[10px] text-slate-400">Consumers & households</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryPreference('pickup')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  deliveryPreference === 'pickup'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-xs">Farm Pickup</span>
                  <span className="text-[10px] text-slate-400">Collect directly at farm</span>
                </div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Special Quality / Packaging Requirements:</label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="submit-post-requirement-btn"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-sm transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Post Requirement & Launch AI Smart Matching</span>
          </button>
        </form>
      </div>
    </div>
  );
};
