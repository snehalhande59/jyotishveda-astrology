'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  PRODUCTS_CATALOGUE,
  CRYSTAL_CATEGORIES,
  Product,
} from '@/lib/shop-data';
import { addToCart } from '@/lib/cart';
import { useLanguage } from '@/context/LanguageContext';
import {
  ChevronRight,
  ShoppingBag,
  Star,
  Check,
  Sparkles,
} from 'lucide-react';

export default function ShopCategoryPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const categoryInfo = CRYSTAL_CATEGORIES.find((c) => c.slug === slug);
  const products = PRODUCTS_CATALOGUE.filter(
    (p) => p.crystalType === slug || p.category === slug
  );

  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans pb-24">
      {/* Header */}
      <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs text-[#786C60] mb-3">
            <Link href="/" className="hover:text-[#D97706]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <Link href="/shop" className="hover:text-[#D97706]">
              {isMr ? 'भांडार' : 'Shop'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <span className="text-[#D97706] font-semibold">
              {categoryInfo ? (isMr ? categoryInfo.marathiName : categoryInfo.name) : slug}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
                {categoryInfo ? (isMr ? categoryInfo.marathiName : categoryInfo.name) : slug}
              </h1>
              <p className="text-xs sm:text-sm text-[#786C60] mt-1 max-w-xl">
                {categoryInfo?.subtitle || (isMr ? 'प्राण प्रतिष्ठित नैसर्गिक रत्ने' : 'Authentic Consecrated Crystals')}
              </p>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{products.length} {isMr ? 'उत्पादने उपलब्ध' : 'Products Available'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EAE1D2] p-12 text-center max-w-md mx-auto my-12">
            <ShoppingBag className="w-12 h-12 text-[#D97706]/40 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#2D1810]">
              {isMr ? 'या श्रेणीत सध्या उत्पादने उपलब्ध नाहीत' : 'No Products Currently in this Category'}
            </h3>
            <p className="text-xs text-[#786C60] mt-1 mb-4">
              {isMr
                ? 'लवकरच नवीन माल प्राण प्रतिष्ठेनंतर जोडला जाईल. कृपया इतर श्रेणी पहा.'
                : 'New authentic lots are being consecrated and will be listed shortly.'}
            </p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-all"
            >
              {isMr ? 'सर्व उत्पादने पहा' : 'Browse All Products'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
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
    </div>
  );
}
