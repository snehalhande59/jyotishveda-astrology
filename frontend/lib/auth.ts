"use client";

import { User } from "./types";

const TOKEN_KEY = "vedic_auth_token";
const USER_KEY = "vedic_auth_user";
const WALLET_KEY = "vedic_wallet_balance";

export function getWalletBalance(): number {
  if (typeof window === "undefined") return 500;

  const stored = localStorage.getItem(WALLET_KEY);

  if (stored !== null) {
    const num = parseFloat(stored);
    return isNaN(num) ? 500 : num;
  }

  const user = getCurrentUser();
  const initial = user ? 500 : 0;

  localStorage.setItem(WALLET_KEY, String(initial));
  return initial;
}

export function updateWalletBalance(amount: number): number {
  if (typeof window === "undefined") return 0;

  const current = getWalletBalance();
  const next = Math.max(0, current + amount);

  localStorage.setItem(WALLET_KEY, String(next));
  window.dispatchEvent(new Event("wallet-updated"));

  return next;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const userJson = localStorage.getItem(USER_KEY);

  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: User): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  document.cookie = `vedic_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
  window.dispatchEvent(new Event("auth-updated"));

  // Real-time broadcast for SuperAdmin live telemetry
  try {
    const payload = {
      type: "USER_LOGIN",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      timestamp: new Date().toISOString(),
    };

    // Cross-tab broadcast for instant zero-latency admin dashboard update
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel("astroveda_telemetry_stream");
      bc.postMessage(payload);
      setTimeout(() => bc.close(), 100);
    }

    // Window event for current tab
    window.dispatchEvent(new CustomEvent("astroveda_telemetry", { detail: payload }));

    // Send server-side activity & heartbeat record
    fetch("/api/user-activities/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "user_login",
        serviceName: "User Portal Sign-in",
        serviceCategory: "auth",
        userEmail: user.email,
        username: user.username,
        isGuest: false,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => {});

    fetch("/api/user-activities/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: user.email,
        username: user.username,
        path: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  document.cookie = "vedic_token=; path=/; max-age=0; SameSite=Lax";
  window.dispatchEvent(new Event("auth-updated"));
}
