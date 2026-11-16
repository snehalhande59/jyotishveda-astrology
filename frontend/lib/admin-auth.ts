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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  const local = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (local && local.trim().length > 5) return local;

  const cookie = getCookie(ADMIN_TOKEN_KEY);
  if (cookie && cookie.trim().length > 5) {
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, cookie);
    } catch {}
    return cookie;
  }
  return null;
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const token = getAdminToken();
  if (!token) return null;

  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) {
    const fallbackUser: AdminUser = {
      id: 1,
      email: 'admin@astroveda.com',
      username: 'AstroVeda Super Admin',
      role: 'admin',
      lastLogin: new Date().toISOString(),
    };
    try {
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(fallbackUser));
    } catch {}
    return fallbackUser;
  }

  try {
    const parsed = JSON.parse(raw) as AdminUser;
    if (!parsed || !parsed.email) {
      const fallbackUser: AdminUser = {
        id: 1,
        email: 'admin@astroveda.com',
        username: 'AstroVeda Super Admin',
        role: 'admin',
        lastLogin: new Date().toISOString(),
      };
      return fallbackUser;
    }
    return parsed;
  } catch {
    const fallbackUser: AdminUser = {
      id: 1,
      email: 'admin@astroveda.com',
      username: 'AstroVeda Super Admin',
      role: 'admin',
      lastLogin: new Date().toISOString(),
    };
    return fallbackUser;
  }
}

export function setAdminSession(token: string, user?: Partial<AdminUser>): void {
  if (typeof window === 'undefined') return;
  const safeUser: AdminUser = {
    id: user?.id || 1,
    email: user?.email || 'admin@astroveda.com',
    username: user?.username || 'AstroVeda Super Admin',
    role: 'admin',
    lastLogin: user?.lastLogin || new Date().toISOString(),
  };

  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(safeUser));
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
  if (typeof window === 'undefined') return false;
  const token = getAdminToken();
  return Boolean(token && token.trim().length > 5);
}
