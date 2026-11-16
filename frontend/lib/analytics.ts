'use client';

import { getStrapiUrl } from './api';
import { getCurrentUser, getAuthToken } from './auth';

export interface ActivityEventPayload {
  eventType: 'search' | 'tool_view' | 'tool_usage' | 'service_view' | 'astrologer_view' | 'booking_activity' | 'page_view';
  serviceName?: string;
  serviceCategory?: 'free_tool' | 'paid_service' | 'astrologer' | 'search' | 'booking' | 'shop' | 'article';
  keyword?: string;
  targetSlug?: string;
  metadata?: Record<string, any>;
}

export function trackEvent(payload: ActivityEventPayload): void {
  if (typeof window === 'undefined') return;

  try {
    const user = getCurrentUser();
    const token = getAuthToken();
    const base = getStrapiUrl();

    const body = {
      ...payload,
      userEmail: user?.email || undefined,
      username: user?.username || undefined,
      isGuest: !user,
      url: window.location.pathname,
      referrer: document.referrer || undefined,
      timestamp: new Date().toISOString(),
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Try posting to Strapi; fallback to local API route if Strapi is not responding
    fetch(`${base}/api/user-activities/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {
      // Fallback silently to Next.js route handler
      fetch('/api/user-activities/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    });
  } catch (err) {
    // Non-blocking
  }
}

export function sendHeartbeat(): void {
  if (typeof window === 'undefined') return;

  try {
    let sessionId = sessionStorage.getItem('vedic_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem('vedic_session_id', sessionId);
    }

    const user = getCurrentUser();
    const base = getStrapiUrl();
    const body = {
      sessionId,
      userEmail: user?.email || undefined,
      path: window.location.pathname,
    };

    fetch(`${base}/api/user-activities/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {
      fetch('/api/user-activities/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    });
  } catch {}
}
