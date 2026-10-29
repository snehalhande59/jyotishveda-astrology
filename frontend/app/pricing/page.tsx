'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AstrologyService } from '@/lib/types';
import { CheckCircle2, Sparkles, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
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
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t('pricing.badge')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {t('pricing.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Reports Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {services.map((service, index) => {
            const isFeatured = service.isFeatured || index === 0;
            const title = getLocalizedField(service, 'title', language) || service.title;
            const shortDesc = getLocalizedField(service, 'shortDescription', language) || service.shortDescription;

            return (
              <div
                key={service.id}
                className={`rounded-3xl p-5 sm:p-8 flex flex-col justify-between transition-all ${
                  isFeatured
                    ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FFFBEB] border-2 border-[#F59E0B] shadow-md md:scale-105'
                    : 'bg-white border border-[#EAE1D2] shadow-sm text-[#2D1810]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                        isFeatured
                          ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                          : 'bg-[#FAF7F2] text-[#786C60] border-[#EAE1D2]'
                      }`}
                    >
                      {service.category}
                    </span>
                    {service.badge && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#2D1810]">
                    {title}
                  </h3>
                  <p className="text-xs mt-2 leading-relaxed text-[#6B5A4E]">
                    {shortDesc}
                  </p>

                  <div className="mt-6 py-4 border-y border-[#F5EFE6] flex items-baseline space-x-2">
                    <span className="font-serif text-3xl font-extrabold text-[#B45309]">
                      {formatCurrency(service.discountedPrice || service.price)}
                    </span>
                    {service.discountedPrice && (
                      <span className="text-xs line-through text-[#786C60]/60">
                        {formatCurrency(service.price)}
                      </span>
                    )}
                    <span className="text-[10px] text-[#786C60] ml-auto">{t('pricing.oneTime')}</span>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs">
                    {service.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2.5 text-[#4A2E18]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={service.slug === 'detailed-kundli' ? '/reports/premium-kundli' : `/reports/${service.slug}`}
                    className="w-full block text-center py-3.5 rounded-xl font-serif font-bold text-xs tracking-wide bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all"
                  >
                    {t('pricing.selectPlan')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto text-[#D97706] shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <strong className="text-[#2D1810] block text-sm font-bold">{t('pricing.trustEncryption')}</strong>
            <p className="text-[#786C60] leading-relaxed">{t('pricing.trustEncryptionDesc')}</p>
          </div>
          <div className="space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto text-[#D97706] shadow-2xs">
              <Zap className="w-6 h-6" />
            </div>
            <strong className="text-[#2D1810] block text-sm font-bold">{t('pricing.trustInstant')}</strong>
            <p className="text-[#786C60] leading-relaxed">{t('pricing.trustInstantDesc')}</p>
          </div>
          <div className="space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto text-[#D97706] shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <strong className="text-[#2D1810] block text-sm font-bold">{t('pricing.trustScholar')}</strong>
            <p className="text-[#786C60] leading-relaxed">{t('pricing.trustScholarDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
