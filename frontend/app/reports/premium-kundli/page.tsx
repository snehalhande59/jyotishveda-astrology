'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import PaymentModal from '@/components/PaymentModal';
import NorthIndianChart from '@/components/NorthIndianChart';
import SouthIndianChart from '@/components/SouthIndianChart';
import { Sparkles, CheckCircle, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PremiumKundliReportPage() {
  const { language } = useLanguage();
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
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <FileText className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'संपूर्ण ५० पानी सविस्तर जीवन अहवाल' : 'Exhaustive 50-Page Life Roadmap'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'प्रीमियम सविस्तर कुंडली अहवाल' : 'Premium Detailed Kundli Report'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'सर्व १२ भावांचे सखोल विश्लेषण, १२० वर्षांची विंशोत्तरी महादशा, ग्रहांचे बलाबल आणि रत्न मार्गदर्शन.'
              : 'Our most exhaustive Jyotish reading covering all 12 houses, full Vimshottari Mahadasha timeline, planetary strengths, and personalized gemstone prescriptions.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {purchasedReport ? (
          <div className="bg-white text-[#2D1810] p-8 sm:p-10 rounded-2xl border-2 border-[#D97706] shadow-md space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-[#EAE1D2]">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {language === 'mr' ? 'प्रीमियम जीवन अहवाल' : 'Premium Life Dossier'}
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#2D1810] mt-1">{purchasedReport.title}</h2>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                {language === 'mr' ? 'खरेदी केलेले आणि सक्रिय' : 'Purchased & Active'}
              </span>
            </div>

            <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2] text-xs space-y-2">
              <h4 className="font-serif text-base font-bold text-[#B45309]">
                {language === 'mr' ? 'मुख्य ग्रह सारांश' : 'Executive Planetary Summary'}
              </h4>
              <p className="text-[#5C4033] leading-relaxed">{purchasedReport.reportContent.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <strong className="text-[#B45309] text-sm block mb-1">
                  {language === 'mr' ? 'धर्म (आत्मिक उद्दिष्ट)' : 'Dharma (Soul Purpose)'}
                </strong>
                <p className="text-[#5C4033]">{purchasedReport.reportContent.lifeThemes?.dharma}</p>
              </div>
              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <strong className="text-[#B45309] text-sm block mb-1">
                  {language === 'mr' ? 'अर्थ (संपत्ती आणि कार्य)' : 'Artha (Wealth Mastery)'}
                </strong>
                <p className="text-[#5C4033]">{purchasedReport.reportContent.lifeThemes?.artha}</p>
              </div>
              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <strong className="text-[#B45309] text-sm block mb-1">
                  {language === 'mr' ? 'काम (प्रेम आणि नातेसंबंध)' : 'Kama (Desire & Love)'}
                </strong>
                <p className="text-[#5C4033]">{purchasedReport.reportContent.lifeThemes?.kama}</p>
              </div>
              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <strong className="text-[#B45309] text-sm block mb-1">
                  {language === 'mr' ? 'मोक्ष (आत्मिक मुक्ती)' : 'Moksha (Liberation)'}
                </strong>
                <p className="text-[#5C4033]">{purchasedReport.reportContent.lifeThemes?.moksha}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <BirthDetailsForm
                onSubmit={handleFormSubmit}
                isLoading={loading}
                buttonText={language === 'mr' ? `सविस्तर कुंडली अहवाल उघडा — ₹${discountedPrice}` : `Unlock Premium Detailed Kundli — ₹${discountedPrice}`}
                showGender={true}
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-[#B45309] uppercase font-bold tracking-wider">
                      {language === 'mr' ? 'फ्लॅगशिप अहवाल' : 'Flagship Report'}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2D1810] mt-1">
                      {language === 'mr' ? 'आपणास काय मिळेल' : 'What You Receive'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#786C60] line-through">₹{price}</span>
                    <div className="font-serif text-2xl font-extrabold text-[#D97706]">₹{discountedPrice}</div>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-[#5C4033]">
                  {[
                    language === 'mr' ? '५०+ पानांचे सखोल ग्रहांचे विश्लेषण' : '50+ Pages of Deep Planetary Interpretation',
                    language === 'mr' ? 'उत्तर आणि दक्षिण भारतीय दोन्ही चार्ट शैली' : 'Both North and South Indian style visualizations',
                    language === 'mr' ? '१२ भावांचे (स्थानांचे) सविस्तर विवरण' : 'Complete 12 Bhavas (Houses) granular breakdown',
                    language === 'mr' ? '१२० वर्षांची विंशोत्तरी महादशा व अंतर्दशा' : 'Full 120-Year Vimshottari Mahadasha & Antardasha schedule',
                    language === 'mr' ? 'साडेसाती, ढिय्या आणि मांगलिक दोष मूल्यांकन' : 'Sade Sati, Dhaiya, and Manglik Dosha evaluation',
                    language === 'mr' ? 'विशिष्ट रत्न, रुद्राक्ष आणि वैदिक मंत्र उपाय' : 'Specific Gemstone, Rudraksha, and Vedic Mantra remedies',
                    language === 'mr' ? 'पोर्टलवर त्वरित ऑनलाइन प्रवेश आणि प्रिंट पर्याय' : 'Instant online portal access and printable dossier',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2] text-xs text-[#786C60] space-y-2">
                  <div className="flex items-center space-x-2 text-[#92400E] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                    <span>{language === 'mr' ? 'अचूक सायन/निरयन खगोलीय गणित' : 'Pure Sidereal Mathematics'}</span>
                  </div>
                  <p>
                    {language === 'mr'
                      ? 'लाहिरी चित्रापक्ष मानक आणि अचूक ग्रह गणितांवर आधारित.'
                      : 'Guaranteed authentic astronomical calculations based on Lahiri Chitrapaksha standard.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        serviceTitle={language === 'mr' ? 'प्रीमियम सविस्तर कुंडली अहवाल' : 'Premium Detailed Kundli Report'}
        amount={discountedPrice}
        serviceType="report"
        referenceId="premium-kundli"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
