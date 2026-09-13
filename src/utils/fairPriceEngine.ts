export interface FairPriceEstimate {
  cropName: string;
  expectedPrice: number;
  localMarketPrice: number;
  stateAvgPrice: number;
  traditionalTraderOffer: number;
  recommendedMin: number;
  recommendedMax: number;
  demandFactor: 'High' | 'Medium' | 'Low';
  supplyFactor: 'High' | 'Medium' | 'Low';
  mandiWholesaleRate: number;
  averageRetailPrice: number;
  verdict: 'Fair & Competitive' | 'Underpriced' | 'Slightly High';
  farmerUpliftPercent: number; // Farmer gains vs traditional trader
  buyerSavingsPercent: number; // Buyer saves vs traditional retail
  explanation: string;
}

// Mandi base benchmarks across Tamil Nadu districts
export const MANDI_BENCHMARKS: Record<string, { baseAvg: number; unit: string; typicalDemand: 'High' | 'Medium' | 'Low' }> = {
  'Tomato': { baseAvg: 28, unit: 'kg', typicalDemand: 'High' },
  'Onion': { baseAvg: 34, unit: 'kg', typicalDemand: 'High' },
  'Potato': { baseAvg: 26, unit: 'kg', typicalDemand: 'Medium' },
  'Banana': { baseAvg: 40, unit: 'bunch', typicalDemand: 'High' },
  'Brinjal': { baseAvg: 32, unit: 'kg', typicalDemand: 'Medium' },
  'Carrot': { baseAvg: 48, unit: 'kg', typicalDemand: 'High' },
  'Paddy': { baseAvg: 23, unit: 'kg', typicalDemand: 'High' },
  'Mango': { baseAvg: 75, unit: 'kg', typicalDemand: 'High' },
  'Green Chilli': { baseAvg: 55, unit: 'kg', typicalDemand: 'High' },
  'Cabbage': { baseAvg: 22, unit: 'kg', typicalDemand: 'Medium' },
};

export function calculateFairPrice(
  cropName: string,
  farmerExpectedPrice: number,
  location: string = 'Madurai'
): FairPriceEstimate {
  const benchmark = MANDI_BENCHMARKS[cropName] || { baseAvg: farmerExpectedPrice * 0.95 || 30, unit: 'kg', typicalDemand: 'Medium' };
  
  // Location variance
  let locationMod = 1.0;
  if (location.toLowerCase().includes('chennai') || location.toLowerCase().includes('coimbatore')) {
    locationMod = 1.08; // Metro demand
  } else if (location.toLowerCase().includes('salem') || location.toLowerCase().includes('trichy')) {
    locationMod = 1.02;
  }

  const localMarketPrice = Math.round(benchmark.baseAvg * locationMod);
  const stateAvgPrice = Math.round(benchmark.baseAvg * 1.04);
  
  // Traditional middleman/trader buying price is typically 30-40% below wholesale
  const traditionalTraderOffer = Math.round(localMarketPrice * 0.65);
  
  // Traditional retail store price paid by consumers
  const traditionalRetailPrice = Math.round(localMarketPrice * 1.45);

  // AI Recommended range factoring current demand
  let recommendedMin: number;
  let recommendedMax: number;

  if (benchmark.typicalDemand === 'High') {
    recommendedMin = Math.max(Math.round(localMarketPrice * 0.98), Math.round(farmerExpectedPrice * 0.92));
    recommendedMax = Math.round(localMarketPrice * 1.12);
  } else {
    recommendedMin = Math.round(localMarketPrice * 0.92);
    recommendedMax = Math.round(localMarketPrice * 1.03);
  }

  // Ensure logical ordering
  if (recommendedMin > recommendedMax) {
    const temp = recommendedMin;
    recommendedMin = recommendedMax;
    recommendedMax = temp + 2;
  }

  const avgDirectPrice = (recommendedMin + recommendedMax) / 2;
  const farmerUpliftPercent = Math.round(((avgDirectPrice - traditionalTraderOffer) / traditionalTraderOffer) * 100);
  const buyerSavingsPercent = Math.round(((traditionalRetailPrice - avgDirectPrice) / traditionalRetailPrice) * 100);

  const explanation = `Based on current local mandi benchmarks in ${location} and ${benchmark.typicalDemand.toLowerCase()} demand trends, ₹${recommendedMin}–₹${recommendedMax}/${benchmark.unit} is an equitable direct-selling range. This offers you ~${farmerUpliftPercent}% higher earnings than local trader brokers while saving buyers ~${buyerSavingsPercent}% compared to retail markets. (Estimates are advisory and not legally guaranteed).`;

  const verdict = farmerExpectedPrice < recommendedMin
    ? 'Underpriced'
    : farmerExpectedPrice > recommendedMax
    ? 'Slightly High'
    : 'Fair & Competitive';

  return {
    cropName,
    expectedPrice: farmerExpectedPrice,
    localMarketPrice,
    stateAvgPrice,
    traditionalTraderOffer,
    mandiWholesaleRate: localMarketPrice,
    averageRetailPrice: traditionalRetailPrice,
    supplyFactor: 'Medium',
    recommendedMin,
    recommendedMax,
    verdict,
    demandFactor: benchmark.typicalDemand,
    farmerUpliftPercent,
    buyerSavingsPercent,
    explanation,
  };
}
