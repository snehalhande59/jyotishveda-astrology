'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF7F2] text-[#2D1810] flex items-center justify-center min-h-screen font-sans p-4">
        <div className="bg-white border border-[#EAE1D2] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto text-xl font-bold text-[#D97706]">
            ⚠️
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D1810]">
            System Error
          </h2>
          <p className="text-xs text-[#786C60] leading-relaxed">
            A critical error occurred while loading this page. Please try refreshing.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}