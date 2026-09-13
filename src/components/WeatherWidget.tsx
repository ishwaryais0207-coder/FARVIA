import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  RealTimeAgriWeather, 
  TN_AGRI_DISTRICTS, 
  DistrictCoordinates, 
  fetchRealTimeAgriWeather, 
  findDistrictFromLocation 
} from '../utils/weatherService';
import { speakText } from '../utils/voiceService';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  MapPin, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Compass, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WeatherWidgetProps {
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ className = '' }) => {
  const { language, currentUser, products } = useApp();

  // Find farmer's registered crops
  const farmerCrops = products
    .filter(p => p.farmerId === currentUser.id)
    .map(p => p.name);

  // Initialize selected district based on current user's location
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    const matched = findDistrictFromLocation(currentUser.location || 'Madurai');
    return matched.city;
  });

  const [weatherData, setWeatherData] = useState<RealTimeAgriWeather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'today' | 'forecast' | 'field-checks'>('today');

  // Load weather data for the selected district
  const loadWeather = async (districtKey: string) => {
    setIsLoading(true);
    const districtInfo = TN_AGRI_DISTRICTS[districtKey] || TN_AGRI_DISTRICTS['Madurai'];
    const data = await fetchRealTimeAgriWeather(districtInfo, farmerCrops.length > 0 ? farmerCrops : ['Tomato', 'Brinjal']);
    setWeatherData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, currentUser.location]);

  // Handle GPS location detection
  const handleDetectGPS = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert(language === 'ta' ? 'ஜிபிஎஸ் வசதி கிடைக்கவில்லை' : 'Geolocation not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Find closest district in our registry
        let closestKey = 'Madurai';
        let minDistance = Infinity;

        for (const [key, val] of Object.entries(TN_AGRI_DISTRICTS)) {
          const d = Math.hypot(val.lat - latitude, val.lon - longitude);
          if (d < minDistance) {
            minDistance = d;
            closestKey = key;
          }
        }

        setSelectedCity(closestKey);
        setIsLocating(false);
        try {
          confetti({ particleCount: 40, spread: 45, origin: { y: 0.8 } });
        } catch (e) {}
      },
      (err) => {
        console.warn('Geolocation failed or denied:', err);
        setIsLocating(false);
        // Default to user's saved location
        const matched = findDistrictFromLocation(currentUser.location || 'Madurai');
        setSelectedCity(matched.city);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Spoken voice advisory in Tamil or English
  const handleToggleVoice = () => {
    if (!weatherData) return;

    if (isSpeaking) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = language === 'ta'
        ? `${weatherData.city} வானிலை அறிக்கை. வெப்பநிலை ${weatherData.temperature} டிகிரி. மழை வாய்ப்பு ${weatherData.rainProbability} சதவீதம். ${weatherData.harvestVerdictTa}. ${weatherData.cropSpecificAdviceTa}`
        : `Weather advisory for ${weatherData.city}. Current temperature ${weatherData.temperature} degrees Celsius. Rain probability is ${weatherData.rainProbability} percent. ${weatherData.harvestVerdictEn}. ${weatherData.cropSpecificAdviceEn}`;

      speakText(textToSpeak, language);

      setTimeout(() => {
        setIsSpeaking(false);
      }, 12000);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-emerald-500/40 relative overflow-hidden space-y-5 ${className}`}>
      {/* Decorative ambient lighting */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Location Selector & Real-Time Status */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
              <Sun className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  {language === 'ta' ? 'நிகழ்நேர வானிலை & அறுவடை வழிகாட்டல்' : 'Live Agri Weather & Harvest Forecast'}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Station
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{weatherData ? `${weatherData.city}, ${weatherData.district}` : selectedCity}</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Location Dropdown & GPS Detect Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="flex items-center gap-1 text-xs font-bold bg-white/10 hover:bg-white/20 active:scale-95 text-emerald-200 px-3 py-2 rounded-xl border border-white/15 transition disabled:opacity-50"
            title="Detect My Farm Location via GPS"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-300' : 'text-emerald-400'}`} />
            <span>{isLocating ? 'Locating...' : 'GPS'}</span>
          </button>

          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-900/90 border border-emerald-500/40 text-emerald-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold cursor-pointer pr-7 appearance-none"
            >
              {Object.keys(TN_AGRI_DISTRICTS).map(city => (
                <option key={city} value={city} className="bg-slate-950 text-white">
                  {city} ({TN_AGRI_DISTRICTS[city].district})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={() => loadWeather(selectedCity)}
            disabled={isLoading}
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 rounded-xl border border-white/15 transition disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {weatherData && (
        <div className="relative z-10 space-y-4">
          {/* Main Harvest Readiness Hero Card */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            weatherData.harvestVerdict === 'Optimal' 
              ? 'bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border-emerald-400/50 shadow-md shadow-emerald-950/50'
              : weatherData.harvestVerdict === 'Good'
              ? 'bg-gradient-to-r from-teal-900/80 to-emerald-900/80 border-teal-400/50'
              : 'bg-gradient-to-r from-amber-950/80 to-slate-900/80 border-amber-500/50'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs ${
                    weatherData.harvestVerdict === 'Optimal'
                      ? 'bg-emerald-400 text-slate-950'
                      : weatherData.harvestVerdict === 'Good'
                      ? 'bg-teal-400 text-slate-950'
                      : 'bg-amber-400 text-slate-950'
                  }`}>
                    {language === 'ta' ? 'அறுவடை சாதக நிலை' : 'Harvest Readiness Index'}
                  </span>
                  <span className="text-xs font-black text-amber-300">
                    {weatherData.harvestScore}/100 Score
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                  {language === 'ta' ? weatherData.harvestVerdictTa : weatherData.harvestVerdictEn}
                </h4>
                <p className="text-xs text-emerald-100/90 font-medium">
                  {language === 'ta' ? weatherData.cropSpecificAdviceTa : weatherData.cropSpecificAdviceEn}
                </p>
              </div>

              {/* Hand-free Spoken Audio Button for Farmers */}
              <button
                onClick={handleToggleVoice}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs transition active:scale-95 shadow-md shrink-0 ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-950 animate-pulse border-2 border-amber-500'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
                title="Listen in Tamil or English"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{language === 'ta' ? 'நிறுத்து' : 'Stop Audio'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'ta' ? 'குரல் வழிகாட்டல்' : 'Listen Forecast'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Live Atmospheric Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Temperature */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                {language === 'ta' ? 'வெப்பநிலை' : 'Temperature'}
              </span>
              <div className="my-1">
                <span className="text-2xl font-black text-amber-300">{weatherData.temperature}°C</span>
                <span className="text-[11px] text-slate-300 font-semibold block">{weatherData.condition}</span>
              </div>
              <span className="text-[10px] text-slate-400">Feels {weatherData.apparentTemp}°C</span>
            </div>

            {/* Rain Probability */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                {language === 'ta' ? 'மழை வாய்ப்பு' : 'Rain Risk'}
              </span>
              <div className="my-1 flex items-baseline gap-1">
                <CloudRain className="w-4 h-4 text-cyan-400 inline" />
                <span className="text-2xl font-black text-cyan-300">{weatherData.rainProbability}%</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">
                {weatherData.rainProbability < 20 ? 'Safe Dry Sky' : 'Caution Wet'}
              </span>
            </div>

            {/* Humidity */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                {language === 'ta' ? 'காற்றின் ஈரப்பதம்' : 'Humidity'}
              </span>
              <div className="my-1 flex items-baseline gap-1">
                <Droplets className="w-4 h-4 text-emerald-400 inline" />
                <span className="text-2xl font-black text-emerald-300">{weatherData.humidity}%</span>
              </div>
              <span className="text-[10px] text-slate-400">Relative Humidity</span>
            </div>

            {/* Wind Speed */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                {language === 'ta' ? 'காற்றின் வேகம்' : 'Wind Speed'}
              </span>
              <div className="my-1 flex items-baseline gap-1">
                <Wind className="w-4 h-4 text-slate-300 inline" />
                <span className="text-2xl font-black text-slate-200">{weatherData.windSpeed}</span>
                <span className="text-xs text-slate-400 font-bold">km/h</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">
                {weatherData.windSpeed < 15 ? 'Safe for Spray' : 'Moderate Gust'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs: Today's Field Checks vs 5-Day Harvest Outlook */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'today'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {language === 'ta' ? 'இன்றைய கள வழிகாட்டல்' : "Today's Field Checks"}
            </button>

            <button
              onClick={() => setActiveTab('forecast')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'forecast'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {language === 'ta' ? '5-நாள் அறுவடை திட்டம்' : '5-Day Harvest Outlook'}
            </button>
          </div>

          {/* TAB 1: Today's Practical Field Decisions */}
          {activeTab === 'today' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Field Dryness & Machinery */}
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  🚜 {language === 'ta' ? 'மண் தரம் & இயந்திர இயக்கம்' : 'Soil Firmness & Machinery Movement'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {language === 'ta' ? weatherData.fieldDrynessStatusTa : weatherData.fieldDrynessStatus}
                </p>
              </div>

              {/* Grain & Pod Drying */}
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  ☀️ {language === 'ta' ? 'களத்துமேடு / தானிய உலர்த்தல்' : 'Paddy / Pod Terrace Sun-Drying'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {language === 'ta' ? weatherData.grainDryingStatusTa : weatherData.grainDryingStatus}
                </p>
              </div>

              {/* Pesticide & Nutrient Spraying */}
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-black text-teal-300 uppercase tracking-wider flex items-center gap-1">
                  🌱 {language === 'ta' ? 'உரக்கரைசல் / பூச்சி மருந்து தெளிப்பு' : 'Foliar Spray & Crop Protection'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {language === 'ta' ? weatherData.sprayingWindowStatusTa : weatherData.sprayingWindowStatus}
                </p>
              </div>

              {/* Perishable Produce Picking */}
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  🍅 {language === 'ta' ? 'காய்கறி பறிக்கும் நேரம்' : 'Perishable Vegetable Picking Window'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {language === 'ta' ? weatherData.perishablePickingWindowTa : weatherData.perishablePickingWindow}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 5-Day Harvest Window Planning */}
          {activeTab === 'forecast' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {weatherData.dailyForecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 flex flex-col justify-between text-center space-y-2"
                  >
                    <div>
                      <span className="text-xs font-black text-white block">
                        {day.dayName.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-emerald-300 font-bold block">
                        {day.date}
                      </span>
                    </div>

                    <div className="my-1">
                      <div className="flex items-center justify-center gap-1 text-sm font-black text-amber-300">
                        <span>{day.maxTemp}°</span>
                        <span className="text-slate-400 text-xs font-normal">/ {day.minTemp}°</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-300 font-bold mt-0.5">
                        <CloudRain className="w-3 h-3" />
                        <span>{day.rainProbability}%</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg block truncate ${
                      day.harvestSuitability === 'Optimal'
                        ? 'bg-emerald-400 text-slate-950'
                        : day.harvestSuitability === 'Good'
                        ? 'bg-teal-400 text-slate-950'
                        : 'bg-amber-400 text-slate-950'
                    }`}>
                      {language === 'ta' ? day.tamilHarvestTag : day.harvestTag}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                {language === 'ta'
                  ? 'வானிலை மாற்றங்களுக்கு ஏற்ப உங்கள் அறுவடை தேதிகளை முன்கூட்டியே திட்டமிடுங்கள்.'
                  : 'Align combine harvesters and produce packing with the 5-day dry window to maximize shelf life.'}
              </p>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
            <span>
              {language === 'ta' ? 'கடைசியாக புதுப்பிக்கப்பட்டது:' : 'Last Synced:'} {weatherData.lastUpdated}
            </span>
            <span className="text-emerald-400 font-semibold">
              Open-Meteo High-Resolution Agro Station
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
