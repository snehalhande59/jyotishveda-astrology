'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartTotals,
  CartItem,
} from '@/lib/cart';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function CartPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState(getCartTotals());

  useEffect(() => {
    const current = getCart();
    setItems(current);
    setTotals(getCartTotals(current));

    const handleUpdate = () => {
      const updated = getCart();
      setItems(updated);
      setTotals(getCartTotals(updated));
    };

    window.addEventListener('cart-updated', handleUpdate);
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, []);

  const handleQtyChange = (productId: string, newQty: number) => {
    const updated = updateCartQuantity(productId, newQty);
    setItems(updated);
    setTotals(getCartTotals(updated));
  };

  const handleRemove = (productId: string) => {
    const updated = removeFromCart(productId);
    setItems(updated);
    setTotals(getCartTotals(updated));
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans pb-24">
      {/* Header */}
      <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs text-[#786C60] mb-2">
            <Link href="/" className="hover:text-[#D97706]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <Link href="/shop" className="hover:text-[#D97706]">
              {isMr ? 'भांडार' : 'Shop'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <span className="text-[#D97706] font-semibold">{isMr ? 'खरेदी टोपली' : 'Shopping Cart'}</span>
          </nav>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
            {isMr ? 'तुमची खरेदी टोपली' : 'Your Shopping Cart'} ({totals.totalItems})
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EAE1D2] p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <ShoppingBag className="w-16 h-16 text-[#D97706]/40 mx-auto mb-4" />
            <h2 className="font-serif font-bold text-xl text-[#2D1810]">
              {isMr ? 'तुमची खरेदी टोपली रिकामी आहे' : 'Your Shopping Cart is Empty'}
            </h2>
            <p className="text-xs text-[#786C60] mt-1 mb-6">
              {isMr
                ? 'अद्याप कोणतेही रत्न किंवा रुद्राक्ष जोडलेले नाही.'
                : 'Explore our consecrated collection of natural healing crystals and Vedic gems.'}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-all shadow-md"
            >
              <span>{isMr ? 'भांडार पहा' : 'Browse Astrology Shop'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-[#EAE1D2] p-4 sm:p-6 shadow-sm space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F5EFE6] last:border-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EAE1D2] flex-shrink-0">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/shop/product/${product.slug}`}
                          className="font-serif font-bold text-sm text-[#2D1810] hover:text-[#D97706] transition-colors line-clamp-1"
                        >
                          {isMr ? product.marathiName : product.name}
                        </Link>
                        <span className="text-[11px] text-gray-500 block mt-0.5">
                          {isMr ? 'किंमत:' : 'Price:'} ₹{product.price}
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] mt-1">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-4">
                      {/* Qty Selector */}
                      <div className="flex items-center space-x-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, quantity - 1)}
                          className="p-1 text-[#2D1810] hover:text-[#D97706]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-bold text-xs">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, quantity + 1)}
                          className="p-1 text-[#2D1810] hover:text-[#D97706]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <span className="font-serif font-bold text-sm text-[#2D1810] w-16 sm:w-20 text-right">
                        ₹{product.price * quantity}
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(product.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Shipping Notification Bar */}
              <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span className="text-[#785D46]">
                    {totals.subtotal >= 999
                      ? (isMr ? 'अभिनंदन! तुमची ऑर्डर मोफत पाठवणीसाठी पात्र आहे.' : 'Congratulations! Your order qualifies for Free Insured Delivery.')
                      : (isMr ? `आणखी ₹${999 - totals.subtotal} ची खरेदी करा आणि विनामूल्य पाठवणी मिळवा!` : `Add ₹${999 - totals.subtotal} more to unlock Free Insured Delivery!`)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-[#EAE1D2] p-4 sm:p-6 shadow-sm space-y-5 static lg:sticky lg:top-24">
                <h3 className="font-serif font-bold text-base text-[#2D1810] pb-3 border-b border-[#F3ECE1]">
                  {isMr ? 'ऑर्डर सारांश' : 'Order Summary'}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#5C4535]">
                    <span>{isMr ? 'उपएकूण (Subtotal):' : 'Cart Subtotal:'}</span>
                    <strong className="text-[#2D1810]">₹{totals.subtotal}</strong>
                  </div>

                  <div className="flex justify-between text-[#5C4535]">
                    <span>{isMr ? 'सुरक्षित पाठवणी:' : 'Insured Shipping:'}</span>
                    <strong className={totals.shipping === 0 ? 'text-emerald-700' : 'text-[#2D1810]'}>
                      {totals.shipping === 0 ? (isMr ? 'मोफत' : 'FREE') : `₹${totals.shipping}`}
                    </strong>
                  </div>

                  <div className="flex justify-between text-[#5C4535]">
                    <span>{isMr ? 'वैदिक सेवा व विमा (३%):' : 'Vedic Seva & Transit Insurance (3%):'}</span>
                    <strong className="text-[#2D1810]">₹{totals.tax}</strong>
                  </div>

                  <div className="pt-3 border-t border-[#F3ECE1] flex justify-between items-baseline">
                    <span className="font-serif font-bold text-sm text-[#2D1810]">{isMr ? 'एकूण देय रक्कम:' : 'Total Payable:'}</span>
                    <span className="font-serif text-2xl font-extrabold text-[#D97706]">
                      ₹{totals.total}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>{isMr ? 'सुरक्षित चेकआउटकडे जा' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-[#786C60] flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isMr ? 'सुरक्षित रेझरपे पेमेंट गेटवे' : '100% Secure Razorpay Checkout'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
