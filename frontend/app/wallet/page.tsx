'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getWalletBalance, updateWalletBalance } from '@/lib/auth';
import { User } from '@/lib/types';
import PaymentModal from '@/components/PaymentModal';
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
import { useLanguage } from '@/context/LanguageContext';

export default function WalletPage() {
  const router = useRouter();
  const { language, formatCurrency } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeRechargeAmount, setActiveRechargeAmount] = useState(500);

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-9841',
      description: language === 'mr' ? 'स्वागत बोनस ॲस्ट्रो क्रेडिट्स' : 'Welcome Bonus Astro Credits',
      amount: 500,
      type: 'credit',
      date: language === 'mr' ? 'आत्ताच' : 'Just now',
    },
    {
      id: 'TXN-8722',
      description: language === 'mr' ? 'कुंडली सल्लामसलत प्रोमो' : 'Kundli Consultation Promo',
      amount: 150,
      type: 'credit',
      date: language === 'mr' ? 'काल' : 'Yesterday',
    },
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
      alert(language === 'mr' ? 'किमान रिचार्ज रक्कम ₹५० आहे' : 'Minimum recharge amount is ₹50');
      return;
    }
    if (amt > 50000) {
      alert(language === 'mr' ? 'कमाल रिचार्ज रक्कम ₹५०,००० आहे' : 'Maximum recharge amount is ₹50,000');
      return;
    }

    setActiveRechargeAmount(amt);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    const amt = activeRechargeAmount;
    const nextBal = updateWalletBalance(amt);
    setBalance(nextBal);
    setTransactions((prev) => [
      {
        id: paymentData?.paymentId || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        description: language === 'mr' ? 'वॉलेट रिचार्ज (रेझरपे प्रमाणित)' : 'Wallet Balance Recharge (Razorpay Verified)',
        amount: amt,
        type: 'credit',
        date: language === 'mr' ? 'आत्ताच' : 'Just now',
      },
      ...prev,
    ]);
    setSuccessMessage(
      language === 'mr'
        ? `तुमच्या ज्योतिषवेद वॉलेटमध्ये ₹${amt} यशस्वीरीत्या जमा झाले!`
        : `Successfully added ₹${amt} to your JyotishVeda Wallet!`
    );
    setCustomAmount('');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Top Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E] mb-3">
              <Wallet className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{language === 'mr' ? 'ज्योतिषवेद सुरक्षित वॉलेट' : 'JyotishVeda Secure Wallet'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
              {language === 'mr' ? 'ज्योतिषी सल्लामसलत वॉलेट' : 'Astrologer Consultation Wallet'}
            </h1>
            <p className="text-xs sm:text-sm text-[#786C60] mt-1 max-w-lg leading-relaxed">
              {language === 'mr'
                ? 'वरिष्ठ ज्योतिषांशी थेट कॉल, चॅट आणि त्वरित कुंडली अहवालांसाठी क्रेडिट्स जमा करा.'
                : 'Preload credits for instant 1-on-1 calls, live chat with senior Acharyas, and express horoscope reports.'}
            </p>
          </div>

          <div className="bg-white border-2 border-[#D97706] rounded-2xl p-5 shadow-sm text-center w-full md:w-auto md:min-w-[220px]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B45309] block">
              {language === 'mr' ? 'उपलब्ध शिल्लक' : 'Available Balance'}
            </span>
            <span className="font-serif text-3xl font-extrabold text-[#D97706] block my-1">
              ₹{balance.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#786C60]">
              {user ? (language === 'mr' ? `खाते: ${user.username}` : `Account: ${user.username}`) : (language === 'mr' ? 'अतिथी सत्र' : 'Guest Session')}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Recharge Controls */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#2D1810] flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#D97706]" />
              <span>{language === 'mr' ? 'वॉलेटमध्ये शिल्लक जोडा' : 'Add Balance to Wallet'}</span>
            </h2>

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Quick Amount Options */}
            <div>
              <label className="block text-xs font-semibold text-[#5C4033] mb-2">
                {language === 'mr' ? 'रिचार्ज रक्कम निवडा (रुपये)' : 'Select Recharge Amount (INR)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-[#D97706] border-[#D97706] text-white shadow-md'
                        : 'bg-[#FFFDF9] border-[#EAE1D2] text-[#2D1810] hover:border-[#D97706]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-xs font-semibold text-[#5C4033] mb-1">
                {language === 'mr' ? 'किंवा इच्छित रक्कम टाका (किमान ₹५०)' : 'Or Enter Custom Amount (Min ₹50)'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#786C60] font-semibold text-sm">₹</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full pl-8 pr-4 py-2.5 bg-[#FFFDF9] border border-[#EAE1D2] rounded-xl text-sm focus:outline-none focus:border-[#D97706] text-[#2D1810]"
                />
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2] text-xs text-[#786C60] space-y-2">
              <div className="flex items-center justify-between text-[#2D1810] font-semibold">
                <span>{language === 'mr' ? 'स्वीकृत पेमेंट्स:' : 'Accepted Payment Gateways:'}</span>
                <span className="text-[#B45309] font-medium">UPI, Cards, NetBanking, Wallets</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {language === 'mr'
                  ? '२५६-बिट सुरक्षित रेझरपे पेमेंट गेटवे. कोणतेही छुपे शुल्क नाही.'
                  : 'Powered by secure Razorpay payment integration with 256-bit encryption. Zero hidden fees.'}
              </p>
            </div>

            <button
              onClick={handleRecharge}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>{language === 'mr' ? 'प्रक्रिया सुरू आहे...' : 'Securing Transaction...'}</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {language === 'mr'
                      ? `₹${customAmount ? customAmount : selectedAmount} जोडण्यासाठी पुढे जा`
                      : `Proceed to Add ₹${customAmount ? customAmount : selectedAmount}`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transaction History & Quick Actions */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2D1810] flex items-center justify-between">
              <span>{language === 'mr' ? 'अलीकडील व्यवहार' : 'Recent Transactions'}</span>
              <Clock className="w-4 h-4 text-[#786C60]" />
            </h3>

            <div className="divide-y divide-[#EAE1D2]/60 text-xs">
              {transactions.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between">
                  <div>
                    <strong className="block text-[#2D1810]">{t.description}</strong>
                    <span className="text-[10px] text-[#786C60]">{t.date} • {t.id}</span>
                  </div>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +₹{t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFF9EB] text-[#2D1810] p-6 rounded-2xl border border-[#FDE68A] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#92400E]">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <h4 className="font-serif text-sm font-bold">
                {language === 'mr' ? 'ज्योतिषांशी चर्चा करायची आहे?' : 'Need to Consult an Astrologer?'}
              </h4>
            </div>
            <p className="text-xs text-[#786C60] leading-relaxed">
              {language === 'mr'
                ? 'आपली शिल्लक वापरून सत्यापित वैदिक विद्वानांशी थेट कॉल किंवा चॅट बुक करा.'
                : 'Use your wallet balance to instantly book live video or chat consultations with verified Vedic scholars.'}
            </p>
            <Link
              href="/astrologers"
              className="inline-block mt-2 px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              {language === 'mr' ? 'विद्वान ज्योतिषी शोधा →' : 'Browse Verified Scholars →'}
            </Link>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        serviceTitle={language === 'mr' ? 'ज्योतिषवेदा वॉलेट रिचार्ज' : 'JyotishVeda Wallet Recharge'}
        amount={activeRechargeAmount}
        serviceType="wallet_recharge"
        referenceId="wallet"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
