'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'footer';
}

export default function LanguageSwitcher({ className = '', variant = 'pill' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center space-x-1 text-xs ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer font-medium ${
            language === 'en'
              ? 'text-[#B45309] font-bold underline decoration-[#F59E0B]'
              : 'text-[#785D46] hover:text-[#2D1810]'
          }`}
          title="Switch to English"
        >
          EN
        </button>
        <span className="text-[#D8C7A5]">|</span>
        <button
          type="button"
          onClick={() => setLanguage('mr')}
          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer font-medium ${
            language === 'mr'
              ? 'text-[#B45309] font-bold underline decoration-[#F59E0B]'
              : 'text-[#785D46] hover:text-[#2D1810]'
          }`}
          title="मराठी भाषेमध्ये बदला"
        >
          मराठी
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center bg-[#FFFBEB] border border-[#FDE68A] rounded-full p-0.5 shadow-sm ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <div className="pl-2 pr-1 text-[#D97706]">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-[11px] rounded-full transition-all cursor-pointer font-medium ${
          language === 'en'
            ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold shadow-sm'
            : 'text-[#785D46] hover:text-[#2D1810]'
        }`}
        title="English"
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage('mr')}
        className={`px-2.5 py-1 text-[11px] rounded-full transition-all cursor-pointer font-medium ${
          language === 'mr'
            ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold shadow-sm'
            : 'text-[#785D46] hover:text-[#2D1810]'
        }`}
        title="मराठी (Marathi)"
      >
        मराठी
      </button>
    </div>
  );
}
