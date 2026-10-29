import { getAuthToken } from './auth';
import {
  Astrologer,
  AstrologyService,
  AuthResponse,
  FAQ,
  Horoscope,
  KundliChartData,
  SiteSettings,
  ZodiacSign,
} from './types';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? getAuthToken() : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${STRAPI_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

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
      const items = Array.isArray(res?.data) ? res.data : [];
      return items.map((a) => ({
        ...a,
        specialties: toArray(a.specialties),
        languages: toArray(a.languages),
        availableSlots: toArray(a.availableSlots),
      }));
    } catch (e) {
      return [];
    }
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
  async getChatEligibility() {
    const res = await request<{
      data: {
        isEligible?: boolean;
        eligibleForFreeIntro: boolean;
        reason: string;
        freeSessionUsed: boolean;
        hasActiveSession?: boolean;
        activeSession?: any;
        remainingSeconds?: number;
        freeMinutes?: number;
        maxMessages?: number;
        hasChart?: boolean;
        hasKundli: boolean;
        latestKundli?: any;
        user?: any;
      };
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
};
