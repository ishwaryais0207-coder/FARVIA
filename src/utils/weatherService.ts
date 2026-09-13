export interface DailyForecast {
  date: string;
  dayName: string;
  weatherCode: number;
  condition: string;
  maxTemp: number;
  minTemp: number;
  rainProbability: number;
  windSpeed: number;
  harvestSuitability: 'Optimal' | 'Good' | 'Moderate' | 'Risky';
  harvestTag: string;
  tamilHarvestTag: string;
}

export interface RealTimeAgriWeather {
  city: string;
  district: string;
  temperature: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  condition: string;
  weatherCode: number;
  isRealTime: boolean;
  lastUpdated: string;
  harvestScore: number; // 0 to 100
  harvestVerdict: 'Optimal' | 'Good' | 'Moderate' | 'Risky';
  harvestVerdictTa: string;
  harvestVerdictEn: string;
  fieldDrynessStatus: string;
  fieldDrynessStatusTa: string;
  grainDryingStatus: string;
  grainDryingStatusTa: string;
  sprayingWindowStatus: string;
  sprayingWindowStatusTa: string;
  perishablePickingWindow: string;
  perishablePickingWindowTa: string;
  dailyForecast: DailyForecast[];
  cropSpecificAdviceEn: string;
  cropSpecificAdviceTa: string;
}

export interface DistrictCoordinates {
  city: string;
  district: string;
  lat: number;
  lon: number;
  region: string;
}

export const TN_AGRI_DISTRICTS: Record<string, DistrictCoordinates> = {
  'Madurai': { city: 'Madurai', district: 'Madurai', lat: 9.9252, lon: 78.1198, region: 'South Agrarian Hub' },
  'Melur': { city: 'Melur', district: 'Madurai', lat: 10.0336, lon: 78.3361, region: 'Madurai East' },
  'Salem': { city: 'Salem', district: 'Salem', lat: 11.6643, lon: 78.1460, region: 'Horticulture & Sambar Onion' },
  'Coimbatore': { city: 'Coimbatore', district: 'Coimbatore', lat: 11.0168, lon: 76.9558, region: 'Western Agro Zone' },
  'Thanjavur': { city: 'Thanjavur', district: 'Thanjavur', lat: 10.7870, lon: 79.1378, region: 'Cauvery Delta Rice Bowl' },
  'Trichy': { city: 'Trichy', district: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047, region: 'Central Banana & Paddy' },
  'Theni': { city: 'Theni', district: 'Theni', lat: 10.0104, lon: 77.4768, region: 'Cumbum Valley Fruits' },
  'Dindigul': { city: 'Dindigul', district: 'Dindigul', lat: 10.3673, lon: 77.9803, region: 'Vegetable Sowing Belt' },
  'Tirunelveli': { city: 'Tirunelveli', district: 'Tirunelveli', lat: 8.7139, lon: 77.7567, region: 'Tamirabarani Delta' },
  'Erode': { city: 'Erode', district: 'Erode', lat: 11.3410, lon: 77.7172, region: 'Turmeric & Sugarcane' },
  'Tirupur': { city: 'Tirupur', district: 'Tirupur', lat: 11.1085, lon: 77.3411, region: 'Kongu Pulses & Maize' },
  'Chennai': { city: 'Chennai', district: 'Chennai', lat: 13.0827, lon: 80.2707, region: 'Coastal Terminal Market' },
  'Dharmapuri': { city: 'Dharmapuri', district: 'Dharmapuri', lat: 12.1357, lon: 78.1580, region: 'Mango & Tomato Belt' },
  'Vellore': { city: 'Vellore', district: 'Vellore', lat: 12.9165, lon: 79.1325, region: 'Palar Basin Vegetables' }
};

// Map WMO weather codes to human-readable strings
export function mapWeatherCodeToCondition(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Mostly Sunny';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Morning Fog';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 80 && code <= 82) return 'Scattered Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Partly Cloudy';
}

/**
 * Identify closest district from farmer location string
 */
export function findDistrictFromLocation(location: string): DistrictCoordinates {
  const normalized = (location || '').toLowerCase();
  for (const [key, val] of Object.entries(TN_AGRI_DISTRICTS)) {
    if (normalized.includes(key.toLowerCase()) || normalized.includes(val.district.toLowerCase())) {
      return val;
    }
  }
  return TN_AGRI_DISTRICTS['Madurai'];
}

/**
 * Compute agricultural harvest suitability score and advisories based on meteorological metrics
 */
