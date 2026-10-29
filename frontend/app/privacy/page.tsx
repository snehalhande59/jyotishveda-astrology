import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#786C60] mt-1">
          Last updated: October 2026 • JyotishVeda Platform
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-white p-5 sm:p-8 md:p-12 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6 text-xs text-[#5C4033] leading-relaxed">
        <div className="flex items-center space-x-2 text-[#92400E] font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-[#D97706]" />
          <span>Our Commitment to Sacred Birth Privacy</span>
        </div>

        <p>
          At <strong>JyotishVeda</strong>, we treat astrological birth details (full name, date of birth, time of birth, place of birth, and geographic coordinates) as sensitive personal information. We do not sell, rent, monetize, or disclose your birth information to third parties.
        </p>

        <h3 className="font-serif text-base font-bold text-[#2D1810] pt-2">1. Data Collected</h3>
        <p>
          We only gather data essential to perform astronomical calculations: date of birth, time, latitude, longitude, and user account credentials (email and encrypted passwords). We never store plaintext passwords or payment card details.
        </p>

        <h3 className="font-serif text-base font-bold text-[#2D1810] pt-2">2. Payment Processing</h3>
        <p>
          All online financial transactions are processed securely through certified Razorpay gateways. Payment signatures are cryptographically validated directly on our backend. No credit card or banking secrets ever touch our frontend application.
        </p>

        <h3 className="font-serif text-base font-bold text-[#2D1810] pt-2">3. User Rights</h3>
        <p>
          You have full rights to request the deletion or export of your account, saved birth charts, and consultation history by contacting our data protection officer at <code>privacy@jyotishveda.com</code>.
        </p>
      </div>
    </div>
  );
}