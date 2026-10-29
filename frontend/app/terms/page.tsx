import React from 'react';
import { ShieldAlert, BookOpen } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
          Terms of Service &amp; Astrological Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-[#786C60] mt-1">
          Effective Date: October 2026 • JyotishVeda Platform
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-white p-8 sm:p-12 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6 text-xs text-[#5C4033] leading-relaxed">
        <div className="p-4 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] text-[#92400E] flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
          <p>
            <strong>Astrological Advisory Notice (Section 5 Standard):</strong> Vedic astrology is an ancient symbolic, mathematical, and interpretive science. All astrological reports, daily horoscopes, Kundli readings, and consultations represent advisory guidance and energetic cycles. They do not constitute scientific fact, financial advice, psychiatric counseling, medical diagnosis, or deterministic guarantees of marriage, career, or wealth outcomes.
          </p>
        </div>

        <h3 className="font-serif text-base font-bold text-[#2D1810] pt-2">1. Use of Services</h3>
        <p>
          By utilizing JyotishVeda, you confirm that you are at least 18 years old and agree to provide accurate birth date and time information. Astronomical positions are computed using the sidereal Lahiri Chitrapaksha Ayanamsa.
        </p>

        <h3 className="font-serif text-base font-bold text-[#2D1810] pt-2">2. Consultations &amp; Appointments</h3>
        <p>
          Video consultations take place with verified Acharyas via Google Meet or secure video links. Rescheduling is permitted up to 12 hours prior to the booked time slot.
        </p>

        <h3 className="font-serif text-base font-bold text-[#2D1810] pt-2">3. Intellectual Property</h3>
        <p>
          The computational algorithms, custom chart visualizations, and interpretive texts are the proprietary intellectual property of JyotishVeda. Users receive a personal license for private and family use.
        </p>
      </div>
    </div>
  );
}