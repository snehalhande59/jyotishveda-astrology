'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FAQ } from '@/lib/types';
import { HelpCircle, Sparkles } from 'lucide-react';

export default function FaqPage() {
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
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto mt-2">
          Clear answers regarding Vedic astrology, astronomical algorithms, payment gateways, and consultation procedures.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#150D2A] text-[#F7DF94] border border-[#D4AF37]'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF37]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filtered.map((faq, index) => (
            <div
              key={faq.id || index}
              className="bg-white border border-[#D4AF37]/25 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-5 text-left flex justify-between items-center text-sm font-semibold text-[#150D2A] hover:text-[#8C6D1F]"
              >
                <span>{faq.question}</span>
                <span className="text-xl font-bold text-[#8C6D1F] ml-3">
                  {activeFaq === index ? '−' : '+'}
                </span>
              </button>
              {activeFaq === index && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
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