export function computeHarvestMetrics(
  rainProb: number,
  humidity: number,
  windSpeed: number,
  temp: number
): {
  score: number;
  verdict: 'Optimal' | 'Good' | 'Moderate' | 'Risky';
  verdictTa: string;
  verdictEn: string;
  fieldDrynessTa: string;
  fieldDrynessEn: string;
  grainDryingTa: string;
  grainDryingEn: string;
  sprayingTa: string;
  sprayingEn: string;
  perishablePickingTa: string;
  perishablePickingEn: string;
} {
  let score = 100;

  // Rain penalty (heaviest impact on harvest)
  if (rainProb > 50) score -= 45;
  else if (rainProb > 25) score -= 25;
  else if (rainProb > 15) score -= 10;

  // Humidity penalty (affects drying and fungus)
  if (humidity > 80) score -= 20;
  else if (humidity > 70) score -= 10;

  // Wind penalty (causes fruit drops / spray drift)
  if (windSpeed > 25) score -= 15;
  else if (windSpeed > 18) score -= 8;

  // Extreme heat penalty
  if (temp > 37) score -= 10;

  score = Math.max(20, Math.min(100, score));

  let verdict: 'Optimal' | 'Good' | 'Moderate' | 'Risky' = 'Optimal';
  let verdictTa = 'அறுவடைக்கு மிகச் சிறந்த சாதகமான வானிலை';
  let verdictEn = 'Optimal Window for Field Harvest';

  if (score < 50) {
    verdict = 'Risky';
    verdictTa = 'மழை வாய்ப்பு - அறுவடையை ஒத்திவைப்பது நல்லது';
    verdictEn = 'Rain Imminent — Delay Harvest to Avoid Crop Spoilage';
  } else if (score < 75) {
    verdict = 'Moderate';
    verdictTa = 'மிதமான வானிலை - காலை நேரத்தில் மட்டும் அறுவடை செய்யவும்';
    verdictEn = 'Moderate Conditions — Early Morning Harvest Advised';
  } else if (score < 90) {
    verdict = 'Good';
    verdictTa = 'நல்ல வானிலை - காய்கறி அறுவடைக்கு உகந்தது';
    verdictEn = 'Good Harvest Conditions';
  }

  // Field Dryness
  const fieldDrynessEn = rainProb < 20 && humidity < 70
    ? 'Soil is firm and dry — Harvester and tractor movement fully safe without rutting'
    : 'Moderate soil dampness — Manual hand-picking recommended over heavy machinery';
  const fieldDrynessTa = rainProb < 20 && humidity < 70
    ? 'மண் காய்ந்து உறுதியாக உள்ளது — அறுவடை இயந்திரங்கள் மற்றும் டிராக்டர் இயக்க பாதுகாப்பானது'
    : 'நிலத்தில் லேசான ஈரப்பதம் — மனித உழைப்பு மூலம் அறுவடை செய்ய பரிந்துரைக்கப்படுகிறது';

  // Grain / Pod Sun Drying
  const grainDryingEn = rainProb < 20 && humidity < 65
    ? 'Excellent sun radiation (8+ hrs) — Fast moisture reduction for paddy, groundnut, and chillies'
    : 'Higher atmospheric moisture — Cover sun-drying grain lots before late afternoon';
  const grainDryingTa = rainProb < 20 && humidity < 65
    ? 'சிறந்த வெயில் நிலை (8 மணிநேரம்) — நெல், நிலக்கடலை மற்றும் மிளகாய் உலர்த்த மிக உகந்தது'
    : 'வளிமண்டல ஈரப்பதம் அதிகம் — உலர்த்தும் தானியங்களை மாலைக்குள் பத்திரப்படுத்தவும்';

  // Spraying Window
  const sprayingEn = windSpeed < 15 && rainProb < 20
    ? 'Safe Window — Low wind velocity (<15 km/h), minimal chemical drift loss'
    : 'Avoid spraying — Risk of pesticide wash-off due to humid cloud cover or gusty winds';
  const sprayingTa = windSpeed < 15 && rainProb < 20
    ? 'மருந்து தெளிக்க உகந்தது — காற்றின் வேகம் 15 கி.மீ-க்கு குறைவாக உள்ளதால் தெளிப்பு வீணாகாது'
    : 'மருந்து தெளிப்பதை தவிர்க்கவும் — காற்று மற்றும் மழை வாய்ப்பால் மருந்து வீணாகலாம்';

  // Perishable vegetable picking
  const perishablePickingEn = 'Pick tomatoes, brinjals & green chillies between 6:00 AM – 10:30 AM to preserve turgidity and shelf life.';
  const perishablePickingTa = 'தக்காளி, கத்தரி மற்றும் மிளகாயை காலை 6:00 மணி முதல் 10:30 மணிக்குள் அறுவடை செய்தால் காய் வாடாமல் புத்துணர்ச்சியுடன் இருக்கும்.';

  return {
    score,
    verdict,
    verdictTa,
    verdictEn,
    fieldDrynessTa,
    fieldDrynessEn,
    grainDryingTa,
    grainDryingEn,
    sprayingTa,
    sprayingEn,
    perishablePickingTa,
    perishablePickingEn,
  };
}

