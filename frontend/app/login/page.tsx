'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setAuthSession } from '@/lib/auth';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(identifier, password);
      setAuthSession(res.jwt, res.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid username/email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-sm max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center shadow-gold mx-auto">
            <Sparkles className="w-6 h-6 text-[#0F0B1E]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#150D2A]">
            {t('auth.loginTitle')}
          </h1>
          <p className="text-xs text-gray-500">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#8C6D1F]" />
              <span>{t('auth.emailOrUser')}</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-[#8C6D1F]" />
              <span>{t('auth.password')}</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm rounded-xl shadow-gold hover:opacity-95 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? <span>{t('auth.signingIn')}</span> : <span>{t('auth.signInBtn')}</span>}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>{t('auth.noAccount')}{' '}</span>
          <Link href="/register" className="text-[#8C6D1F] font-semibold hover:underline">
            {t('auth.registerFree')}
          </Link>
        </div>
      </div>
    </div>
  );
}
