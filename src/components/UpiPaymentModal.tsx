import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  Sparkles,
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UpiPaymentModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    orders, 
    payOrder, 
    language,
    setCurrentView 
  } = useApp();

  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('hotel.procurement@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  // Find most recent pending order or default to first order
  const pendingOrder = orders.find(o => o.paymentStatus === 'Pending') || orders[0];

  if (activeModal !== 'upi-payment' || !pendingOrder) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      const generatedTxn = `UPI-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
      setTxnId(generatedTxn);
      payOrder(pendingOrder.id, customUpiId);

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Direct Digital Payment (UPI)</h3>
              <p className="text-xs text-emerald-200">
                Indian Digital Payment Gateway (Zero Escrow Deduction)
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

        {/* Modal Body */}
        <div className="p-6">
          {!paymentSuccess ? (
            <div className="space-y-4">
              {/* Order Summary Pill */}
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                  <span>Order: #{pendingOrder.id}</span>
                  <span className="text-emerald-800 font-bold">{pendingOrder.item.productName} ({pendingOrder.item.quantity} {pendingOrder.item.unit})</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Farmer: {pendingOrder.farmerName}</span>
                  <span className="text-emerald-700 font-semibold">{pendingOrder.farmerLocation}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-emerald-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Total Payable:</span>
                  <span className="font-black text-emerald-800 text-lg">₹{pendingOrder.totalAmount}</span>
                </div>
              </div>

              {/* UPI QR Code Sandbox Graphic */}
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center">
                <div className="w-36 h-36 mx-auto bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white shadow-md relative">
                  {/* Stylized QR representation */}
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-white rounded-lg">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                            ? 'bg-slate-900'
                            : 'bg-emerald-600/30'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                      UPI
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block mt-2">
                  Scan with any UPI App (GPay / PhonePe / Paytm)
                </span>
              </div>

              {/* UPI ID Input */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-700">Enter Buyer UPI ID / VPA:</label>
                <input
                  type="text"
                  value={customUpiId}
                  onChange={(e) => setCustomUpiId(e.target.value)}
                  placeholder="e.g. username@okhdfcbank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              {/* Popular UPI Apps */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { id: 'gpay', label: 'Google Pay', icon: '🟢' },
                  { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                  { id: 'paytm', label: 'Paytm', icon: '🔵' },
                  { id: 'bhim', label: 'BHIM UPI', icon: '🟠' },
                ].map(app => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedUpiApp(app.id as any)}
                    className={`p-2 rounded-xl border transition ${
                      selectedUpiApp === app.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-base">{app.icon}</span>
                    <span className="text-[10px] block mt-0.5 font-medium">{app.label}</span>
                  </button>
                ))}
              </div>

              {/* Pay Now CTA */}
              <button
                id="upi-submit-payment-btn"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-sm transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with NPCI Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Payment of ₹{pendingOrder.totalAmount}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                🔒 Protected by 256-bit encryption. Safe sandbox prototype mode for SIH 2026.
              </p>
            </div>
          ) : (
            /* Payment Success Screen */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Payment Successful!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  ₹{pendingOrder.totalAmount} directly credited to farmer {pendingOrder.farmerName}.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-left font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-bold text-slate-900">{txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-emerald-700">UPI Instant Settlement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">CLEARED (Success)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setActiveModal('logistics-tracker');
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Track Delivery Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setCurrentView('orders');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-xs transition"
                >
                  View All Orders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
