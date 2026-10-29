'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Compass, Heart, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HealingPage() {
  const { language } = useLanguage();

  const remedies = [
    {
      title: language === 'mr' ? 'रत्न शिफारस (ज्योतिषीय रत्न)' : 'Jyotish Gemstone Recommendation (Ratna)',
      subtitle: language === 'mr' ? 'लग्नेश आणि भाग्य स्थानानुसार निश्चित' : 'Prescribed as per your Lagnesha & Bhagyasthan',
      desc: language === 'mr'
        ? 'ग्रहांच्या कार्यात्मक अनुकूलतेनुसार अचूक रत्नशास्त्र मार्गदर्शन. अशुभ स्थानांना उत्तेजित न करता आपल्या योगकारक ग्रहांना बळकट करा.'
        : 'Authentic astrological gemology calculated directly from planetary functional beneficence. Strengthen your Lagna Lord and yogakaraka grahas without aggravating malefic houses.',
      examples: [
        language === 'mr' ? 'गुरूसाठी पिवळा पुष्कराज (Pukhraj)' : 'Yellow Sapphire (Pukhraj) for Jupiter',
        language === 'mr' ? 'शनीसाठी नीलम (Neelam)' : 'Blue Sapphire (Neelam) for Saturn',
        language === 'mr' ? 'बुधासाठी पाचू (Panna)' : 'Emerald (Panna) for Mercury',
        language === 'mr' ? 'सूर्यासाठी माणिक (Manikya)' : 'Ruby (Manikya) for Sun',
      ],
      link: '/kundli',
      cta: language === 'mr' ? 'योग्य रत्न शोधा' : 'Calculate Suitable Gemstone',
    },
    {
      title: language === 'mr' ? 'पवित्र रुद्राक्ष थेरपी' : 'Sacred Rudraksha Therapy',
      subtitle: language === 'mr' ? 'विद्युत-चुंबकीय जैव-कंपन मणी' : 'Electro-magnetic bio-resonance beads',
      desc: language === 'mr'
        ? '१ मुखी (शिव) ते १४ मुखी (हनुमान), रुद्राक्ष मणी मज्जासंस्थेला संतुलित करतात, ग्रह दोषांचे निवारण करतात आणि संरक्षण करतात.'
        : 'From 1 Mukhi (Shiva) to 14 Mukhi (Hanuman), Rudraksha beads balance the nervous system, mitigate chronic planetary doshas, and shield personal aura.',
      examples: [
        language === 'mr' ? '५ मुखी - गुरु ग्रह व मानसिक शांततेसाठी' : '5 Mukhi for Jupiter & general peace',
        language === 'mr' ? '७ मुखी (महालक्ष्मी) - शुक्र व समृद्धीसाठी' : '7 Mukhi (Mahalakshmi) for Venus & wealth',
        language === 'mr' ? '८ मुखी (गणेश) - राहू व विघ्न निवारणासाठी' : '8 Mukhi (Ganesha) for Rahu & obstacle removal',
      ],
      link: '/astrologers',
      cta: language === 'mr' ? 'रुद्राक्ष तज्ज्ञांचा सल्ला घ्या' : 'Consult Rudraksha Scholar',
    },
    {
      title: language === 'mr' ? 'वैदिक बीज मंत्र आणि जप साधना' : 'Vedic Beej Mantras & Japa Sadhana',
      subtitle: language === 'mr' ? 'ध्वनी लहरींवर आधारित आध्यात्मिक उपाय' : 'Vibrational sound resonance remedies',
      desc: language === 'mr'
        ? 'प्रत्येक ग्रहाची एक विशिष्ट संस्कृत कंपन वारंवारता असते. दैनंदिन बीजमंत्र जप ग्रह पीडा शांत करतो आणि चक्रे संतुलित करतो.'
        : 'Each graha has an exact Sanskrit resonance frequency. Daily chanting of recommended beej mantras neutralizes planetary afflictions and balances the chakras.',
      examples: [
        language === 'mr' ? 'सूर्य गायत्री - आरोग्य आणि तेजासाठी' : 'Surya Gayatri for vitality',
        language === 'mr' ? 'महामृत्युंजय मंत्र - दीर्घायुष्य व संरक्षणासाठी' : 'Maha Mrityunjaya for health & longevity',
        language === 'mr' ? 'नवाक्षरी नवार्ण मंत्र - आत्मिक संरक्षणासाठी' : 'Navarna Mantra for spiritual protection',
      ],
      link: '/kundli',
      cta: language === 'mr' ? 'वैयक्तिक मंत्र मिळवा' : 'Generate Personalized Mantras',
    },
    {
      title: language === 'mr' ? 'पवित्र यंत्रे आणि ऊर्जा भूमिती' : 'Sacred Yantras & Sacred Geometry',
      subtitle: language === 'mr' ? 'ब्रह्मांडीय ऊर्जा केंद्रित करणारी यंत्रे' : 'Cosmic geometric energy condensers',
      desc: language === 'mr'
        ? 'शुभ नक्षत्रांमध्ये प्राणप्रतिष्ठित तांब्याची आणि सोन्याची यंत्रे वास्तुदोष निवारण करतात आणि सकारात्मक ऊर्जा आकर्षित करतात.'
        : 'Precision copper and gold-plated yantras energized during auspicious Nakshatras to harmonize residential Vastu and attract prosperity.',
      examples: [
        language === 'mr' ? 'श्री यंत्र - धन, ऐश्वर्य आणि विपुलतेसाठी' : 'Shree Yantra for wealth & abundance',
        language === 'mr' ? 'कुबेर यंत्र - व्यापार वृद्धीसाठी' : 'Kuber Yantra for business gains',
        language === 'mr' ? 'महामृत्युंजय यंत्र - सुरक्षेसाठी' : 'Mahamrityunjay Yantra for safety',
      ],
      link: '/pricing',
      cta: language === 'mr' ? 'उपाय अहवाल पहा' : 'Explore Remedial Reports',
    },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'प्राचीन पराशरीय उपाय व उपचार शास्त्र' : 'Classical Parashari Upayas & Remedial Shastra'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'वैदिक उपचार, रत्न आणि उपाय' : 'Vedic Healing, Gemology & Remedies'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'प्रतिकूल ग्रह लहरी संतुलित करा आणि अस्सल रत्ने, रुद्राक्ष, यंत्रे व वैदिक मंत्रांद्वारे शुभ योगांना बळकटी द्या.'
              : 'Harmonize discordant planetary vibrations and amplify auspicious yogas through authentic gems, Rudraksha, sacred geometry, and Vedic mantras.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {remedies.map((rem, i) => (
            <div
              key={i}
              className="bg-white p-5 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm hover:border-[#D97706] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E] bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A]">
                  {rem.subtitle}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2D1810] mt-3">
                  {rem.title}
                </h3>
                <p className="text-xs text-[#786C60] mt-3 leading-relaxed">
                  {rem.desc}
                </p>

                <div className="mt-5 p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B45309] mb-2">
                    {language === 'mr' ? 'प्रमुख उपाय:' : 'Key Prescriptions:'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#5C4033]">
                    {rem.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#EAE1D2] flex items-center justify-between">
                <Link
                  href={rem.link}
                  className="px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                >
                  <span>{rem.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/astrologers"
                  className="text-xs font-semibold text-[#786C60] hover:text-[#D97706] transition-colors"
                >
                  {language === 'mr' ? 'ज्योतिषांशी चर्चा करा →' : 'Ask Astrologer →'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
