'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getWalletBalance, updateWalletBalance } from '@/lib/auth';
import { User } from '@/lib/types';
import {
  Wallet,
  CreditCard,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [transactions, setTransactions] = useState([
    { id: 'TXN-9841', description: 'Welcome Bonus Astro Credits', amount: 500, type: 'credit', date: 'Just now' },
    { id: 'TXN-8722', description: 'Kundli Deep-Dive Consultation Promo', amount: 150, type: 'credit', date: 'Yesterday' },
  ]);

  useEffect(() => {
    const curUser = getCurrentUser();
    setUser(curUser);
    setBalance(getWalletBalance());

    const handleUpdate = () => setBalance(getWalletBalance());
    window.addEventListener('wallet-updated', handleUpdate);
    return () => window.removeEventListener('wallet-updated', handleUpdate);
  }, []);

  const handleRecharge = () => {
    const amt = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (isNaN(amt) || amt < 50) {
      alert('Minimum recharge amount is ₹50');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const nextBal = updateWalletBalance(amt);
      setBalance(nextBal);
      setTransactions((prev) => [
        {
          id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
          description: 'Wallet Balance Recharge (Razorpay Test)',
          amount: amt,
          type: 'credit',
          date: 'Just now',
        },
        ...prev,
      ]);
      setIsProcessing(false);
      setSuccessMessage(`Successfully added ₹${amt} to your JyotishVeda Wallet!`);
      setCustomAmount('');
      setTimeout(() => setSuccessMessage(null), 5000);
    }, 800);
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Top Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94] mb-3">
              <Wallet className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>JyotishVeda AstroPay Wallet</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              Astrologer Consultation Wallet
            </h1>
            <p className="text-xs sm:text-sm text-[#D8C7A5] mt-1 max-w-lg">
              Preload credits for instant 1-on-1 calls, live chat with senior Acharyas, and express horoscope reports.
            </p>
          </div>

          <div className="bg-[#191233] border-2 border-[#D4AF37] rounded-2xl p-5 shadow-cosmic text-center min-w-[200px]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
              Available Balance
            </span>
            <span className="font-serif text-3xl font-bold text-[#F7DF94] block my-1">
              ₹{balance.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#D8C7A5]/70">
              {user ? `Account: ${user.username}` : 'Guest Session'}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Recharge Controls */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#150D2A] flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#8C6D1F]" />
              <span>Add Balance to Wallet</span>
            </h2>

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Quick Amount Options */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Select Recharge Amount (INR)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-[#150D2A] border-[#D4AF37] text-[#F7DF94] shadow-md'
                        : 'bg-[#FAF6F0] border-gray-200 text-gray-800 hover:border-[#D4AF37]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Or Enter Custom Amount (Min ₹50)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full pl-8 pr-4 py-2.5 bg-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20 text-xs text-gray-600 space-y-2">
              <div className="flex items-center justify-between text-gray-900 font-semibold">
                <span>Payment Gateways:</span>
                <span className="text-[#8C6D1F]">UPI, Cards, NetBanking, Wallets</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Powered by secure Razorpay payment integration with 256-bit encryption. Zero hidden deduction fees.
              </p>
            </div>

            <button
              onClick={handleRecharge}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm rounded-xl shadow-gold hover:opacity-95 transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <span>Securing Transaction...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Proceed to Add ₹{customAmount ? customAmount : selectedAmount}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transaction History & Quick Actions */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/25 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#150D2A] flex items-center justify-between">
              <span>Recent Transactions</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </h3>

            <div className="divide-y divide-gray-100 text-xs">
              {transactions.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between">
                  <div>
                    <strong className="block text-gray-900">{t.description}</strong>
                    <span className="text-[10px] text-gray-500">{t.date} • {t.id}</span>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    +₹{t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#150D2A] text-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/30 shadow-cosmic space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#F7DF94]">Need to Consult an Astrologer?</h4>
            <p className="text-xs text-[#D8C7A5]/80 leading-relaxed">
              Use your wallet balance to instantly book live video or chat consultations with verified Vedic scholars.
            </p>
            <Link
              href="/astrologers"
              className="inline-block mt-2 px-4 py-2 bg-[#25184B] border border-[#D4AF37]/40 text-xs font-semibold text-[#F7DF94] rounded-lg hover:border-[#D4AF37]"
            >
              Browse Verified Scholars &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
