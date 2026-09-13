import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateFarmingTips, FarmingTip } from '../utils/farmingTipsEngine';
import { speakText } from '../utils/voiceService';
import { 
  Sprout, 
  Sparkles, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  Droplets, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Info,
  Bug,
  RefreshCw,
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FarmingTipsSectionProps {
  className?: string;
}

export const FarmingTipsSection: React.FC<FarmingTipsSectionProps> = ({ className = '' }) => {
  const { currentUser, products, language } = useApp();
  
  // Filter products by current farmer
  const farmerProducts = products.filter(p => p.farmerId === currentUser.id);

  // Generate dynamic tips based on user's historical products
  const [tips, setTips] = useState<FarmingTip[]>(() => 
    generateFarmingTips(farmerProducts, currentUser.location, currentUser.farmSizeAcres)
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [speakingTipId, setSpeakingTipId] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<string[]>([]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTips(generateFarmingTips(farmerProducts, currentUser.location, currentUser.farmSizeAcres));
      setIsRefreshing(false);
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}
    }, 600);
  };

  const handleToggleSpeak = (tip: FarmingTip) => {
    if (speakingTipId === tip.id) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingTipId(null);
    } else {
      setSpeakingTipId(tip.id);
      const textToSpeak = language === 'ta' 
        ? `${tip.tamilTitle}. ${tip.tamilReasoning}. வழிமுறை: ${tip.tamilActionableAdvice}`
        : `${tip.title}. ${tip.reasoning}. Recommended action: ${tip.actionableAdvice}`;
      
      speakText(textToSpeak, language);

      setTimeout(() => {
        setSpeakingTipId(null);
      }, 10000);
    }
  };

  const handleSaveToPlan = (tipId: string) => {
    if (savedPlans.includes(tipId)) {
      setSavedPlans(prev => prev.filter(id => id !== tipId));
    } else {
      setSavedPlans(prev => [...prev, tipId]);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      } catch (e) {}
    }
  };

  const filteredTips = tips.filter(tip => {
    if (selectedCategory === 'all') return true;
    return tip.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: language === 'ta' ? 'அனைத்து (All)' : 'All Advice' },
    { id: 'rotation', label: language === 'ta' ? 'பயிர் சுழற்சி' : 'Crop Rotation' },
    { id: 'seasonal', label: language === 'ta' ? 'பருவ சாகுபடி' : 'Seasonal Sowing' },
    { id: 'pest_control', label: language === 'ta' ? 'பூச்சி மேலாண்மை' : 'Pest Care' },
    { id: 'market_demand', label: language === 'ta' ? 'சந்தைத் தேவை' : 'Market Demand' },
  ];

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-200 shadow-sm space-y-6 ${className}`}>
      {/* Top Header with Large Tactile Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md mb-0.5">
                🤖 AI Cultivation Intelligence
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {language === 'ta' 
                  ? 'பயிர்த் திட்டம் & வேளாண் ஆலோசனைகள்' 
                  : 'Farming Tips & Seasonal Cultivation'}
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {language === 'ta'
              ? 'உங்கள் முந்தைய விளைபொருட்கள், மண் வளம் மற்றும் நடப்பு பருவத்தின் அடிப்படையில் கணிக்கப்பட்டது'
              : `Synthesized from your harvest records & regional soil dynamics in ${currentUser.location}`}
          </p>
        </div>

        {/* Large Tactile Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-2xl transition active:scale-95 disabled:opacity-50 min-h-[46px] shadow-xs shrink-0"
          title="Recalculate AI suggestions"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-700 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{language === 'ta' ? 'புதுப்பிக்க (Refresh)' : 'Recalculate AI'}</span>
        </button>
      </div>

      {/* Historical Data Context Callout Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 p-4 sm:p-5 rounded-2xl border border-emerald-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-700 text-white rounded-xl shrink-0 shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
              {language === 'ta' ? 'ஆய்வு செய்யப்பட்ட வரலாற்றுத் தரவு:' : 'Analyzed Farm Baseline:'}
            </span>
            <span className="text-xs text-slate-600 font-medium">
              {farmerProducts.length > 0 
                ? `${farmerProducts.map(p => p.name).join(', ')} • ${currentUser.farmSizeAcres} Acres • ${currentUser.location}`
                : `Active crop inventory • ${currentUser.farmSizeAcres} Acres • ${currentUser.location}`}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-xs">
            🗓️ {tips[0]?.seasonPattam || 'Aadi Pattam (ஆடி பட்டம்)'}
          </span>
          {savedPlans.length > 0 && (
            <span className="bg-emerald-800 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{savedPlans.length} in Planned Rotation</span>
            </span>
          )}
        </div>
      </div>

      {/* Category Pills: Large Tactile Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition min-h-[44px] flex items-center justify-center ${
              selectedCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Large Tactile-Friendly Tips Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredTips.map(tip => {
          const isSaved = savedPlans.includes(tip.id);
          const isSpeaking = speakingTipId === tip.id;

          return (
            <div
              key={tip.id}
              className="bg-slate-50/80 hover:bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-400 p-6 transition flex flex-col justify-between space-y-5 shadow-xs hover:shadow-lg"
            >
              <div className="space-y-4">
                {/* Header Row: Category Badge + AI Confidence & Impact */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-200 text-slate-800 font-extrabold text-xs px-3 py-1 rounded-xl uppercase tracking-wider">
                      {tip.category.replace('_', ' ')}
                    </span>
                    <span className="bg-emerald-100 text-emerald-950 font-black text-xs px-3 py-1 rounded-xl border border-emerald-300">
                      ⚡ {tip.impactTag}
                    </span>
                  </div>

                  <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full shrink-0">
                    {tip.confidenceScore}% AI Confidence
                  </span>
                </div>

                {/* Title & Recommended Crop */}
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg leading-snug">
                    {language === 'ta' ? tip.tamilTitle : tip.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs sm:text-sm font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-200">
                      🌱 {language === 'ta' ? tip.tamilCropName : tip.cropName}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Season: {tip.seasonPattam}
                    </span>
                  </div>
                </div>

                {/* AI Agronomic Reasoning based on historical products */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{language === 'ta' ? 'ஏன் இந்த பரிந்துரை?' : 'Why AI Recommends This:'}</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                    {language === 'ta' ? tip.tamilReasoning : tip.reasoning}
                  </p>
                </div>

                {/* Actionable Cultivation Guidance */}
                <div className="space-y-1.5">
                  <span className="font-black text-slate-900 text-xs sm:text-sm block">
                    {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட சாகுபடி முறை:' : 'Recommended Field Action:'}
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/60">
                    {language === 'ta' ? tip.tamilActionableAdvice : tip.actionableAdvice}
                  </p>
                </div>

                {/* Tactile Agronomic Specs Grid */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs sm:text-sm">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">WATER NEED</span>
                    <span className="font-black text-slate-900">{tip.waterRequirement}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">HARVEST TIME</span>
                    <span className="font-black text-slate-900">{tip.daysToHarvest} Days</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">MARKET</span>
                    <span className="font-black text-emerald-700">{tip.marketOutlook}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Large Tactile Action Buttons (Min 46px height for effortless touching) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleToggleSpeak(tip)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition min-h-[46px] shadow-xs active:scale-95 ${
                    isSpeaking 
                      ? 'bg-amber-400 text-slate-950 border-2 border-amber-500 animate-pulse'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-200'
                  }`}
                  title="Listen in Tamil / English"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-slate-950" />
                      <span>{language === 'ta' ? 'நிறுத்து (Stop)' : 'Stop Audio'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'ta' ? '🔊 குரல் வழிகாட்டல் (Listen)' : '🔊 Listen to Advisory'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSaveToPlan(tip.id)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition min-h-[46px] shadow-sm active:scale-95 ${
                    isSaved
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4" />
                      <span>{language === 'ta' ? 'திட்டத்தில் சேர்க்கப்பட்டது' : 'Added to Sowing Plan ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>{language === 'ta' ? '+ சாகுபடி திட்டத்தில் சேர்' : '+ Add to Sowing Plan'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
