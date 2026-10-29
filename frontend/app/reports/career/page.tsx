'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import PaymentModal from '@/components/PaymentModal';
import { Briefcase, CheckCircle, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CareerReportPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<BirthFormData | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [purchasedReport, setPurchasedReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const price = 999;
  const discountedPrice = 699;

  const handleFormSubmit = (data: BirthFormData) => {
    setFormData(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!formData) return;
    setLoading(true);
    try {
      const report = await api.generateReport('career', formData, true, paymentData.paymentId);
      setPurchasedReport(report);
    } catch (e: any) {
      alert(e.message || 'Error generating purchased report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Briefcase className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'कर्म भाव • १०वे स्थान व्यवसाय ब्लूप्रिंट' : 'Karma Bhava • 10th House Vocation Blueprint'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'वैदिक करिअर आणि व्यवसाय भविष्य अहवाल' : 'Vedic Career & Professional Destiny Report'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'आपले खरे कार्यक्षेत्र, सर्वोत्तम व्यवसाय बदल, पदोन्नती आणि व्यापार विस्तारासाठी अनुकूल कालावधी जाणून घ्या.'
              : 'Discover your true karmic calling, optimal career transitions, and favorable periods for promotion and business expansion.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {purchasedReport ? (
          <div className="bg-white text-[#2D1810] p-4 sm:p-6 md:p-10 rounded-3xl border-2 border-[#D97706] shadow-md space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#EAE1D2] gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {language === 'mr' ? 'सत्यापित खरेदी केलेला अहवाल' : 'Verified Purchased Report'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1810] mt-1">
                  {purchasedReport.title}
                </h2>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                {language === 'mr' ? 'प्रवेश मंजूर' : 'Access Granted'}
              </span>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#5C4033]">
              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <h4 className="font-serif text-sm font-bold text-[#B45309]">
                  {language === 'mr' ? '१०वे स्थान (कर्म भाव) सविस्तर विश्लेषण' : '10th House (Karma Bhava) Analysis'}
                </h4>
                <p className="mt-1">{purchasedReport.reportContent.analysis}</p>
              </div>

              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <h4 className="font-serif text-sm font-bold text-[#B45309]">
                  {language === 'mr' ? 'शिफारस केलेले उद्योग आणि भूमिका' : 'Recommended Industries & Roles'}
                </h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-[#2D1810]">
                  {purchasedReport.reportContent.recommendedIndustries?.map((ind: string, i: number) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <h4 className="font-serif text-sm font-bold text-[#B45309]">
                  {language === 'mr' ? 'व्यावसायिक यशासाठी वैदिक उपाय' : 'Vedic Remedies for Career Advancement'}
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
            {/* Form */}
            <div className="lg:col-span-6 space-y-6">
              <BirthDetailsForm
                onSubmit={handleFormSubmit}
                isLoading={loading}
                buttonText={language === 'mr' ? `करिअर अहवाल मागवा — ₹${discountedPrice}` : `Order Career Report — ₹${discountedPrice}`}
              />
            </div>

            {/* Overview & Features */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-[#B45309] uppercase font-bold tracking-wider">
                      {language === 'mr' ? 'प्रीमियम ज्योतिष अहवाल' : 'Premium Astrology Service'}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2D1810] mt-1">
                      {language === 'mr' ? 'अहवाल वैशिष्ट्ये आणि व्याप्ती' : 'Report Inclusions & Scope'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#786C60] line-through">₹{price}</span>
                    <div className="font-serif text-2xl font-extrabold text-[#D97706]">₹{discountedPrice}</div>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-[#5C4033]">
                  {[
                    language === 'mr' ? '१०वे कर्म स्थान व राशी स्वामी ग्रह विश्लेषण' : '10th House Karma Bhava & Ruling Graha Status',
                    language === 'mr' ? 'दशमांश (डी-१०) सूक्ष्म वर्ग कुंडली विश्लेषण' : 'Dashamsha (D-10) Divisional Chart Analysis',
                    language === 'mr' ? 'नोकरी विरुद्ध व्यवसाय अनुकूलता' : 'Employment vs. Entrepreneurship Aptitude',
                    language === 'mr' ? 'नोकरी बदल व पदोन्नतीसाठी शुभ वेळ' : 'Auspicious Timing for Job Change & Promotion',
                    language === 'mr' ? 'अडथळे दूर करण्यासाठी वैदिक उपाय' : 'Mitigation Remedies for Professional Obstacles',
                    language === 'mr' ? 'डॅशबोर्डवर त्वरित आजीवन उपलब्ध' : 'Instant Delivery to Dashboard & Saved Reports',
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
                    <span>{language === 'mr' ? '२५६-बिट सुरक्षित पेमेंट' : 'Razorpay Secure Checkout'}</span>
                  </div>
                  <p>
                    {language === 'mr'
                      ? 'जन्म तपशील सादर करून त्वरित एन्क्रिप्टेड ऑर्डर आणि सुरक्षित पडताळणी मिळवा.'
                      : 'Submit birth details to initiate instant encrypted payment order with server-side signature verification.'}
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
        serviceTitle={language === 'mr' ? 'वैदिक करिअर आणि व्यवसाय अहवाल' : 'Vedic Career & Professional Destiny Report'}
        amount={discountedPrice}
        serviceType="report"
        referenceId="career"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
