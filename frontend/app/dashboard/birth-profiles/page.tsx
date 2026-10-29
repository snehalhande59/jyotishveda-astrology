'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { BirthProfile } from '@/lib/types';
import {
  User,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MyBirthProfilesPage() {
  const { language } = useLanguage();
  const [profiles, setProfiles] = useState<BirthProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login?redirect=/dashboard/birth-profiles');
      return;
    }

    const loadProfiles = async () => {
      try {
        const data = await api.getMyBirthProfiles();
        setProfiles(data || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load your birth profiles');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [router]);

  const handleDelete = async (id: number) => {
    const confirmMsg = language === 'mr' ? 'तुम्हाला ही जन्म प्रोफाइल नक्की हटवायची आहे का?' : 'Are you sure you want to delete this birth profile?';
    if (!confirm(confirmMsg)) return;
    try {
      await api.deleteBirthProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE1D2] pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#92400E] uppercase tracking-wider font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{language === 'mr' ? 'वापरकर्ता डॅशबोर्ड' : 'User Dashboard'}</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-[#2D1810]">
              {language === 'mr' ? 'माझी जतन केलेली जन्म माहिती' : 'My Saved Birth Profiles'}
            </h1>
            <p className="text-xs text-[#786C60] mt-1">
              {language === 'mr'
                ? 'स्वतःसाठी, कुटुंबातील सदस्यांसाठी किंवा विवाहासाठी जतन केलेल्या जन्म तपशीलांचे व्यवस्थापन करा.'
                : 'Manage saved birth details for yourself, family members, or prospective matches.'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE1D2] text-[#2D1810] text-xs font-semibold hover:border-[#D97706] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'मागे जा' : 'Back'}</span>
            </Link>
            <Link
              href="/birth-profile"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'mr' ? 'नवीन प्रोफाइल जोडा' : 'Add New Profile'}</span>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center text-[#D97706] flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold">
              {language === 'mr' ? 'प्रोफाइल्स लोड होत आहेत...' : 'Loading your saved profiles...'}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
            {error}
          </div>
        )}

        {!loading && profiles.length === 0 && (
          <div className="bg-white border border-[#EAE1D2] rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <User className="w-12 h-12 text-[#D97706]/40 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#2D1810]">
              {language === 'mr' ? 'अद्याप कोणतीही जन्म प्रोफाइल नाही' : 'No Saved Birth Profiles Yet'}
            </h3>
            <p className="text-xs text-[#786C60] max-w-md mx-auto leading-relaxed">
              {language === 'mr'
                ? 'त्वरित कुंडली, पत्रिका मिलन आणि प्रीमियम वैदिक अहवालांसाठी आपले अचूक जन्म तपशील जतन करा.'
                : 'Save your exact birth date, time, and coordinates once to instantly generate Kundli charts, check compatibility, and order premium Vedic reports.'}
            </p>
            <Link
              href="/birth-profile"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all"
            >
              <span>{language === 'mr' ? 'पहिली प्रोफाइल तयार करा' : 'Create Your First Profile'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#EAE1D2] rounded-2xl p-6 space-y-4 hover:border-[#D97706] shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2D1810]">
                    {p.fullName}
                  </h3>
                  <span className="text-[10px] text-[#786C60] uppercase tracking-wider font-semibold">
                    {p.gender || 'Profile'}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(p.id)}
                  title="Delete Profile"
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-[#5C4033] space-y-1.5 pt-2 border-t border-[#EAE1D2]">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{language === 'mr' ? 'दिनांक:' : 'Date:'} <strong>{p.dateOfBirth}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{language === 'mr' ? 'वेळ:' : 'Time:'} <strong>{p.timeOfBirth}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{language === 'mr' ? 'स्थान:' : 'Place:'} <strong>{p.placeOfBirth}</strong></span>
                </div>
              </div>

              {p.chartData && (
                <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#EAE1D2] text-[11px] grid grid-cols-2 gap-2 text-[#5C4033]">
                  <div>Lagna: <strong className="text-[#2D1810]">{p.chartData.ascendant?.signName}</strong></div>
                  <div>Moon: <strong className="text-[#2D1810]">{p.chartData.moonSign?.signName}</strong></div>
                  <div>Nakshatra: <strong className="text-[#2D1810]">{p.chartData.moonSign?.nakshatra}</strong></div>
                  <div>Pada: <strong className="text-[#2D1810]">{p.chartData.moonSign?.pada}</strong></div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/kundli"
                  className="text-xs font-bold text-[#D97706] hover:underline flex items-center space-x-1"
                >
                  <span>{language === 'mr' ? 'कुंडली पहा' : 'Open Kundli Generator'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
