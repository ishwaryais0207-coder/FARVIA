export type UserRole = 'farmer' | 'buyer' | 'admin';

export type BuyerCategory = 
  | 'individual'
  | 'retail_shop'
  | 'supermarket'
  | 'hotel'
  | 'restaurant'
  | 'institution'
  | 'other';

export type Language = 'ta' | 'en' | 'hi';

export type DeliveryType = 'home' | 'business' | 'pickup';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  city: string;
  district: string;
  state: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  buyerCategory?: BuyerCategory;
  location: string;
  coordinates: LocationCoordinates;
  verified: boolean;
  avatar?: string;
  farmSizeAcres?: number;
  rating: number;
  totalRatings: number;
  ordersCompleted: number;
}

export interface AgriculturalProduct {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerRating: number;
  farmerOrdersCount: number;
  name: string;
  tamilName: string;
  category: 'Vegetables' | 'Fruits' | 'Grains & Cereals' | 'Pulses' | 'Tubers' | 'Spices';
  quantity: number;
  unit: 'kg' | 'tonne' | 'quintal' | 'box' | 'bunch';
  expectedPrice: number; // per unit in INR
  marketAveragePrice: number;
  aiFairPriceMin: number;
  aiFairPriceMax: number;
  aiPriceReason: string;
  harvestDate: string;
  availableFrom: string;
  location: string;
  coordinates: LocationCoordinates;
  imageUrl: string;
  description: string;
  isSurplus: boolean;
  surplusDiscountPercent?: number;
  demandStatus: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export type Product = AgriculturalProduct;

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCategory: BuyerCategory;
  buyerPhone: string;
  productName: string;
  tamilProductName: string;
  requiredQuantity: number;
  unit: 'kg' | 'tonne' | 'quintal' | 'box';
  maxBudgetPerUnit: number;
  requiredByDate: string;
  deliveryLocation: string;
  coordinates: LocationCoordinates;
  deliveryPreference: DeliveryType;
  additionalNotes?: string;
  status: 'Open' | 'Matched' | 'Fulfilled' | 'Cancelled';
  createdAt: string;
}

export interface SmartMatchResult {
  farmerProduct: AgriculturalProduct;
  buyerRequirement: BuyerRequirement;
  matchScore: number; // 0 to 100
  distanceKm: number;
  priceDifferencePercent: number; // relative to fair price & budget
  quantityCoveragePercent: number;
  freshnessScore: number; // based on harvest date
  ratingScore: number;
  isBestMatch: boolean;
  matchReasons: string[];
  explanation: string;
}

export type OrderStatus = 
  | 'Pending Farmer Confirmation'
  | 'Order Accepted'
  | 'Packed & Ready'
  | 'In Transit'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  buyerCategory: BuyerCategory;
  item: OrderItem;
  deliveryType: DeliveryType;
  deliveryFee: number;
  platformFee: number; // e.g. ₹0 or minimal 1%
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'Pending' | 'Paid (UPI Sandbox)' | 'Failed' | 'Refunded';
  transactionId?: string;
  upiIdUsed?: string;
  deliveryTracking: {
    driverName: string;
    driverPhone: string;
    vehicleNumber: string;
    currentStage: number; // 1 to 5
    estimatedArrival: string;
    liveDistanceKm: number;
    lastUpdated: string;
  };
  farmerRatingGiven?: number;
  buyerRatingGiven?: number;
  reviewText?: string;
  createdAt: string;
  matchedRequirementId?: string;
}

export interface DemandPrediction {
  cropName: string;
  tamilCropName: string;
  category: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  next7DaysChangePercent: number;
  currentAvgPrice: number;
  projectedFairPrice: number;
  keyDrivers: string[];
  recommendedAction: string;
  seasonality: string;
}

export interface WeatherData {
  city: string;
  district: string;
  tempCelsius: number;
  condition: string;
  humidityPercent: number;
  rainfallProbabilityPercent: number;
  windSpeedKmh: number;
  advisory: {
    ta: string;
    en: string;
    hi: string;
  };
}

export interface AppNotification {
  id: string;
  targetUserId?: string;
  targetRole: UserRole | 'all';
  title: string;
  message: string;
  tamilMessage: string;
  type: 'order' | 'match' | 'payment' | 'price_alert' | 'demand_alert' | 'system';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

export interface ToastMessage {
  id: string;
  type: 'match' | 'order' | 'payment' | 'price_alert' | 'demand_alert' | 'system';
  title: string;
  tamilTitle?: string;
  message: string;
  tamilMessage?: string;
  linkAction?: string;
  actionLabel?: string;
  tamilActionLabel?: string;
  durationMs?: number;
  createdAt: number;
}
