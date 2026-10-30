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
 * 1. Explicit NEXT_PUBLIC_STRAPI_URL environment variable (highest priority)
 * 2. In browser environments: if hostname is NOT localhost/127.0.0.1, use PRODUCTION_STRAPI_URL
 * 3. Server-side rendering in production mode: use PRODUCTION_STRAPI_URL
 * 4. Fallback for local development: http://localhost:1337
 */
export function getStrapiUrl(): string {
  if (process.env.NEXT_PUBLIC_STRAPI_URL && process.env.NEXT_PUBLIC_STRAPI_URL.trim() !== '') {
    return process.env.NEXT_PUBLIC_STRAPI_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      // If running on a local Wi-Fi private IP during local development, point to local Strapi port 1337
      const isLanIp =
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
        /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host);
      if (isLanIp && process.env.NODE_ENV !== 'production') {
        return `http://${host}:1337`;
      }
      return PRODUCTION_STRAPI_URL;
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_STRAPI_URL;
  }

  return 'http://localhost:1337';
}

/**
 * Generates the full Google OAuth initiation URL including dynamic callback parameter.
 */
export function getGoogleAuthUrl(): string {
  const base = getStrapiUrl();
  if (typeof window !== 'undefined') {
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

export const api = {
  // Auth
  async login(identifier: string, password: string):Promise<AuthResponse> {
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
    const res = await request<{ data: Astrologer[] }>('/api/astrologers?populate=*');
    const items = Array.isArray(res?.data) ? res.data : [];
    return items.map((a) => ({
      ...a,
      specialties: toArray(a.specialties),
      languages: toArray(a.languages),
      availableSlots: toArray(a.availableSlots),
    }));
  },

  async getAstrologerById(id: string | number): Promise<Astrologer | null> {
    try {
      const res = await request<{ data: Astrologer }>(`/api/astrologers/${id}`);
      if (!res?.data) return null;
      return {
        ...res.data,
        specialties: toArray(res.data.specialties),
        languages: toArray(res.data.languages),
        availableSlots: toArray(res.data.availableSlots),
      };
    } catch (e) {
      console.warn(`Astrologer fetch failed for id "${id}":`, e);
      return null;
    }
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
};
