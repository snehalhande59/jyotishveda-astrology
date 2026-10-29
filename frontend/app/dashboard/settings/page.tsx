'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, clearAuthSession } from '@/lib/auth';
import { ArrowLeft, LogOut, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push('/login?redirect=/dashboard/settings');
      return;
    }
    setUser(u);
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-[#786C60] hover:text-[#2D1810] flex items-center space-x-1 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('settings.back')}</span>
            </Link>
            <h1 className="font-serif text-3xl font-extrabold text-[#2D1810]">{t('settings.title')}</h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Account Info */}
        <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#2D1810]">{t('settings.credentials')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5C4033]">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <span className="text-[#786C60] block mb-0.5">{t('auth.username')}</span>
              <strong className="text-base text-[#2D1810]">{user?.username}</strong>
            </div>
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <span className="text-[#786C60] block mb-0.5">{t('auth.email')}</span>
              <strong className="text-base text-[#2D1810]">{user?.email}</strong>
            </div>
          </div>
        </div>

        {/* Calculation Preferences */}
        <form onSubmit={handleSavePreferences} className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#EAE1D2] pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2D1810]">{t('settings.astrologySettings')}</h3>
              <p className="text-xs text-[#786C60]">{t('settings.astrologySettingsDesc')}</p>
            </div>
            <Sparkles className="w-5 h-5 text-[#D97706]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5C4033] mb-1">{t('settings.ayanamsaModel')}</label>
              <select className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-3 py-2 text-xs text-[#2D1810] focus:outline-none focus:border-[#D97706]">
                <option value="Lahiri">
                  {language === 'mr' ? 'चित्रापक्ष / लाहिरी (भारत सरकार प्रमाणक)' : 'Chitrapaksha / Lahiri (National Standard)'}
                </option>
                <option value="Raman">B.V. Raman</option>
                <option value="KP">Krishnamurti Paddhati (KP)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#5C4033] mb-1">{t('settings.chartStyle')}</label>
              <select className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-3 py-2 text-xs text-[#2D1810] focus:outline-none focus:border-[#D97706]">
                <option value="North">
                  {language === 'mr' ? 'उत्तर भारतीय (चौकोनी / स्थिर भाव)' : 'North Indian (Diamond / Fixed Houses)'}
                </option>
                <option value="South">
                  {language === 'mr' ? 'दक्षिण भारतीय (स्थिर राशी)' : 'South Indian (Square / Fixed Signs)'}
                </option>
              </select>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{t('settings.saved')}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              {t('settings.saveBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
