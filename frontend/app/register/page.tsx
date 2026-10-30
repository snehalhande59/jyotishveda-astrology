'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { setAuthSession } from '@/lib/auth';
import { Sparkles, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || searchParams.get('returnUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.register(username.trim(), email.trim(), password);
      setAuthSession(res.jwt, res.user);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(
        err.message ||
          (language === 'mr'
            ? 'नोंदणी अयशस्वी. कृपया वेगळे वापरकर्तानाव किंवा ईमेल वापरून पहा.'
            : 'Registration failed. Try a different username or email.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans flex items-center justify-center p-4">
      <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl border border-[#EAE1D2] shadow-sm max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center shadow-xs mx-auto text-[#D97706]">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-xs text-[#786C60]">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A2E18] mb-1.5 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t('auth.username')}</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. aryavarta_jyotish"
              className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A2E18] mb-1.5 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t('auth.email')}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A2E18] mb-1.5 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t('auth.passwordMin')}</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>{t('auth.creatingAccount')}</span>
            ) : (
              <>
                <span>{t('auth.createAccountBtn')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Alternative Google Sign-In */}
        <div className="space-y-3 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#EAE1D2] w-full" />
            <span className="bg-white px-3 text-[11px] text-[#786C60] uppercase tracking-wider font-semibold">
              {language === 'mr' ? 'किंवा' : 'or continue with'}
            </span>
            <div className="border-t border-[#EAE1D2] w-full" />
          </div>

          <a
            href={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/connect/google`}
            className="w-full py-3 px-4 bg-[#FAF7F2] hover:bg-[#FFFDF9] border border-[#EAE1D2] hover:border-[#D97706] rounded-xl text-xs font-bold text-[#2D1810] flex items-center justify-center space-x-2.5 transition-all shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{language === 'mr' ? 'गुगल खात्याद्वारे नोंदणी करा' : 'Sign up with Google'}</span>
          </a>
        </div>

        <div className="text-center text-xs text-[#786C60] pt-3 border-t border-[#F5EFE6]">
          <span>{t('auth.alreadyHaveAccount')}{' '}</span>
          <Link
            href={`/login${redirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="text-[#D97706] font-bold hover:underline"
          >
            {t('auth.signInLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
