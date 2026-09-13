import { AgriculturalProduct, BuyerRequirement, SmartMatchResult } from '../types';

// Haversine distance calculator between two coordinates (km)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function computeSmartMatches(
  requirement: BuyerRequirement,
  products: AgriculturalProduct[]
): SmartMatchResult[] {
  // Filter products that match name or category
  const candidateProducts = products.filter(p => {
    const pName = p.name.toLowerCase();
    const reqName = requirement.productName.toLowerCase();
    return pName.includes(reqName) || reqName.includes(pName);
  });

  const results: SmartMatchResult[] = candidateProducts.map(product => {
    // 1. Distance Calculation
    const distanceKm = calculateDistanceKm(
      requirement.coordinates.lat,
      requirement.coordinates.lng,
      product.coordinates.lat,
      product.coordinates.lng
    );

    // Distance Score: 100 if <= 5km, decays smoothly up to 100km
    let distanceScore = 100;
    if (distanceKm > 5) {
      distanceScore = Math.max(20, Math.round(100 - (distanceKm - 5) * 0.9));
    }

    // 2. Quantity Match: Does farmer have enough?
    const qtyRatio = product.quantity / requirement.requiredQuantity;
    let quantityCoveragePercent = Math.min(100, Math.round(qtyRatio * 100));
    let quantityScore = 100;
    if (qtyRatio < 1) {
      quantityScore = Math.round(qtyRatio * 90); // partial fulfillment penalty
    } else if (qtyRatio > 2.5) {
      quantityScore = 95; // slightly exceeds requirement, still great
    }

    // 3. Price Match: Farmer price vs Buyer budget & AI fair price
    const budget = requirement.maxBudgetPerUnit;
    const farmerPrice = product.expectedPrice;
    let priceScore = 90;
    const priceDiffPercent = Math.round(((farmerPrice - budget) / budget) * 100);

    if (farmerPrice <= budget) {
      // Farmer is within buyer's budget!
      priceScore = 100;
      if (farmerPrice <= product.aiFairPriceMax && farmerPrice >= product.aiFairPriceMin) {
        priceScore = 100; // right in the fair zone
      }
    } else {
      // Farmer asks slightly more than buyer's maximum
      const excess = farmerPrice - budget;
      priceScore = Math.max(10, Math.round(100 - excess * 8));
    }

    // 4. Freshness & Harvest Date Score
    let freshnessScore = 85;
    const harvestTime = new Date(product.harvestDate).getTime();
    const nowTime = new Date().getTime();
    const daysSinceHarvest = Math.max(0, Math.round((nowTime - harvestTime) / (1000 * 3600 * 24)));
    if (daysSinceHarvest <= 1) freshnessScore = 98;
    else if (daysSinceHarvest <= 3) freshnessScore = 88;
    else freshnessScore = 70;

    // 5. Rating Score
    const ratingScore = Math.min(100, Math.round((product.farmerRating / 5.0) * 100));

    // Weighted Total Match Score (0 - 100)
    // Distance: 30%, Price: 25%, Quantity: 20%, Freshness: 15%, Rating: 10%
    const rawScore =
      distanceScore * 0.30 +
      priceScore * 0.25 +
      quantityScore * 0.20 +
      freshnessScore * 0.15 +
      ratingScore * 0.10;

    const matchScore = Math.min(99, Math.max(35, Math.round(rawScore)));

    // Explainable reasons list
    const matchReasons: string[] = [];
    if (distanceKm <= 15) {
      matchReasons.push(`Hyper-local proximity (${distanceKm} km away)`);
    } else if (distanceKm <= 40) {
      matchReasons.push(`Regional cluster reach (${distanceKm} km away)`);
    }

    if (farmerPrice <= budget) {
      matchReasons.push(`Within buyer budget (₹${farmerPrice}/${product.unit} ≤ ₹${budget})`);
    }
    if (product.quantity >= requirement.requiredQuantity) {
      matchReasons.push(`Full volume available (${product.quantity} ${product.unit} ready)`);
    } else {
      matchReasons.push(`Partial volume ready (${product.quantity}/${requirement.requiredQuantity} ${product.unit})`);
    }

    if (product.farmerRating >= 4.5) {
      matchReasons.push(`High reliability rating (${product.farmerRating}★, ${product.farmerOrdersCount} orders)`);
    }

    if (freshnessScore >= 90) {
      matchReasons.push(`Freshly harvested within 24-48 hours`);
    }

    // Natural language explanation
    let explanation = '';
    if (matchScore >= 90) {
      explanation = `Nearby farmer (${distanceKm} km) with sufficient volume (${product.quantity} ${product.unit}) and fair price (₹${farmerPrice}/${product.unit}) matching within your budget.`;
    } else if (matchScore >= 75) {
      explanation = `Good candidate in ${product.location}. Volume matches ${quantityCoveragePercent}% of your request with dependable ${product.farmerRating}★ service history.`;
    } else {
      explanation = `Viable alternative: ${product.location} (${distanceKm} km) with ₹${farmerPrice}/${product.unit}.`;
    }

    return {
      farmerProduct: product,
      buyerRequirement: requirement,
      matchScore,
      distanceKm,
      priceDifferencePercent: priceDiffPercent,
      quantityCoveragePercent,
      freshnessScore,
      ratingScore,
      isBestMatch: false, // will mark highest score next
      matchReasons,
      explanation,
    };
  });

  // Sort descending by match score
  results.sort((a, b) => b.matchScore - a.matchScore);

  if (results.length > 0) {
    results[0].isBestMatch = true;
  }

  return results;
}
