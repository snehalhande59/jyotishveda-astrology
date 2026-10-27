import React from 'react';
import { ShieldAlert, BookOpen } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
          Terms of Service &amp; Astrological Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-[#D8C7A5] mt-1">
          Effective Date: October 2026 • JyotishVeda Platform
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-white p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Astrological Advisory Notice (Section 5 Standard):</strong> Vedic astrology is an ancient symbolic, mathematical, and interpretive science. All astrological reports, daily horoscopes, Kundli readings, and consultations represent advisory guidance and energetic cycles. They do not constitute scientific fact, financial advice, psychiatric counseling, medical diagnosis, or deterministic guarantees of marriage, career, or wealth outcomes.
          </p>
        </div>

        <h3 className="font-serif text-base font-bold text-[#150D2A] pt-2">1. Use of Services</h3>
        <p>
          By utilizing JyotishVeda, you confirm that you are at least 18 years old and agree to provide accurate birth date and time information. Astronomical positions are computed using the sidereal Lahiri Chitrapaksha Ayanamsa.
        </p>

        <h3 className="font-serif text-base font-bold text-[#150D2A] pt-2">2. Consultations &amp; Appointments</h3>
        <p>
          Video consultations take place with verified Acharyas via Google Meet or secure video links. Rescheduling is permitted up to 12 hours prior to the booked time slot.
        </p>

        <h3 className="font-serif text-base font-bold text-[#150D2A] pt-2">3. Intellectual Property</h3>
        <p>
          The computational algorithms, custom chart visualizations, and interpretive texts are the proprietary intellectual property of JyotishVeda. Users receive a personal license for private and family use.
        </p>
      </div>
    </div>
  );
}
