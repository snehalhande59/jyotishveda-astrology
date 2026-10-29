import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE1D2] shadow-sm max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center shadow-sm mx-auto text-2xl font-serif text-[#D97706] font-extrabold">
          404
        </div>
        <h1 className="font-serif text-2xl font-extrabold text-[#2D1810]">
          Page Not Found
        </h1>
        <p className="text-xs text-[#786C60] leading-relaxed">
          The astrological coordinate or page you requested could not be found. It may have moved or been renamed.
        </p>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to JyotishVeda Home</span>
        </Link>
      </div>
    </div>
  );
}