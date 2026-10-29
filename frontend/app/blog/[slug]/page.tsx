import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Clock, User, Sparkles, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await api.getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#D97706] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 border-b border-[#EAE1D2] pb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{article.category || 'Vedic Wisdom'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2D1810] leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#786C60] pt-2">
            <span className="flex items-center space-x-1.5">
              <User className="w-4 h-4 text-[#D97706]" />
              <span>{article.author || 'Vedic Scholar'}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <span>{article.readTime || '5 min read'}</span>
            </span>
          </div>
        </div>

        {/* Excerpt Lead */}
        {article.excerpt && (
          <p className="text-base sm:text-lg text-[#5C4033] font-serif italic border-l-4 border-[#D97706] pl-4 py-1 leading-relaxed bg-[#FFFDF9] p-4 rounded-r-xl border border-[#EAE1D2]">
            {article.excerpt}
          </p>
        )}

        {/* Body Content */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#EAE1D2] shadow-sm max-w-none text-sm sm:text-base text-[#5C4033] leading-relaxed space-y-6">
          <div className="whitespace-pre-line leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-8 bg-[#FFF9EB] border border-[#FDE68A] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2D1810]">
              Ready to explore your own celestial blueprint?
            </h4>
            <p className="text-xs text-[#786C60] mt-1">
              Generate your authentic Sidereal Kundli with exact degrees and Vimshottari Mahadasha timeline.
            </p>
          </div>
          <Link
            href="/kundli"
            className="px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all whitespace-nowrap"
          >
            Generate My Kundli
          </Link>
        </div>
      </div>
    </div>
  );
}