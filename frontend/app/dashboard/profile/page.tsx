'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, clearAuthSession } from '@/lib/auth';
import { api } from '@/lib/api';
import { User, ArrowLeft, Shield, LogOut, CheckCircle } from 'lucide-react';

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push('/login');
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
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-[#D8C7A5] hover:text-[#FDFBF7] flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-[#FDFBF7]">Account Settings &amp; Profiles</h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold rounded-xl hover:bg-red-900"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Account Info */}
        <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#150D2A]">User Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <span className="text-gray-500 block mb-0.5">Username</span>
              <strong className="text-base text-[#150D2A]">{user?.username}</strong>
            </div>
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <span className="text-gray-500 block mb-0.5">Email Address</span>
              <strong className="text-base text-[#150D2A]">{user?.email}</strong>
            </div>
          </div>
        </div>

        {/* Saved Birth Profiles */}
        <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-[#150D2A]">Saved Birth Profiles</h3>
            <Link href="/birth-profile" className="text-xs font-semibold text-[#8C6D1F] hover:underline">
              + Add Another Profile
            </Link>
          </div>

          {savedProfiles.length > 0 ? (
            <div className="divide-y divide-gray-100 text-xs">
              {savedProfiles.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center">
                  <div>
                    <strong className="text-sm font-semibold text-[#150D2A] block">{p.fullName}</strong>
                    <span className="text-gray-500">
                      {p.dateOfBirth} at {p.timeOfBirth} • {p.placeOfBirth}
                    </span>
                  </div>
                  <Link
                    href="/kundli"
                    className="px-3 py-1 bg-[#FAF6F0] border border-[#D4AF37]/30 text-[#8C6D1F] font-semibold rounded-lg hover:bg-gray-100"
                  >
                    Open Kundli
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-4">No birth profiles saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
