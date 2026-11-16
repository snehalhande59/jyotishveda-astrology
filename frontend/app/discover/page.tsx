'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Sparkles, Compass, Calendar } from 'lucide-react';

/**
 * Discover Your True Celestial Blueprint
 *
 * This page presents a spacious, visually‑rich hero section that explains
 * that JyotishVeda uses an **exact Nirayana Sidereal Vedic Ephemeris** –
 * the same high‑precision astronomical data used by professional astrologers.
 *
 * The layout mirrors the design language of the rest of the site (rounded
 * cards, muted palette, Marathi/English toggle) while providing a larger
 * vertical padding (`py-32`) so the background image has room to breathe.
 */
export default function DiscoverPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1518009479971-384f14786cd7?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative max-w-3xl mx-auto text-center px-4 py-32 space-y-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
          {isMr ? 'तुमचा खरा खगोलीय नकाशा शोधा' : 'Discover Your True Celestial Blueprint'}
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
          {isMr
            ? 'JyotishVeda मध्ये अचूक निराणय निसर्गीय वैदिक एपनिफेरिस वापरली जाते – सटीक ग्रह स्थिती, तिथी, नक्षत्र व योग, जी कोणत्याही स्थान व क्षणास सुस्पष्टपणे गणना करते.'
            : 'JyotishVeda leverages an exact **Nirayana Sidereal Vedic Ephemeris** – precise planetary positions, tithis, nakshatras & yogas calculated for any place and moment.'}
        </p>
        <Link
          href="/kundli"
          className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {isMr ? 'तुमचा कुंडली बनवा' : 'Generate Your Kundli'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
