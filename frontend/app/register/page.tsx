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
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE1D2] shadow-sm max-w-md w-full space-y-6">
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
            className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
