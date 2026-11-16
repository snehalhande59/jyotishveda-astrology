'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const WIDTH_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-3xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}: ModalProps) {
  const { isDark } = useAdminTheme();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full ${WIDTH_CLASSES[maxWidth]} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border transition-colors ${
          isDark
            ? 'bg-[#151122] border-[#2D2444] text-[#E5DFD7]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-[#261E38] bg-[#0F0C1A]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div>
            <h3
              className={`text-base font-bold tracking-wide ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8E84A6]' : 'text-slate-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-[#231B36]'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
