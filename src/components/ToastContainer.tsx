import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ToastMessage } from '../types';
import { 
  Sparkles, 
  Truck, 
  IndianRupee, 
  TrendingUp, 
  Bell, 
  X, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  onAction?: (action?: string) => void;
  language: string;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, onAction, language }) => {
  const duration = toast.durationMs || 5500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'match':
        return {
          border: 'border-emerald-400',
          bg: 'bg-gradient-to-r from-emerald-950/95 to-slate-950/95',
          glow: 'shadow-emerald-900/40',
          iconBg: 'bg-emerald-500 text-slate-950',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          Icon: Sparkles,
          tagText: language === 'ta' ? '✨ ஸ்மார்ட் பொருத்தம்' : '✨ AI Smart Match Found',
        };
      case 'order':
        return {
          border: 'border-blue-400',
          bg: 'bg-gradient-to-r from-blue-950/95 to-slate-950/95',
          glow: 'shadow-blue-900/40',
          iconBg: 'bg-blue-500 text-white',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          Icon: Truck,
          tagText: language === 'ta' ? '🚚 ஆர்டர் & விநியோகம்' : '🚚 Order Status Changed',
        };
      case 'payment':
        return {
          border: 'border-emerald-300',
          bg: 'bg-gradient-to-r from-teal-950/95 to-emerald-950/95',
          glow: 'shadow-teal-900/40',
          iconBg: 'bg-amber-400 text-slate-950',
          badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          Icon: IndianRupee,
          tagText: language === 'ta' ? '💸 உடனடி வங்கி வரவு' : '💸 Instant Direct Payment',
        };
      case 'price_alert':
      case 'demand_alert':
        return {
          border: 'border-amber-400',
          bg: 'bg-gradient-to-r from-amber-950/95 to-slate-950/95',
          glow: 'shadow-amber-900/40',
          iconBg: 'bg-amber-500 text-slate-950',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          Icon: TrendingUp,
          tagText: language === 'ta' ? '📈 நேரடி சந்தை தகவல்' : '📈 Mandi Price Movement',
        };
      default:
        return {
          border: 'border-slate-400',
          bg: 'bg-slate-900/95',
          glow: 'shadow-slate-900/40',
          iconBg: 'bg-slate-600 text-white',
          badgeBg: 'bg-slate-700 text-slate-200 border-slate-600',
          Icon: Bell,
          tagText: 'Notification',
        };
    }
  };

  const style = getStyle();
  const Icon = style.Icon;

  const title = (language === 'ta' && toast.tamilTitle) ? toast.tamilTitle : toast.title;
  const message = (language === 'ta' && toast.tamilMessage) ? toast.tamilMessage : toast.message;
  const actionLabel = (language === 'ta' && toast.tamilActionLabel) 
    ? toast.tamilActionLabel 
    : (toast.actionLabel || (language === 'ta' ? 'விவரங்களை காண்க' : 'View Details'));

  return (
    <div 
      className={`pointer-events-auto w-full rounded-2xl border-2 ${style.border} ${style.bg} text-white p-4 shadow-2xl ${style.glow} backdrop-blur-xl relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-4`}
    >
      {/* Top Banner Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center font-bold shrink-0 shadow-md`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${style.badgeBg}`}>
              {style.tagText}
            </span>
            <h4 className="text-sm font-black text-white leading-tight mt-0.5">
              {title}
            </h4>
          </div>
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Content */}
      <p className="text-xs text-slate-200 mt-2.5 font-medium leading-relaxed">
        {message}
      </p>

      {/* Action Footer if linkAction is provided */}
      {toast.linkAction && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>FARVIA Verified</span>
          </div>

          <button
            onClick={() => {
              if (onAction) onAction(toast.linkAction);
              onDismiss(toast.id);
            }}
            className="flex items-center gap-1.5 bg-white text-slate-950 hover:bg-emerald-400 hover:text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition active:scale-95"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Auto-dismiss progress animation bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div 
          className="h-full bg-emerald-400/80" 
          style={{ 
            animation: `shrinkWidth ${duration}ms linear forwards` 
          }} 
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, setCurrentView, language } = useApp();

  if (toasts.length === 0) return null;

  return (
    <aside 
      aria-label="Marketplace alerts and notifications"
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-sm sm:max-w-md w-[calc(100vw-2rem)]"
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
          onAction={(linkAction) => {
            if (linkAction) setCurrentView(linkAction);
          }}
          language={language}
        />
      ))}
    </aside>
  );
};
