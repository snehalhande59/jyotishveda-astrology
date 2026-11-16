'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

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
    bg: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20 text-amber-400',
    text: 'text-amber-400',
  },
  emerald: {
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    text: 'text-emerald-400',
  },
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20 text-blue-400',
    text: 'text-blue-400',
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20 text-purple-400',
    text: 'text-purple-400',
  },
  rose: {
    bg: 'from-rose-500/10 to-rose-600/5',
    border: 'border-rose-500/30',
    iconBg: 'bg-rose-500/20 text-rose-400',
    text: 'text-rose-400',
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
  const c = COLOR_MAP[color] || COLOR_MAP.amber;

  const content = (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${c.bg} bg-[#141021] border ${c.border} rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10 group ${
        href || onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-[#8E84A6] tracking-wide block uppercase group-hover:text-white transition-colors">
              {title}
            </span>
            {href && (
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8E84A6] opacity-0 group-hover:opacity-100 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {value}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.iconBg} shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-3 border-t border-[#261E38]/60 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-[#8E84A6] truncate group-hover:text-[#C7BED6] transition-colors">
              {subtitle}
            </span>
          )}
          {change && (
            <span
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                changeType === 'positive'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : changeType === 'negative'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-gray-500/20 text-gray-400'
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
    return <Link href={href} className="block no-underline">{content}</Link>;
  }

  return content;
}
