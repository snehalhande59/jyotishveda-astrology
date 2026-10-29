'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import PaymentModal from '@/components/PaymentModal';
import { DollarSign, CheckCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FinanceReportPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<BirthFormData | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [purchasedReport, setPurchasedReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const price = 1199;
  const discountedPrice = 799;

  const handleFormSubmit = (data: BirthFormData) => {
    setFormData(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!formData) return;
    setLoading(true);
    try {
      const report = await api.generateReport('finance', formData, true, paymentData.paymentId);
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
            <DollarSign className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'धन आणि लाभ भाव • संपत्ती विश्लेषण' : 'Dhana & Labha Bhavas • Wealth Architecture'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'वित्त आणि संपत्ती भाग्य अहवाल' : 'Finance & Wealth Destiny Report'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'धन योग, लक्ष्मी योग, मालमत्ता निर्मिती क्षेत्रे आणि उच्च नफ्याचे वित्तीय कालावधी यांचे सविस्तर विश्लेषण.'
              : 'Detailed examination of Dhana Yogas, Lakshmi Yogas, asset building sectors, and high-gain financial periods.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {purchasedReport ? (
          <div className="bg-white text-[#2D1810] p-8 sm:p-10 rounded-2xl border-2 border-[#D97706] shadow-md space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-[#EAE1D2]">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {language === 'mr' ? 'सत्यापित खरेदी केलेला अहवाल' : 'Verified Purchased Report'}
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#2D1810] mt-1">{purchasedReport.title}</h2>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                {language === 'mr' ? 'प्रवेश मंजूर' : 'Access Granted'}
              </span>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#5C4033]">
              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <h4 className="font-serif text-sm font-bold text-[#B45309]">
                  {language === 'mr' ? '२रे आणि ११वे स्थान (धन व लाभ भाव) विश्लेषण' : '2nd & 11th House Wealth Analysis'}
                </h4>
                <p className="mt-1">{purchasedReport.reportContent.analysis}</p>
              </div>

              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <h4 className="font-serif text-sm font-bold text-[#B45309]">
                  {language === 'mr' ? 'सर्वोत्तम संपत्ती संचय माध्यम' : 'Ideal Wealth Accumulation Vehicles'}
                </h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-[#2D1810]">
                  {purchasedReport.reportContent.wealthVehicles?.map((v: string, i: number) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <h4 className="font-serif text-sm font-bold text-[#B45309]">
                  {language === 'mr' ? 'समृद्धी उपाय आणि खबरदारी' : 'Prosperity Remedies & Precautions'}
                </h4>
                <ul className="mt-2 space-y-1">
                  {purchasedReport.reportContent.remedies?.map((rem: string, i: number) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="text-[#D97706]">✦</span>
                      <span>{rem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <BirthDetailsForm
                onSubmit={handleFormSubmit}
                isLoading={loading}
                buttonText={language === 'mr' ? `वित्त अहवाल मागवा — ₹${discountedPrice}` : `Order Finance Report — ₹${discountedPrice}`}
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-[#B45309] uppercase font-bold tracking-wider">
                      {language === 'mr' ? 'वित्तीय सेवा' : 'Financial Service'}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2D1810] mt-1">
                      {language === 'mr' ? 'अहवाल वैशिष्ट्ये' : 'Report Features'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#786C60] line-through">₹{price}</span>
                    <div className="font-serif text-2xl font-extrabold text-[#D97706]">₹{discountedPrice}</div>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-[#5C4033]">
                  {[
                    language === 'mr' ? '२रे (धन) आणि ११वे (लाभ) स्थान संबंध विश्लेषण' : '2nd (Dhana) & 11th (Labha) House Financial Connections',
                    language === 'mr' ? 'धन योग आणि लक्ष्मी योग उपस्थिती पडताळणी' : 'Dhana Yoga and Lakshmi Yoga Presence Verification',
                    language === 'mr' ? 'अनुकूल गुंतवणूक पर्याय (रिअल इस्टेट, शेअर्स, सोने)' : 'Favorable Investment Avenues (Real Estate, Equity, Gold)',
                    language === 'mr' ? 'जोखमीचे सावधगिरी कालावधी आणि कर्जमुक्ती उपाय' : 'Speculation Caution Periods & Debt Mitigation',
                    language === 'mr' ? 'उच्च नफ्यासाठी शुभ कालखंड' : 'Auspicious Timing Windows for High Capital Growth',
                    language === 'mr' ? 'सुरक्षित रेझरपे पेमेंट पडताळणी' : 'Verified Razorpay Integration',
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
                    <span>{language === 'mr' ? 'सुरक्षित ऑनलाइन व्यवहार' : 'Safe Secure Transaction'}</span>
                  </div>
                  <p>
                    {language === 'mr'
                      ? 'स्ट्रॅपी ५ बॅकएंडवर सुरक्षित ऑर्डर निर्मिती आणि स्वाक्षरी पडताळणी.'
                      : 'Order created and signed securely on Strapi backend.'}
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
        serviceTitle={language === 'mr' ? 'वित्त आणि संपत्ती भाग्य अहवाल' : 'Finance & Wealth Destiny Report'}
        amount={discountedPrice}
        serviceType="report"
        referenceId="finance"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
