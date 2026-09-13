import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RateOrderModal: React.FC = () => {
  const { activeModal, setActiveModal, orders, rateOrder, role } = useApp();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('Excellent fresh produce delivered directly from farm without any transit damage. Saved significantly!');

  const completedOrDeliveredOrder = orders.find(o => o.status === 'Delivered' || o.status === 'In Transit' || o.status === 'Completed') || orders[0];

  if (activeModal !== 'rate-order' || !completedOrDeliveredOrder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'buyer') {
      rateOrder(completedOrDeliveredOrder.id, rating, undefined, review);
    } else {
      rateOrder(completedOrDeliveredOrder.id, undefined, rating, review);
    }

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Rate Direct Trade Experience</h3>
              <p className="text-xs text-emerald-200">
                Order #{completedOrDeliveredOrder.id} • {completedOrDeliveredOrder.item.productName}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="text-center py-2">
            <span className="text-xs text-slate-500 block mb-2 font-medium">
              How was the freshness and delivery experience with {completedOrDeliveredOrder.farmerName}?
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-slate-800 block mt-1">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Outstanding (5/5)' : `${rating} Stars`}
            </span>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Written Review / Feedback:</label>
            <textarea
              rows={3}
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            id="submit-rating-btn"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-xs transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Rating & Update Farmer Reliability Score</span>
          </button>
        </form>
      </div>
    </div>
  );
};
