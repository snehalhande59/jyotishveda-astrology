'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import NorthIndianChart from '@/components/NorthIndianChart';
import { Sparkles, CheckCircle, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function BirthProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProfileSubmit = async (formData: BirthFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.saveBirthProfile(formData);
      setCreatedProfile(res);
      setSuccessMessage('Birth profile successfully created and saved to your account!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save birth profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Sacred Horoscope Identity</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
            Create My Birth Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5]">
            Save your exact astrological birth coordinates for instant access to personalized Kundli, daily transits, and future reports.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {successMessage && (
          <div className="mb-8 p-4 bg-emerald-950 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-950 border border-red-500/50 rounded-2xl text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-6 space-y-6">
            <BirthDetailsForm
              onSubmit={handleProfileSubmit}
              isLoading={isSubmitting}
              buttonText="Save & Generate Birth Profile"
              showGender={true}
            />

            <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/20 text-xs text-gray-600 space-y-2">
              <div className="flex items-center space-x-2 text-gray-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#8C6D1F]" />
                <span>Strict Privacy & Confidentiality</span>
              </div>
              <p>
                Your birth details and coordinates are stored privately and used exclusively for your personal astrological calculations. We never sell or share private profile data.
              </p>
            </div>
          </div>

          {/* Right: Real-time Profile Preview or Guidelines */}
          <div className="lg:col-span-6">
            {createdProfile ? (
              <div className="bg-[#150D2A] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37] shadow-cosmic text-[#FDFBF7] space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#D4AF37]/20">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Active Profile</span>
                    <h3 className="font-serif text-2xl font-bold text-[#F7DF94]">
                      {createdProfile.fullName}
                    </h3>
                  </div>
                  <UserCheck className="w-7 h-7 text-[#D4AF37]" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-[#0F0B1E] p-4 rounded-xl border border-[#D4AF37]/20">
                  <div>
                    <span className="text-[#D8C7A5]/60 block">Birth Date</span>
                    <strong className="text-[#FDFBF7]">{createdProfile.dateOfBirth}</strong>
                  </div>
                  <div>
                    <span className="text-[#D8C7A5]/60 block">Birth Time</span>
                    <strong className="text-[#FDFBF7]">{createdProfile.timeOfBirth}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#D8C7A5]/60 block">Place of Birth</span>
                    <strong className="text-[#FDFBF7]">{createdProfile.placeOfBirth}</strong>
                  </div>
                </div>

                {createdProfile.chartData && (
                  <div className="space-y-4">
                    <NorthIndianChart chartData={createdProfile.chartData} />
                    <div className="flex gap-3">
                      <Link
                        href="/kundli"
                        className="flex-1 text-center py-2.5 bg-[#D4AF37] text-[#0F0B1E] font-semibold text-xs rounded-xl shadow-gold hover:opacity-90"
                      >
                        Explore Complete Kundli
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex-1 text-center py-2.5 bg-[#25184B] border border-[#D4AF37]/40 text-[#FDFBF7] text-xs font-semibold rounded-xl hover:border-[#D4AF37]"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/20 shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#150D2A]">
                  Why Complete Birth Coordinates Matter
                </h3>
                <ul className="space-y-4 text-xs text-gray-700 leading-relaxed">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FAF6F0] border border-[#D4AF37] flex items-center justify-center text-[#8C6D1F] font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className="text-gray-900 block">Lagna (Rising Sign) Sensitivity</strong>
                      The earth rotates 1 degree every 4 minutes. Accurate birth time ensures exact Ascendant and house cusp positions.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FAF6F0] border border-[#D4AF37] flex items-center justify-center text-[#8C6D1F] font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className="text-gray-900 block">Nakshatra Pada Precision</strong>
                      Each Nakshatra is divided into 4 padas of 3° 20&apos; each. The pada reveals deep behavioral subtleties and Navamsha chart status.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FAF6F0] border border-[#D4AF37] flex items-center justify-center text-[#8C6D1F] font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className="text-gray-900 block">Vimshottari Dasha Balance</strong>
                      The starting Mahadasha period balance depends strictly on the Moon&apos;s elapsed degrees inside the birth constellation.
                    </div>
                  </li>
                </ul>

                <div className="p-4 bg-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl text-xs text-[#8C6D1F]">
                  Fill out the form on the left with your city search to automatically fetch exact geographic latitude, longitude, and timezone offset.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
