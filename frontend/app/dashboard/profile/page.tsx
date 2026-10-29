'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, clearAuthSession } from '@/lib/auth';
import { api } from '@/lib/api';
import { User, ArrowLeft, Shield, LogOut, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function UserProfilePage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push('/login?redirect=/dashboard/profile');
      return;
    }
    setUser(u);

    async function load() {
      try {
        const profs = await api.getMyBirthProfiles();
        setSavedProfiles(profs || []);
      } catch (e) {
        console.warn('Error loading profiles:', e);
      }
    }
    load();
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
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
              <span>{language === 'mr' ? 'डॅशबोर्डवर परत जा' : 'Back to Dashboard'}</span>
            </Link>
            <h1 className="font-serif text-3xl font-extrabold text-[#2D1810]">
              {language === 'mr' ? 'खाते माहिती आणि प्रोफाइल्स' : 'Account Settings & Profiles'}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'mr' ? 'लॉग आऊट' : 'Sign Out'}</span>
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Account Info */}
        <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#2D1810]">
            {language === 'mr' ? 'वापरकर्ता खाते तपशील' : 'User Account Information'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5C4033]">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <span className="text-[#786C60] block mb-0.5">{language === 'mr' ? 'वापरकर्तानाव' : 'Username'}</span>
              <strong className="text-base text-[#2D1810]">{user?.username}</strong>
            </div>
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <span className="text-[#786C60] block mb-0.5">{language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}</span>
              <strong className="text-base text-[#2D1810]">{user?.email}</strong>
            </div>
          </div>
        </div>

        {/* Saved Birth Profiles */}
        <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#EAE1D2] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#2D1810]">
              {language === 'mr' ? 'जतन केलेली जन्म माहिती' : 'Saved Birth Profiles'}
            </h3>
            <Link href="/birth-profile" className="text-xs font-semibold text-[#D97706] hover:underline">
              {language === 'mr' ? '+ नवीन प्रोफाइल जोडा' : '+ Add Another Profile'}
            </Link>
          </div>

          {savedProfiles.length > 0 ? (
            <div className="divide-y divide-[#EAE1D2] text-xs">
              {savedProfiles.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center">
                  <div>
                    <strong className="text-sm font-semibold text-[#2D1810] block">{p.fullName}</strong>
                    <span className="text-[#786C60]">
                      {p.dateOfBirth} at {p.timeOfBirth} • {p.placeOfBirth}
                    </span>
                  </div>
                  <Link
                    href="/kundli"
                    className="px-3 py-1 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-semibold rounded-lg hover:bg-[#FEF3C7] transition-colors"
                  >
                    {language === 'mr' ? 'कुंडली पहा' : 'Open Kundli'}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#786C60] py-4">
              {language === 'mr' ? 'कोणतीही जन्म प्रोफाइल जतन केलेली नाही.' : 'No birth profiles saved yet.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
