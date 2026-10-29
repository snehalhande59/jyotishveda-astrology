'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import PaymentModal from '@/components/PaymentModal';
import { Heart, CheckCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MarriageReportPage() {
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
      const report = await api.generateReport('marriage', formData, true, paymentData.paymentId);
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
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{language === 'mr' ? 'कलत्र भाव • ७वे स्थान विवाह ब्लूप्रिंट' : 'Kalatra Bhava • 7th House Marriage Blueprint'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'पवित्र विवाह आणि जोडीदार ज्योतिष अहवाल' : 'Sacred Vivaha & Marriage Astrology Report'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'विवाहाची शुभ वेळ, जोडीदाराचे व्यक्तिमत्त्व, मांगलिक दोष विश्लेषण आणि वैवाहिक सौख्यासाठी प्रामाणिक उपाय.'
              : 'Timing of marriage, partner personality profile, Manglik Kuja Dosha evaluation, and authentic remedies for marital harmony.'}
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
                  {language === 'mr' ? '७वे स्थान आणि शुक्र ग्रह गतिशीलता' : '7th House & Venus Dynamics'}
                </h4>
                <p className="mt-1">{purchasedReport.reportContent.analysis}</p>
              </div>

              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <h4 className="font-serif text-sm font-bold text-[#B45309]">
                  {language === 'mr' ? 'जोडीदाराचा स्वभाव आणि सुसंगतता' : 'Spouse Temperament & Alignment'}
                </h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-[#2D1810]">
                  {purchasedReport.reportContent.partnerCharacteristics?.map((char: string, i: number) => (
                    <li key={i}>{char}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2]">
                <h4 className="font-serif text-sm font-bold text-[#B45309]">
                  {language === 'mr' ? 'वैवाहिक सौख्यासाठी सुसंवादी उपाय' : 'Harmonizing Matrimonial Remedies'}
                </h4>
                <ul className="mt-2 space-y-1">
                  {purchasedReport.reportContent.harmonizingRemedies?.map((rem: string, i: number) => (
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
                buttonText={language === 'mr' ? `विवाह अहवाल मागवा — ₹${discountedPrice}` : `Order Marriage Report — ₹${discountedPrice}`}
                showGender={true}
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-[#B45309] uppercase font-bold tracking-wider">
                      {language === 'mr' ? 'विवाह सेवा' : 'Marriage Service'}
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
                    language === 'mr' ? '७वे कलत्र स्थान आणि शुक्र ग्रहाची स्थिती' : '7th House Kalatra Bhava & Venus (Shukra) Status',
                    language === 'mr' ? 'नवांश (डी-९) कुंडलीद्वारे वैवाहिक स्थैर्य विश्लेषण' : 'Navamsha (D-9) Chart Depth for Marital Longevity',
                    language === 'mr' ? 'विवाह जुळण्याची वेळ आणि जीवनसाथी भेटण्याचा काळ' : 'Timing of Marriage & Meeting Soulmate Windows',
                    language === 'mr' ? 'मांगलिक (कुज) दोष विश्लेषण आणि निवारण' : 'Manglik (Kuja) Dosha Evaluation & Neutralizations',
                    language === 'mr' ? 'नात्यात शांती आणि प्रेमासाठी प्रभावी उपाय' : 'Effective Vedic Remedies for Relationship Peace',
                    language === 'mr' ? 'डॅशबोर्डवर त्वरित आजीवन उपलब्ध' : 'Instant Access in User Portal',
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
                    <span>{language === 'mr' ? 'सुरक्षित रेझरपे पेमेंट' : 'Razorpay Secure Test Gateway'}</span>
                  </div>
                  <p>
                    {language === 'mr'
                      ? 'एन्क्रिप्टेड पेमेंट प्रक्रिया आणि त्वरित डिजिटल अहवाल सक्रियता.'
                      : 'Encrypted payment processing with instant digital report activation.'}
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
        serviceTitle={language === 'mr' ? 'पवित्र विवाह आणि जोडीदार ज्योतिष अहवाल' : 'Sacred Vivaha & Marriage Astrology Report'}
        amount={discountedPrice}
        serviceType="report"
        referenceId="marriage"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
