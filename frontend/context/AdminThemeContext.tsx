'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AdminTheme = 'dark' | 'light';

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
  setTheme: (theme: AdminTheme) => void;
  isDark: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jyotishveda_admin_theme') as AdminTheme | null;
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      } else {
        // Default to dark mode for authentic Vedic celestial atmosphere
        setThemeState('dark');
      }
    } catch {}
    setMounted(true);
  }, []);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('jyotishveda_admin_theme', newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const isDark = theme === 'dark';

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
      <div className={isDark ? 'dark admin-dark' : 'light admin-light'}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
