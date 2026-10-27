import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-sm max-w-md w-full text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center shadow-gold mx-auto text-2xl font-serif text-[#0F0B1E]">
          404
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#150D2A]">
          Celestial Realm Not Found
        </h1>
        <p className="text-xs text-gray-600 leading-relaxed">
          The astrological coordinate or page you requested does not exist or has shifted in the cosmic transits.
        </p>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#150D2A] text-[#FDFBF7] text-xs font-semibold rounded-xl hover:bg-[#8C6D1F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sacred Home</span>
        </Link>
      </div>
    </div>
  );
}
