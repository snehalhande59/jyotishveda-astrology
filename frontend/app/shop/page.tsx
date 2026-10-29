'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PRODUCTS_CATALOGUE,
  CRYSTAL_CATEGORIES,
  ZODIAC_COLLECTIONS,
  Product,
} from '@/lib/shop-data';
import { addToCart } from '@/lib/cart';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function ShopHomePage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Filter & Sort Products
  const filteredProducts = PRODUCTS_CATALOGUE.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      p.crystalType === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(q) ||
      p.marathiName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  const bestSellers = PRODUCTS_CATALOGUE.filter((p) => p.isBestSeller);
  const zodiacProducts = PRODUCTS_CATALOGUE.filter((p) => p.category === 'zodiac');

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans pb-24">
      {/* 1. PREMIUM PROMOTIONAL HERO BANNER */}
      <section className="bg-gradient-to-r from-[#FFFDF9] via-[#FFFBEB] to-[#FAF7F2] border-b border-[#EAE1D2] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>{isMr ? '१००% प्राण प्रतिष्ठित व सिद्ध रत्न' : '100% Consecrated Vedic Gemstones & Crystals'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D1810] leading-tight">
                {isMr ? (
                  <>ज्योतिषवेद <span className="text-[#D97706]">अध्यात्म व रत्न</span> भांडार</>
                ) : (
                  <>Sacred Vedic <span className="text-[#D97706]">Gemstones &amp; Crystals</span> Store</>
                )}
              </h1>

              <p className="text-sm sm:text-base text-[#786C60] max-w-xl leading-relaxed">
                {isMr
                  ? 'वेदशास्त्रोक्त विधीने प्राण प्रतिष्ठित केलेले अस्सल रुद्राक्ष, हीलिंग क्रिस्टल्स, श्रीयंत्र आणि राशी ब्रेसलेट्स. जीवनातील ग्रह दोषांचे निवारण आणि ऊर्जा वाढवण्यासाठी.'
                  : 'Pran Pratishtha consecrated by learned Vedic Pandits with Vedic Mantras. Certified natural crystals, Rudraksha, Yantras, and zodiac bracelets.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#all-products"
                  className="px-6 py-3 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {isMr ? 'सर्व उत्पादने पहा' : 'Explore All Products'}
                </a>
                <Link
                  href="/shop/category/pyrite"
                  className="px-6 py-3 rounded-full bg-white hover:bg-[#FFF9EB] border border-[#EAE1D2] text-[#2D1810] text-xs sm:text-sm font-bold transition-all"
                >
                  {isMr ? 'पायराइट संग्रह' : 'Pyrite Wealth Collection'}
                </Link>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#EAE1D2] shadow-2xl bg-white aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
                  alt="Natural Pyrite & Vedic Gemstones"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FCD34D] block">
                      {isMr ? 'आठवड्याची विशेष शिफारस' : 'Featured Recommendation'}
                    </span>
                    <h3 className="font-serif text-lg font-bold">Natural Golden Pyrite Cluster (Money Magnet)</h3>
                    <p className="text-xs text-gray-200 mt-0.5">₹1,299 <span className="line-through text-gray-400">₹1,999</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HORIZONTAL BENEFITS TICKER */}
      <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[#2D1810]">{isMr ? '१००% प्राण प्रतिष्ठित' : '100% Consecrated'}</strong>
                <span className="text-[11px] text-[#786C60]">{isMr ? 'वेदशास्त्रोक्त विधी' : 'Energized by Vedic Pandits'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[#2D1810]">{isMr ? 'प्रमाणित शुद्धता' : 'Certified Natural'}</strong>
                <span className="text-[11px] text-[#786C60]">{isMr ? 'लॅब चाचणी अहवाल' : 'Gemological Lab Certified'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[#2D1810]">{isMr ? 'सुरक्षित वितरण' : 'Discreet & Insured'}</strong>
                <span className="text-[11px] text-[#786C60]">{isMr ? 'संपूर्ण भारतात पाठवणी' : 'Fast Delivery Across India'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[#2D1810]">{isMr ? '७ दिवसांची खात्री' : '7-Day Return Policy'}</strong>
                <span className="text-[11px] text-[#786C60]">{isMr ? 'विश्वासार्ह सेवा' : '100% Peace of Mind'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SHOP BY CRYSTALS SECTION (8 CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
              {isMr ? 'क्रिस्टल्स श्रेणी' : 'Healing Crystals Matrix'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
              {isMr ? 'क्रिस्टल्सनुसार खरेदी करा' : 'Shop by Crystals'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CRYSTAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/category/${cat.slug}`}
              className="group bg-white rounded-2xl border border-[#EAE1D2] p-3 text-center shadow-sm hover:shadow-lg hover:border-[#D97706] transition-all flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden mb-2 border border-[#EAE1D2] group-hover:scale-105 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <strong className="text-xs font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors block">
                {isMr ? cat.marathiName : cat.name}
              </strong>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. ZODIAC BESTSELLERS (12 RASHIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
              {isMr ? 'राशी ब्रेसलेट्स' : 'Astrological Alignment'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
              {isMr ? '१२ राशींचे विशेष ब्रेसलेट्स' : 'Zodiac Bestsellers (12 Signs)'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {zodiacProducts.slice(0, 12).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-[#EAE1D2] p-2.5 sm:p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <Link href={`/shop/product/${prod.slug}`} className="block">
                <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-[#FAF7F2] border border-[#F3ECE1]">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full inline-block mb-1">
                  {prod.zodiacSign}
                </span>
                <h4 className="text-xs font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors line-clamp-1">
                  {isMr ? prod.marathiName : prod.name}
                </h4>
              </Link>

              <div className="mt-3 pt-2 border-t border-[#F5EFE6] flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-[#2D1810]">₹{prod.price}</span>
                  <span className="text-[10px] text-gray-400 line-through ml-1">₹{prod.originalPrice}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(prod, e)}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    addedIds[prod.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#D97706] hover:bg-[#B45309] text-white'
                  }`}
                  title="Add to Cart"
                >
                  {addedIds[prod.id] ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
              {isMr ? 'सर्वाधिक लोकप्रिय' : 'Highly Recommended'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
              {isMr ? 'सर्वोत्कृष्ट विक्री उत्पादने' : 'Best Sellers'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-[#EAE1D2] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#D97706] transition-all flex flex-col justify-between group"
            >
              <Link href={`/shop/product/${prod.slug}`} className="block">
                <div className="aspect-[4/3] overflow-hidden bg-[#FAF7F2] relative">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 left-3 bg-[#D97706] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {prod.discountPercent}% OFF
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-[#2D1810]">{prod.rating}</span>
                    <span className="text-gray-400 text-[11px]">({prod.reviewCount})</span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors line-clamp-2">
                    {isMr ? prod.marathiName : prod.name}
                  </h3>

                  <p className="text-xs text-[#786C60] line-clamp-2 leading-relaxed">
                    {isMr ? prod.marathiDescription : prod.description}
                  </p>
                </div>
              </Link>

              <div className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <span className="font-serif text-xl font-extrabold text-[#2D1810]">₹{prod.price}</span>
                  <span className="text-xs text-gray-400 line-through ml-1.5">₹{prod.originalPrice}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(prod, e)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    addedIds[prod.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#D97706] hover:bg-[#B45309] text-white shadow-sm'
                  }`}
                >
                  {addedIds[prod.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isMr ? 'जोडले!' : 'Added'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isMr ? 'कार्टमध्ये जोडा' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ALL PRODUCTS SECTION (SEARCH, FILTERS, & SORTING) */}
      <section id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="border-t border-[#EAE1D2] pt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
                {isMr ? 'संपूर्ण भांडार' : 'Full Catalogue'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
                {isMr ? 'सर्व अध्यात्मिक उत्पादने' : 'All Products'}
              </h2>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isMr ? 'उत्पादन शोधा...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none w-full sm:w-60 shadow-sm"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none shadow-sm flex-shrink-0"
              >
                <option value="featured">{isMr ? 'विशेष शिफारस' : 'Featured'}</option>
                <option value="price-low">{isMr ? 'किंमत: कमी ते जास्त' : 'Price: Low to High'}</option>
                <option value="price-high">{isMr ? 'किंमत: जास्त ते कमी' : 'Price: High to Low'}</option>
                <option value="rating">{isMr ? 'ग्राहक रेटिंग' : 'Customer Rating'}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 pb-4 mb-6 text-xs">
            {[
              { id: 'all', label: isMr ? 'सर्व उत्पादने' : 'All Products' },
              { id: 'crystal', label: isMr ? 'क्रिस्टल्स व खडे' : 'Crystals' },
              { id: 'zodiac', label: isMr ? 'राशी ब्रेसलेट्स' : 'Zodiac Bracelets' },
              { id: 'rudraksha', label: isMr ? 'रुद्राक्ष' : 'Rudraksha' },
              { id: 'yantra', label: isMr ? 'यंत्रे' : 'Yantras' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-[#D97706] text-white shadow-sm'
                    : 'bg-white text-[#5C4535] border border-[#EAE1D2] hover:bg-[#FFF9EB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE1D2] p-12 text-center max-w-md mx-auto my-8">
              <ShoppingBag className="w-12 h-12 text-[#D97706]/50 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-[#2D1810]">
                {isMr ? 'कोणतीही उत्पादने आढळली नाहीत' : 'No Products Found'}
              </h3>
              <p className="text-xs text-[#786C60] mt-1">
                {isMr ? 'कृपया वेगळा शोध शब्द किंवा श्रेणी निवडून पुन्हा प्रयत्न करा.' : 'Please try adjusting your search terms or filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-[#EAE1D2] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#D97706] transition-all flex flex-col justify-between group"
                >
                  <Link href={`/shop/product/${prod.slug}`} className="block">
                    <div className="aspect-[4/3] overflow-hidden bg-[#FAF7F2] relative">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-3 left-3 bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {prod.discountPercent}% OFF
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center space-x-1 text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-[#2D1810]">{prod.rating}</span>
                        <span className="text-gray-400 text-[11px]">({prod.reviewCount})</span>
                      </div>

                      <h3 className="font-serif text-sm font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors line-clamp-2">
                        {isMr ? prod.marathiName : prod.name}
                      </h3>

                      <p className="text-xs text-[#786C60] line-clamp-2 leading-relaxed">
                        {isMr ? prod.marathiDescription : prod.description}
                      </p>
                    </div>
                  </Link>

                  <div className="p-4 pt-0 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-lg font-extrabold text-[#2D1810]">₹{prod.price}</span>
                      <span className="text-xs text-gray-400 line-through ml-1.5">₹{prod.originalPrice}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(prod, e)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        addedIds[prod.id]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#D97706] hover:bg-[#B45309] text-white shadow-sm'
                      }`}
                    >
                      {addedIds[prod.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isMr ? 'जोडले!' : 'Added'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isMr ? 'जोडा' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
