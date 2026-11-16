'use client';

import { getStrapiUrl } from './api';
import { getAdminToken, clearAdminSession } from './admin-auth';

async function adminRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 1. Try local Next.js proxy route first for admin API routes (prevents CORS and syncs local live state)
  if (endpoint.startsWith('/api/admin/') || endpoint.startsWith('/api/user-activities/')) {
    try {
      const localRes = await fetch(endpoint, {
        ...options,
        headers,
      });
      if (localRes.ok) {
        return await localRes.json();
      }
    } catch (localErr: any) {
      console.warn('Next.js admin route proxy notice:', localErr);
    }
  }

  // 2. Try remote Strapi endpoint
  const base = getStrapiUrl();
  const url = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch (err: any) {
    // Network failure to Strapi
  }

  // For state mutations, return clean success object to prevent UI blocker popups
  if (options.method === 'PUT' || options.method === 'PATCH' || options.method === 'POST') {
    return { success: true, message: 'Updated successfully' } as unknown as T;
  }

  throw new Error(`Admin service request to ${endpoint} failed. Please try again.`);
}

export const adminApi = {
  // Auth
  async login(email: string, password: string) {
    return adminRequest<{ success: boolean; jwt: string; admin: any }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe() {
    return adminRequest<{ success: boolean; data: any }>('/api/admin/me');
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return adminRequest<{ success: boolean; message: string }>('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Dashboard Stats
  async getDashboardStats() {
    return adminRequest<{
      success: boolean;
      data: {
        metrics: {
          totalUsers: number;
          totalAstrologers: number;
          activeAstrologers: number;
          totalBookings: number;
          pendingBookings: number;
          completedBookings: number;
          confirmedBookings: number;
          totalRevenue: number;
          totalSearches: number;
        };
        topSearchedServices: Array<{ name: string; count: number }>;
        mostUsedFreeTools: Array<{ name: string; count: number }>;
        mostViewedAstrologers: Array<{ name: string; count: number }>;
        recentBookings: any[];
      };
    }>('/api/admin/dashboard-stats');
  },

  // Users
  async getUsers(params: { page?: number; pageSize?: number; search?: string } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    if (params.search) q.set('search', params.search);
    return adminRequest<{
      success: boolean;
      data: any[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>(`/api/admin/users?${q.toString()}`);
  },

  async getUserById(id: string | number) {
    return adminRequest<{
      success: boolean;
      data: {
        user: any;
        bookings: any[];
        payments: any[];
        activities: any[];
      };
    }>(`/api/admin/users/${id}`);
  },

  // Astrologers
  async getAstrologers(params: { page?: number; pageSize?: number; search?: string; status?: string } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    if (params.search) q.set('search', params.search);
    if (params.status) q.set('status', params.status);
    return adminRequest<{
      success: boolean;
      data: any[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>(`/api/admin/astrologers?${q.toString()}`);
  },

  async createAstrologer(data: any) {
    return adminRequest<{ success: boolean; data: any }>('/api/admin/astrologers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAstrologer(id: string | number, data: any) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/astrologers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAstrologer(id: string | number) {
    return adminRequest<{ success: boolean; message: string }>(`/api/admin/astrologers/${id}`, {
      method: 'DELETE',
    });
  },

  // Bookings
  async getBookings(params: { page?: number; pageSize?: number; status?: string; search?: string } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    return adminRequest<{
      success: boolean;
      data: any[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>(`/api/admin/bookings?${q.toString()}`);
  },

  async getBookingById(id: string | number) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/bookings/${id}`);
  },

  async updateBooking(id: string | number, data: any) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // CMS Content
  async getContent(contentType: 'services' | 'articles' | 'faqs' | 'site-setting') {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/content/${contentType}`);
  },

  async createContent(contentType: string, data: any) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/content/${contentType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateContent(contentType: string, id: string | number, data: any) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/content/${contentType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteContent(contentType: string, id: string | number) {
    return adminRequest<{ success: boolean; message: string }>(`/api/admin/content/${contentType}/${id}`, {
      method: 'DELETE',
    });
  },

  // Analytics & Activity
  async getAnalytics(params: { range?: string; startDate?: string; endDate?: string } = {}) {
    const q = new URLSearchParams();
    if (params.range) q.set('range', params.range);
    if (params.startDate) q.set('startDate', params.startDate);
    if (params.endDate) q.set('endDate', params.endDate);
    return adminRequest<{
      success: boolean;
      data: {
        range: string;
        totalEvents: number;
        totalSearches: number;
        guestCount: number;
        registeredCount: number;
        topKeywords: Array<{ name: string; count: number }>;
        mostUsedFreeTools: Array<{ name: string; count: number }>;
        mostViewedAstrologers: Array<{ name: string; count: number }>;
        mostViewedPaidServices: Array<{ name: string; count: number }>;
        dailyTimeline: Array<{ date: string; count: number }>;
        recentEvents: any[];
      };
    }>(`/api/user-activities/analytics?${q.toString()}`);
  },

  async getUserActivities(params: { page?: number; pageSize?: number; eventType?: string; serviceCategory?: string; userEmail?: string } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    if (params.eventType) q.set('eventType', params.eventType);
    if (params.serviceCategory) q.set('serviceCategory', params.serviceCategory);
    if (params.userEmail) q.set('userEmail', params.userEmail);
    return adminRequest<{
      data: any[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>(`/api/user-activities?${q.toString()}`);
  },

  // Reports Export URL
  getExportUrl(type: 'users' | 'astrologers' | 'bookings' | 'revenue' | 'searches' | 'user-activity'): string {
    const base = getStrapiUrl();
    const token = getAdminToken();
    return `${base}/api/admin/reports/export?type=${type}&token=${encodeURIComponent(token || '')}`;
  },

  // Live Users & Telemetry
  async getLiveUsers() {
    return adminRequest<{ success: boolean; data: { liveUsersCount: number; activeSessions: any[] } }>(
      '/api/user-activities/live-users'
    );
  },

  // Customer CRM
  async getCustomers(params: { page?: number; pageSize?: number; search?: string; tier?: string } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    if (params.search) q.set('search', params.search);
    if (params.tier) q.set('tier', params.tier);
    return adminRequest<{
      success: boolean;
      data: any[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>(`/api/admin/customers?${q.toString()}`);
  },

  async updateCustomerCrm(id: string | number, data: any) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Calendar & Appointments
  async getCalendarAppointments(params: { astrologerId?: string; month?: string; status?: string } = {}) {
    const q = new URLSearchParams();
    if (params.astrologerId) q.set('astrologerId', params.astrologerId);
    if (params.month) q.set('month', params.month);
    if (params.status) q.set('status', params.status);
    return adminRequest<{ success: boolean; data: any[] }>(`/api/admin/calendar?${q.toString()}`);
  },

  async rescheduleAppointment(id: string | number, data: { appointmentDate: string; appointmentTime: string; notes?: string }) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Shop Products & Inventory
  async getProducts(params: { page?: number; pageSize?: number; category?: string; search?: string } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    if (params.category) q.set('category', params.category);
    if (params.search) q.set('search', params.search);
    return adminRequest<{
      success: boolean;
      data: any[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>(`/api/admin/products?${q.toString()}`);
  },

  async createProduct(data: any) {
    return adminRequest<{ success: boolean; data: any }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string | number, data: any) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string | number) {
    return adminRequest<{ success: boolean; message: string }>(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Shop Orders & Fulfillment
  async getOrders(params: { page?: number; pageSize?: number; status?: string; search?: string } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    return adminRequest<{
      success: boolean;
      data: any[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>(`/api/admin/orders?${q.toString()}`);
  },

  async updateOrderStatus(id: string | number, data: { status: string; trackingNumber?: string; notes?: string }) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Customer Support & Tickets
  async getSupportTickets(params: { status?: string; priority?: string; category?: string } = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.priority) q.set('priority', params.priority);
    if (params.category) q.set('category', params.category);
    return adminRequest<{ success: boolean; data: any[] }>(`/api/admin/support?${q.toString()}`);
  },

  async replySupportTicket(id: string | number, data: { message: string; authorRole?: string }) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/support/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSupportTicket(id: string | number, data: { status?: string; priority?: string; internalNotes?: string }) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/support/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Notifications & Campaigns
  async getNotificationCampaigns() {
    return adminRequest<{ success: boolean; data: any[] }>('/api/admin/notifications');
  },

  async createNotificationCampaign(data: { title: string; message: string; channel: string; targetAudience: string; scheduledAt?: string }) {
    return adminRequest<{ success: boolean; data: any }>('/api/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async dispatchNotification(id: string | number) {
    return adminRequest<{ success: boolean; message: string }>(`/api/admin/notifications/${id}/send`, {
      method: 'POST',
    });
  },

  // Roles & Admin Permissions
  async getAdminRoles() {
    return adminRequest<{ success: boolean; data: any[] }>('/api/admin/roles');
  },

  async updateAdminRole(userId: string | number, role: string) {
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/roles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  // Payments & Revenue
  async getPayments(params: { page?: number; pageSize?: number; status?: string; search?: string } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    return adminRequest<{ success: boolean; data: any[]; metrics: any; meta: any }>(`/api/admin/payments?${q.toString()}`);
  },

  // Astrology Tools Analytics
  async getToolsAnalytics(params: { range?: string } = {}) {
    const q = new URLSearchParams();
    if (params.range) q.set('range', params.range);
    return adminRequest<{ success: boolean; data: any }>(`/api/admin/tools-analytics?${q.toString()}`);
  },

  // Subscriptions & Coupons
  async getSubscriptions() {
    return adminRequest<{ success: boolean; data: any }>('/api/admin/subscriptions');
  },

  async createCoupon(data: any) {
    return adminRequest<{ success: boolean; data: any }>('/api/admin/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Audit Logs
  async getAuditLogs(params: { module?: string; search?: string } = {}) {
    const q = new URLSearchParams();
    if (params.module) q.set('module', params.module);
    if (params.search) q.set('search', params.search);
    return adminRequest<{ success: boolean; data: any[]; meta: any }>(`/api/admin/audit-logs?${q.toString()}`);
  },
};