/**
 * Fetch real-time localized weather from Open-Meteo API with local fallback
 */
export async function fetchRealTimeAgriWeather(
  districtInfo: DistrictCoordinates,
  farmerCrops: string[] = ['Tomato', 'Brinjal']
): Promise<RealTimeAgriWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${districtInfo.lat}&longitude=${districtInfo.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    const current = data.current;
    const daily = data.daily;

    const temp = Math.round(current.temperature_2m || 31);
    const apparent = Math.round(current.apparent_temperature || temp);
    const humidity = Math.round(current.relative_humidity_2m || 60);
    const wind = Math.round(current.wind_speed_10m || 12);
    const rainProb = Math.round(daily.precipitation_probability_max?.[0] ?? (current.precipitation > 0 ? 70 : 15));
    const weatherCode = current.weather_code ?? 1;
    const condition = mapWeatherCodeToCondition(weatherCode);

    const metrics = computeHarvestMetrics(rainProb, humidity, wind, temp);

    // Build 5-day daily forecast
    const forecast: DailyForecast[] = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysTa = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

    const count = Math.min(5, (daily.time || []).length);
    for (let i = 0; i < count; i++) {
      const d = new Date(daily.time[i]);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()];
      const dayNameTa = i === 0 ? 'இன்று' : i === 1 ? 'நாளை' : daysTa[d.getDay()];
      const pMax = Math.round(daily.precipitation_probability_max?.[i] ?? 15);
      const code = daily.weather_code?.[i] ?? 1;

      let harvestSuitability: 'Optimal' | 'Good' | 'Moderate' | 'Risky' = 'Optimal';
      let harvestTag = '🌟 Prime Harvest Window';
      let tamilHarvestTag = '🌟 சிறந்த அறுவடை நாள்';

      if (pMax > 50) {
        harvestSuitability = 'Risky';
        harvestTag = '⚠️ High Rain Spoilage Risk';
        tamilHarvestTag = '⚠️ மழை அபாயம் - அறுவடையை தள்ளிப்போடவும்';
      } else if (pMax > 25) {
        harvestSuitability = 'Moderate';
        harvestTag = '🌤️ Early Morning Only';
        tamilHarvestTag = '🌤️ அதிகாலை மட்டும் அறுவடை';
      } else if (pMax > 15) {
        harvestSuitability = 'Good';
        harvestTag = '✓ Favorable Harvest Day';
        tamilHarvestTag = '✓ அறுவடைக்கு ஏற்ற நாள்';
      }

      forecast.push({
        date: daily.time[i],
        dayName: `${dayName} (${dayNameTa})`,
        weatherCode: code,
        condition: mapWeatherCodeToCondition(code),
        maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? (temp + 2)),
        minTemp: Math.round(daily.temperature_2m_min?.[i] ?? (temp - 6)),
        rainProbability: pMax,
        windSpeed: Math.round(daily.wind_speed_10m_max?.[i] ?? wind),
        harvestSuitability,
        harvestTag,
        tamilHarvestTag
      });
    }

    // Crop specific advisory
    const cropListStr = farmerCrops.slice(0, 3).join(', ');
    const cropSpecificAdviceEn = `Weather outlook for ${districtInfo.city}: Low rain risk (${rainProb}%) and ${temp}°C warmth make it optimal to harvest ${cropListStr || 'vegetables'} today. Direct loading onto transport vehicles will prevent transit spoilage.`;
    const cropSpecificAdviceTa = `${districtInfo.city} பகுதியில் இன்று மழை வாய்ப்பு ${rainProb}% மட்டுமே உள்ளதால், உங்கள் ${cropListStr || 'பயிர்களை'} அறுவடை செய்து உடனடியாக வாகனத்தில் ஏற்றுவதற்கு இதுவே மிகச் சிறந்த தருணம்.`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      city: districtInfo.city,
      district: districtInfo.district,
      temperature: temp,
      apparentTemp: apparent,
      humidity,
      windSpeed: wind,
      rainProbability: rainProb,
      condition,
      weatherCode,
      isRealTime: true,
      lastUpdated: timeStr,
      harvestScore: metrics.score,
      harvestVerdict: metrics.verdict,
      harvestVerdictEn: metrics.verdictEn,
      harvestVerdictTa: metrics.verdictTa,
      fieldDrynessStatus: metrics.fieldDrynessEn,
      fieldDrynessStatusTa: metrics.fieldDrynessTa,
      grainDryingStatus: metrics.grainDryingEn,
      grainDryingStatusTa: metrics.grainDryingTa,
      sprayingWindowStatus: metrics.sprayingEn,
      sprayingWindowStatusTa: metrics.sprayingTa,
      perishablePickingWindow: metrics.perishablePickingEn,
      perishablePickingWindowTa: metrics.perishablePickingTa,
      dailyForecast: forecast,
      cropSpecificAdviceEn,
      cropSpecificAdviceTa
    };
  } catch (err) {
    console.warn('Open-Meteo real-time fetch fallback:', err);
    return getFallbackAgriWeather(districtInfo, farmerCrops);
  }
}

