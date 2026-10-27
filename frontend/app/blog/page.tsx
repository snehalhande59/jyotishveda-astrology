import React from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Sparkles, BookOpen, Clock, User, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
  const articles = await api.getArticles();

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Vedic Shastra & Wisdom</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold bg-gradient-to-r from-[#F7DF94] via-[#D4AF37] to-[#E5C058] bg-clip-text text-transparent">
            Astrology Articles & Insights
          </h1>
          <p className="text-[#D8C7A5]/80 text-sm sm:text-base leading-relaxed">
            Scholarly explorations into sidereal planetary mechanics, classical Parashari principles, Vimshottari cycles, and metaphysical foundations of Vedic Jyotish.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art: any) => (
            <article
              key={art.id}
              className="bg-[#191233]/70 border border-[#D4AF37]/25 rounded-2xl overflow-hidden hover:border-[#D4AF37] transition-all hover:shadow-gold flex flex-col justify-between group"
            >
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                  <span className="font-semibold uppercase tracking-wider bg-[#25184B] px-2.5 py-0.5 rounded border border-[#D4AF37]/20">
                    {art.category || 'Vedic Wisdom'}
                  </span>
                  <span className="flex items-center space-x-1 text-[#D8C7A5]/70">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime || '5 min read'}</span>
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#FDFBF7] group-hover:text-[#F7DF94] transition-colors leading-snug">
                  <Link href={`/blog/${art.slug}`}>
                    {art.title}
                  </Link>
                </h3>

                <p className="text-xs text-[#D8C7A5]/80 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="p-6 pt-0 border-t border-[#D4AF37]/10 flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-xs text-[#D8C7A5]/70">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{art.author || 'Vedic Scholar'}</span>
                </div>
                <Link
                  href={`/blog/${art.slug}`}
                  className="text-xs font-bold text-[#D4AF37] hover:text-[#F7DF94] flex items-center space-x-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
