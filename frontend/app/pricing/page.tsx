'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AstrologyService } from '@/lib/types';
import { CheckCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedField } from '@/lib/translations';

export default function PricingPage() {
  const { t, language, formatCurrency } = useLanguage();
  const [services, setServices] = useState<AstrologyService[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (e) {
        console.warn('Error loading services:', e);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs text-[#F7DF94]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('pricing.badge')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            {t('pricing.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Reports Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isFeatured = service.isFeatured || index === 0;
            const title = getLocalizedField(service, 'title', language) || service.title;
            const shortDesc = getLocalizedField(service, 'shortDescription', language) || service.shortDescription;

            return (
              <div
                key={service.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  isFeatured
                    ? 'bg-[#150D2A] text-[#FDFBF7] border-2 border-[#D4AF37] shadow-cosmic scale-105'
                    : 'bg-white border border-[#D4AF37]/25 shadow-sm text-gray-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                        isFeatured
                          ? 'bg-[#25184B] text-[#D4AF37] border-[#D4AF37]/40'
                          : 'bg-[#FAF6F0] text-[#8C6D1F] border-[#D4AF37]/30'
                      }`}
                    >
                      {service.category}
                    </span>
                    {service.badge && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-serif text-2xl font-bold ${isFeatured ? 'text-[#FDFBF7]' : 'text-[#150D2A]'}`}>
                    {title}
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${isFeatured ? 'text-[#D8C7A5]/80' : 'text-gray-600'}`}>
                    {shortDesc}
                  </p>

                  <div className="mt-6 py-4 border-y border-[#D4AF37]/20 flex items-baseline space-x-2">
                    <span className="font-serif text-3xl font-bold text-[#D4AF37]">
                      {formatCurrency(service.discountedPrice || service.price)}
                    </span>
                    {service.discountedPrice && (
                      <span className={`text-xs line-through ${isFeatured ? 'text-gray-400' : 'text-gray-400'}`}>
                        {formatCurrency(service.price)}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 ml-auto">{t('pricing.oneTime')}</span>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs">
                    {service.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                        <span className={isFeatured ? 'text-[#D8C7A5]' : 'text-gray-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={service.slug === 'detailed-kundli' ? '/reports/premium-kundli' : `/reports/${service.slug}`}
                    className={`w-full block text-center py-3 rounded-xl font-serif font-bold text-xs tracking-wide shadow-gold transition-all ${
                      isFeatured
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E]'
                        : 'bg-[#150D2A] text-[#FDFBF7] hover:bg-[#8C6D1F]'
                    }`}
                  >
                    {t('pricing.selectPlan')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/20 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-1">
            <ShieldCheck className="w-6 h-6 text-[#8C6D1F] mx-auto" />
            <strong className="text-gray-900 block text-sm">{t('pricing.trustEncryption')}</strong>
            <p className="text-gray-600">{t('pricing.trustEncryptionDesc')}</p>
          </div>
          <div className="space-y-1">
            <Zap className="w-6 h-6 text-[#8C6D1F] mx-auto" />
            <strong className="text-gray-900 block text-sm">{t('pricing.trustInstant')}</strong>
            <p className="text-gray-600">{t('pricing.trustInstantDesc')}</p>
          </div>
          <div className="space-y-1">
            <Sparkles className="w-6 h-6 text-[#8C6D1F] mx-auto" />
            <strong className="text-gray-900 block text-sm">{t('pricing.trustScholar')}</strong>
            <p className="text-gray-600">{t('pricing.trustScholarDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