/**
 * High-quality fallback if network is offline
 */
export function getFallbackAgriWeather(
  districtInfo: DistrictCoordinates,
  farmerCrops: string[] = ['Tomato', 'Brinjal']
): RealTimeAgriWeather {
  const temp = 32;
  const humidity = 58;
  const wind = 12;
  const rainProb = 15;
  const metrics = computeHarvestMetrics(rainProb, humidity, wind, temp);

  const forecast: DailyForecast[] = [
    {
      date: '2026-09-11',
      dayName: 'Today (இன்று)',
      weatherCode: 1,
      condition: 'Clear Sunshine',
      maxTemp: 33,
      minTemp: 24,
      rainProbability: 15,
      windSpeed: 12,
      harvestSuitability: 'Optimal',
      harvestTag: '🌟 Prime Harvest Window',
      tamilHarvestTag: '🌟 சிறந்த அறுவடை நாள்'
    },
    {
      date: '2026-09-12',
      dayName: 'Tomorrow (நாளை)',
      weatherCode: 2,
      condition: 'Partly Sunny',
      maxTemp: 32,
      minTemp: 23,
      rainProbability: 20,
      windSpeed: 14,
      harvestSuitability: 'Good',
      harvestTag: '✓ Good Field Conditions',
      tamilHarvestTag: '✓ அறுவடைக்கு சாதகமான நாள்'
    },
    {
      date: '2026-09-13',
      dayName: 'Saturday (சனி)',
      weatherCode: 3,
      condition: 'Pleasant Breeze',
      maxTemp: 31,
      minTemp: 24,
      rainProbability: 25,
      windSpeed: 15,
      harvestSuitability: 'Good',
      harvestTag: '🌤️ Morning Harvest Window',
      tamilHarvestTag: '🌤️ காலை நேர அறுவடை'
    },
    {
      date: '2026-09-14',
      dayName: 'Sunday (ஞாயிறு)',
      weatherCode: 61,
      condition: 'Evening Showers',
      maxTemp: 30,
      minTemp: 23,
      rainProbability: 45,
      windSpeed: 18,
      harvestSuitability: 'Moderate',
      harvestTag: '⚠️ Wrap Up by 2 PM',
      tamilHarvestTag: '⚠️ மாலை மழைக்கு முன் முடிக்கவும்'
    },
    {
      date: '2026-09-15',
      dayName: 'Monday (திங்கள்)',
      weatherCode: 1,
      condition: 'Clear Sky',
      maxTemp: 32,
      minTemp: 24,
      rainProbability: 10,
      windSpeed: 11,
      harvestSuitability: 'Optimal',
      harvestTag: '🌟 Prime Field Day',
      tamilHarvestTag: '🌟 சிறந்த அறுவடை நாள்'
    }
  ];

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    city: districtInfo.city,
    district: districtInfo.district,
    temperature: temp,
    apparentTemp: 33,
    humidity,
    windSpeed: wind,
    rainProbability: rainProb,
    condition: 'Optimal Sunshine',
    weatherCode: 1,
    isRealTime: false,
    lastUpdated: timeStr,
    harvestScore: 94,
    harvestVerdict: 'Optimal',
    harvestVerdictEn: 'Optimal Window for Field Harvest',
    harvestVerdictTa: 'அறுவடைக்கு மிகச் சிறந்த சாதகமான வானிலை',
    fieldDrynessStatus: metrics.fieldDrynessEn,
    fieldDrynessStatusTa: metrics.fieldDrynessTa,
    grainDryingStatus: metrics.grainDryingEn,
    grainDryingStatusTa: metrics.grainDryingTa,
    sprayingWindowStatus: metrics.sprayingEn,
    sprayingWindowStatusTa: metrics.sprayingTa,
    perishablePickingWindow: metrics.perishablePickingEn,
    perishablePickingWindowTa: metrics.perishablePickingTa,
    dailyForecast: forecast,
    cropSpecificAdviceEn: `Weather in ${districtInfo.city}: Low rain risk (${rainProb}%) and warm sun make today ideal to harvest your produce.`,
    cropSpecificAdviceTa: `${districtInfo.city} பகுதியில் குறைந்த மழை வாய்ப்பு மற்றும் நல்ல வெயில் இருப்பதால், இன்றைய அறுவடைக்கு மிகச் சிறந்தது.`
  };
}
