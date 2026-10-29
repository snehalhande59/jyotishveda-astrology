import React from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Sparkles, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await api.getServices();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Authenticated Vedic Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2D1810]">
            Astrology Services &amp; Consultations
          </h1>
          <p className="text-[#786C60] text-sm sm:text-base leading-relaxed">
            Every service is computed using the authoritative Chitrapaksha / Lahiri Sidereal ephemeris, delivering pure mathematical astronomical coordinates paired with nuanced interpretive wisdom.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border border-[#EAE1D2] rounded-2xl p-6 flex flex-col justify-between hover:border-[#D97706] transition-all hover:shadow-md duration-300 relative group"
            >
              {svc.badge && (
                <span className="absolute -top-3 right-6 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {svc.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                    {svc.category.toUpperCase()}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-[#786C60] leading-relaxed">
                    {svc.shortDescription}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-[#EAE1D2]">
                  <p className="text-[11px] font-bold text-[#5C4033] uppercase tracking-wide">
                    What’s Included:
                  </p>
                  <ul className="space-y-1.5">
                    {svc.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-[#5C4033]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Price & CTA */}
              <div className="pt-6 mt-6 border-t border-[#EAE1D2] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-[#D97706]">₹{svc.discountedPrice || svc.price}</span>
                    {svc.discountedPrice && (
                      <span className="text-xs text-[#786C60] line-through">₹{svc.price}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#786C60] flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#D97706]" />
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
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Guarantee Banner */}
        <div className="bg-[#FFF9EB] border border-[#FDE68A] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#FDE68A] flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#D97706]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#2D1810]">
                Authentic Astronomical Precision Guarantee
              </h4>
              <p className="text-xs text-[#786C60]">
                All planetary degrees are computed via pure sidereal ephemeris mechanics with verifiable Lahiri Ayanamsa. We never fabricate coordinates or generate random predictions.
              </p>
            </div>
          </div>
          <Link
            href="/about"
            className="text-xs font-bold text-[#D97706] hover:underline whitespace-nowrap"
          >
            Learn about our calculation principles →
          </Link>
        </div>
      </div>
    </div>
  );
}