'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import NorthIndianChart from '@/components/NorthIndianChart';
import { Sparkles, CheckCircle, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function BirthProfilePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProfileSubmit = async (formData: BirthFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.saveBirthProfile(formData);
      setCreatedProfile(res);
      setSuccessMessage(
        language === 'mr'
          ? 'जन्म प्रोफाइल यशस्वीरित्या तयार केली गेली आणि आपल्या खात्यात जतन केली गेली!'
          : 'Birth profile successfully created and saved to your account!'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save birth profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'पवित्र पत्रिका ओळख' : 'Sacred Horoscope Identity'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'माझी जन्म प्रोफाइल तयार करा' : 'Create My Birth Profile'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-lg mx-auto leading-relaxed">
            {language === 'mr'
              ? 'वैयक्तिक कुंडली, दैनंदिन गोचर आणि भविष्यातील अहवालांमध्ये त्वरित प्रवेशासाठी आपले अचूक जन्म तपशील जतन करा.'
              : 'Save your exact astrological birth coordinates for instant access to personalized Kundli, daily transits, and future reports.'}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {successMessage && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-6 space-y-6">
            <BirthDetailsForm
              onSubmit={handleProfileSubmit}
              isLoading={isSubmitting}
              buttonText={language === 'mr' ? 'जन्म प्रोफाइल जतन करा' : 'Save & Generate Birth Profile'}
              showGender={true}
            />

            <div className="bg-white p-5 rounded-2xl border border-[#EAE1D2] text-xs text-[#786C60] space-y-2 shadow-sm">
              <div className="flex items-center space-x-2 text-[#2D1810] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                <span>{language === 'mr' ? 'कडक गोपनीयता व सुरक्षितता' : 'Strict Privacy & Confidentiality'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'mr'
                  ? 'आपले जन्म तपशील सुरक्षित ठेवले जातात आणि केवळ आपल्या वैयक्तिक ज्योतिषीय गणनेसाठी वापरले जातात. आम्ही कधीही डेटा विकत किंवा सामायिक करत नाही.'
                  : 'Your birth details and coordinates are stored privately and used exclusively for your personal astrological calculations. We never sell or share private profile data.'}
              </p>
            </div>
          </div>

          {/* Right: Real-time Profile Preview or Guidelines */}
          <div className="lg:col-span-6">
            {createdProfile ? (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#D97706] shadow-md text-[#2D1810] space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#EAE1D2]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#B45309]">{language === 'mr' ? 'सक्रिय प्रोफाइल' : 'Active Profile'}</span>
                    <h3 className="font-serif text-2xl font-bold text-[#2D1810]">
                      {createdProfile.fullName}
                    </h3>
                  </div>
                  <UserCheck className="w-7 h-7 text-[#D97706]" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE1D2]">
                  <div>
                    <span className="text-[#786C60] block">{language === 'mr' ? 'जन्म दिनांक' : 'Birth Date'}</span>
                    <strong className="text-[#2D1810]">{createdProfile.dateOfBirth}</strong>
                  </div>
                  <div>
                    <span className="text-[#786C60] block">{language === 'mr' ? 'जन्म वेळ' : 'Birth Time'}</span>
                    <strong className="text-[#2D1810]">{createdProfile.timeOfBirth}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#786C60] block">{language === 'mr' ? 'जन्म स्थान' : 'Place of Birth'}</span>
                    <strong className="text-[#2D1810]">{createdProfile.placeOfBirth}</strong>
                  </div>
                </div>

                {createdProfile.chartData && (
                  <div className="space-y-4">
                    <NorthIndianChart chartData={createdProfile.chartData} />
                    <div className="flex gap-3">
                      <Link
                        href="/kundli"
                        className="flex-1 text-center py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                      >
                        {language === 'mr' ? 'संपूर्ण कुंडली उघडा' : 'Explore Complete Kundli'}
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex-1 text-center py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] text-[#2D1810] text-xs font-semibold rounded-xl hover:bg-[#F3EFEA] transition-colors"
                      >
                        {language === 'mr' ? 'डॅशबोर्डवर जा' : 'Go to Dashboard'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#2D1810]">
                  {language === 'mr' ? 'अचूक जन्म तपशील का महत्त्वाचे आहेत?' : 'Why Complete Birth Coordinates Matter'}
                </h3>
                <ul className="space-y-4 text-xs text-[#5C4033] leading-relaxed">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#92400E] font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className="text-[#2D1810] block">{language === 'mr' ? 'लग्न राशी संवेदनशीलता' : 'Lagna (Rising Sign) Sensitivity'}</strong>
                      {language === 'mr'
                        ? 'पृथ्वी दर ४ मिनिटांत १ अंश फिरते. अचूक जन्म वेळ अचूक लग्न आणि भाव आरंभ निश्चित करते.'
                        : 'The earth rotates 1 degree every 4 minutes. Accurate birth time ensures exact Ascendant and house cusp positions.'}
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#92400E] font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className="text-[#2D1810] block">{language === 'mr' ? 'नक्षत्र चरण अचूकता' : 'Nakshatra Pada Precision'}</strong>
                      {language === 'mr'
                        ? 'प्रत्येक नक्षत्र ३° २०′ च्या ४ चरणांमध्ये विभागलेले असते. चरण सखोल स्वभाव आणि नवांश स्थिती ठरवते.'
                        : 'Each Nakshatra is divided into 4 padas of 3° 20\' each. The pada reveals deep behavioral subtleties and Navamsha chart status.'}
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#92400E] font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className="text-[#2D1810] block">{language === 'mr' ? 'विंशोत्तरी दशा शेष' : 'Vimshottari Dasha Balance'}</strong>
                      {language === 'mr'
                        ? 'प्रारंभिक महादशा शिल्लक पूर्णपणे जन्माच्या वेळी चंद्राच्या अंशांवर अवलंबून असते.'
                        : "The starting Mahadasha period balance depends strictly on the Moon's elapsed degrees inside the birth constellation."}
                    </div>
                  </li>
                </ul>

                <div className="p-4 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#786C60]">
                  {language === 'mr'
                    ? 'अचूक अक्षांश, रेखांश आणि टाइमझोन मिळवण्यासाठी डावीकडील फॉर्ममध्ये आपले शहर शोधा.'
                    : 'Fill out the form on the left with your city search to automatically fetch exact geographic latitude, longitude, and timezone offset.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}