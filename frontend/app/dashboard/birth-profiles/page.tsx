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
} from 'lucide-react';

export default function MyBirthProfilesPage() {
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
    if (!confirm('Are you sure you want to delete this birth profile?')) return;
    try {
      await api.deleteBirthProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#D4AF37] uppercase tracking-wider font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>User Dashboard</span>
            </div>
            <h1 className="font-serif text-3xl font-bold bg-gradient-to-r from-[#F7DF94] to-[#D4AF37] bg-clip-text text-transparent">
              My Saved Birth Profiles
            </h1>
            <p className="text-xs text-[#D8C7A5]/80 mt-1">
              Manage saved birth details for yourself, family members, or prospective matches.
            </p>
          </div>

          <Link
            href="/birth-profile"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] text-xs font-bold hover:shadow-gold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Profile</span>
          </Link>
        </div>

        {loading && (
          <div className="py-12 text-center text-[#D4AF37] flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading your saved profiles...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4 text-xs text-red-200">
            {error}
          </div>
        )}

        {!loading && profiles.length === 0 && (
          <div className="bg-[#191233]/60 border border-[#D4AF37]/20 rounded-2xl p-12 text-center space-y-4">
            <User className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#FDFBF7]">
              No Saved Birth Profiles Yet
            </h3>
            <p className="text-xs text-[#D8C7A5]/70 max-w-md mx-auto">
              Save your exact birth date, time, and coordinates once to instantly generate Kundli charts, check compatibility, and order premium Vedic reports.
            </p>
            <Link
              href="/birth-profile"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#0F0B1E] text-xs font-bold hover:shadow-gold transition-all"
            >
              <span>Create Your First Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4 hover:border-[#D4AF37] transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#F7DF94]">
                    {p.fullName}
                  </h3>
                  <span className="text-[10px] text-[#D8C7A5]/60 uppercase tracking-wider">
                    {p.gender || 'Profile'}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(p.id)}
                  title="Delete Profile"
                  className="p-1.5 text-[#D8C7A5]/50 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-[#D8C7A5]/80 space-y-1.5 pt-2 border-t border-[#D4AF37]/10">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Date: <strong>{p.dateOfBirth}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Time: <strong>{p.timeOfBirth}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Place: <strong>{p.placeOfBirth}</strong></span>
                </div>
              </div>

              {p.chartData && (
                <div className="bg-[#0F0B1E] rounded-xl p-3 border border-[#D4AF37]/15 text-[11px] grid grid-cols-2 gap-2 text-[#D8C7A5]/90">
                  <div>Lagna: <strong className="text-[#FDFBF7]">{p.chartData.ascendant?.signName}</strong></div>
                  <div>Moon: <strong className="text-[#FDFBF7]">{p.chartData.moonSign?.signName}</strong></div>
                  <div>Nakshatra: <strong className="text-[#FDFBF7]">{p.chartData.moonSign?.nakshatra}</strong></div>
                  <div>Pada: <strong className="text-[#FDFBF7]">{p.chartData.moonSign?.pada}</strong></div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/kundli"
                  className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center space-x-1"
                >
                  <span>Open Kundli Generator</span>
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
