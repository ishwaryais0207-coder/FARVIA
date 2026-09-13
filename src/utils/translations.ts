import { Language } from '../types';

export const translations = {
  // Navigation & Branding
  brandName: {
    en: 'FARVIA',
    ta: 'ஃபார்வியா (FARVIA)',
    hi: 'फारविया (FARVIA)',
  },
  tagline: {
    en: 'From Farmer to Buyer, Fair and Direct.',
    ta: 'விவசாயியிடமிருந்து நுகர்வோருக்கு, நியாயமான நேரடி சந்தை.',
    hi: 'किसान से सीधे खरीदार तक, उचित और पारदर्शी।',
  },
  farmerRole: {
    en: 'Farmer',
    ta: 'விவசாயி',
    hi: 'किसान',
  },
  buyerRole: {
    en: 'Buyer',
    ta: 'கொள்முதல் செய்வோர் (வாங்குபவர்)',
    hi: 'खरीदार',
  },
  adminRole: {
    en: 'Admin',
    ta: 'நிர்வாகி',
    hi: 'व्यवस्थापक',
  },
  navMarketplace: {
    en: 'Marketplace',
    ta: 'சந்தை',
    hi: 'मंडी/बाजार',
  },
  navRequirements: {
    en: 'Buyer Requirements',
    ta: 'தேவைகள் கோரிக்கை',
    hi: 'खरीदार आवश्यकताएं',
  },
  navSmartMatches: {
    en: 'AI Smart Matches',
    ta: 'AI சிறந்த பொருத்தங்கள்',
    hi: 'AI स्मार्ट मिलान',
  },
  navSurplus: {
    en: 'Surplus Produce',
    ta: 'உபரி விளைச்சல்',
    hi: 'अधिशेष उपज',
  },
  navFairPrice: {
    en: 'Fair Price & Demand',
    ta: 'நியாய விலை & தேவை கணிப்பு',
    hi: 'उचित मूल्य एवं मांग',
  },
  navOrders: {
    en: 'Orders & Tracking',
    ta: 'ஆர்டர்கள் & கண்காணிப்பு',
    hi: 'ऑर्डर और ट्रैकिंग',
  },
  navImpact: {
    en: 'Impact Dashboard',
    ta: 'தாக்கம் & பயன்கள்',
    hi: 'प्रभाव डैशबोर्ड',
  },
  navVoiceAssistant: {
    en: 'Voice Assistant',
    ta: 'குரல் உதவியாளர்',
    hi: 'आवाज सहायक',
  },
  navAdmin: {
    en: 'Admin Panel',
    ta: 'நிர்வாகப் பலகை',
    hi: 'एडमिन पैनल',
  },

  // Actions
  addProduct: {
    en: '+ Add Farm Product',
    ta: '+ புதிய விளைபொருள் சேர்க்க',
    hi: '+ नई फसल/उपज जोड़ें',
  },
  postRequirement: {
    en: '+ Post Requirement',
    ta: '+ தேவை கோரிக்கை பதிவு செய்ய',
    hi: '+ नई मांग पोस्ट करें',
  },
  buyNow: {
    en: 'Direct Buy',
    ta: 'நேரடியாக வாங்க',
    hi: 'सीधे खरीदें',
  },
  viewDetails: {
    en: 'View Details',
    ta: 'விவரங்களை பார்க்க',
    hi: 'विवरण देखें',
  },
  contactFarmer: {
    en: 'Call Farmer',
    ta: 'விவசாயியை அழைக்க',
    hi: 'किसान को कॉल करें',
  },
  acceptOrder: {
    en: 'Accept Order',
    ta: 'ஆர்டரை ஏற்கவும்',
    hi: 'ऑर्डर स्वीकार करें',
  },
  rejectOrder: {
    en: 'Decline',
    ta: 'நிராகரிக்க',
    hi: 'अस्वीकार करें',
  },
  payWithUpi: {
    en: 'Pay via UPI (Sandbox)',
    ta: 'UPI மூலம் பணம் செலுத்துக',
    hi: 'UPI से भुगतान करें',
  },
  trackDelivery: {
    en: 'Live Track',
    ta: 'நேரலை கண்காணிப்பு',
    hi: 'लाइव ट्रैक',
  },
  rateExperience: {
    en: 'Rate & Review',
    ta: 'மதிப்பீடு வழங்குக',
    hi: 'रेटिंग और समीक्षा दें',
  },
  speakNow: {
    en: 'Tap to Speak',
    ta: 'பேச தொடங்குங்கள்',
    hi: 'बोलने के लिए दबाएं',
  },
  listening: {
    en: 'Listening in Tamil / English...',
    ta: 'கேட்கிறது... பேசுங்கள்...',
    hi: 'सुन रहा है... बोलिए...',
  },

  // Key Labels
  expectedPrice: {
    en: 'Farmer Expected Price',
    ta: 'விவசாயி எதிர்பார்க்கும் விலை',
    hi: 'किसान का अपेक्षित मूल्य',
  },
  aiFairPrice: {
    en: 'AI Fair Price Range',
    ta: 'AI பரிந்துரைக்கும் நியாய விலை',
    hi: 'AI उचित मूल्य सीमा',
  },
  availableQty: {
    en: 'Available Quantity',
    ta: 'இருப்பு அளவு',
    hi: 'उपलब्ध मात्रा',
  },
  requiredQty: {
    en: 'Required Quantity',
    ta: 'தேவையான அளவு',
    hi: 'आवश्यक मात्रा',
  },
  distance: {
    en: 'Distance',
    ta: 'தொலைவு',
    hi: 'दूरी',
  },
  harvestDate: {
    en: 'Harvest Date',
    ta: 'அறுவடை நாள்',
    hi: 'फसल कटाई तिथि',
  },
  rating: {
    en: 'Farmer Rating',
    ta: 'விவசாயி மதிப்பீடு',
    hi: 'किसान रेटिंग',
  },
  location: {
    en: 'Location',
    ta: 'இடம்',
    hi: 'स्थान',
  },
  matchScore: {
    en: 'AI Match Score',
    ta: 'AI பொருத்த விகிதம்',
    hi: 'AI मैच स्कोर',
  },
  bestMatch: {
    en: 'Best Direct Match',
    ta: 'சிறந்த நேரடி பொருத்தம்',
    hi: 'सर्वोत्तम प्रत्यक्ष मिलान',
  },

  // Delivery options
  homeDelivery: {
    en: 'Home Delivery',
    ta: 'வீட்டுக்கே டெலிவரி',
    hi: 'घर पर डिलीवरी',
  },
  businessDelivery: {
    en: 'Business Bulk Delivery (Hotels/Shops)',
    ta: 'வணிக மொத்த டெலிவரி (ஹோட்டல்/கடைகள்)',
    hi: 'व्यावसायिक डिलीवरी (होटल/दुकानें)',
  },
  farmPickup: {
    en: 'Direct Farm/Yard Pickup',
    ta: 'நேரடி தோட்டம் / களத்துமேடு எடுப்பு',
    hi: 'खेत से सीधी उठान',
  },

  // Problem statement / hero
  heroTitle: {
    en: 'Sell Direct. Earn Fair. Buy Better.',
    ta: 'நேரடியாக விற்போம். நியாயமாய் சம்பாதிப்போம். நுகர்வோருக்கு மலிவு.',
    hi: 'सीधे बेचें। उचित कमाएं। बेहतर खरीदें।',
  },
  heroSubtitle: {
    en: 'Connecting farmers directly with consumers, hotels, restaurants and supermarkets without middlemen exploitation.',
    ta: 'இடைத்தரகர்களின்றி விவசாயிகளை நுகர்வோர், உணவகங்கள், சூப்பர் மார்க்கெட்டுகளுடன் நேரடியாக இணைக்கும் நவீன தளம்.',
    hi: 'बिचौलियों के बिना किसानों को सीधे उपभोक्ताओं, होटलों और सुपरमार्केट से जोड़ने वाला आधुनिक मंच।',
  },

  // Agro Weather
  weatherAdvisory: {
    en: 'Agri Weather Advisory',
    ta: 'வேளாண் வானிலை வழிகாட்டல்',
    hi: 'कृषि मौसम परामर्श',
  },
};

export function t(key: keyof typeof translations, lang: Language = 'en'): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return translations[key]?.['en'] || key;
}

export const CROP_TRANSLATIONS: Record<string, { ta: string; hi: string }> = {
  'Tomato': { ta: 'தக்காளி', hi: 'टमाटर' },
  'Onion': { ta: 'வெங்காயம்', hi: 'प्याज' },
  'Potato': { ta: 'உருளைக்கிழங்கு', hi: 'आलू' },
  'Banana': { ta: 'வாழைப்பழம் (நேந்திரன்/பூவன்)', hi: 'केला' },
  'Brinjal': { ta: 'கத்தரிக்காய்', hi: 'बैंगन' },
  'Carrot': { ta: 'கேரட் (ஊட்டி)', hi: 'गाजर' },
  'Paddy': { ta: 'நெல் / பொன்னி அரிசி', hi: 'धान / चावल' },
  'Mango': { ta: 'மாம்பழம் (அல்போன்சா/பங்கனப்பள்ளி)', hi: 'आम' },
  'Green Chilli': { ta: 'பச்சை மிளகாய்', hi: 'हरी मिर्च' },
  'Cabbage': { ta: 'முட்டைக்கோஸ்', hi: 'पत्तागोभी' },
};
