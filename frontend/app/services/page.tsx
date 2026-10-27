import React from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Sparkles, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await api.getServices();

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authenticated Vedic Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold bg-gradient-to-r from-[#F7DF94] via-[#D4AF37] to-[#E5C058] bg-clip-text text-transparent">
            Astrology Services & Consultations
          </h1>
          <p className="text-[#D8C7A5]/80 text-sm sm:text-base leading-relaxed">
            Every service is computed using the authoritative Chitrapaksha / Lahiri Sidereal ephemeris, delivering pure mathematical astronomical coordinates paired with nuanced interpretive wisdom.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl p-6 flex flex-col justify-between hover:border-[#D4AF37] transition-all hover:shadow-gold duration-300 relative group"
            >
              {svc.badge && (
                <span className="absolute -top-3 right-6 bg-gradient-to-r from-[#D4AF37] to-[#8C6D1F] text-[#0F0B1E] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {svc.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                    {svc.category.toUpperCase()}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#FDFBF7] group-hover:text-[#F7DF94] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-[#D8C7A5]/80 leading-relaxed">
                    {svc.shortDescription}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-[#D4AF37]/10">
                  <p className="text-[11px] font-semibold text-[#D8C7A5] uppercase tracking-wide">
                    What’s Included:
                  </p>
                  <ul className="space-y-1.5">
                    {svc.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-[#D8C7A5]/90">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Price & CTA */}
              <div className="pt-6 mt-6 border-t border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-[#F7DF94]">₹{svc.discountedPrice || svc.price}</span>
                    {svc.discountedPrice && (
                      <span className="text-xs text-[#D8C7A5]/50 line-through">₹{svc.price}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#D8C7A5]/70 flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>{svc.deliveryTime || 'Instant Access'}</span>
                  </span>
                </div>

                <Link
                  href={
                    svc.category === 'consultation'
                      ? '/booking'
                      : svc.slug.includes('career')
                      ? '/reports/career'
                      : svc.slug.includes('marriage')
                      ? '/reports/marriage'
                      : svc.slug.includes('finance')
                      ? '/reports/finance'
                      : '/reports/premium-kundli'
                  }
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] text-xs font-bold hover:shadow-gold transition-all"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Guarantee Banner */}
        <div className="bg-[#150D2A] border border-[#D4AF37]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/40 flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#FDFBF7]">
                Authentic Astronomical Precision Guarantee
              </h4>
              <p className="text-xs text-[#D8C7A5]/70">
                All planetary degrees are computed via pure sidereal ephemeris mechanics with verifiable Lahiri Ayanamsa. We never fabricate coordinates or generate random predictions.
              </p>
            </div>
          </div>
          <Link
            href="/about"
            className="text-xs font-semibold text-[#D4AF37] hover:underline whitespace-nowrap"
          >
            Learn about our calculation principles →
          </Link>
        </div>
      </div>
    </div>
  );
}
