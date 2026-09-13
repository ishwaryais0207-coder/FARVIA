import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  Filter 
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { 
    orders, 
    setActiveModal, 
    setActiveOrderForTracking, 
    updateOrderStatus,
    language 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredOrders = orders.filter(o => 
    filterStatus === 'All' || o.status === filterStatus
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'ta' ? 'ஆர்டர்கள் & நேரடி விநியோகம்' : 'Orders & Agro Fleet Logistics'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent farm-to-doorstep direct orders with live GPS vehicle dispatch
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200">
          {['All', 'In Transit', 'Delivered', 'Placed'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === st
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
          >
            {/* Order Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Order #{order.id}
                </span>
                <span className="text-slate-400">Placed: {order.createdAt}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Payment Badge */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  order.paymentStatus === 'Paid via UPI'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {order.paymentStatus}
                </span>

                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-900'
                    : order.status === 'In Transit'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  ● {order.status}
                </span>
              </div>
            </div>

            {/* Order Items & Parties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Product Info */}
              <div className="flex items-center gap-3.5">
                <img
                  src={order.item.imageUrl}
                  alt={order.item.productName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                    {order.item.productName}
                  </h3>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Quantity: <strong>{order.item.quantity} {order.item.unit}</strong> • ₹{order.item.pricePerUnit}/{order.item.unit}
                  </span>
                  <span className="text-emerald-700 font-bold text-sm block mt-1">
                    Total: ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="text-xs space-y-1.5 text-slate-600 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span>Farm Origin: <strong className="text-slate-900">{order.farmerName}</strong> ({order.farmerLocation})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Destination: <strong className="text-slate-900">{order.buyerName}</strong> ({order.buyerLocation})</span>
                </div>
              </div>

              {/* Logistics & Action buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-end text-xs">
                {/* Live Fleet Tracking Button */}
                <button
                  id={`track-order-${order.id}`}
                  onClick={() => {
                    setActiveOrderForTracking(order);
                    setActiveModal('logistics-tracker');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Track Live Delivery Fleet</span>
                </button>

                <div className="flex gap-2">
                  {order.paymentStatus === 'Pending' ? (
                    <button
                      onClick={() => {
                        setActiveModal('upi-payment');
                      }}
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-center transition"
                    >
                      Pay ₹{order.totalAmount} via UPI
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveModal('rate-order');
                      }}
                      className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold py-2 rounded-xl text-center border border-amber-200 transition flex items-center justify-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{order.ratingByBuyer ? `Rated ${order.ratingByBuyer}★` : 'Rate Order'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
