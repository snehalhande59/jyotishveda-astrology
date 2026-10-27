'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  translations,
  toDevanagariNumerals,
  translatePlanetName,
  translateZodiacSign,
  translateDignity,
  translateMotion,
} from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  formatNumber: (num: number | string) => string;
  formatCurrency: (amount: number) => string;
  translatePlanet: (planet: string) => string;
  translateSign: (sign: string) => string;
  translateDignityText: (dignity: string) => string;
  translateMotionText: (motion: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'jyotishveda_language';
const LEGACY_STORAGE_KEY = 'vedic_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Check stored language preference with safe client-side initialization
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY)) as Language;
      if (stored === 'en' || stored === 'mr') {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      } else {
        setLanguageState('en');
        document.documentElement.lang = 'en';
      }
    } catch {
      // Fallback if localStorage is inaccessible
      setLanguageState('en');
      document.documentElement.lang = 'en';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Ignore quota/access errors
      }
      document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'mr' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.en;
    let text = dict[key] || translations.en[key] || key;

    if (variables) {
      Object.entries(variables).forEach(([varKey, val]) => {
        const replacement = language === 'mr' && typeof val === 'number'
          ? toDevanagariNumerals(val)
          : String(val);
        text = text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), replacement);
      });
    }

    return text;
  };

  const formatNumber = (num: number | string): string => {
    if (language === 'mr') {
      return toDevanagariNumerals(num);
    }
    return String(num);
  };

  const formatCurrency = (amount: number): string => {
    if (language === 'mr') {
      return `₹${toDevanagariNumerals(amount)}`;
    }
    return `₹${amount}`;
  };

  const translatePlanet = (planet: string) => translatePlanetName(planet, language);
  const translateSign = (sign: string) => translateZodiacSign(sign, language);
  const translateDignityText = (dignity: string) => translateDignity(dignity, language);
  const translateMotionText = (motion: string) => translateMotion(motion, language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatNumber,
        formatCurrency,
        translatePlanet,
        translateSign,
        translateDignityText,
        translateMotionText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
