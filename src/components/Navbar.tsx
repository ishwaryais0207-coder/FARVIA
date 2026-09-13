import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { UserRole, Language } from '../types';
import { 
  Sprout, 
  ShoppingBag, 
  ShieldCheck, 
  Mic, 
  Bell, 
  Sparkles, 
  MapPin, 
  Layers, 
  TrendingUp, 
  Truck, 
  BarChart3, 
  Percent,
  Menu,
  X,
  Volume2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    currentView, 
    setCurrentView, 
    currentUser, 
    notifications,
    markNotificationRead,
    setActiveModal,
    setIsNotificationCenterOpen 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'marketplace', label: t('navMarketplace', language), icon: ShoppingBag },
    { id: 'requirements', label: t('navRequirements', language), icon: Layers, highlight: true },
    { id: 'smart-matches', label: t('navSmartMatches', language), icon: Sparkles },
    { id: 'surplus', label: t('navSurplus', language), icon: Percent },
    { id: 'fair-price', label: t('navFairPrice', language), icon: TrendingUp },
    { id: 'orders', label: t('navOrders', language), icon: Truck },
    { id: 'impact', label: t('navImpact', language), icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Utility Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-1.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-800">{currentUser.name}</span>
            <span className="text-slate-400">|</span>
            <span>{currentUser.location}</span>
            {currentUser.verified && (
              <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                id="role-btn-farmer"
                onClick={() => setRole('farmer')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                  role === 'farmer'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>{t('farmerRole', language)}</span>
              </button>
              <button
                id="role-btn-buyer"
                onClick={() => setRole('buyer')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                  role === 'buyer'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('buyerRole', language)}</span>
              </button>
              <button
                id="role-btn-admin"
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                  role === 'admin'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('adminRole', language)}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-1 py-0.5 rounded-lg text-xs font-medium">
              <button
                id="lang-ta-btn"
                onClick={() => setLanguage('ta')}
                className={`px-2 py-0.5 rounded ${language === 'ta' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                தமிழ்
              </button>
              <span className="text-slate-300">|</span>
              <button
                id="lang-en-btn"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                English
              </button>
              <span className="text-slate-300">|</span>
              <button
                id="lang-hi-btn"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-serif">
                {t('brandName', language)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                Direct Agri
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium tracking-tight">
              {t('tagline', language)}
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 font-medium text-xs">
          <button
            onClick={() => setCurrentView(role === 'farmer' ? 'farmer-dashboard' : role === 'buyer' ? 'buyer-dashboard' : 'admin')}
            className={`px-3 py-2 rounded-lg transition ${
              currentView === 'farmer-dashboard' || currentView === 'buyer-dashboard'
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {role === 'farmer' ? 'விவசாயி பலகை (Dashboard)' : role === 'buyer' ? 'Buyer Dashboard' : 'Admin Panel'}
          </button>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition relative ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions (Voice Assistant, Notifications, Mobile Menu) */}
        <div className="flex items-center gap-2">
          {/* Prominent Voice Assistant Microphone Button for Rural Farmers */}
          <button
            id="voice-assistant-launcher-btn"
            onClick={() => setActiveModal('voice-assistant')}
            title="Tamil Voice Assistant / குரல் உதவியாளர்"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="relative">
              <Mic className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            </div>
            <span className="font-semibold hidden sm:inline">
              {language === 'ta' ? 'குரல் பேசுங்கள்' : language === 'hi' ? 'आवाज से बोलें' : 'Voice Assistant'}
            </span>
          </button>

          {/* Quick Action Button depending on role */}
          {role === 'farmer' ? (
            <button
              id="quick-add-product-btn"
              onClick={() => setActiveModal('add-product')}
              className="hidden sm:flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition shadow-xs"
            >
              <span>+ Add Produce</span>
            </button>
          ) : (
            <button
              id="quick-post-requirement-btn"
              onClick={() => setActiveModal('post-requirement')}
              className="hidden sm:flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition shadow-xs"
            >
              <span>+ Post Need</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="notif-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition relative border border-slate-200"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Real-time Marketplace Alerts</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                  {notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkAction) setCurrentView(n.linkAction);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        n.read ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-emerald-950">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-700">
                        {language === 'ta' ? n.tamilMessage : n.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setIsNotificationCenterOpen(true);
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-300" />
                    <span>{language === 'ta' ? 'அனைத்து அறிவிப்புகள் & தூண்டுதல்கள்' : 'Open Full Notification Center & Simulator'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2">
          <button
            onClick={() => {
              setCurrentView(role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg font-bold text-xs bg-emerald-50 text-emerald-900"
          >
            Dashboard
          </button>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-medium text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
