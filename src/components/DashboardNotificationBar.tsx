import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Sparkles, 
  Truck, 
  IndianRupee, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardNotificationBarProps {
  onOpenNotificationCenter: () => void;
  className?: string;
}

export const DashboardNotificationBar: React.FC<DashboardNotificationBarProps> = ({ 
  onOpenNotificationCenter,
  className = '' 
}) => {
  const { 
    role, 
    notifications, 
    triggerMockEvent, 
    language 
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-4 ${className}`}>
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
                {language === 'ta' ? 'நேரடி அறிவிப்பு மையம்' : 'Live Notification Engine'}
              </span>
              <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                • {role === 'farmer' ? 'Farmer Direct Alerts' : 'Buyer Sourcing Alerts'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              {language === 'ta' 
                ? 'நிகழ்நேர அறிவிப்புகள் & விரைவு தூண்டுதல்கள் (Toast Alerts)' 
                : 'Real-Time Alerts & Interactive Toast Triggers'}
            </h3>
          </div>
        </div>

        {/* Open Notification Center Button */}
        <button
          onClick={onOpenNotificationCenter}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black px-4 py-2.5 rounded-2xl text-xs shadow-md transition shrink-0"
        >
          <Bell className="w-4 h-4 text-amber-300" />
          <span>{language === 'ta' ? 'அறிவிப்பு மையத்தை திற' : 'Open Notification Center'}</span>
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
          <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
        </button>
      </div>

      {/* Tactile 1-Tap Simulation Triggers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>
              {language === 'ta' 
                ? 'டெமோ தூண்டுதல்கள்: உடனடி டோஸ்ட் எச்சரிக்கையை சோதிக்கவும்' 
                : 'Click any trigger below to test interactive toast alerts in real-time:'}
            </span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
            Fires instant floating toasts & updates notification history
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Trigger 1: Smart Match Found */}
          <button
            onClick={() => {
              triggerMockEvent('match');
              try { confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } }); } catch (e) {}
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-300/80 text-left transition shadow-2xs hover:shadow-md active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-emerald-950 block truncate">
                {language === 'ta' ? '⚡ பொருத்தம் கிடைத்தது' : '⚡ Simulate Match Found'}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium block truncate mt-0.5">
                {role === 'farmer' ? 'Hotel Saravana (96% Match)' : 'Murugan Farmer (97% Match)'}
              </span>
            </div>
          </button>

          {/* Trigger 2: Order Status Changed */}
          <button
            onClick={() => {
              triggerMockEvent('order_status');
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-300/80 text-left transition shadow-2xs hover:shadow-md active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-blue-950 block truncate">
                {language === 'ta' ? '🚚 வாகன நிலை மாற்றம்' : '🚚 Simulate Order Status'}
              </span>
              <span className="text-[11px] text-blue-700 font-medium block truncate mt-0.5">
                Order #ORD-101 in transit
              </span>
            </div>
          </button>

          {/* Trigger 3: Instant UPI Payment Received */}
          <button
            onClick={() => {
              triggerMockEvent('payment');
              try { confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } }); } catch (e) {}
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 border-2 border-teal-300/80 text-left transition shadow-2xs hover:shadow-md active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-teal-950 block truncate">
                {language === 'ta' ? '💸 வங்கி வரவு' : '💸 Simulate Direct UPI'}
              </span>
              <span className="text-[11px] text-teal-700 font-medium block truncate mt-0.5">
                ₹2,920 instant settlement
              </span>
            </div>
          </button>

          {/* Trigger 4: Wholesale Market Demand Surge */}
          <button
            onClick={() => {
              triggerMockEvent('demand_surge');
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-2 border-amber-300/80 text-left transition shadow-2xs hover:shadow-md active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-amber-950 block truncate">
                {language === 'ta' ? '📈 சந்தை விலை உயர்வு' : '📈 Simulate Market Surge'}
              </span>
              <span className="text-[11px] text-amber-700 font-medium block truncate mt-0.5">
                Tomato demand +22%
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
