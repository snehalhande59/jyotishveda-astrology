'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FAQ } from '@/lib/types';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FaqPage() {
  const { language } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getFaqs();
        setFaqs(data || []);
      } catch (e) {
        console.warn('FAQ fetch error:', e);
      }
    }
    load();
  }, []);

  const categories = ['All', 'General', 'Kundli', 'Payments', 'Consultation'];

  const filtered = activeCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
          {language === 'mr' ? 'नेहमी विचारले जाणारे प्रश्न (FAQ)' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto mt-2 leading-relaxed">
          {language === 'mr'
            ? 'वैदिक ज्योतिष, खगोलीय सूत्रे, पेमेंट गेटवे आणि सल्लामसलत प्रक्रियेबद्दलचे सर्व प्रश्न.'
            : 'Clear answers regarding Vedic astrology, astronomical algorithms, payment gateways, and consultation procedures.'}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 pb-2 sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#D97706] text-white shadow-sm border border-[#D97706]'
                  : 'bg-white text-[#5C4033] border border-[#EAE1D2] hover:border-[#D97706]'
              }`}
            >
              {cat === 'All' ? (language === 'mr' ? 'सर्व' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filtered.map((faq, index) => (
            <div
              key={faq.id || index}
              className="bg-white border border-[#EAE1D2] rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-5 text-left flex justify-between items-center text-sm font-bold text-[#2D1810] hover:text-[#D97706] transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-xl font-bold text-[#D97706] ml-3">
                  {activeFaq === index ? '−' : '+'}
                </span>
              </button>
              {activeFaq === index && (
                <div className="px-5 pb-5 text-xs text-[#5C4033] leading-relaxed border-t border-[#EAE1D2] pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}