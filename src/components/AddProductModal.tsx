import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateFairPrice } from '../utils/fairPriceEngine';
import { X, Sprout, Sparkles, Mic, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_CROPS = [
  { name: 'Tomato', ta: 'நாட்டுத் தக்காளி', category: 'Vegetables' as const, defaultPrice: 28, unit: 'kg' as const, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80' },
  { name: 'Onion', ta: 'சின்ன வெங்காயம்', category: 'Vegetables' as const, defaultPrice: 42, unit: 'kg' as const, img: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80' },
  { name: 'Potato', ta: 'உருளைக்கிழங்கு', category: 'Tubers' as const, defaultPrice: 25, unit: 'kg' as const, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80' },
  { name: 'Banana', ta: 'நேந்திரன் வாழைப்பழம்', category: 'Fruits' as const, defaultPrice: 38, unit: 'kg' as const, img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80' },
  { name: 'Brinjal', ta: 'கத்தரிக்காய்', category: 'Vegetables' as const, defaultPrice: 32, unit: 'kg' as const, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80' },
  { name: 'Carrot', ta: 'ஊட்டி கேரட்', category: 'Vegetables' as const, defaultPrice: 48, unit: 'kg' as const, img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80' },
  { name: 'Paddy', ta: 'தூயமல்லி நெல்', category: 'Grains & Cereals' as const, defaultPrice: 24, unit: 'kg' as const, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80' },
  { name: 'Mango', ta: 'மாம்பழம்', category: 'Fruits' as const, defaultPrice: 75, unit: 'kg' as const, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80' },
];

export const AddProductModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    addProduct, 
    currentUser, 
    language,
    setCurrentView 
  } = useApp();

  const [name, setName] = useState('Tomato');
  const [tamilName, setTamilName] = useState('நாட்டுத் தக்காளி');
  const [category, setCategory] = useState<'Vegetables' | 'Fruits' | 'Grains & Cereals' | 'Pulses' | 'Tubers' | 'Spices'>('Vegetables');
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState<'kg' | 'tonne' | 'quintal' | 'box' | 'bunch'>('kg');
  const [expectedPrice, setExpectedPrice] = useState(28);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableFrom, setAvailableFrom] = useState('Tomorrow');
  const [location, setLocation] = useState(currentUser.location || 'Melur, Madurai');
  const [imageUrl, setImageUrl] = useState(PRESET_CROPS[0].img);
  const [description, setDescription] = useState('Freshly harvested direct farm produce, graded and ready for delivery.');
  const [isSurplus, setIsSurplus] = useState(false);

  if (activeModal !== 'add-product') return null;

  // Real-time AI Fair Price estimation for this crop & price
  const fairPriceEst = calculateFairPrice(name, expectedPrice, location);

  const handleSelectPreset = (crop: typeof PRESET_CROPS[0]) => {
    setName(crop.name);
    setTamilName(crop.ta);
    setCategory(crop.category);
    setExpectedPrice(crop.defaultPrice);
    setUnit(crop.unit);
    setImageUrl(crop.img);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addProduct({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      farmerRating: currentUser.rating || 4.8,
      farmerOrdersCount: currentUser.ordersCompleted || 24,
      name,
      tamilName,
      category,
      quantity: Number(quantity),
      unit,
      expectedPrice: Number(expectedPrice),
      marketAveragePrice: fairPriceEst.localMarketPrice,
      aiFairPriceMin: fairPriceEst.recommendedMin,
      aiFairPriceMax: fairPriceEst.recommendedMax,
      aiPriceReason: fairPriceEst.explanation,
      harvestDate,
      availableFrom,
      location,
      coordinates: currentUser.coordinates,
      imageUrl,
      description,
      isSurplus,
      surplusDiscountPercent: isSurplus ? 25 : undefined,
      demandStatus: fairPriceEst.demandFactor,
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setActiveModal(null);
    setCurrentView('marketplace');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'ta' ? 'விளைபொருள் சேர்க்க (Add Product)' : 'List Agricultural Produce'}
              </h3>
              <p className="text-xs text-emerald-200">
                Instantly published to nearby buyers & hotels with AI Fair Pricing
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Preset Selector for Fast Farmer Entry */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700">
                {language === 'ta' ? 'விரைவு தேர்வு (Select Crop):' : 'Select Crop / Produce:'}
              </span>
              <button
                type="button"
                onClick={() => setActiveModal('voice-assistant')}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 text-[11px]"
              >
                <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Use Tamil Voice Input</span>
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PRESET_CROPS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleSelectPreset(c)}
                  className={`px-3 py-2 rounded-xl text-left border shrink-0 transition flex items-center gap-2 ${
                    name === c.name
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <img src={c.img} alt={c.name} className="w-6 h-6 rounded-md object-cover" />
                  <div>
                    <span className="block text-xs font-semibold">{c.name}</span>
                    <span className="text-[10px] text-slate-400 block">{c.ta}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Product Name (English / Tamil):</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains & Cereals">Grains & Cereals</option>
                <option value="Pulses">Pulses</option>
                <option value="Tubers">Tubers</option>
                <option value="Spices">Spices</option>
              </select>
            </div>

            {/* Quantity & Unit */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Available Quantity:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
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
                  <option value="bunch">bunch</option>
                </select>
              </div>
            </div>

            {/* Expected Price */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                {language === 'ta' ? 'எதிர்பார்க்கும் விலை (₹ / அலகு):' : 'Farmer Expected Price (₹/unit):'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-sm text-emerald-800"
                />
              </div>
            </div>

            {/* Harvest Date */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Harvest Date:</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Available From */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Availability Date / Time:</label>
              <input
                type="text"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                placeholder="e.g. Tomorrow 7 AM, Today"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Farm / Dispatch Location:</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Melur, Madurai, Tamil Nadu"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* AI Fair Price Real-Time Assistant Card */}
          <div className="bg-emerald-50/70 border border-emerald-300 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI Fair Price Analysis
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Demand: {fairPriceEst.demandFactor}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-slate-600">Recommended Fair Selling Range:</span>
              <span className="font-black text-emerald-800 text-sm">
                ₹{fairPriceEst.recommendedMin}–₹{fairPriceEst.recommendedMax} / {unit}
              </span>
            </div>
            <p className="text-[11px] text-emerald-950/80 leading-relaxed font-medium">
              {fairPriceEst.explanation}
            </p>
          </div>

          {/* Surplus Produce Checkbox (Feature 9) */}
          <div className="bg-amber-50/70 border border-amber-300 p-3 rounded-2xl flex items-start gap-2.5">
            <input
              type="checkbox"
              id="isSurplusCheckbox"
              checked={isSurplus}
              onChange={(e) => setIsSurplus(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
            />
            <label htmlFor="isSurplusCheckbox" className="cursor-pointer">
              <span className="font-bold text-amber-950 block">
                {language === 'ta' ? 'உபரி விளைச்சலாக பட்டியலிட (Mark as Surplus Produce)' : 'Mark as Surplus Produce (Urgent Clearance)'}
              </span>
              <span className="text-[11px] text-amber-900/80 block leading-tight">
                Prioritizes discovery for hotels, restaurants, and bulk buyers with promotional discount to prevent crop spoilage and food waste.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="submit-add-product-btn"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-sm transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {language === 'ta' ? 'விளைபொருளை சந்தையில் வெளியிடுக (Publish Now)' : 'Publish to Direct Marketplace'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
