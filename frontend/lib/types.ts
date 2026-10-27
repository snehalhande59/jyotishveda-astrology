export interface User {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  walletBalance?: number;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface PlanetPosition {
  name: string;
  sanskrit: string;
  longitude: number;
  signNumber: number;
  signName: string;
  signSanskrit: string;
  degreeInSign: number;
  degreeFormatted: string;
  ruler: string;
  nakshatraName: string;
  nakshatraLord: string;
  nakshatraPada: number;
  houseNumber: number;
  isRetrograde?: boolean;
  dignity?: string;
  navamshaSign?: number;
  navamshaSignName?: string;
  navamshaHouse?: number;
}

export interface HouseData {
  houseNumber: number;
  signNumber: number;
  signName: string;
  signSanskrit: string;
  ruler: string;
  occupants: string[];
}

export interface DashaPeriod {
  planet: string;
  durationYears: number;
  startDate: string;
  endDate: string;
  isBalance: boolean;
}

export interface KundliChartData {
  meta: {
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    latitude: number;
    longitude: number;
    timezoneOffsetHours: number;
    ayanamsa: {
      name: string;
      value: number;
      formatted: string;
    };
    julianDate: number;
  };
  ascendant: {
    longitude: number;
    signNumber: number;
    signName: string;
    signSanskrit: string;
    degreeFormatted: string;
    nakshatra: string;
    pada: number;
  };
  moonSign: {
    signNumber: number;
    signName: string;
    signSanskrit: string;
    degreeFormatted: string;
    nakshatra: string;
    nakshatraLord: string;
    pada: number;
  };
  sunSign: {
    signNumber: number;
    signName: string;
    signSanskrit: string;
    degreeFormatted: string;
    nakshatra: string;
    pada: number;
  };
  planets: PlanetPosition[];
  houses: HouseData[];
  navamsaHouses?: HouseData[];
  summary?: string;
  dasha: {
    balanceDashaPlanet: string;
    balanceYears: number;
    timeline: DashaPeriod[];
  };
}

export interface AstrologyService {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  category: 'report' | 'consultation' | 'kundli' | 'yearly' | 'specialized';
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountedPrice?: number;
  features: string[];
  deliveryTime?: string;
  isFeatured?: boolean;
  badge?: string;
}

export interface Astrologer {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  title: string;
  bio: string;
  experienceYears: number;
  specialties: string[];
  languages: string[];
  consultationFee: number;
  rating: number;
  reviewCount: number;
  avatarUrl?: string;
  availableSlots: string[];
  isFeatured?: boolean;
  isOnline?: boolean;
  availableNow?: boolean;
  perMinuteRate?: number;
}

export interface Horoscope {
  id: number;
  sign: string;
  date: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  generalGuidance: string;
  love?: string;
  career?: string;
  finance?: string;
  health?: string;
  luckyNumber?: number;
  luckyColor?: string;
  luckyTime?: string;
}

export interface ZodiacSign {
  id: number;
  name: string;
  sanskritName: string;
  signNumber: number;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  ruler: string;
  symbol: string;
  dateRange: string;
  traits: string;
  strengths: string[];
  weaknesses: string[];
  compatibleSigns: string[];
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  defaultAyanamsa: string;
  announcementBar: string;
}

export interface BirthProfile {
  id: number;
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezoneOffset?: number;
  gender?: string;
  chartData?: KundliChartData;
  createdAt?: string;
}

export interface AstrologyArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt?: string;
}

export interface PaymentRecord {
  id: number;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  serviceType: string;
  referenceId?: string;
  createdAt: string;
}

export interface PanchangData {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  vaara: {
    name: string;
    sanskrit: string;
    ruler: string;
  };
  tithi: {
    number: number;
    name: string;
    paksha: 'Shukla' | 'Krishna';
    deity: string;
    progressPercent: number;
  };
  nakshatra: {
    name: string;
    lord: string;
    pada: number;
    progressPercent: number;
  };
  yoga: {
    index: number;
    name: string;
    isAuspicious: boolean;
  };
  karana: {
    name: string;
    type: 'Movable' | 'Fixed';
  };
  timings: {
    sunrise: string;
    sunset: string;
    rahuKalam: string;
    yamaganda: string;
    gulikaKalam: string;
    abhijitMuhurat: string;
  };
  sunLongitude: number;
  moonLongitude: number;
  ayanamsa: {
    name: string;
    value: number;
    formatted: string;
  };
}

export interface ChatSession {
  id: number;
  sessionNumber: string;
  sessionType: 'free_intro' | 'paid_consultation';
  status: 'active' | 'completed' | 'expired';
  durationMinutes: number;
  maxMessages: number;
  messageCount: number;
  startedAt: string;
  expiresAt: string;
  endedAt?: string;
  astrologer?: Astrologer;
  birthChartSummary?: any;
}

export interface ChatMessage {
  id: number;
  senderType: 'user' | 'astrologer' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  metadata?: any;
}
