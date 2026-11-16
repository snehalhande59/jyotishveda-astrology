import { getAuthToken, clearAuthSession } from './auth';
import {
  Astrologer,
  AstrologyService,
  AuthResponse,
  ChatEligibility,
  FAQ,
  Horoscope,
  KundliChartData,
  SiteSettings,
  ZodiacSign,
} from './types';

export const PRODUCTION_STRAPI_URL = 'https://jyotishveda-backend-0epp.onrender.com';

/**
 * Resolves the Strapi backend URL dynamically:
 * 1. Explicit NEXT_PUBLIC_STRAPI_URL environment variable (highest priority, ignores dead/offline server IPs)
 * 2. In browser environments: if hostname is NOT localhost/127.0.0.1, use PRODUCTION_STRAPI_URL
 * 3. Fallback for local development: http://localhost:1337
 */
export function getStrapiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (envUrl && envUrl.trim() !== '' && !envUrl.includes('150-136-44-53')) {
    return envUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      // If running on a local Wi-Fi private IP during local development, point to local Strapi port 1337
      const isLanIp =
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
        /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host);
      if (isLanIp && process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND === 'true') {
        return `http://${host}:1337`;
      }
      return PRODUCTION_STRAPI_URL;
    }
  }

  // Allow explicit opt-in to a local Strapi backend instance
  if (process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND === 'true') {
    return 'http://localhost:1337';
  }

  // Default to production Strapi URL
  return PRODUCTION_STRAPI_URL;
}

/**
 * Generates the full Google OAuth initiation URL including dynamic callback parameter.
 * Automatically targets the active Strapi backend instance.
 * Optionally stores the post-login redirect path in sessionStorage.
 */
