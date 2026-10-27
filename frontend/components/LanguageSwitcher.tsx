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
              ? 'text-[#F7DF94] font-bold underline decoration-[#D4AF37]'
              : 'text-[#D8C7A5]/70 hover:text-white'
          }`}
          title="Switch to English"
        >
          EN
        </button>
        <span className="text-[#D4AF37]/40">|</span>
        <button
          type="button"
          onClick={() => setLanguage('mr')}
          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer font-medium ${
            language === 'mr'
              ? 'text-[#F7DF94] font-bold underline decoration-[#D4AF37]'
              : 'text-[#D8C7A5]/70 hover:text-white'
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
      className={`inline-flex items-center bg-[#150D2A] border border-[#D4AF37]/50 rounded-full p-0.5 shadow-sm ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <div className="pl-2 pr-1 text-[#D4AF37]">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-[11px] rounded-full transition-all cursor-pointer font-medium ${
          language === 'en'
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#0F0B1E] font-bold shadow-sm'
            : 'text-[#D8C7A5] hover:text-[#FDFBF7]'
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
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#0F0B1E] font-bold shadow-sm'
            : 'text-[#D8C7A5] hover:text-[#FDFBF7]'
        }`}
        title="मराठी (Marathi)"
      >
        मराठी
      </button>
    </div>
  );
}
