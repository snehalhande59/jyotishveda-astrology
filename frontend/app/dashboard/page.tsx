'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { User } from '@/lib/types';
import {
  User as UserIcon,
  FileText,
  Calendar,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    setUser(currentUser);

    async function loadUserData() {
      try {
        const [profData, repData, bookData] = await Promise.all([
          api.getMyBirthProfiles(),
          api.getMyReports(),
          api.getMyBookings(),
        ]);
        setProfiles(profData || []);
        setReports(repData || []);
        setBookings(bookData || []);
      } catch (e) {
        console.warn('Dashboard data fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [router]);

  if (!user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-8 h-8 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{language === 'mr' ? 'वैयक्तिक ज्योतिष पोर्टल' : 'Personal Astrology Portal'}</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-[#2D1810] mt-2">
              {language === 'mr' ? `नमस्ते, ${user?.username}` : `Namaste, ${user?.username}`}
            </h1>
            <p className="text-xs text-[#786C60]">{language === 'mr' ? 'ईमेल:' : 'Email:'} {user?.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/family-kundli"
              className="px-4 py-2 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all flex items-center space-x-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>{language === 'mr' ? 'कुटुंब कुंडली (Family Vault)' : 'Family Kundli Vault'}</span>
            </Link>
            <Link
              href="/birth-profile"
              className="px-4 py-2 bg-white border border-[#EAE1D2] hover:border-[#D97706] text-[#2D1810] font-semibold text-xs rounded-xl shadow-xs transition-all"
            >
              {language === 'mr' ? '+ नवीन जन्म प्रोफाइल' : '+ Add Birth Profile'}
            </Link>
            <Link
              href="/kundli"
              className="px-4 py-2 bg-white border border-[#EAE1D2] text-[#2D1810] text-xs font-semibold rounded-xl hover:border-[#D97706] shadow-xs transition-all"
            >
              {language === 'mr' ? 'नवीन कुंडली काढा' : 'Calculate Kundli'}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Real-time Order / Booking Status Notifications */}
        {bookings
          .filter((b) => b.status === 'confirmed' && b.meetingLink)
          .map((cb) => (
            <div
              key={cb.id}
              className="p-5 bg-gradient-to-r from-emerald-50 via-[#F0FDF4] to-emerald-50 border-2 border-emerald-400 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white tracking-wider">
                      {language === 'mr' ? 'सल्लामसलत निश्चित (Confirmed)' : 'Appointment Confirmed'}
                    </span>
                    <span className="text-[11px] font-mono text-[#786C60]">#{cb.bookingNumber}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1A4D2E] mt-1">
                    {language === 'mr' ? 'आपली व्हिडिओ भेट निश्चित झाली आहे:' : 'Your Video Consultation is Confirmed with:'}{' '}
                    {cb.astrologer?.name || 'Vedic Acharya'}
                  </h3>
                  <p className="text-xs text-[#2D5A3C] mt-0.5">
                    📅 {cb.date} at ⏰ {cb.timeSlot} • {cb.topic || 'Vedic Astrology Consultation'}
                  </p>
                </div>
              </div>
              <a
                href={cb.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0 self-stretch sm:self-auto justify-center"
              >
                <Video className="w-4 h-4" />
                <span>{language === 'mr' ? 'व्हिडिओ कॉलमध्ये सामील व्हा' : 'Join Video Consultation'}</span>
              </a>
            </div>
          ))}

        {bookings
          .filter((b) => b.status === 'cancelled')
          .slice(0, 1)
          .map((cb) => (
            <div
              key={cb.id}
              className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {language === 'mr'
                    ? `बुकिंग #${cb.bookingNumber} (${cb.astrologer?.name || 'आचार्य'}) रद्द करण्यात आली आहे. परतावा प्रक्रिया सुरू केली आहे.`
                    : `Booking #${cb.bookingNumber} with ${cb.astrologer?.name || 'Acharya'} was cancelled. Refund has been initiated.`}
                </span>
              </div>
            </div>
          ))}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/dashboard/reports"
            className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EAE1D2] shadow-sm hover:border-[#D97706] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] text-[#786C60] uppercase font-bold tracking-wider">
                {language === 'mr' ? 'माझे अहवाल' : 'My Reports'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810] mt-1">{reports.length}</h3>
              <p className="text-xs text-[#D97706] font-semibold mt-1">
                {language === 'mr' ? 'अहवाल पहा →' : 'View active reports →'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706] flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </Link>

          <Link
            href="/dashboard/bookings"
            className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EAE1D2] shadow-sm hover:border-[#D97706] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] text-[#786C60] uppercase font-bold tracking-wider">
                {language === 'mr' ? 'सल्लामसलत' : 'Consultations'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810] mt-1">{bookings.length}</h3>
              <p className="text-xs text-[#D97706] font-semibold mt-1">
                {language === 'mr' ? 'अपॉइंटमेंट्स पहा →' : 'View appointments →'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706] flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
          </Link>

          <Link
            href="/family-kundli"
            className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EAE1D2] shadow-sm hover:border-[#D97706] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] text-[#786C60] uppercase font-bold tracking-wider">
                {language === 'mr' ? 'कुटुंब कुंडल्या' : 'Family Kundlis'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810] mt-1">{profiles.length}</h3>
              <p className="text-xs text-[#D97706] font-semibold mt-1">
                {language === 'mr' ? 'कुटुंब तिजोरी उघडा →' : 'Manage family vault →'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706] flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Saved Birth Profiles */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#EAE1D2] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                {language === 'mr' ? 'कौटुंबिक जन्म पत्रिका (Family Kundlis)' : 'Family Birth Profiles'}
              </h3>
              <Link href="/family-kundli" className="text-xs font-bold text-[#D97706] hover:underline">
                {language === 'mr' ? 'सर्व पहा →' : 'View All Vault →'}
              </Link>
            </div>

            {profiles.length > 0 ? (
              <div className="divide-y divide-[#EAE1D2] text-xs">
                {profiles.map((p) => (
                  <div key={p.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-sm font-semibold text-[#2D1810]">{p.fullName}</strong>
                        {p.relationship && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]">
                            {p.relationship}
                          </span>
                        )}
                      </div>
                      <span className="text-[#786C60] block mt-0.5">
                        {p.dateOfBirth} at {p.timeOfBirth} • {p.placeOfBirth}
                      </span>
                    </div>
                    <Link
                      href={`/family-kundli`}
                      className="px-3 py-1 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-semibold rounded-lg hover:bg-[#FEF3C7] transition-colors self-end sm:self-auto"
                    >
                      {language === 'mr' ? 'कुंडली उघडा' : 'View Kundli'}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#786C60] py-6 text-center">
                {language === 'mr'
                  ? 'अद्याप कोणतीही जन्म प्रोफाइल जतन केलेली नाही. त्वरित कुंडलीसाठी आपली पहिली प्रोफाइल तयार करा.'
                  : 'No birth profiles saved yet. Create your first profile to unlock instant Kundlis.'}
              </p>
            )}
          </div>

          {/* Upcoming Consultations */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#EAE1D2] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                {language === 'mr' ? 'सल्लामसलत सत्रे' : 'Consultation Sessions'}
              </h3>
              <Link href="/astrologers" className="text-xs font-semibold text-[#D97706] hover:underline">
                {language === 'mr' ? 'ज्योतिषी निवडा' : 'Book Acharya'}
              </Link>
            </div>

            {bookings.length > 0 ? (
              <div className="divide-y divide-[#EAE1D2] text-xs">
                {bookings.map((b) => (
                  <div key={b.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <strong className="text-sm font-semibold text-[#2D1810] block">
                        {b.astrologer?.name || (language === 'mr' ? 'वैदिक विद्वान' : 'Vedic Scholar')}
                      </strong>
                      <span className="text-[#786C60]">
                        {b.date} at {b.timeSlot} • {language === 'mr' ? 'स्थिती:' : 'Status:'}{' '}
                        <span className="text-emerald-700 font-semibold uppercase">{b.status}</span>
                      </span>
                    </div>
                    {b.meetingLink && (
                      <a
                        href={b.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold rounded-lg transition-colors self-end sm:self-auto"
                      >
                        {language === 'mr' ? 'कॉलमध्ये सामील व्हा' : 'Join Call'}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#786C60] py-6 text-center">
                {language === 'mr'
                  ? 'सध्या कोणतेही बुकिंग सक्रिय नाही. प्रमाणित ज्योतिषांशी सल्लामसलत बुक करा.'
                  : 'No active bookings. Browse our certified scholars to schedule an appointment.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
