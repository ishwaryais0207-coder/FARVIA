import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';
import { 
  Bell, 
  Sparkles, 
  Truck, 
  IndianRupee, 
  TrendingUp, 
  X, 
  CheckCheck, 
  Trash2, 
  ArrowRight,
  Filter,
  Volume2,
  Zap,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearNotifications, 
    triggerMockEvent, 
    setCurrentView,
    role,
    language 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'match' | 'order' | 'payment' | 'alert'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'match') return n.type === 'match';
    if (activeFilter === 'order') return n.type === 'order';
    if (activeFilter === 'payment') return n.type === 'payment';
    if (activeFilter === 'alert') return n.type === 'price_alert' || n.type === 'demand_alert';
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'order':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <IndianRupee className="w-4 h-4 text-teal-600" />;
      case 'price_alert':
      case 'demand_alert':
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getNotifBadgeColor = (type: string) => {
    switch (type) {
      case 'match':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'order':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'payment':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'price_alert':
      case 'demand_alert':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  {language === 'ta' ? 'அறிவிப்பு மையம்' : 'Marketplace Notification Center'}
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    {unreadCount} {language === 'ta' ? 'புதியவை' : 'Unread'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {language === 'ta' 
                  ? 'நேரடி பொருத்தங்கள், ஆர்டர் விநியோக நிலை மற்றும் வங்கி கட்டண அறிவிப்புகள்' 
                  : 'Instant alerts for smart matches, vehicle dispatches & UPI settlements'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time Mock Simulator Trigger Bar */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-4 border-b border-emerald-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{language === 'ta' ? 'நேரடி நிகழ்வு தூண்டுதல்கள் (Simulate Triggers)' : 'Live Event Simulator Triggers'}</span>
            </div>
            <span className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              Active Role: <strong className="text-slate-900 capitalize">{role}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => {
                triggerMockEvent('match');
                try { confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } }); } catch (e) {}
              }}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-emerald-600 hover:text-white text-slate-800 p-2 rounded-xl text-xs font-bold border border-emerald-300 transition shadow-2xs active:scale-95 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
              <span>{language === 'ta' ? 'பொருத்தம்' : 'Smart Match'}</span>
            </button>

            <button
              onClick={() => {
                triggerMockEvent('order_status');
              }}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-blue-600 hover:text-white text-slate-800 p-2 rounded-xl text-xs font-bold border border-blue-300 transition shadow-2xs active:scale-95 group"
            >
              <Truck className="w-3.5 h-3.5 text-blue-600 group-hover:text-white" />
              <span>{language === 'ta' ? 'வாகன புறப்பாடு' : 'Order Status'}</span>
            </button>

            <button
              onClick={() => {
                triggerMockEvent('payment');
                try { confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } }); } catch (e) {}
              }}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-teal-600 hover:text-white text-slate-800 p-2 rounded-xl text-xs font-bold border border-teal-300 transition shadow-2xs active:scale-95 group"
            >
              <IndianRupee className="w-3.5 h-3.5 text-teal-600 group-hover:text-white" />
              <span>{language === 'ta' ? 'வங்கி வரவு' : 'UPI Payment'}</span>
            </button>

            <button
              onClick={() => {
                triggerMockEvent('demand_surge');
              }}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-800 p-2 rounded-xl text-xs font-bold border border-amber-300 transition shadow-2xs active:scale-95 group"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 group-hover:text-slate-950" />
              <span>{language === 'ta' ? 'சந்தை தகவல்' : 'Price Alert'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & Bulk Action Bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeFilter === 'all' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ta' ? 'அனைத்தும்' : 'All'} ({notifications.length})
            </button>

            <button
              onClick={() => setActiveFilter('match')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeFilter === 'match' 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ta' ? 'பொருத்தங்கள்' : 'Matches'}
            </button>

            <button
              onClick={() => setActiveFilter('order')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeFilter === 'order' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ta' ? 'ஆர்டர்கள்' : 'Orders'}
            </button>

            <button
              onClick={() => setActiveFilter('payment')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeFilter === 'payment' 
                  ? 'bg-teal-700 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ta' ? 'பணப்பரிவர்த்தனை' : 'Payments'}
            </button>

            <button
              onClick={() => setActiveFilter('alert')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeFilter === 'alert' 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ta' ? 'சந்தை/வானிலை' : 'Market'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1.5 rounded-xl hover:bg-emerald-100 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'அனைத்தும் படித்ததாக குறிக்க' : 'Mark all read'}</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
                title="Clear All Notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Inbox className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'ta' ? 'புதிய அறிவிப்புகள் எதுவும் இல்லை' : 'No notifications in this filter'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {language === 'ta' 
                    ? 'மேலே உள்ள "நிகழ்வு தூண்டுதல்கள்" பட்டன்களை அழுத்தி நேரடி அறிவிப்புகளை சோதித்துப் பாருங்கள்.' 
                    : 'Tap the simulation trigger buttons above to test live smart match and order status alerts.'}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map(n => (
              <div
                key={n.id}
                className={`pt-3 first:pt-0 p-3.5 rounded-2xl transition flex items-start justify-between gap-3 ${
                  n.read ? 'bg-slate-50/60 text-slate-600' : 'bg-emerald-50/40 text-slate-900 border border-emerald-200/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getNotifBadgeColor(n.type)}`}>
                        {n.type.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 truncate">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {language === 'ta' ? n.tamilMessage : n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      🕒 {n.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {n.linkAction && (
                    <button
                      onClick={() => {
                        markNotificationRead(n.id);
                        setCurrentView(n.linkAction!);
                        onClose();
                      }}
                      className="bg-slate-900 hover:bg-emerald-700 text-white font-black text-xs px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1 active:scale-95"
                    >
                      <span>{language === 'ta' ? 'காண்க' : 'Open'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {!n.read && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="text-[11px] font-bold text-slate-400 hover:text-emerald-700"
                    >
                      {language === 'ta' ? 'படித்தேன்' : 'Mark read'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Smart India Hackathon 2024 Direct Agricultural Architecture</span>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl transition"
          >
            {language === 'ta' ? 'மூடு' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
