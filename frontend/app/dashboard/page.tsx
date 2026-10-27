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
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Personal Astrology Portal</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#FDFBF7] mt-2">
              Namaste, {user?.username}
            </h1>
            <p className="text-xs text-[#D8C7A5]">Email: {user?.email}</p>
          </div>

          <div className="flex space-x-3">
            <Link
              href="/birth-profile"
              className="px-4 py-2 bg-[#D4AF37] text-[#0F0B1E] font-semibold text-xs rounded-xl shadow-gold hover:opacity-95"
            >
              + Add Birth Profile
            </Link>
            <Link
              href="/kundli"
              className="px-4 py-2 bg-[#25184B] border border-[#D4AF37]/40 text-[#FDFBF7] text-xs font-semibold rounded-xl hover:border-[#D4AF37]"
            >
              Calculate New Kundli
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/dashboard/reports"
            className="bg-white p-6 rounded-2xl border border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold">My Reports</span>
              <h3 className="font-serif text-3xl font-bold text-[#150D2A] mt-1">{reports.length}</h3>
              <p className="text-xs text-[#8C6D1F] font-semibold mt-1">View active reports →</p>
            </div>
            <FileText className="w-10 h-10 text-[#8C6D1F]/60" />
          </Link>

          <Link
            href="/dashboard/bookings"
            className="bg-white p-6 rounded-2xl border border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Consultations</span>
              <h3 className="font-serif text-3xl font-bold text-[#150D2A] mt-1">{bookings.length}</h3>
              <p className="text-xs text-[#8C6D1F] font-semibold mt-1">View appointments →</p>
            </div>
            <Calendar className="w-10 h-10 text-[#8C6D1F]/60" />
          </Link>

          <Link
            href="/dashboard/profile"
            className="bg-white p-6 rounded-2xl border border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Saved Profiles</span>
              <h3 className="font-serif text-3xl font-bold text-[#150D2A] mt-1">{profiles.length}</h3>
              <p className="text-xs text-[#8C6D1F] font-semibold mt-1">Manage profiles →</p>
            </div>
            <Compass className="w-10 h-10 text-[#8C6D1F]/60" />
          </Link>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Saved Birth Profiles */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#150D2A]">Saved Birth Profiles</h3>
              <Link href="/birth-profile" className="text-xs font-semibold text-[#8C6D1F] hover:underline">
                + New Profile
              </Link>
            </div>

            {profiles.length > 0 ? (
              <div className="divide-y divide-gray-100 text-xs">
                {profiles.map((p) => (
                  <div key={p.id} className="py-3 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-semibold text-[#150D2A] block">{p.fullName}</strong>
                      <span className="text-gray-500">
                        {p.dateOfBirth} at {p.timeOfBirth} • {p.placeOfBirth}
                      </span>
                    </div>
                    <Link
                      href="/kundli"
                      className="px-3 py-1 bg-[#FAF6F0] border border-[#D4AF37]/30 text-[#8C6D1F] font-semibold rounded-lg hover:bg-[#FAF6F0]/80"
                    >
                      View Kundli
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">
                No birth profiles saved yet. Create your first profile to unlock instant Kundlis.
              </p>
            )}
          </div>

          {/* Upcoming Consultations */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#150D2A]">Consultation Sessions</h3>
              <Link href="/astrologers" className="text-xs font-semibold text-[#8C6D1F] hover:underline">
                Book Acharya
              </Link>
            </div>

            {bookings.length > 0 ? (
              <div className="divide-y divide-gray-100 text-xs">
                {bookings.map((b) => (
                  <div key={b.id} className="py-3 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-semibold text-[#150D2A] block">
                        {b.astrologer?.name || 'Vedic Scholar'}
                      </strong>
                      <span className="text-gray-500">
                        {b.date} at {b.timeSlot} • Status: <span className="text-emerald-600 font-semibold uppercase">{b.status}</span>
                      </span>
                    </div>
                    {b.meetingLink && (
                      <a
                        href={b.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-[#150D2A] text-[#FDFBF7] font-semibold rounded-lg hover:bg-[#8C6D1F]"
                      >
                        Join Call
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">
                No active bookings. Browse our certified scholars to schedule an appointment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
