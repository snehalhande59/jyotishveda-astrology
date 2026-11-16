'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAdminUser, clearAdminSession } from '@/lib/admin-auth';
import AdminAuthGuard from './AdminAuthGuard';
import GlobalSearchModal from './GlobalSearchModal';
import { AdminThemeProvider, useAdminTheme } from '@/context/AdminThemeContext';
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
  IndianRupee,
  Sun,
  Moon,
  Tag,
  History,
  Compass,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

// 15 Enterprise Platform Management Modules
const ENTERPRISE_NAV_GROUPS = [
  {
    group: 'Executive Overview',
    items: [
      { href: '/admin/dashboard', label: '1. Overview Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: '2. Analytics & Reports', icon: TrendingUp },
    ],
  },
  {
    group: 'Client & Scholar Operations',
    items: [
      { href: '/admin/crm', label: '3. User Management – CRM', icon: Users },
      { href: '/admin/astrologers', label: '4. Astrologer Management', icon: Sparkles },
      { href: '/admin/bookings', label: '5. Appointments & Bookings', icon: Calendar },
    ],
  },
  {
    group: 'Revenue & Commerce',
    items: [
      { href: '/admin/payments', label: '6. Payments & Transactions', icon: IndianRupee },
      { href: '/admin/reports', label: '8. Kundli & Paid Reports', icon: FileText },
      { href: '/admin/products', label: '9. Shop & Products', icon: ShoppingBag },
      { href: '/admin/subscriptions', label: '11. Subscriptions & Coupons', icon: Tag },
    ],
  },
  {
    group: 'Vedic Tools & Intelligence',
    items: [
      { href: '/admin/tools-analytics', label: '7. Astrology Tools Analytics', icon: Activity },
      { href: '/admin/search-analytics', label: 'Search Trends', icon: Search },
      { href: '/admin/user-activity', label: 'Live Activity Radar', icon: Compass },
    ],
  },
  {
    group: 'Content & Customer Care',
    items: [
      { href: '/admin/content', label: '10. Horoscope & Content CMS', icon: FileText },
      { href: '/admin/support', label: '12. Notifications & Support', icon: LifeBuoy },
      { href: '/admin/notifications', label: 'Broadcast Campaigns', icon: Bell },
    ],
  },
  {
    group: 'Governance & Controls',
    items: [
      { href: '/admin/roles', label: '13. Staff & Roles (RBAC)', icon: Shield },
      { href: '/admin/audit-logs', label: '14. Audit Logs & Activity', icon: History },
      { href: '/admin/settings', label: '15. Admin Settings', icon: Settings },
    ],
  },
];

function AdminLayoutInner({ children, title, subtitle }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useAdminTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setAdminUser(getAdminUser());
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    router.replace('/admin/login');
  };

  return (
    <div
      className={`min-h-screen font-sans flex overflow-x-hidden transition-colors duration-200 ${
        isDark ? 'bg-[#0A0812] text-[#E5DFD7]' : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      {/* Universal Global Search Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* ============================================================
          1. DESKTOP SIDEBAR
         ============================================================ */}
      <aside
        className={`hidden lg:flex lg:flex-col w-72 border-r fixed inset-y-0 left-0 z-30 transition-colors duration-200 ${
          isDark
            ? 'bg-[#110D1B] border-[#261E38]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center justify-between px-5 border-b transition-colors ${
            isDark ? 'border-[#261E38] bg-[#0E0B17]/60' : 'border-slate-200 bg-slate-50/80'
          }`}
        >
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-600/20 shrink-0">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <span
                className={`font-serif font-extrabold text-sm tracking-wider block leading-tight ${
                  isDark ? 'text-amber-300' : 'text-amber-700'
                }`}
              >
                JYOTISHVEDA
              </span>
              <span
                className={`text-[9px] tracking-widest uppercase font-bold block ${
                  isDark ? 'text-amber-500/80' : 'text-slate-500'
                }`}
              >
                Enterprise Portal
              </span>
            </div>
          </Link>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
              isDark
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            v3.2
          </span>
        </div>

        {/* Navigation Links (15 Enterprise Modules) */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto no-scrollbar">
          {ENTERPRISE_NAV_GROUPS.map((grp) => (
            <div key={grp.group} className="space-y-0.5">
              <div
                className={`px-3 pb-1 text-[9px] font-extrabold tracking-wider uppercase ${
                  isDark ? 'text-amber-400/60' : 'text-slate-400'
                }`}
              >
                {grp.group}
              </div>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-sm'
                          : 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                        : isDark
                        ? 'text-[#9F96B2] hover:text-[#E5DFD7] hover:bg-[#1A1428]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive
                          ? isDark
                            ? 'text-amber-400'
                            : 'text-amber-700'
                          : isDark
                          ? 'text-[#7D7296]'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          className={`p-3.5 border-t transition-colors ${
            isDark ? 'border-[#261E38] bg-[#0E0B17]/80' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-colors mb-2.5 ${
              isDark
                ? 'bg-[#191326] hover:bg-[#231B36] border-[#2B2240] text-amber-300'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-amber-800'
            }`}
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              <span>Public Customer Website</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-mono font-bold">
              Live
            </span>
          </a>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-extrabold text-xs shrink-0 shadow-sm">
                {adminUser?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <div
                  className={`text-xs font-bold truncate leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {adminUser?.username || 'Super Admin'}
                </div>
                <div className="text-[10px] text-amber-500 truncate font-mono">
                  {adminUser?.email || 'admin@astroveda.com'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Secure Logout"
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
          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full border-r z-50 ${
              isDark ? 'bg-[#110D1B] border-[#261E38]' : 'bg-white border-slate-200'
            }`}
          >
            <div
              className={`h-16 flex items-center justify-between px-5 border-b ${
                isDark ? 'border-[#261E38]' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="font-serif font-bold text-amber-500 tracking-wider">JYOTISHVEDA</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className={isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
              {ENTERPRISE_NAV_GROUPS.map((grp) => (
                <div key={grp.group} className="space-y-0.5">
                  <div
                    className={`px-3 pb-1 text-[9px] font-extrabold tracking-wider uppercase ${
                      isDark ? 'text-amber-400/60' : 'text-slate-400'
                    }`}
                  >
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
                        className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? isDark
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isDark
                            ? 'text-[#9F96B2] hover:bg-[#1A1428] hover:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-amber-500" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div
              className={`p-4 border-t space-y-3 ${
                isDark ? 'border-[#261E38]' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold"
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
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header
          className={`h-16 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
            isDark
              ? 'bg-[#110D1B]/90 border-[#261E38]'
              : 'bg-white/90 border-slate-200 shadow-xs'
          }`}
        >
          {/* Header Left */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-[#1A1428] text-gray-300 hover:text-white border-[#2B2240]'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1
                className={`text-sm sm:text-base font-bold tracking-tight flex items-center space-x-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>{title || 'Enterprise Management Overview'}</span>
              </h1>
              {subtitle && (
                <p className={`text-[11px] hidden sm:block ${isDark ? 'text-[#8E84A6]' : 'text-slate-500'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Global Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                isDark
                  ? 'bg-[#171224] hover:bg-[#201830] border-[#2C2242] text-gray-400 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Global Search across all 15 modules"
            >
              <Search className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Global Search</span>
              <kbd
                className={`hidden md:inline text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                  isDark ? 'bg-[#0F0C18] border-[#2B2240] text-gray-500' : 'bg-white border-slate-300 text-slate-500'
                }`}
              >
                Ctrl+K
              </kbd>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? 'bg-[#1A1428] hover:bg-[#231B36] border-[#2B2240] text-amber-300 hover:text-amber-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600 hover:text-amber-700'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Celestial Theme'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell with Badge */}
            <Link
              href="/admin/notifications"
              className={`relative p-2 rounded-xl border transition-all ${
                isDark
                  ? 'bg-[#1A1428] hover:bg-[#231B36] border-[#2B2240] text-gray-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Broadcast Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5 ring-2 ring-amber-500/20" />
            </Link>

            {/* Live IST Time */}
            {currentTime && (
              <div
                className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono ${
                  isDark
                    ? 'bg-[#1A1428] border-[#2B2240] text-[#A69CBE]'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <Clock className="w-3 h-3 text-amber-500" />
                <span>IST {currentTime}</span>
              </div>
            )}

            {/* Admin Avatar Badge */}
            <div
              className={`flex items-center space-x-2 pl-2 border-l ${
                isDark ? 'border-[#261E38]' : 'border-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-extrabold text-xs shadow-sm">
                {adminUser?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <span
                  className={`text-xs font-bold block leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {adminUser?.username || 'Admin'}
                </span>
                <span className="text-[10px] text-amber-500 uppercase tracking-wider block font-bold">
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
  );
}

export default function AdminLayout(props: AdminLayoutProps) {
  return (
    <AdminAuthGuard>
      <AdminThemeProvider>
        <AdminLayoutInner {...props} />
      </AdminThemeProvider>
    </AdminAuthGuard>
  );
}
