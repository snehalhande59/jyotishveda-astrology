import React from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Sparkles, BookOpen, Clock, User, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
  const articles = await api.getArticles();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Vedic Shastra &amp; Wisdom</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2D1810]">
            Astrology Articles &amp; Insights
          </h1>
          <p className="text-[#786C60] text-sm sm:text-base leading-relaxed">
            Scholarly explorations into sidereal planetary mechanics, classical Parashari principles, Vimshottari cycles, and metaphysical foundations of Vedic Jyotish.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art: any) => (
            <article
              key={art.id}
              className="bg-white border border-[#EAE1D2] rounded-2xl overflow-hidden hover:border-[#D97706] transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-xs text-[#B45309]">
                  <span className="font-bold uppercase tracking-wider bg-[#FFFBEB] px-2.5 py-0.5 rounded border border-[#FDE68A]">
                    {art.category || 'Vedic Wisdom'}
                  </span>
                  <span className="flex items-center space-x-1 text-[#786C60]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime || '5 min read'}</span>
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors leading-snug">
                  <Link href={`/blog/${art.slug}`}>
                    {art.title}
                  </Link>
                </h3>

                <p className="text-xs text-[#786C60] leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="p-6 pt-0 border-t border-[#EAE1D2] flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-xs text-[#786C60]">
                  <User className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{art.author || 'Vedic Scholar'}</span>
                </div>
                <Link
                  href={`/blog/${art.slug}`}
                  className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center space-x-1"
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