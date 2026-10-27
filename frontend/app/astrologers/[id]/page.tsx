'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Astrologer } from '@/lib/types';
import { Award, Clock, Star, Users, CheckCircle, Video, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AstrologerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!params?.id) return;
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const data = await api.getAstrologerById(id);
        if (data) {
          setAstrologer(data);
        } else {
          // Fallback if specific ID not found in dev
          const all = await api.getAstrologers();
          setAstrologer(all[0] || null);
        }
      } catch (e) {
        console.warn('Error loading astrologer profile:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6F0] p-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#150D2A]">Astrologer Not Found</h2>
        <Link href="/astrologers" className="mt-4 text-xs font-semibold text-[#8C6D1F] underline">
          Return to Astrologers Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={astrologer.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'}
            alt={astrologer.name}
            className="w-32 h-32 rounded-3xl object-cover border-4 border-[#D4AF37] shadow-gold flex-shrink-0"
          />
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Certified Jyotish Scholar</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">{astrologer.name}</h1>
            <p className="text-xs sm:text-sm text-[#D4AF37] font-semibold">{astrologer.title}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-[#D8C7A5]/80 pt-1">
              <span>★ {astrologer.rating} ({astrologer.reviewCount} client sessions)</span>
              <span>•</span>
              <span>{astrologer.experienceYears}+ Years of Rigorous Practice</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bio & Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#150D2A]">Scholarly Biography</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{astrologer.bio}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#150D2A]">Specialties &amp; Systems</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(astrologer.specialties) ? astrologer.specialties : []).map((s, i) => (
                <span key={i} className="px-3.5 py-1.5 bg-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl text-xs font-semibold text-[#8C6D1F]">
                  {s}
                </span>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100 text-xs text-gray-600">
              <strong>Spoken Languages:</strong>{' '}
              {Array.isArray(astrologer.languages)
                ? astrologer.languages.join(', ')
                : String(astrologer.languages || '')}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-4 bg-[#150D2A] text-[#FDFBF7] p-6 rounded-3xl border-2 border-[#D4AF37] shadow-cosmic space-y-6">
          <div>
            <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">Private Consultation</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="font-serif text-3xl font-bold text-[#F7DF94]">₹{astrologer.consultationFee}</span>
              <span className="text-xs text-[#D8C7A5]">/ 45 Mins</span>
            </div>
          </div>

          <div className="text-xs space-y-2 border-y border-[#D4AF37]/20 py-4 text-[#D8C7A5]">
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-[#D4AF37]" />
              <span>1-on-1 Video Consultation (Google Meet)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Available daily slots</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Confidential &amp; Bespoke Remedies</span>
            </div>
          </div>

          <Link
            href={`/booking?astrologerId=${astrologer.id}`}
            className="w-full block text-center py-3 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs rounded-xl shadow-gold hover:opacity-95 transition-all"
          >
            Select Date &amp; Time Slot
          </Link>
        </div>
      </div>
    </div>
  );
}
