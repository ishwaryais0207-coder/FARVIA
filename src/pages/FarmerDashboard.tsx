import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { WeatherWidget } from '../components/WeatherWidget';
import { FarmingTipsSection } from '../components/FarmingTipsSection';
import { DashboardNotificationBar } from '../components/DashboardNotificationBar';
import { 
  Sprout, 
  Mic, 
  Layers, 
  TrendingUp, 
  Truck, 
  DollarSign, 
  Star, 
  Plus, 
  Percent, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle 
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { 
    currentUser, 
    products, 
    requirements, 
    orders, 
    setActiveModal, 
    setActiveOrderForTracking,
    setActiveProductForDetails,
    updateOrderStatus,
    setCurrentView, 
    setIsNotificationCenterOpen,
    language 
  } = useApp();

  // Filter products by this farmer
  const myProducts = products.filter(p => p.farmerId === currentUser.id);

  // Nearby buyer requirements
  const nearbyReqs = requirements.slice(0, 3);

  // Active incoming orders for this farmer
  const incomingOrders = orders.filter(o => o.farmerId === currentUser.id);

  // Total earnings
  const totalEarnings = orders
    .filter(o => o.farmerId === currentUser.id && o.paymentStatus.includes('Paid'))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Farmer Welcome Banner with Large Accessibility Buttons */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-2xl flex items-center justify-center border border-emerald-200 shadow-inner">
            👨‍🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? `வணக்கம், ${currentUser.name}!` : `Welcome, ${currentUser.name}!`}
              </h1>
              {currentUser.verified && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Farmer
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              📍 {currentUser.location} • Farm Size: {currentUser.farmSizeAcres} Acres • Rating: {currentUser.rating}★ ({currentUser.totalRatings} reviews)
            </p>
          </div>
        </div>

        {/* Large Rural-Friendly Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            id="farmer-voice-add-btn"
            onClick={() => setActiveModal('voice-assistant')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-md shadow-emerald-700/20 transition hover:scale-105 active:scale-95"
          >
            <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{language === 'ta' ? 'குரல் மூலம் பயிர் சேர்க்க' : 'Add Produce by Voice'}</span>
          </button>

          <button
            id="farmer-manual-add-btn"
            onClick={() => setActiveModal('add-product')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-md transition hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ta' ? '+ புதிய விளைபொருள்' : '+ Add Product'}</span>
          </button>
        </div>
      </div>

      {/* Live Mock Notification Center & Instant Simulator Triggers */}
      <DashboardNotificationBar 
        onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)} 
      />

      {/* Metrics Row: Earnings, Orders, Fair Price, Weather */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Earnings Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {language === 'ta' ? 'மொத்த வருவாய் (Earnings)' : 'Total Farmer Earnings'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-700">₹{totalEarnings.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">+78% vs Trader Mandi</span>
          </div>
          <span className="text-[10px] text-slate-400">Zero broker commissions deducted</span>
        </div>

        {/* Active Orders Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {language === 'ta' ? 'செயலில் உள்ள ஆர்டர்கள்' : 'Active Orders'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">{incomingOrders.length}</span>
            <span className="text-[11px] text-blue-600 font-bold block mt-0.5">
              {incomingOrders.filter(o => o.status === 'In Transit').length} in transit with fleet
            </span>
          </div>
          <button
            onClick={() => setCurrentView('orders')}
            className="text-[10px] text-emerald-700 font-bold hover:underline text-left"
          >
            Track order fleet →
          </button>
        </div>

        {/* AI Fair Price Index */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {language === 'ta' ? 'தக்காளி நியாய விலை' : 'Tomato Fair Range'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">₹29–₹32</span>
            <span className="text-[11px] text-amber-700 font-bold block mt-0.5">High Demand (+18% trend)</span>
          </div>
          <button
            onClick={() => setCurrentView('fair-price')}
            className="text-[10px] text-emerald-700 font-bold hover:underline text-left"
          >
            View Mandi analytics →
          </button>
        </div>

        {/* Rating Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {language === 'ta' ? 'மதிப்பீடு & நற்பெயர்' : 'Farmer Reputation'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              <Star className="w-4 h-4 fill-purple-600" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">{currentUser.rating} / 5.0</span>
            <span className="text-[11px] text-purple-700 font-bold block mt-0.5">
              {currentUser.ordersCompleted} orders successfully fulfilled
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Boosts AI Match Score to 94%+</span>
        </div>
      </div>

      {/* Top Priority Hub: Farming Tips & New Orders in a Responsive Tactile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: AI Farming Tips */}
        <div className="w-full">
          <FarmingTipsSection />
        </div>

        {/* Right Column: New Incoming Orders & Fleet Dispatch with Large Tactile Cards */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-7 border-2 border-blue-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md mb-0.5">
                    📦 Farm Fleet Dispatch
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {language === 'ta' ? 'புதிய ஆர்டர்கள் & விநியோகம்' : 'New Orders & Fleet Dispatch'}
                  </h2>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {language === 'ta' 
                  ? 'உடனடி கொள்முதல் கோரிக்கைகள் மற்றும் வாகன கண்காணிப்பு' 
                  : 'Incoming purchase orders requiring packing and dispatch'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-900 text-xs font-black px-3 py-1.5 rounded-xl border border-blue-200 shrink-0">
                {incomingOrders.length} Active
              </span>
              <button
                onClick={() => setCurrentView('orders')}
                className="text-xs font-extrabold text-blue-700 hover:text-blue-900 hover:underline shrink-0"
              >
                {language === 'ta' ? 'அனைத்து ஆர்டர்கள் →' : 'All Orders →'}
              </button>
            </div>
          </div>

          {incomingOrders.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'ta' ? 'தற்போது புதிய ஆர்டர்கள் இல்லை' : 'No Pending Dispatch Orders'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {language === 'ta' 
                    ? 'வாங்குபவர்களின் புதிய கொள்முதல் கோரிக்கைகள் வந்தவுடன் இங்கே தோன்றும்.' 
                    : 'When institutional buyers or consumers place purchase orders, they will appear here with instant dispatch alerts.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingOrders.map(ord => (
                <div
                  key={ord.id}
                  className="p-5 sm:p-6 rounded-3xl border-2 border-slate-200 hover:border-blue-300 bg-slate-50/80 hover:bg-white transition space-y-4 shadow-xs hover:shadow-md"
                >
                  {/* Top Status Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                        #{ord.id.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {ord.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-3 py-1 rounded-xl shadow-2xs ${
                        ord.status === 'In Transit' 
                          ? 'bg-blue-600 text-white' 
                          : ord.status === 'Delivered'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-400 text-slate-950'
                      }`}>
                        {ord.status === 'In Transit' ? '🚚 In Transit' : ord.status}
                      </span>
                      <span className="bg-emerald-100 text-emerald-950 font-black text-xs px-2.5 py-1 rounded-xl border border-emerald-300">
                        {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Produce & Amount Info */}
                  <div className="flex items-start gap-4">
                    <img 
                      src={ord.item.imageUrl} 
                      alt={ord.item.productName} 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg font-black text-slate-900 truncate">
                        {ord.item.productName}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                        {ord.item.quantity} {ord.item.unit} • ₹{ord.item.pricePerUnit}/{ord.item.unit}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Farm Payout</span>
                        <span className="text-xl sm:text-2xl font-black text-emerald-700">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buyer Details Box */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">
                        🏢 {ord.buyerName}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        Direct Procurement
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block">
                      📍 Delivery Hub: {ord.deliveryAddress || 'Hotel Saravana Bhavan, Simmakkal, Madurai'}
                    </span>
                  </div>

                  {/* Large Tactile Action Button */}
                  <button
                    onClick={() => {
                      setActiveOrderForTracking(ord);
                      setActiveModal('logistics-tracker');
                    }}
                    className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-amber-300" />
                    <span>{language === 'ta' ? 'வாகன கண்காணிப்பு & டெலிவரி (Track)' : 'Live Agro Fleet Tracking'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Localized Agri Weather & Harvest Planning Station */}
      <div className="w-full">
        <WeatherWidget />
      </div>

      {/* Secondary Row: Buyer Requirements Near Me + Surplus Produce Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Buyer Requirements Near Me (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'ta' ? 'அருகிலுள்ள கொள்முதல் தேவைகள் (Buyer Needs)' : 'Buyer Requirements Near You'}
                  </h2>
                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                    Direct Demand
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Hotels, restaurants and shops waiting for farm produce matching your crops
                </p>
              </div>
              <button
                onClick={() => setCurrentView('requirements')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {nearbyReqs.map(req => (
                <div
                  key={req.id}
                  className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {req.productName} ({req.tamilProductName})
                      </span>
                      <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {req.buyerCategory.toUpperCase()}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Budget: ₹{req.maxBudgetPerUnit}/{req.unit}
                      </span>
                    </div>

                    <p className="text-slate-600 font-medium">
                      Buyer: <strong className="text-slate-900">{req.buyerName}</strong> • {req.deliveryLocation}
                    </p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Needed: {req.requiredQuantity} {req.unit} • By {req.requiredByDate}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('smart-matches');
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs shrink-0 flex items-center justify-center gap-1"
                  >
                    <span>Check AI Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Surplus Produce Promotion Box (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-amber-500/15 to-amber-600/5 border-2 border-amber-300/80 rounded-3xl p-6 text-xs space-y-4 shadow-sm bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base block">
                  {language === 'ta' ? 'உபரி விளைச்சல் உள்ளதா?' : 'Have Surplus Produce?'}
                </span>
                <span className="text-xs text-amber-900 font-semibold">Direct clearance to avoid food spoilage</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {language === 'ta'
                ? 'அறுவடைக்கு பின் தேங்கியுள்ள உபரி காய்கறி பழங்களை சில்லறை மற்றும் மொத்த கொள்முதல் நிறுவனங்களுக்கு உடனடி சலுகை விலையில் வழங்குங்கள்.'
                : 'Post excess harvested crop stock at competitive rates directly to nearby hotels, restaurants, and catering institutions.'}
            </p>
            <button
              onClick={() => {
                setActiveModal('add-product');
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black py-3 rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
            >
              <span>{language === 'ta' ? 'உபரி பயிரை உடனடியாக பதிவிட' : 'Post Surplus Produce Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* My Active Products Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {language === 'ta' ? 'எனது விளைபொருட்கள் (My Listed Products)' : 'My Listed Farm Products'}
            </h2>
            <p className="text-xs text-slate-500">
              Produce currently discoverable by nearby consumers and institutions
            </p>
          </div>
          <button
            onClick={() => setActiveModal('add-product')}
            className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold px-3.5 py-1.5 rounded-xl text-xs transition border border-emerald-200"
          >
            + Add Another Crop
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {myProducts.map(prod => (
            <div
              key={prod.id}
              className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:shadow-md transition text-xs"
            >
              <div className="relative h-32">
                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-slate-950/70 text-white font-bold text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {prod.quantity} {prod.unit} left
                </span>
                {prod.isSurplus && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md shadow">
                    Surplus
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-bold text-slate-900">{prod.name} ({prod.tamilName})</h4>
                  <span className="font-black text-emerald-700">₹{prod.expectedPrice}/{prod.unit}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <span>Harvest: {prod.harvestDate}</span>
                  <span className="text-emerald-700 font-semibold">Fair: ₹{prod.aiFairPriceMin}–₹{prod.aiFairPriceMax}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
