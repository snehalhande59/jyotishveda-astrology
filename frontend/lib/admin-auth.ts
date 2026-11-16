'use client';

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: 'admin';
  lastLogin?: string;
}

const ADMIN_TOKEN_KEY = 'astroveda_admin_token';
const ADMIN_USER_KEY = 'astroveda_admin_user';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function setAdminSession(token: string, user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  document.cookie = `astroveda_admin_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  window.dispatchEvent(new Event('admin-auth-updated'));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  document.cookie = 'astroveda_admin_token=; path=/; max-age=0; SameSite=Lax';
  window.dispatchEvent(new Event('admin-auth-updated'));
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}
