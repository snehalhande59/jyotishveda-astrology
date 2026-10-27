'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import PaymentModal from '@/components/PaymentModal';
import NorthIndianChart from '@/components/NorthIndianChart';
import SouthIndianChart from '@/components/SouthIndianChart';
import { Sparkles, CheckCircle, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export default function PremiumKundliReportPage() {
  const [formData, setFormData] = useState<BirthFormData | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [purchasedReport, setPurchasedReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const price = 1999;
  const discountedPrice = 1499;

  const handleFormSubmit = (data: BirthFormData) => {
    setFormData(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!formData) return;
    setLoading(true);
    try {
      const report = await api.generateReport('premium-kundli', formData, true, paymentData.paymentId);
      setPurchasedReport(report);
    } catch (e: any) {
      alert(e.message || 'Error generating report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs text-[#F7DF94]">
            <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Exhaustive 50-Page Life Roadmap</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Premium Detailed Kundli Report
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto">
            Our most exhaustive Jyotish reading covering all 12 houses, full Vimshottari Mahadasha timeline, planetary strengths, and personalized gemstone prescriptions.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {purchasedReport ? (
          <div className="bg-[#150D2A] text-[#FDFBF7] p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-cosmic space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-[#D4AF37]/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Premium Life Dossier</span>
                <h2 className="font-serif text-3xl font-bold text-[#F7DF94] mt-1">{purchasedReport.title}</h2>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
                Purchased &amp; Active
              </span>
            </div>

            <div className="p-4 bg-[#0F0B1E] rounded-xl border border-[#D4AF37]/20 text-xs space-y-2">
              <h4 className="font-serif text-base font-bold text-[#F7DF94]">Executive Planetary Summary</h4>
              <p className="text-[#D8C7A5] leading-relaxed">{purchasedReport.reportContent.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#191233] rounded-xl border border-[#D4AF37]/20">
                <strong className="text-[#F7DF94] text-sm block mb-1">Dharma (Soul Purpose)</strong>
                <p className="text-[#D8C7A5]">{purchasedReport.reportContent.lifeThemes?.dharma}</p>
              </div>
              <div className="p-4 bg-[#191233] rounded-xl border border-[#D4AF37]/20">
                <strong className="text-[#F7DF94] text-sm block mb-1">Artha (Wealth Mastery)</strong>
                <p className="text-[#D8C7A5]">{purchasedReport.reportContent.lifeThemes?.artha}</p>
              </div>
              <div className="p-4 bg-[#191233] rounded-xl border border-[#D4AF37]/20">
                <strong className="text-[#F7DF94] text-sm block mb-1">Kama (Desire &amp; Love)</strong>
                <p className="text-[#D8C7A5]">{purchasedReport.reportContent.lifeThemes?.kama}</p>
              </div>
              <div className="p-4 bg-[#191233] rounded-xl border border-[#D4AF37]/20">
                <strong className="text-[#F7DF94] text-sm block mb-1">Moksha (Liberation)</strong>
                <p className="text-[#D8C7A5]">{purchasedReport.reportContent.lifeThemes?.moksha}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <BirthDetailsForm
                onSubmit={handleFormSubmit}
                isLoading={loading}
                buttonText={`Unlock Premium Detailed Kundli — ₹${discountedPrice}`}
                showGender={true}
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-[#8C6D1F] uppercase font-bold tracking-wider">
                      Flagship Report
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#150D2A] mt-1">What You Receive</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 line-through">₹{price}</span>
                    <div className="font-serif text-2xl font-bold text-[#150D2A]">₹{discountedPrice}</div>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-700">
                  {[
                    '50+ Pages of Deep Planetary Interpretation',
                    'Both North and South Indian style visualizations',
                    'Complete 12 Bhavas (Houses) granular breakdown',
                    'Full 120-Year Vimshottari Mahadasha & Antardasha schedule',
                    'Sade Sati, Dhaiya, and Manglik Dosha evaluation',
                    'Specific Gemstone, Rudraksha, and Vedic Mantra remedies',
                    'Instant online portal access and printable dossier',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/25 text-xs text-gray-600 space-y-2">
                  <div className="flex items-center space-x-2 text-[#8C6D1F] font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pure Sidereal Mathematics</span>
                  </div>
                  <p>Guaranteed authentic astronomical calculations based on Lahiri Chitrapaksha standard.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        serviceTitle="Premium Detailed Kundli Report"
        amount={discountedPrice}
        serviceType="report"
        referenceId="premium-kundli"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
