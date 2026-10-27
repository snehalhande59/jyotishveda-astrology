'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0F0B1E] text-[#FDFBF7] flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <h2 className="font-serif text-2xl font-bold text-[#D4AF37]">
            Universal Alignment In Progress
          </h2>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0F0B1E] font-bold text-xs"
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
