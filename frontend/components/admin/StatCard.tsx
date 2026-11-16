'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
  href?: string;
  onClick?: () => void;
}

const COLOR_MAP = {
  amber: {
    bgDark: 'from-amber-500/10 to-amber-600/5',
    borderDark: 'border-amber-500/30',
    iconBgDark: 'bg-amber-500/20 text-amber-400',
    iconBgLight: 'bg-amber-100 text-amber-600 border border-amber-200',
    text: 'text-amber-500',
  },
  emerald: {
    bgDark: 'from-emerald-500/10 to-emerald-600/5',
    borderDark: 'border-emerald-500/30',
    iconBgDark: 'bg-emerald-500/20 text-emerald-400',
    iconBgLight: 'bg-emerald-100 text-emerald-600 border border-emerald-200',
    text: 'text-emerald-500',
  },
  blue: {
    bgDark: 'from-blue-500/10 to-blue-600/5',
    borderDark: 'border-blue-500/30',
    iconBgDark: 'bg-blue-500/20 text-blue-400',
    iconBgLight: 'bg-blue-100 text-blue-600 border border-blue-200',
    text: 'text-blue-500',
  },
  purple: {
    bgDark: 'from-purple-500/10 to-purple-600/5',
    borderDark: 'border-purple-500/30',
    iconBgDark: 'bg-purple-500/20 text-purple-400',
    iconBgLight: 'bg-purple-100 text-purple-600 border border-purple-200',
    text: 'text-purple-500',
  },
  rose: {
    bgDark: 'from-rose-500/10 to-rose-600/5',
    borderDark: 'border-rose-500/30',
    iconBgDark: 'bg-rose-500/20 text-rose-400',
    iconBgLight: 'bg-rose-100 text-rose-600 border border-rose-200',
    text: 'text-rose-500',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  changeType = 'positive',
  color = 'amber',
  href,
  onClick,
}: StatCardProps) {
  const { isDark } = useAdminTheme();
  const c = COLOR_MAP[color] || COLOR_MAP.amber;

  const content = (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] group ${
        href || onClick ? 'cursor-pointer' : ''
      } ${
        isDark
          ? `bg-gradient-to-br ${c.bgDark} bg-[#141021] border ${c.borderDark} shadow-lg hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10`
          : 'bg-white border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span
              className={`text-xs font-semibold tracking-wide block uppercase transition-colors ${
                isDark
                  ? 'text-[#8E84A6] group-hover:text-white'
                  : 'text-slate-500 group-hover:text-slate-900'
              }`}
            >
              {title}
            </span>
            {href && (
              <ArrowUpRight
                className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${
                  isDark ? 'text-amber-400' : 'text-amber-600'
                }`}
              />
            )}
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {value}
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform ${
            isDark ? c.iconBgDark : c.iconBgLight
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div
          className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-[#261E38]/60' : 'border-slate-100'
          }`}
        >
          {subtitle && (
            <span
              className={`truncate transition-colors ${
                isDark ? 'text-[#8E84A6] group-hover:text-[#C7BED6]' : 'text-slate-500 group-hover:text-slate-800'
              }`}
            >
              {subtitle}
            </span>
          )}
          {change && (
            <span
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                changeType === 'positive'
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : changeType === 'negative'
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-gray-500/20 text-gray-500'
              }`}
            >
              {changeType === 'positive' ? (
                <TrendingUp className="w-3 h-3" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              <span>{change}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
