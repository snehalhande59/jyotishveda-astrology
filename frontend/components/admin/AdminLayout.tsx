'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAdminUser, clearAdminSession } from '@/lib/admin-auth';
import AdminAuthGuard from './AdminAuthGuard';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Calendar,
  Activity,
  Search,
  FileText,
  Download,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Clock,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
  Package,
  LifeBuoy,
  Shield,
  HeartHandshake,
  TrendingUp,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const NAV_GROUPS = [
  {
    group: 'Platform Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Live Analytics', icon: TrendingUp },
      { href: '/admin/user-activity', label: 'User Activity', icon: Activity },
      { href: '/admin/search-analytics', label: 'Search Trends', icon: Search },
    ],
  },
  {
    group: 'Astrology & Consultations',
    items: [
      { href: '/admin/astrologers', label: 'Astrologers', icon: Sparkles },
      { href: '/admin/calendar', label: 'Calendar & Slots', icon: Calendar },
      { href: '/admin/bookings', label: 'Consultation Bookings', icon: Clock },
    ],
  },
  {
    group: 'Customer CRM',
    items: [
      { href: '/admin/crm', label: 'Customer CRM', icon: HeartHandshake },
      { href: '/admin/users', label: 'User Accounts', icon: Users },
    ],
  },
  {
    group: 'Vedic Store',
    items: [
      { href: '/admin/products', label: 'Shop Products', icon: ShoppingBag },
      { href: '/admin/orders', label: 'Customer Orders', icon: Package },
    ],
  },
  {
    group: 'Support & Outreach',
    items: [
      { href: '/admin/support', label: 'Support Helpdesk', icon: LifeBuoy },
      { href: '/admin/notifications', label: 'Broadcast Alerts', icon: Bell },
    ],
  },
  {
    group: 'System & CMS',
    items: [
      { href: '/admin/content', label: 'CMS Content & Services', icon: FileText },
      { href: '/admin/reports', label: 'Reports & Export', icon: Download },
      { href: '/admin/roles', label: 'Roles & RBAC', icon: Shield },
      { href: '/admin/settings', label: 'Admin Settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setAdminUser(getAdminUser());
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    router.replace('/admin/login');
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#0A0812] text-[#E5DFD7] font-sans flex overflow-x-hidden">
        {/* ============================================================
            1. DESKTOP SIDEBAR
           ============================================================ */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-[#110D1B] border-r border-[#261E38] fixed inset-y-0 left-0 z-30">
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-[#261E38] bg-[#0E0B17]/60">
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-600/20">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="font-serif font-bold text-base tracking-wider text-amber-300 block leading-tight">
                  ASTROVEDA
                </span>
                <span className="text-[10px] tracking-widest text-amber-500/80 uppercase font-semibold block">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto no-scrollbar">
            {NAV_GROUPS.map((grp) => (
              <div key={grp.group} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-amber-400/60 uppercase">
                  {grp.group}
                </div>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-sm'
                          : 'text-[#9F96B2] hover:text-[#E5DFD7] hover:bg-[#1A1428]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-[#7D7296]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#261E38] bg-[#0E0B17]/80 space-y-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#191326] hover:bg-[#231B36] border border-[#2B2240] text-xs text-amber-300 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Public Website</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Live</span>
            </a>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-bold text-xs shrink-0">
                  {adminUser?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#E5DFD7] truncate leading-tight">
                    {adminUser?.username || 'Super Admin'}
                  </div>
                  <div className="text-[10px] text-amber-400/80 truncate">
                    {adminUser?.email || 'admin@astroveda.com'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ============================================================
            2. MOBILE DRAWER
           ============================================================ */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#110D1B] border-r border-[#261E38] z-50">
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#261E38]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                  <span className="font-serif font-bold text-amber-300 tracking-wider">ASTROVEDA</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
                {NAV_GROUPS.map((grp) => (
                  <div key={grp.group} className="space-y-1">
                    <div className="px-2 pb-1 text-[10px] font-bold tracking-wider text-amber-400/60 uppercase">
                      {grp.group}
                    </div>
                    {grp.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'text-[#9F96B2] hover:bg-[#1A1428] hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-amber-400" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              <div className="p-4 border-t border-[#261E38] space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            3. MAIN CONTENT AREA
           ============================================================ */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          {/* Top Header Bar */}
          <header className="h-16 bg-[#110D1B]/90 backdrop-blur-md border-b border-[#261E38] sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#1A1428] text-gray-300 hover:text-white border border-[#2B2240]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center space-x-2">
                  <span>{title || 'Dashboard Overview'}</span>
                </h1>
                {subtitle && <p className="text-[11px] text-[#8E84A6] hidden sm:block">{subtitle}</p>}
              </div>
            </div>

            {/* Header Right */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Live Status indicator */}
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Backend Connected</span>
              </div>

              {/* Time display */}
              {currentTime && (
                <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#1A1428] border border-[#2B2240] text-[11px] text-[#A69CBE] font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentTime}</span>
                </div>
              )}

              {/* Admin Avatar Badge */}
              <div className="flex items-center space-x-2 pl-2 border-l border-[#261E38]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-bold text-xs shadow-md">
                  {adminUser?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-white block leading-tight">
                    {adminUser?.username || 'Admin'}
                  </span>
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-semibold">
                    Super Admin
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