export function getGoogleAuthUrl(redirectUrl?: string): string {
  let base = getStrapiUrl();
  if (base.includes('150-136-44-53')) {
    base = PRODUCTION_STRAPI_URL;
  }

  if (typeof window !== 'undefined') {
    if (redirectUrl) {
      try {
        sessionStorage.setItem('auth_redirect_target', redirectUrl);
      } catch {}
    }
    const callback = `${window.location.origin}/connect/google/redirect`;
    return `${base}/api/connect/google?callback=${encodeURIComponent(callback)}`;
  }
  return `${base}/api/connect/google`;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? getAuthToken() : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const base = getStrapiUrl();
  const url = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response: Response;
  try {
    // 40s timeout to allow Render free tier spin-up
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);
    const signal = options.signal || controller.signal;

    try {
      response = await fetch(url, {
        ...options,
        headers,
        signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. The astrology server is waking up, please retry in a few seconds.');
    }
    if (typeof window !== 'undefined' && !navigator.onLine) {
      throw new Error('You appear to be offline. Please check your internet connection.');
    }
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('Failed'))) {
      throw new Error('Unable to connect to the astrology server. Please check your network connection.');
    }
    throw err;
  }

  // If unauthorized due to an expired/invalid token, clear dead session and retry without token for public endpoints
  if (response.status === 401 && token) {
    if (typeof window !== 'undefined') {
      clearAuthSession();
    }
    const retryHeaders = { ...headers };
    delete retryHeaders['Authorization'];
    try {
      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    } catch {
      // ignore retry failure and throw below
    }
  }

  if (!response.ok) {
    let errorMsg = `API request failed (${response.status})`;
    try {
      const errorJson = await response.json();
      errorMsg = errorJson?.error?.message || errorJson?.message || errorMsg;
    } catch (e) {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

function toArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim().length > 0) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export const FALLBACK_ASTROLOGERS: Astrologer[] = [
  {
    id: 1,
    name: 'Astro Heena',
    slug: 'astro-heena',
    title: 'Certified Vedic Astrologer & Tarot Reader',
    bio: '12+ years of compassionate counseling in Vedic relationship Kundli matching, Prashna, and career guidance. Over 15,000 satisfied consultations worldwide.',
    experienceYears: 12,
    specialties: ['Kundli Analysis', 'Love & Relationships', 'Tarot Reading', 'Career Transitions'],
    languages: ['English', 'Marathi', 'Hindi'],
    consultationFee: 810,
    perMinuteRate: 18,
    rating: 4.98,
    reviewCount: 3420,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['09:00 AM', '11:00 AM', '02:30 PM', '05:00 PM', '08:00 PM'],
    isFeatured: true,
    isOnline: true,
  },
  {
    id: 2,
    name: 'Acharya Vidyadhar Shastri',
    slug: 'acharya-vidyadhar-shastri',
    title: 'Senior Jyotish Ratna & Vedic Scholar',
    bio: 'Over 28 years of rigorous classical practice in Parashara and Jaimini systems. Former faculty at Varanasi Sanskrit University.',
    experienceYears: 28,
    specialties: ['Kundli Deep-Dive', 'Career Transitions', 'Muhurat Selection', 'Vedic Gemstones'],
    languages: ['English', 'Hindi', 'Sanskrit'],
    consultationFee: 2499,
    perMinuteRate: 35,
    rating: 4.98,
    reviewCount: 1450,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'],
    isFeatured: true,
    isOnline: true,
  },
  {
    id: 3,
    name: 'Dr. Meenakshi Sundaram',
    slug: 'dr-meenakshi-sundaram',
    title: 'Gold Medalist Jyotish Visharada',
    bio: 'Expert in Nadi Jyotish and Prashna Shastra (Horary Astrology). Holds Doctorate in Ancient Indian Astronavigation.',
    experienceYears: 22,
    specialties: ['Nadi Astrology', 'Marriage Compatibility', 'Prashna Kundli', 'Medical Astrology'],
    languages: ['English', 'Hindi', 'Tamil'],
    consultationFee: 2199,
    perMinuteRate: 30,
    rating: 4.95,
    reviewCount: 980,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['09:30 AM', '01:00 PM', '04:00 PM', '06:30 PM'],
    isFeatured: true,
    isOnline: true,
  },
  {
    id: 4,
    name: 'Pandit Rajeshwar Joshi',
    slug: 'pandit-rajeshwar-joshi',
    title: 'Vedic Astrologer & Vastu Consultant',
    bio: 'Specialist in corporate astrology, business partner Kundli matching, and residential energy alignment.',
    experienceYears: 18,
    specialties: ['Business Kundli', 'Wealth Yogas', 'Vastu Shastra', 'Remedial Yagyas'],
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 1899,
    perMinuteRate: 25,
    rating: 4.91,
    reviewCount: 720,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['11:00 AM', '02:00 PM', '04:30 PM', '07:00 PM'],
    isFeatured: false,
    isOnline: true,
  },
  {
    id: 5,
    name: 'Acharya Dattatray Kulkarni',
    slug: 'acharya-dattatray-kulkarni',
    title: 'KP Astrology & Ashtakvarga Specialist',
    bio: 'Renowned Maharashtra Jyotish scholar with 25 years specializing in accurate Krishnamurti Paddhati timing of events and progeny analysis.',
    experienceYears: 25,
    specialties: ['KP Astrology', 'Kundli Matching', 'Progeny & Family', 'Muhurat Selection'],
    languages: ['Marathi', 'Hindi', 'English'],
    consultationFee: 1999,
    perMinuteRate: 28,
    rating: 4.97,
    reviewCount: 2450,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['10:00 AM', '01:30 PM', '04:00 PM', '06:30 PM'],
    isFeatured: true,
    isOnline: true,
  },
  {
    id: 6,
    name: 'Astro Priyadarshini Rao',
    slug: 'astro-priyadarshini-rao',
    title: 'Holistic Astrologer & Palmistry Expert',
    bio: 'Master of Samudrika Shastra (Palmistry) combined with birth chart degrees. Provides realistic, compassionate solutions for youth and professionals.',
    experienceYears: 14,
    specialties: ['Palmistry', 'Career & Finance', 'Tarot Reading', 'Gemology'],
    languages: ['Marathi', 'English', 'Hindi'],
    consultationFee: 1299,
    perMinuteRate: 20,
    rating: 4.94,
    reviewCount: 1780,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['11:30 AM', '02:00 PM', '05:30 PM', '07:30 PM'],
    isFeatured: true,
    isOnline: true,
  },
  {
    id: 7,
    name: 'Pandit Shridhar Deshmukh',
    slug: 'pandit-shridhar-deshmukh',
    title: 'Classical Vivaha Kundli & Yagya Acharya',
    bio: 'Hereditary Vedic priest and astrologer from Nashik. Trusted by thousands for vivaha dosha nivarana, Mangal dosha, and Navagraha shanti.',
    experienceYears: 20,
    specialties: ['Marriage Compatibility', 'Mangal Dosha', 'Navagraha Shanti', 'Vedic Rituals'],
    languages: ['Marathi', 'Sanskrit', 'Hindi'],
    consultationFee: 1699,
    perMinuteRate: 24,
    rating: 4.95,
    reviewCount: 2100,
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['08:00 AM', '10:30 AM', '03:30 PM', '06:00 PM'],
    isFeatured: false,
    isOnline: true,
  },
  {
    id: 8,
    name: 'Dr. Ananya Sharma',
    slug: 'dr-ananya-sharma',
    title: 'Numerologist & Astro-Vedic Counselor',
    bio: 'Combines Chaldean Numerology with Sidereal Vedic charts. Specializes in mobile numerology, corporate brand name harmony, and personal life path guidance.',
    experienceYears: 16,
    specialties: ['Numerology', 'Name Correction', 'Life Coaching', 'Career Guidance'],
    languages: ['English', 'Hindi'],
    consultationFee: 1499,
    perMinuteRate: 22,
    rating: 4.93,
    reviewCount: 1650,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['12:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'],
    isFeatured: false,
    isOnline: true,
  },
  {
    id: 9,
    name: 'Pandit Bhaskaran Namboodiri',
    slug: 'pandit-bhaskaran-namboodiri',
    title: 'Senior Kerala Horary (Prashna) Jyotish',
    bio: '30+ years practicing Ashta Mangala Prashna and Kavadi astrology from Thrissur, Kerala. Solves perplexing dilemmas without exact birth time.',
    experienceYears: 30,
    specialties: ['Prashna Kundli', 'Remedial Pujas', 'Spiritual Healing', 'Lost Objects & Answers'],
    languages: ['English', 'Malayalam', 'Hindi'],
    consultationFee: 2799,
    perMinuteRate: 40,
    rating: 4.99,
    reviewCount: 3890,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['09:00 AM', '11:00 AM', '04:00 PM', '06:00 PM'],
    isFeatured: true,
    isOnline: true,
  },
  {
    id: 10,
    name: 'Astro Sunita Patil',
    slug: 'astro-sunita-patil',
    title: 'Lal Kitab Acharya & Family Astrologer',
    bio: 'Dedicated specialist in simple, cost-effective Lal Kitab remedies, resolving domestic tension, children education roadblocks, and chronic bad luck.',
    experienceYears: 15,
    specialties: ['Lal Kitab Remedies', 'Family Harmony', 'Education Guidance', 'Evil Eye / Nazar'],
    languages: ['Marathi', 'Hindi'],
    consultationFee: 1199,
    perMinuteRate: 18,
    rating: 4.91,
    reviewCount: 1420,
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['10:00 AM', '02:00 PM', '04:30 PM', '08:00 PM'],
    isFeatured: false,
    isOnline: true,
  },
  {
    id: 11,
    name: 'Acharya Ramanujacharya',
    slug: 'acharya-ramanujacharya',
    title: 'Jaimini Astrologer & Spiritual Guide',
    bio: 'Deep authority on Jaimini Karakas, Chara Dasha, and spiritual Moksha indicators. Teaches meditation and planetary mantra alignment.',
    experienceYears: 26,
    specialties: ['Jaimini Astrology', 'Spiritual Guidance', 'Kundli Deep-Dive', 'Mantra Therapy'],
    languages: ['Hindi', 'Sanskrit', 'English'],
    consultationFee: 2299,
    perMinuteRate: 32,
    rating: 4.98,
    reviewCount: 2980,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['07:30 AM', '11:00 AM', '03:00 PM', '05:30 PM'],
    isFeatured: false,
    isOnline: true,
  },
  {
    id: 12,
    name: 'Astro Vikramaditya Rathore',
    slug: 'astro-vikramaditya-rathore',
    title: 'Financial & Stock Market Astrologer',
    bio: 'Analyzes commodity, equity, and market cycles using Sarvatobhadra Chakra and lunar constellations. Advises entrepreneurs and investors.',
    experienceYears: 19,
    specialties: ['Wealth Yogas', 'Business Kundli', 'Financial Astromarkets', 'Stock Timing'],
    languages: ['Hindi', 'English'],
    consultationFee: 2999,
    perMinuteRate: 45,
    rating: 4.93,
    reviewCount: 1830,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    availableSlots: ['09:30 AM', '01:00 PM', '03:30 PM', '07:00 PM'],
    isFeatured: true,
    isOnline: true,
  },
];

export const api = {
  // Auth
  async login(identifier: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/local/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  async forgotPassword(email: string): Promise<any> {
    return request<any>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  },

  async getMe() {
    return request<any>('/api/users/me');
  },

  // Services Catalog
  async getServices(): Promise<AstrologyService[]> {
    try {
      const res = await request<{ data: AstrologyService[] }>('/api/astrology-services?populate=*');
      const items = Array.isArray(res?.data) ? res.data : [];
      return items.map((s) => ({
        ...s,
        features: toArray(s.features),
      }));
    } catch (e) {
      console.warn('Falling back from Strapi service error:', e);
      return [];
    }
  },

  // Astrologers
  async getAstrologers(): Promise<Astrologer[]> {
    try {
      const res = await request<{ data: Astrologer[] }>('/api/astrologers?populate=*');
      const dbItems = Array.isArray(res?.data) ? res.data : [];
      const parsedDb = dbItems.map((a) => ({
        ...a,
        specialties: toArray(a.specialties),
        languages: toArray(a.languages),
        availableSlots: toArray(a.availableSlots),
      }));

      if (parsedDb.length >= 10) {
        return parsedDb;
      }

      // Merge backend items with verified catalog to ensure full 12+ directory
      const merged = [...parsedDb];
      FALLBACK_ASTROLOGERS.forEach((fa) => {
        if (!merged.find((m) => m.slug === fa.slug || m.name.toLowerCase() === fa.name.toLowerCase())) {
          merged.push(fa);
        }
      });
      return merged;
    } catch (e) {
      console.warn('Using verified astrologers fallback directory:', e);
      return FALLBACK_ASTROLOGERS;
    }
  },

  async getAstrologerById(id: string | number): Promise<Astrologer | null> {
    try {
      const res = await request<{ data: Astrologer }>(`/api/astrologers/${id}`);
      if (res?.data) {
        return {
          ...res.data,
          specialties: toArray(res.data.specialties),
          languages: toArray(res.data.languages),
          availableSlots: toArray(res.data.availableSlots),
        };
      }
    } catch (e) {}

    const fallback = FALLBACK_ASTROLOGERS.find((a) => String(a.id) === String(id) || a.slug === String(id));
    return fallback || null;
  },

  // Horoscope
  async getHoroscope(sign: string, period = 'daily'): Promise<Horoscope | null> {
    try {
      const res = await request<{ data: Horoscope[] }>(
        `/api/horoscopes?filters[sign][$eq]=${encodeURIComponent(sign)}&filters[period][$eq]=${period}&sort[0]=date:desc`
      );
      return res.data?.[0] || null;
    } catch (e) {
      return null;
    }
  },

  // Zodiac Signs
  async getZodiacSigns(): Promise<ZodiacSign[]> {
    try {
      const res = await request<{ data: ZodiacSign[] }>('/api/zodiac-signs?sort[0]=signNumber:asc');
      return Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      return [];
    }
  },

  // FAQs
  async getFaqs(): Promise<FAQ[]> {
    try {
      const res = await request<{ data: FAQ[] }>('/api/faqs?sort[0]=order:asc');
      return Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      return [];
    }
  },

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    try {
      const res = await request<{ data: SiteSettings }>('/api/site-setting');
      return res?.data || null;
    } catch (e) {
      return null;
    }
  },

  // Vedic Kundli Calculations
  async generateKundli(details: {
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    latitude: number;
    longitude: number;
    timezoneOffset?: number;
    ayanamsa?: string;
  }): Promise<{ id?: number; chartData: KundliChartData }> {
    const res = await request<{ data: { id: number; chartData: KundliChartData } }>('/api/kundli/generate', {
      method: 'POST',
      body: JSON.stringify(details),
    });
    return res.data;
  },

  // Compatibility (Guna Milan)
  async calculateCompatibility(boyBirth: any, girlBirth: any) {
    const res = await request<{ data: any }>('/api/kundli/compatibility', {
      method: 'POST',
      body: JSON.stringify({ boyBirth, girlBirth }),
    });
    return res.data;
  },

  // Birth Profile
  async saveBirthProfile(profileData: any) {
    const res = await request<{ data: any }>('/api/birth-profiles', {
      method: 'POST',
      body: JSON.stringify({ data: profileData }),
    });
    return res.data;
  },

  async getMyBirthProfiles() {
    const res = await request<{ data: any[] }>('/api/birth-profiles/me');
    return res.data;
  },

  async deleteBirthProfile(id: number) {
    const res = await request<{ data: any }>(`/api/birth-profiles/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  // Panchang Calculation
  async calculatePanchang(details: { date?: string; time?: string; latitude?: number; longitude?: number; timezoneOffset?: number }) {
    const res = await request<{ data: any }>('/api/kundli/panchang', {
      method: 'POST',
      body: JSON.stringify(details),
    });
    return res.data;
  },

  // Articles & Blog
  async getArticles() {
    try {
      const res = await request<{ data: any[] }>('/api/astrology-articles?sort[0]=createdAt:desc');
      return Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      return [];
    }
  },

  async getArticleBySlug(slug: string) {
    try {
      const res = await request<{ data: any[] }>(`/api/astrology-articles?filters[slug][$eq]=${encodeURIComponent(slug)}`);
      return res.data?.[0] || null;
    } catch (e) {
      return null;
    }
  },

  // Astrology Reports
  async generateReport(reportType: string, birthDetails: any, isPurchased = false, paymentId?: string) {
    const res = await request<{ data: any }>('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ reportType, birthDetails, isPurchased, paymentId }),
    });
    return res.data;
  },

  async getMyReports() {
    const res = await request<{ data: any[] }>('/api/reports/me');
    return res.data;
  },

  // Bookings
  async createBooking(bookingData: { astrologerId: number; date: string; timeSlot: string; topic?: string; clientNotes?: string }) {
    const res = await request<{ data: any }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ data: bookingData }),
    });
    return res.data;
  },

  async getMyBookings() {
    const res = await request<{ data: any[] }>('/api/bookings/me');
    return res.data;
  },

  // Payments
  async createPaymentOrder(amount: number, serviceType: string, referenceId: string) {
    const res = await request<{ data: { orderId: string; amount: number; currency: string; keyId: string; isTestMode: boolean } }>(
      '/api/payments/create-order',
      {
        method: 'POST',
        body: JSON.stringify({ amount, serviceType, referenceId }),
      }
    );
    return res.data;
  },

  async verifyPayment(verificationData: { orderId: string; paymentId: string; signature: string; serviceType?: string; referenceId?: string }) {
    const res = await request<{ success: boolean; message: string; data: any }>('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
    return res;
  },

  async getMyOrders() {
    const res = await request<{ data: any[] }>('/api/payments/my-orders');
    return res.data;
  },

  // Contact
  async sendContactMessage(contactData: { name: string; email: string; phone?: string; subject: string; message: string }) {
    const res = await request<{ data: any }>('/api/contact-messages', {
      method: 'POST',
      body: JSON.stringify({ data: contactData }),
    });
    return res.data;
  },

  // Geocoding / Location Search
  async searchLocation(query: string) {
    try {
      const res = await request<{ data: Array<{ name: string; stateCountry: string; displayName: string; latitude: number; longitude: number; timezoneOffset: number; timezone: string }> }>(
        `/api/location/search?q=${encodeURIComponent(query)}`
      );
      return res.data || [];
    } catch (e) {
      console.warn('Geocoding search failed, fallback will be used', e);
      return [];
    }
  },

  // Latest Kundli
  async getLatestKundli() {
    try {
      const res = await request<{ data: any }>('/api/kundli/me/latest');
      return res.data || null;
    } catch (e) {
      return null;
    }
  },

  // Astrologer Chat Sessions
  async getChatEligibility(): Promise<ChatEligibility> {
    const res = await request<{
      data: ChatEligibility;
    }>('/api/chat/eligibility');
    return res.data;
  },

  async startFreeChatSession(astrologerId?: number) {
    const res = await request<{ success: boolean; data: any; message: string }>(
      '/api/chat/start-free-session',
      {
        method: 'POST',
        body: JSON.stringify({ astrologerId }),
      }
    );
    return res.data;
  },

  async startPaidChatSession(astrologerIdOrBookingId: number, durationMinutes?: number) {
    const res = await request<{ success: boolean; data: any; message: string }>(
      '/api/chat/start-paid-session',
      {
        method: 'POST',
        body: JSON.stringify({
          bookingId: astrologerIdOrBookingId,
          astrologerId: astrologerIdOrBookingId,
          durationMinutes: durationMinutes || 15,
        }),
      }
    );
    return res.data;
  },

  async getChatSession(sessionId: string) {
    const res = await request<{ data: any }>(`/api/chat/sessions/${sessionId}`);
    return res.data;
  },

  async sendChatMessage(sessionId: string, message: string) {
    const res = await request<{
      data: {
        userMessage: any;
        astrologerResponse: any;
        astrologerReply?: any;
        remainingSeconds?: number;
        messageCount?: number;
        maxMessages?: number;
        isCompleted?: boolean;
        status?: string;
      };
    }>(`/api/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return res.data;
  },

  async getChatMessages(sessionId: string) {
    const res = await request<{ data: any[] }>(`/api/chat/sessions/${sessionId}/messages`);
    return res.data;
  },

  async endChatSession(sessionId: string) {
    const res = await request<{ data: any }>(`/api/chat/sessions/${sessionId}/end`, {
      method: 'POST',
    });
    return res.data;
  },

  async getMyChatSessions() {
    try {
      const res = await request<{ data: any[] }>('/api/chat/my-sessions');
      return Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      return [];
    }
  },

  // Gemini AI Astrologer Chat (Proxies securely via backend)
  async sendAiChat(payload: {
    message: string;
    history?: any[];
    birthChart?: any;
    language?: string;
  }): Promise<{
    success: boolean;
    configured: boolean;
    reply?: string;
    message?: string;
    rateLimited?: boolean;
    timestamp?: string;
  }> {
    return request<any>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
