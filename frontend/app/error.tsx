'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-[#EAE1D2] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto text-[#D97706]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2D1810]">
          Something Went Wrong
        </h2>
        <p className="text-xs text-[#786C60] leading-relaxed">
          {error?.message && !error.message.includes('digest')
            ? error.message
            : 'An unexpected error occurred while loading this page. Please try refreshing or return home.'}
        </p>
        <div className="flex justify-center space-x-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE1D2] text-xs font-semibold text-[#2D1810] hover:bg-[#F3EFEA] transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#786C60]" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}