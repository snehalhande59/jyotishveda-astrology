'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PRODUCTS_CATALOGUE, Product } from '@/lib/shop-data';
import { addToCart } from '@/lib/cart';
import { useLanguage } from '@/context/LanguageContext';
import {
  ChevronRight,
  ShoppingBag,
  Star,
  ShieldCheck,
  Sparkles,
  Check,
  Truck,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const product = PRODUCTS_CATALOGUE.find((p) => p.slug === slug) || PRODUCTS_CATALOGUE[0];

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans pb-24">
      {/* Breadcrumbs */}
      <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs text-[#786C60]">
            <Link href="/" className="hover:text-[#D97706]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <Link href="/shop" className="hover:text-[#D97706]">
              {isMr ? 'भांडार' : 'Shop'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <span className="text-[#D97706] font-semibold truncate max-w-xs">
              {isMr ? product.marathiName : product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Product Image Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl border border-[#EAE1D2] p-4 shadow-sm overflow-hidden aspect-square flex items-center justify-center relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute top-7 left-7 bg-[#D97706] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {product.discountPercent}% OFF
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-white p-3 rounded-2xl border border-[#EAE1D2]">
                <ShieldCheck className="w-5 h-5 text-[#D97706] mx-auto mb-1" />
                <strong className="block text-[11px] text-[#2D1810]">{isMr ? '१००% अस्सल' : '100% Authentic'}</strong>
                <span className="text-[10px] text-gray-500">{isMr ? 'लॅब प्रमाणित' : 'Lab Certified'}</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#EAE1D2]">
                <Sparkles className="w-5 h-5 text-[#D97706] mx-auto mb-1" />
                <strong className="block text-[11px] text-[#2D1810]">{isMr ? 'प्राण प्रतिष्ठित' : 'Consecrated'}</strong>
                <span className="text-[10px] text-gray-500">{isMr ? 'मंत्रोच्चार विधी' : 'Vedic Rituals'}</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#EAE1D2]">
                <Truck className="w-5 h-5 text-[#D97706] mx-auto mb-1" />
                <strong className="block text-[11px] text-[#2D1810]">{isMr ? 'विनामूल्य पाठवणी' : 'Free Delivery'}</strong>
                <span className="text-[10px] text-gray-500">{isMr ? '₹९९९ च्या वर' : 'Above ₹999'}</span>
              </div>
            </div>
          </div>

          {/* Product Information Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl border border-[#EAE1D2] p-6 sm:p-8 shadow-sm space-y-5">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1.5 text-xs">
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <strong className="text-[#2D1810]">{product.rating}</strong>
                  <span className="text-gray-400">({product.reviewCount} {isMr ? 'पुनरावलोकने' : 'reviews'})</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
                {isMr ? product.marathiName : product.name}
              </h1>

              {/* Pricing */}
              <div className="flex items-baseline space-x-3 pb-4 border-b border-[#F3ECE1]">
                <span className="font-serif text-3xl font-extrabold text-[#2D1810]">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {isMr ? `₹${product.originalPrice - product.price} बचत` : `Save ₹${product.originalPrice - product.price}`}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-emerald-700">
                  {isMr ? 'उपलब्ध (In Stock)' : 'In Stock'}
                </span>
                <span className="text-gray-400">• {product.stockCount} {isMr ? 'नग शिल्लक' : 'units left'}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#786C60] leading-relaxed">
                {isMr ? product.marathiDescription : product.description}
              </p>

              {/* Quantity & CTA Bar */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-bold text-[#5C4535]">{isMr ? 'प्रमाण:' : 'Quantity:'}</span>
                  <div className="flex items-center space-x-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-[#2D1810] hover:text-[#D97706] rounded-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold text-xs">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                      className="p-1 text-[#2D1810] hover:text-[#D97706] rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E] border-2 border-[#D97706]'
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-[#D97706]" />}
                    <span>{added ? (isMr ? 'कार्टमध्ये जोडले!' : 'Added to Cart!') : (isMr ? 'कार्टमध्ये जोडा' : 'Add to Cart')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="py-3.5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    {isMr ? 'आता खरेदी करा' : 'Buy Now'}
                  </button>
                </div>
              </div>

              {/* Vedic Consecration Details */}
              <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <strong className="text-[#92400E]">{isMr ? 'वेदशास्त्रोक्त प्राण प्रतिष्ठा विधी:' : 'Vedic Consecration Details:'}</strong>
                </div>
                <p className="text-[#785D46] leading-relaxed">
                  {product.vedicRitual}
                </p>
                <div className="pt-1 flex items-center space-x-1 text-[11px] text-[#92400E]">
                  <span>{isMr ? 'अधिष्ठात्री देवता:' : 'Presiding Deity:'}</span>
                  <strong className="underline">{product.deity}</strong>
                </div>
              </div>

              {/* Key Astrological Benefits */}
              <div className="space-y-2 pt-2">
                <strong className="block text-xs font-bold text-[#2D1810] uppercase tracking-wider">
                  {isMr ? 'प्रमुख आध्यात्मिक व ज्योतिषीय लाभ' : 'Key Astrological Benefits'}
                </strong>
                <ul className="space-y-1.5 text-xs text-[#786C60]">
                  {product.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-[#D97706] font-bold mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
