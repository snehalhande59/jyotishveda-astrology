'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-[#191233] border border-[#D4AF37]/30 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#F7DF94]">
          Celestial Alignment Notice
        </h2>
        <p className="text-xs text-[#D8C7A5]/80">
          An astrological coordinate error occurred while loading this view.
        </p>
        <div className="flex justify-center space-x-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] text-xs font-bold"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-[#25184B] border border-[#D4AF37]/30 text-xs font-semibold text-[#FDFBF7]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
