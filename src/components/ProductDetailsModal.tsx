import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Star, 
  Calendar, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  Store, 
  Home, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProductDetailsModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    activeProductForDetails, 
    createOrder, 
    currentUser, 
    setCurrentView,
    language 
  } = useApp();

  const product = activeProductForDetails;
  const [orderQty, setOrderQty] = useState(100);
  const [deliveryType, setDeliveryType] = useState<'business' | 'home' | 'pickup'>('business');

  if (activeModal !== 'product-details' || !product) return null;

  const unitPrice = product.expectedPrice;
  const deliveryFee = deliveryType === 'pickup' ? 0 : 120;
  const totalItemCost = orderQty * unitPrice;
  const grandTotal = totalItemCost + deliveryFee;

  const handleConfirmOrder = () => {
    const newOrder = createOrder({
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      farmerPhone: product.farmerPhone,
      farmerLocation: product.location,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      buyerLocation: currentUser.location,
      buyerCategory: currentUser.buyerCategory || 'hotel',
      item: {
        productId: product.id,
        productName: product.name,
        quantity: orderQty,
        unit: product.unit,
        pricePerUnit: product.expectedPrice,
        totalPrice: totalItemCost,
        imageUrl: product.imageUrl,
      },
      deliveryType,
      deliveryFee,
      totalAmount: grandTotal,
    });

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    setActiveModal('upi-payment');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Image with Badges */}
        <div className="relative h-48 sm:h-56 shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
              {product.category}
            </span>
            {product.isSurplus && (
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                ⚡ Surplus Produce (25% Off)
              </span>
            )}
          </div>

          {/* Title on image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-2xl font-black">{product.name}</h3>
                <p className="text-xs text-emerald-200 font-medium">{product.tamilName}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">₹{product.expectedPrice}</span>
                <span className="text-xs text-slate-200"> / {product.unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Ordering Form */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Farmer Info Row */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                👨‍🌾
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">{product.farmerName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {product.farmerRating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {product.location}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${product.farmerPhone}`}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-xl font-bold transition shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Call Farmer</span>
            </a>
          </div>

          {/* AI Fair Price Analysis Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI Fair Price Range:
              </span>
              <span className="font-black text-emerald-800">
                ₹{product.aiFairPriceMin} – ₹{product.aiFairPriceMax} / {product.unit}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              {product.aiPriceReason}
            </p>
          </div>

          {/* Description & Harvest Date */}
          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Harvest Date:</span>
              <span className="font-bold text-slate-900">{product.harvestDate}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Availability:</span>
              <span className="font-bold text-slate-900">{product.availableFrom}</span>
            </div>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            {product.description}
          </p>

          {/* Purchase Volume Selector */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">Order Quantity ({product.unit}):</label>
              <span className="text-[11px] text-slate-400">Available: {product.quantity} {product.unit}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max={product.quantity}
                step="5"
                value={orderQty}
                onChange={(e) => setOrderQty(Number(e.target.value))}
                className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="font-black text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-300 min-w-[70px] text-center">
                {orderQty} {product.unit}
              </span>
            </div>
          </div>

          {/* Delivery Mode Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Delivery Preference:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('business')}
                className={`p-2 rounded-xl border text-center transition ${
                  deliveryType === 'business'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4 mx-auto mb-0.5 text-emerald-600" />
                <span className="block text-[11px]">Business Bulk</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('home')}
                className={`p-2 rounded-xl border text-center transition ${
                  deliveryType === 'home'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 mx-auto mb-0.5 text-emerald-600" />
                <span className="block text-[11px]">Home Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-2 rounded-xl border text-center transition ${
                  deliveryType === 'pickup'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-4 h-4 mx-auto mb-0.5 text-emerald-600" />
                <span className="block text-[11px]">Farm Pickup</span>
              </button>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Item Total ({orderQty} × ₹{unitPrice}):</span>
              <span className="font-semibold text-slate-900">₹{totalItemCost}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Logistics Delivery Fee:</span>
              <span className="font-semibold text-slate-900">
                {deliveryFee === 0 ? 'Free (Farm Pickup)' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Intermediary Commission:</span>
              <span className="font-bold text-emerald-600">₹0 (Direct Farmer Trade)</span>
            </div>
            <div className="pt-2 mt-1 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Payable:</span>
              <span className="text-emerald-800 text-base font-black">₹{grandTotal}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            id="confirm-direct-buy-btn"
            onClick={handleConfirmOrder}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-sm transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Order & Proceed to UPI Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
