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
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  document.cookie = "vedic_token=; path=/; max-age=0; SameSite=Lax";
}
