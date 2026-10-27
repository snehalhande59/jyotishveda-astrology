'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Compass, Heart, ArrowRight, Star, CheckCircle2 } from 'lucide-react';

export default function HealingPage() {
  const remedies = [
    {
      title: 'Jyotish Gemstone Recommendation (Ratna)',
      subtitle: 'Prescribed as per your Lagnesha & Bhagyasthan',
      desc: 'Authentic astrological gemology calculated directly from planetary functional beneficence. Strengthen your Lagna Lord and yogakaraka grahas without aggravating malefic houses.',
      examples: ['Yellow Sapphire (Pukhraj) for Jupiter', 'Blue Sapphire (Neelam) for Saturn', 'Emerald (Panna) for Mercury', 'Ruby (Manikya) for Sun'],
      link: '/kundli',
      cta: 'Calculate Suitable Gemstone',
    },
    {
      title: 'Sacred Rudraksha Therapy',
      subtitle: 'Electro-magnetic bio-resonance beads',
      desc: 'From 1 Mukhi (Shiva) to 14 Mukhi (Hanuman), Rudraksha beads balance the nervous system, mitigate chronic planetary doshas, and shield personal aura.',
      examples: ['5 Mukhi for Jupiter & general peace', '7 Mukhi (Mahalakshmi) for Venus & wealth', '8 Mukhi (Ganesha) for Rahu & obstacle removal'],
      link: '/astrologers',
      cta: 'Consult Rudraksha Scholar',
    },
    {
      title: 'Vedic Beej Mantras & Japa Sadhana',
      subtitle: 'Vibrational sound resonance remedies',
      desc: 'Each graha has an exact Sanskrit resonance frequency. Daily chanting of recommended beej mantras neutralizes planetary afflictions and balances the chakras.',
      examples: ['Surya Gayatri for vitality', 'Maha Mrityunjaya for health & longevity', 'Navarna Mantra for spiritual protection'],
      link: '/kundli',
      cta: 'Generate Personalized Mantras',
    },
    {
      title: 'Sacred Yantras & Sacred Geometry',
      subtitle: 'Cosmic geometric energy condensers',
      desc: 'Precision copper and gold-plated yantras energized during auspicious Nakshatras to harmonize residential Vastu and attract prosperity.',
      examples: ['Shree Yantra for wealth & abundance', 'Kuber Yantra for business gains', 'Mahamrityunjay Yantra for safety'],
      link: '/pricing',
      cta: 'Explore Remedial Reports',
    },
  ];

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs text-[#F7DF94]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Classical Parashari Upayas &amp; Remedial Shastra</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Vedic Healing, Gemology &amp; Remedies
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto">
            Harmonize discordant planetary vibrations and amplify auspicious yogas through authentic gems, Rudraksha, sacred geometry, and Vedic mantras.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {remedies.map((rem, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm hover:shadow-gold hover:border-[#D4AF37] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D1F] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  {rem.subtitle}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#150D2A] mt-3">
                  {rem.title}
                </h3>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  {rem.desc}
                </p>

                <div className="mt-5 p-4 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/15">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D1F] mb-2">
                    Key Prescriptions:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {rem.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6D1F] flex-shrink-0" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={rem.link}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs rounded-xl shadow-gold hover:opacity-95 flex items-center space-x-1.5"
                >
                  <span>{rem.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/astrologers"
                  className="text-xs font-semibold text-gray-600 hover:text-[#150D2A]"
                >
                  Ask Astrologer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
