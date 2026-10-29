'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import { Sparkles, Moon, Star, Compass, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NakshatraFinderPage() {
  const { language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculateNakshatra = async (formData: BirthFormData) => {
    setLoading(true);
    try {
      const res = await api.generateKundli(formData);
      setResult({
        fullName: formData.fullName,
        moonSign: res.chartData.moonSign,
        meta: res.chartData.meta,
      });
    } catch (err: any) {
      alert(err.message || 'Calculation error');
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
            <Moon className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? '२७ चंद्र नक्षत्रे' : 'The 27 Lunar Constellations'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'वैदिक नक्षत्र व चरण शोधक' : 'Vedic Nakshatra & Pada Finder'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'आपले जन्म नक्षत्र (Janma Nakshatra), अचूक चरण आणि सत्ताधारी देवता खगोलीय अचूकतेने शोधा.'
              : 'Calculate your Janma Nakshatra (birth star), exact Pada (quarter), and governing celestial deity with astronomical accuracy.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <BirthDetailsForm
              onSubmit={handleCalculateNakshatra}
              isLoading={loading}
              buttonText={language === 'mr' ? 'माझे जन्म नक्षत्र मोजा' : 'Calculate My Janma Nakshatra'}
            />
          </div>

          <div className="lg:col-span-7">
            {result ? (
              <div className="bg-white text-[#2D1810] p-6 sm:p-8 rounded-2xl border-2 border-[#D97706] shadow-md space-y-6">
                <span className="text-[10px] uppercase font-bold text-[#B45309] tracking-wider block">
                  {language === 'mr' ? 'जन्म नक्षत्र निष्पन्न झाले' : 'Janma Nakshatra Revealed'}
                </span>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-3xl font-extrabold text-[#2D1810]">
                      {result.moonSign.nakshatra}
                    </h3>
                    <p className="text-xs text-[#786C60] mt-1">
                      {language === 'mr' ? 'चरण' : 'Pada'} {result.moonSign.pada} • {language === 'mr' ? 'राशी:' : 'Rashi:'} {result.moonSign.signName} ({result.moonSign.signSanskrit})
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-xl text-[#D97706]">
                    ✨
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE1D2]">
                  <div>
                    <span className="text-[#786C60] block">{language === 'mr' ? 'स्वामी ग्रह:' : 'Governing Planet:'}</span>
                    <strong className="text-[#2D1810]">{result.moonSign.nakshatraLord || 'Surya'}</strong>
                  </div>
                  <div>
                    <span className="text-[#786C60] block">{language === 'mr' ? 'नक्षत्र चरण:' : 'Nakshatra Pada:'}</span>
                    <strong className="text-[#2D1810]">{language === 'mr' ? `चरण ${result.moonSign.pada} / ४` : `Quarter ${result.moonSign.pada} of 4`}</strong>
                  </div>
                  <div>
                    <span className="text-[#786C60] block">{language === 'mr' ? 'राशीतील अंश:' : 'Degrees in Sign:'}</span>
                    <strong className="text-[#D97706] font-mono">{result.moonSign.degreeFormatted}</strong>
                  </div>
                </div>

                <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#EAE1D2] text-xs text-[#5C4033] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#B45309]">
                    {language === 'mr' ? 'आपल्या जन्म नक्षत्राचे महत्त्व' : 'Significance of Your Birth Star'}
                  </h4>
                  <p className="leading-relaxed">
                    {language === 'mr'
                      ? 'आपले जन्म नक्षत्र आपल्या अंतर्मनाची भावनिक रचना दर्शवते. ते थेट आपल्या विंशोत्तरी महादशेची सुरुवात ठरवते, विवाह गुण मिलन (अष्टकूट) निश्चित करते आणि शुभ मुहूर्तांसाठी मार्गदर्शन करते.'
                      : 'Your Janma Nakshatra reveals the fine emotional fabric of your subconscious mind. It directly governs the starting cycle of your Vimshottari Mahadasha, dictates marital compatibility (Kuta matching), and reveals favorable Muhurats for important ventures.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#2D1810]">
                  {language === 'mr' ? 'वैदिक नक्षत्र म्हणजे काय?' : 'What is a Vedic Nakshatra?'}
                </h3>
                <p className="text-xs text-[#786C60] leading-relaxed">
                  {language === 'mr'
                    ? 'पाश्चात्त्य ज्योतिष केवळ १२ राशींमध्ये विभागलेले असते, तर प्राचीन वैदिक ऋषींनी क्रांतीवृत्त २७ नक्षत्रांमध्ये (प्रत्येकी १३ अंश २० मिनिटे) सूक्ष्मपणे विभागले आहे.'
                    : 'While Western astrology only divides the zodiac into 12 signs, the ancient Vedic seers mapped 27 Nakshatras (lunar mansions) of 13 degrees 20 minutes each.'}
                </p>
                <div className="space-y-3 text-xs text-[#5C4033]">
                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
                    <strong className="text-[#B45309] block mb-1">
                      {language === 'mr' ? '१. ४ चरण' : '1. The 4 Padas'}
                    </strong>
                    {language === 'mr'
                      ? 'प्रत्येक नक्षत्र ४ चरणांमध्ये विभागलेले असते (प्रत्येकी ३° २०′). २७ × ४ = १०८ चरण, जे पारंपरिक वैदिक जपमाळेच्या १०८ मण्यांशी सुसंगत आहेत.'
                      : 'Each constellation is split into 4 quarters called Padas (3° 20\' each). 27 × 4 = 108 Padas, which correspond to the 108 beads of the traditional Vedic Japa Mala.'}
                  </div>
                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
                    <strong className="text-[#B45309] block mb-1">
                      {language === 'mr' ? '२. नामाक्षर (नावाचे पहिले अक्षर)' : '2. First Letter of Name'}
                    </strong>
                    {language === 'mr'
                      ? 'पारंपरिक भारतीय नामकरण विधीमध्ये बाळाच्या जन्माच्या वेळी सक्रिय असलेल्या अचूक नक्षत्र व चरणानुसार शुभ प्रथम अक्षर निवडले जाते.'
                      : "Traditional Indian naming rituals (Nama Karana) select the child's auspicious first syllable based on the precise Nakshatra and Pada active at birth."}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
