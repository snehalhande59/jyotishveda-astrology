'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  Search,
  X,
  Users,
  Sparkles,
  Calendar,
  IndianRupee,
  Package,
  LifeBuoy,
  LayoutDashboard,
  Activity,
  FileText,
  Shield,
  Settings,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODULE_NAV = [
  { label: 'Overview Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, category: 'Navigation' },
  { label: 'Live Analytics & Trends', href: '/admin/analytics', icon: TrendingUp, category: 'Navigation' },
  { label: 'User CRM & Profiles', href: '/admin/crm', icon: Users, category: 'Navigation' },
  { label: 'Registered User Accounts', href: '/admin/users', icon: Users, category: 'Navigation' },
  { label: 'Astrologer Directory & Profiles', href: '/admin/astrologers', icon: Sparkles, category: 'Navigation' },
  { label: 'Appointments & Consultations', href: '/admin/bookings', icon: Calendar, category: 'Navigation' },
  { label: 'Calendar & Consultation Slots', href: '/admin/calendar', icon: Calendar, category: 'Navigation' },
  { label: 'Payments & Financial Transactions', href: '/admin/payments', icon: IndianRupee, category: 'Navigation' },
  { label: 'Astrology Tools Analytics', href: '/admin/tools-analytics', icon: Activity, category: 'Navigation' },
  { label: 'Kundli & Paid Reports Orders', href: '/admin/reports', icon: FileText, category: 'Navigation' },
  { label: 'Vedic Store Products', href: '/admin/products', icon: Package, category: 'Navigation' },
  { label: 'Customer Shop Orders', href: '/admin/orders', icon: Package, category: 'Navigation' },
  { label: 'Horoscope & Content CMS', href: '/admin/content', icon: FileText, category: 'Navigation' },
  { label: 'Subscriptions & Coupons', href: '/admin/subscriptions', icon: IndianRupee, category: 'Navigation' },
  { label: 'Customer Support Tickets', href: '/admin/support', icon: LifeBuoy, category: 'Navigation' },
  { label: 'Broadcast Alerts & Notifications', href: '/admin/notifications', icon: LifeBuoy, category: 'Navigation' },
  { label: 'Staff Roles & Permissions', href: '/admin/roles', icon: Shield, category: 'Navigation' },
  { label: 'Audit Logs & Admin Actions', href: '/admin/audit-logs', icon: Activity, category: 'Navigation' },
  { label: 'Platform & Admin Settings', href: '/admin/settings', icon: Settings, category: 'Navigation' },
];

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const { isDark } = useAdminTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNav = query.trim()
    ? MODULE_NAV.filter((m) => m.label.toLowerCase().includes(query.toLowerCase()))
    : MODULE_NAV.slice(0, 8);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border transition-all ${
          isDark
            ? 'bg-[#141021] border-[#2D2345] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`flex items-center px-4 py-3.5 border-b ${
            isDark ? 'border-[#261E38] bg-[#0E0B17]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <Search className={`w-5 h-5 mr-3 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all 15 modules, users, astrologers, bookings..."
            className={`w-full bg-transparent text-sm font-medium focus:outline-none placeholder-opacity-60 ${
              isDark ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1 mr-2 rounded-md hover:bg-black/10 text-gray-400 hover:text-gray-200`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              isDark
                ? 'bg-[#1C162E] border-[#2B2240] text-gray-400'
                : 'bg-slate-200 border-slate-300 text-slate-600'
            }`}
          >
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          <div
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'text-amber-400/70' : 'text-amber-700'
            }`}
          >
            {query.trim() ? 'Matching Modules & Pages' : 'Quick Access Modules'}
          </div>

          {filteredNav.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No matching modules found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors group ${
                    isDark
                      ? 'hover:bg-amber-500/10 text-gray-200 hover:text-amber-300'
                      : 'hover:bg-amber-50 text-slate-700 hover:text-amber-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-[#201830] text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDark ? 'text-amber-400' : 'text-amber-600'
                    }`}
                  />
                </button>
              );
            })
          )}

          {/* Quick Shortcuts Hint */}
          <div
            className={`mt-3 pt-3 border-t flex items-center justify-between text-[11px] px-3 ${
              isDark ? 'border-[#261E38] text-gray-400' : 'border-slate-100 text-slate-500'
            }`}
          >
            <span>Jump to: Users, Astrologers, Bookings, Orders</span>
            <span className="font-mono">Press ↵ to open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
