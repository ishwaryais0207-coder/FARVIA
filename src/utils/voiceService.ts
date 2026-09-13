import { Language } from '../types';

export interface ParsedVoiceProduct {
  cropName: string;
  tamilName: string;
  quantity: number;
  unit: 'kg' | 'tonne' | 'quintal' | 'box';
  expectedPrice: number;
  location: string;
  confidence: number;
  rawText: string;
}

// Tamil keywords mapping
const TAMIL_CROP_KEYWORDS: Record<string, { en: string; ta: string }> = {
  'தக்காளி': { en: 'Tomato', ta: 'தக்காளி' },
  'வெங்காயம்': { en: 'Onion', ta: 'வெங்காயம்' },
  'உருளைக்கிழங்கு': { en: 'Potato', ta: 'உருளைக்கிழங்கு' },
  'வாழைப்பழம்': { en: 'Banana', ta: 'வாழைப்பழம்' },
  'கத்தரிக்காய்': { en: 'Brinjal', ta: 'கத்தரிக்காய்' },
  'கேரட்': { en: 'Carrot', ta: 'கேரட்' },
  'நெல்': { en: 'Paddy', ta: 'நெல்' },
  'அரிசி': { en: 'Paddy', ta: 'நெல்' },
  'மாம்பழம்': { en: 'Mango', ta: 'மாம்பழம்' },
  'பச்சை மிளகாய்': { en: 'Green Chilli', ta: 'பச்சை மிளகாய்' },
};

const ENGLISH_CROP_KEYWORDS: Record<string, { en: string; ta: string }> = {
  'tomato': { en: 'Tomato', ta: 'தக்காளி' },
  'onion': { en: 'Onion', ta: 'வெங்காயம்' },
  'potato': { en: 'Potato', ta: 'உருளைக்கிழங்கு' },
  'banana': { en: 'Banana', ta: 'வாழைப்பழம்' },
  'brinjal': { en: 'Brinjal', ta: 'கத்தரிக்காய்' },
  'eggplant': { en: 'Brinjal', ta: 'கத்தரிக்காய்' },
  'carrot': { en: 'Carrot', ta: 'கேரட்' },
  'paddy': { en: 'Paddy', ta: 'நெல்' },
  'rice': { en: 'Paddy', ta: 'நெல்' },
  'mango': { en: 'Mango', ta: 'மாம்பழம்' },
  'chilli': { en: 'Green Chilli', ta: 'பச்சை மிளகாய்' },
};

export function parseVoiceInput(text: string): ParsedVoiceProduct {
  const lower = text.toLowerCase();
  let cropName = 'Tomato';
  let tamilName = 'தக்காளி';
  let quantity = 100;
  let unit: 'kg' | 'tonne' | 'quintal' | 'box' = 'kg';
  let expectedPrice = 30;
  let location = 'Madurai';

  // 1. Detect Crop from Tamil words
  for (const [key, val] of Object.entries(TAMIL_CROP_KEYWORDS)) {
    if (text.includes(key)) {
      cropName = val.en;
      tamilName = val.ta;
      break;
    }
  }

  // Detect Crop from English words if not detected
  if (cropName === 'Tomato') {
    for (const [key, val] of Object.entries(ENGLISH_CROP_KEYWORDS)) {
      if (lower.includes(key)) {
        cropName = val.en;
        tamilName = val.ta;
        break;
      }
    }
  }

  // 2. Detect Quantity (look for numbers followed by kilo, kg, tonne, or Tamil கிலோ)
  const qtyMatch = text.match(/(\d+)\s*(?:கிலோ|கிலோகிராம்|kg|kilo|kgs|டன்|tonne|quintal)/i) ||
                   text.match(/(\d+)/);
  if (qtyMatch && qtyMatch[1]) {
    quantity = parseInt(qtyMatch[1], 10);
  }

  // Detect Unit
  if (text.includes('டன்') || lower.includes('tonne') || lower.includes('ton')) {
    unit = 'tonne';
  } else if (text.includes('குவின்டால்') || lower.includes('quintal')) {
    unit = 'quintal';
  } else if (text.includes('பெட்டி') || lower.includes('box')) {
    unit = 'box';
  }

  // 3. Detect Expected Price (look for numbers near ரூபாய், rs, rupees, ₹, விலை, or /kg)
  const priceMatch = text.match(/(?:ரூபாய்|ரூ|rs\.?|inr|₹)\s*(\d+)/i) ||
                     text.match(/(\d+)\s*(?:ரூபாய்|ரூ|rupees|rs)/i) ||
                     text.match(/(?:rate|price|விலை)\s*(\d+)/i);
  if (priceMatch && priceMatch[1]) {
    expectedPrice = parseInt(priceMatch[1], 10);
  } else {
    // If there were two numbers in speech, the second is often price
    const allNumbers = text.match(/\d+/g);
    if (allNumbers && allNumbers.length >= 2) {
      expectedPrice = parseInt(allNumbers[1], 10);
    }
  }

  // 4. Detect Location if mentioned (Madurai, Salem, Chennai, Coimbatore, Trichy, Tirunelveli)
  const locations = [
    { name: 'Madurai', keys: ['மதுரை', 'madurai'] },
    { name: 'Salem', keys: ['சேலம்', 'salem'] },
    { name: 'Chennai', keys: ['சென்னை', 'chennai'] },
    { name: 'Coimbatore', keys: ['கோவை', 'கோயம்புத்தூர்', 'coimbatore'] },
    { name: 'Trichy', keys: ['திருச்சி', 'திருச்சிராப்பள்ளி', 'trichy'] },
    { name: 'Tirunelveli', keys: ['திருநெல்வேலி', 'நெல்லை', 'tirunelveli'] },
  ];

  for (const loc of locations) {
    if (loc.keys.some(k => lower.includes(k) || text.includes(k))) {
      location = loc.name;
      break;
    }
  }

  return {
    cropName,
    tamilName,
    quantity,
    unit,
    expectedPrice,
    location,
    confidence: 0.94,
    rawText: text,
  };
}

import { tamilTts } from './tamilTtsService';

// Text-to-Speech (TTS) using dedicated Tamil TTS engine with Web Speech API
export function speakText(text: string, lang: Language = 'ta'): void {
  if (lang === 'ta') {
    tamilTts.speakTamil(text);
    return;
  }

  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterances
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

// Check if browser Speech Recognition is supported
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}
