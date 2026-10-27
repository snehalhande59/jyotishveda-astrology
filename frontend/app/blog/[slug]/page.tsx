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
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#D4AF37] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 border-b border-[#D4AF37]/20 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{article.category || 'Vedic Wisdom'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold bg-gradient-to-r from-[#F7DF94] via-[#D4AF37] to-[#E5C058] bg-clip-text text-transparent leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#D8C7A5]/80 pt-2">
            <span className="flex items-center space-x-1.5">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span>{article.author || 'Vedic Scholar'}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>{article.readTime || '5 min read'}</span>
            </span>
          </div>
        </div>

        {/* Excerpt Lead */}
        {article.excerpt && (
          <p className="text-base sm:text-lg text-[#F7DF94]/90 font-serif italic border-l-2 border-[#D4AF37] pl-4 py-1 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Body Content */}
        <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#D8C7A5]/90 leading-relaxed space-y-6">
          <div className="whitespace-pre-line">
            {article.content}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-8 bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#FDFBF7]">
              Ready to explore your own celestial blueprint?
            </h4>
            <p className="text-xs text-[#D8C7A5]/80 mt-1">
              Generate your authentic Sidereal Kundli with exact degrees and Vimshottari Mahadasha timeline.
            </p>
          </div>
          <Link
            href="/kundli"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] text-xs font-bold hover:shadow-gold transition-all whitespace-nowrap"
          >
            Generate My Kundli
          </Link>
        </div>
      </div>
    </div>
  );
}
