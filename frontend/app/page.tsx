'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AstrologyService, Astrologer, FAQ, SiteSettings } from '@/lib/types';
import { getWalletBalance } from '@/lib/auth';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import NorthIndianChart from '@/components/NorthIndianChart';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedField } from '@/lib/translations';
import {
  Sparkles,
  Compass,
  Star,
  Users,
  Award,
  ChevronRight,
  Calendar,
  Heart,
  ArrowRight,
  PhoneCall,
  Moon,
  Wallet,
  CheckCircle2,
  Flame,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  coverImage?: string;
}

const ZODIAC_OVERVIEW = [
  {
    name: 'Aries',
    sanskrit: 'Mesha',
    symbol: '♈',
    element: 'Fire',
    elementMr: 'अग्नी',
    lord: 'Mars',
    lordMr: 'मंगळ',
    advice: 'Energetic career breakthroughs expected. Channel ambition with patience.',
    adviceMr: 'करिअरमध्ये प्रगतीचे उत्तम योग आहेत. संयमाने आणि एकाग्रतेने कामे पूर्ण करा.',
    luckyNumber: 9,
    luckyColor: 'Coral Red',
    luckyColorMr: 'पोवळा लाल',
  },
  {
    name: 'Taurus',
    sanskrit: 'Vrishabha',
    symbol: '♉',
    element: 'Earth',
    elementMr: 'पृथ्वी',
    lord: 'Venus',
    lordMr: 'शुक्र',
    advice: 'Jupiter transit brings auspicious financial harmony and family bliss.',
    adviceMr: 'गुरू गोचर कौटुंबिक आनंद आणि आर्थिक समृद्धी आणेल. धनवृद्धीचे योग.',
    luckyNumber: 6,
    luckyColor: 'Diamond White',
    luckyColorMr: 'चमकदार पांढरा',
  },
  {
    name: 'Gemini',
    sanskrit: 'Mithuna',
    symbol: '♊',
    element: 'Air',
    elementMr: 'वायू',
    lord: 'Mercury',
    lordMr: 'बुध',
    advice: 'High intellectual creativity. Ideal window for contracts and communications.',
    adviceMr: 'बौद्धिक क्षमतेत वृद्धी होईल. नवीन करार आणि संभाषणासाठी उत्तम काळ.',
    luckyNumber: 5,
    luckyColor: 'Emerald Green',
    luckyColorMr: 'हिरवा',
  },
  {
    name: 'Cancer',
    sanskrit: 'Karka',
    symbol: '♋',
    element: 'Water',
    elementMr: 'जल',
    lord: 'Moon',
    lordMr: 'चंद्र',
    advice: 'Intuitive insights in relationships. Nurture peace with meditation.',
    adviceMr: 'नातसंबंधात भावनिक सौख्य लाभेल. ध्यानाने मनःशांती कायम ठेवा.',
    luckyNumber: 2,
    luckyColor: 'Pearl Silver',
    luckyColorMr: 'मोती पांढरा',
  },
  {
    name: 'Leo',
    sanskrit: 'Simha',
    symbol: '♌',
    element: 'Fire',
    elementMr: 'अग्नी',
    lord: 'Sun',
    lordMr: 'सूर्य',
    advice: 'Solar radiance enhances leadership authority. Maintain humility at work.',
    adviceMr: 'सूर्याचे तेज नेतृत्वगुणांना चालना देईल. कामाच्या ठिकाणी नम्रता बाळगा.',
    luckyNumber: 1,
    luckyColor: 'Ruby Gold',
    luckyColorMr: 'सोनेरी',
  },
  {
    name: 'Virgo',
    sanskrit: 'Kanya',
    symbol: '♍',
    element: 'Earth',
    elementMr: 'पृथ्वी',
    lord: 'Mercury',
    lordMr: 'बुध',
    advice: 'Meticulous planning resolves past pending tasks with high precision.',
    adviceMr: 'नियोजनात्मक कामांमध्ये यश लाभेल. प्रलंबित कामे सहज पूर्ण होतील.',
    luckyNumber: 5,
    luckyColor: 'Sage Green',
    luckyColorMr: 'फिकट हिरवा',
  },
  {
    name: 'Libra',
    sanskrit: 'Tula',
    symbol: '♎',
    element: 'Air',
    elementMr: 'वायू',
    lord: 'Venus',
    lordMr: 'शुक्र',
    advice: 'Partnership ventures flourish. Excellent time for artistic expressions.',
    adviceMr: 'भागीदारीच्या व्यवसायात लाभ संभवतो. कलात्मक कामांसाठी उत्तम काळ.',
    luckyNumber: 6,
    luckyColor: 'Sky Blue',
    luckyColorMr: 'आकाशी निळा',
  },
  {
    name: 'Scorpio',
    sanskrit: 'Vrishchika',
    symbol: '♏',
    element: 'Water',
    elementMr: 'जल',
    lord: 'Mars',
    lordMr: 'मंगळ',
    advice: 'Deep transformation and spiritual clarity. Focus on inner sadhana.',
    adviceMr: 'आत्मचिंतन आणि आध्यात्मिक प्रगतीचे योग. मानसिक स्थैर्य लाभेल.',
    luckyNumber: 9,
    luckyColor: 'Deep Maroon',
    luckyColorMr: 'गडद तांबडा',
  },
  {
    name: 'Sagittarius',
    sanskrit: 'Dhanu',
    symbol: '♐',
    element: 'Fire',
    elementMr: 'अग्नी',
    lord: 'Jupiter',
    lordMr: 'गुरू',
    advice: 'Spiritual journeys and higher learning bring profound life joy.',
    adviceMr: 'धार्मिक यात्रा व उच्च शिक्षणातून आनंद आणि मार्गदर्शन प्राप्त होईल.',
    luckyNumber: 3,
    luckyColor: 'Yellow Saffron',
    luckyColorMr: 'भगवा / पिवळा',
  },
  {
    name: 'Capricorn',
    sanskrit: 'Makara',
    symbol: '♑',
    element: 'Earth',
    elementMr: 'पृथ्वी',
    lord: 'Saturn',
    lordMr: 'शनी',
    advice: 'Steadfast perseverance yields sustained career prestige and gains.',
    adviceMr: 'कठोर परिश्रमांना यश येईल. कार्यक्षेत्रात मान-सन्मान वाढेल.',
    luckyNumber: 8,
    luckyColor: 'Navy Blue',
    luckyColorMr: 'गडद निळा',
  },
  {
    name: 'Aquarius',
    sanskrit: 'Kumbha',
    symbol: '♒',
    element: 'Air',
    elementMr: 'वायू',
    lord: 'Saturn',
    lordMr: 'शनी',
    advice: 'Visionary humanitarian ideas attract like-minded patrons and allies.',
    adviceMr: 'नवीन संकल्पनांना मित्रांचे व सहकाऱ्यांचे उत्तम सहकार्य लाभेल.',
    luckyNumber: 8,
    luckyColor: 'Electric Cyan',
    luckyColorMr: 'आकाशी',
  },
  {
    name: 'Pisces',
    sanskrit: 'Meena',
    symbol: '♓',
    element: 'Water',
    elementMr: 'जल',
    lord: 'Jupiter',
    lordMr: 'गुरू',
    advice: 'Heightened compassion and artistic inspiration. Trust inner instincts.',
    adviceMr: 'सहानुभूती आणि अंतःप्रेरणेतून योग्य निर्णय घेता येतील. शुभ वार्ता लाभेल.',
    luckyNumber: 3,
    luckyColor: 'Golden Amber',
    luckyColorMr: 'सोनेरी पिवळा',
  },
];

const FREE_TOOLS_LIST = [
  {
    titleEn: 'Free Kundli / Birth Chart',
    titleMr: 'मोफत जन्मकुंडली',
    descEn: 'Instant North & South Indian birth charts with exact degrees and house rulers.',
    descMr: 'अचूक अंश आणि भावाधिपतींसह उत्तर व दक्षिण भारतीय पद्धतीची जन्मकुंडली.',
    link: '/kundli',
    icon: Compass,
    tagEn: 'Core Essential',
    tagMr: 'महत्त्वपूर्ण साधन',
  },
  {
    titleEn: 'Kundli Milan (Guna Match)',
    titleMr: 'कुंडली मिलन (गुणमेलन)',
    descEn: '36-point Ashta Kuta compatibility analysis between bride and groom.',
    descMr: 'वर-वधू यांच्यातील ३६ गुणांवर आधारित अष्टकूट गुणमेलन विश्लेषण.',
    link: '/compatibility',
    icon: Heart,
    tagEn: 'Vivaha Milan',
    tagMr: 'विवाह मिलन',
  },
  {
    titleEn: 'Today Vedic Panchang',
    titleMr: 'आजचे वैदिक पंचांग',
    descEn: '5 limbs of time: Tithi, Vara, Nakshatra, Yoga, and Karana with Rahu Kaal.',
    descMr: 'तिथी, वार, नक्षत्र, योग आणि करण या ५ अंगांसह राहु काळ व शुभ मुहूर्त.',
    link: '/panchang',
    icon: Calendar,
    tagEn: 'Updated Daily',
    tagMr: 'दैनिक पंचांग',
  },
  {
    titleEn: 'Numerology Calculator',
    titleMr: 'अंकशास्त्र कॅल्क्युलेटर',
    descEn: 'Calculate your Life Path, Destiny, and Soul Urge numbers with planetary links.',
    descMr: 'जन्मतारखेवरून मूलांक, भाग्यांक व नामांक यांची शास्त्रीय माहिती मिळवा.',
    link: '/numerology',
    icon: Star,
    tagEn: 'Pythagorean & Vedic',
    tagMr: 'वैदिक अंकशास्त्र',
  },
  {
    titleEn: 'Nakshatra & Pada Finder',
    titleMr: 'नक्षत्र आणि चरण शोधक',
    descEn: 'Find your governing lunar constellation, deity, and planetary lord.',
    descMr: 'आपले जन्म नक्षत्र, चरण, आराध्य दैवत आणि नक्षत्र स्वामी जाणून घ्या.',
    link: '/nakshatra-finder',
    icon: Sparkles,
    tagEn: '27 Mansions',
    tagMr: '२७ नक्षत्रे',
  },
  {
    titleEn: 'Moon Sign (Rashi) Finder',
    titleMr: 'चंद्र राशी शोधक',
    descEn: 'Identify your true Sidereal Moon sign from exact birth time and city coordinates.',
    descMr: 'अचूक जन्मवेळ आणि स्थानावरून आपली खरी वैदिक चंद्र राशी शोधा.',
    link: '/zodiac-finder',
    icon: Moon,
    tagEn: 'Chandra Rashi',
    tagMr: 'चंद्र राशी',
  },
];

const FESTIVALS_LIST = [
  {
    titleEn: 'Makar Sankranti',
    titleMr: 'मकर संक्रांती',
    metaEn: 'Jan 14, 2026 • Punya Kaal: 07:15 AM',
    metaMr: '१४ जाने २०२६ • पुण्य काळ: ०७:१५ सकाळी',
  },
  {
    titleEn: 'Maha Shivratri',
    titleMr: 'महाशिवरात्री',
    metaEn: 'Feb 15, 2026 • Nishita Puja: 12:09 AM',
    metaMr: '१५ फेब्रु २०२६ • निशीथ पूजा: १२:०९ मध्यरात्री',
  },
  {
    titleEn: 'Holi (Dhulandi)',
    titleMr: 'होळी (धुलिवंदन)',
    metaEn: 'Mar 03 - 04, 2026 • Phalguna Purnima',
    metaMr: '०३ - ०४ मार्च २०२६ • फाल्गुन पौर्णिमा',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { t, language, formatNumber, formatCurrency, translateSign } = useLanguage();
  const [services, setServices] = useState<AstrologyService[]>([]);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [selectedZodiac, setSelectedZodiac] = useState(ZODIAC_OVERVIEW[0]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [previewChart, setPreviewChart] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [walletBal, setWalletBal] = useState<number>(500);

  useEffect(() => {
    setWalletBal(getWalletBalance());
    async function loadData() {
      try {
        const [servicesRes, astrologersRes, faqsRes, settingsRes, articlesRes] = await Promise.all([
          api.getServices(),
          api.getAstrologers(),
          api.getFaqs(),
          api.getSiteSettings(),
          api.getArticles(),
        ]);
        setServices(servicesRes);
        setAstrologers(astrologersRes);
        setFaqs(faqsRes);
        setSiteSettings(settingsRes);
        setArticles(articlesRes);
      } catch (err) {
        console.warn('Data load error:', err);
      }
    }
    loadData();
  }, []);

  const handleQuickKundli = async (formData: BirthFormData) => {
    setIsCalculating(true);
    try {
      const res = await api.generateKundli(formData);
      setPreviewChart(res.chartData);
    } catch (err: any) {
      alert(err.message || 'Calculation error');
    } finally {
      setIsCalculating(false);
    }
  };

  const heroTitle = getLocalizedField(siteSettings, 'heroTitle', language) || (language === 'mr' ? 'आपली खरी ग्रहस्थिती आणि वैश्विक नशीब जाणून घ्या' : 'Discover Your True Celestial Blueprint');
  const heroSubtitle = getLocalizedField(siteSettings, 'heroSubtitle', language) || (language === 'mr' ? 'अचूक वैदिक ग्रहगणित, लाहिरी अयनांश आणि सखोल ज्योतिषीय मार्गदर्शनाने आपले जीवन समृद्ध करा.' : 'Uncover your authentic karmic trajectory, planetary alignments, and profound Jyotish insights computed strictly with the Lahiri Sidereal ephemeris.');

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] font-sans">
      {/* ========================================================
          1. HERO BANNER SECTION (Dual-Column Portal Header)
         ======================================================== */}
      <section className="relative bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/25 overflow-hidden">
        {/* Subtle celestial stars background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Title & Fast CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs text-[#F7DF94]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-medium tracking-wide">{t('home.heroBadge')}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FDFBF7] leading-tight">
              {heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-[#D8C7A5] leading-relaxed max-w-xl">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/kundli"
                className="px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs sm:text-sm rounded-xl shadow-gold hover:opacity-95 transition-all flex items-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>{t('home.btnKundli')}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/compatibility"
                className="px-5 py-3 bg-[#25184B] border border-[#D4AF37]/40 text-[#FDFBF7] font-semibold text-xs sm:text-sm rounded-xl hover:border-[#D4AF37] transition-all flex items-center space-x-2"
              >
                <Heart className="w-4 h-4 text-[#D4AF37]" />
                <span>{t('home.btnMilan')}</span>
              </Link>
              <Link
                href="/astrologers"
                className="px-4 py-3 bg-[#191233] border border-[#D4AF37]/30 text-xs font-semibold text-[#F7DF94] rounded-xl hover:border-[#D4AF37] transition-all flex items-center space-x-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t('home.btnConsult')}</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#D4AF37]/20 max-w-md">
              <div>
                <span className="block font-serif text-2xl font-bold text-[#F7DF94]">{formatNumber(27)}</span>
                <span className="text-[11px] text-[#D8C7A5]/70">{t('home.metricNakshatras')}</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#F7DF94]">100%</span>
                <span className="text-[11px] text-[#D8C7A5]/70">{t('home.metricAccuracy')}</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#F7DF94]">{formatNumber(4.98)}★</span>
                <span className="text-[11px] text-[#D8C7A5]/70">{t('home.metricRating')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Birth Details Form */}
          <div className="lg:col-span-5">
            <BirthDetailsForm
              onSubmit={handleQuickKundli}
              isLoading={isCalculating}
              buttonText={language === 'mr' ? 'झटपट जन्मकुंडली गणना करा' : 'Calculate Instant Kundli'}
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          2. INSTANT CHART PREVIEW SECTION (When Form Submitted)
         ======================================================== */}
      {previewChart && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20 mb-14">
          <div className="bg-[#150D2A] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-cosmic text-[#FDFBF7]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 border-b border-[#D4AF37]/20 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#25184B] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                  {language === 'mr' ? 'ग्रहगणित आधारित कुंडली' : 'Ephemeris Computed Kundli'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7DF94] mt-1.5">
                  {previewChart.meta?.fullName || 'User'}&apos;s {language === 'mr' ? 'वैदिक जन्मकुंडली' : 'Vedic Kundli'}
                </h2>
                <p className="text-xs text-[#D8C7A5] mt-1">
                  {language === 'mr' ? 'जन्म' : 'Born'}: {previewChart.meta?.dateOfBirth} {language === 'mr' ? 'वेळ' : 'at'} {previewChart.meta?.timeOfBirth} ({previewChart.meta?.placeOfBirth})
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/kundli"
                  className="px-4 py-2 bg-[#D4AF37] text-[#0F0B1E] font-semibold text-xs rounded-lg hover:opacity-90 shadow-gold"
                >
                  {language === 'mr' ? '१२ भाव आणि महादशा पहा' : 'View 12 Bhavas & Dasha'}
                </Link>
                <button
                  onClick={() => setPreviewChart(null)}
                  className="px-3 py-2 bg-[#25184B] text-xs rounded-lg text-[#D8C7A5] hover:text-white"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
              <div className="lg:col-span-7 flex justify-center">
                <NorthIndianChart chartData={previewChart} />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#0F0B1E] p-5 rounded-2xl border border-[#D4AF37]/20 space-y-3">
                  <h4 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                    {language === 'mr' ? 'महत्त्वपूर्ण खगोलीय ग्रहस्थिती' : 'Core Astronomical Coordinates'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                      <span className="text-[#D8C7A5]">{t('kundli.pillarLagna')}:</span>
                      <strong className="text-[#FDFBF7]">{translateSign(previewChart.ascendant?.signName)} ({previewChart.ascendant?.degreeFormatted})</strong>
                    </li>
                    <li className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                      <span className="text-[#D8C7A5]">{t('kundli.pillarMoon')}:</span>
                      <strong className="text-[#FDFBF7]">{translateSign(previewChart.moonSign?.signName)} ({previewChart.moonSign?.degreeFormatted})</strong>
                    </li>
                    <li className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                      <span className="text-[#D8C7A5]">{t('kundli.pillarNakshatra')}:</span>
                      <strong className="text-[#FDFBF7]">{previewChart.moonSign?.nakshatra} ({language === 'mr' ? 'चरण' : 'Pada'} {formatNumber(previewChart.moonSign?.pada)})</strong>
                    </li>
                    <li className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                      <span className="text-[#D8C7A5]">{t('kundli.pillarSun')}:</span>
                      <strong className="text-[#FDFBF7]">{translateSign(previewChart.sunSign?.signName)} ({previewChart.sunSign?.degreeFormatted})</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#D8C7A5]">{language === 'mr' ? 'अयनांश पद्धती' : 'Ayanamsa Standard'}:</span>
                      <strong className="text-[#D4AF37]">{previewChart.meta?.ayanamsa?.formatted || '24° (Lahiri)'}</strong>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#25184B]/60 p-4 rounded-xl border border-[#D4AF37]/20 text-xs">
                  <h5 className="font-semibold text-[#F7DF94]">
                    {language === 'mr' ? 'सध्याचे महादशा चक्र' : 'Current Mahadasha Cycle'}
                  </h5>
                  <p className="text-[#D8C7A5] mt-1 leading-relaxed">
                    {language === 'mr'
                      ? `${previewChart.dasha?.balanceDashaPlanet || ''} महादशा शिल्लक: जन्मापासून ~${formatNumber(previewChart.dasha?.balanceYears || 'N/A')} वर्षे.`
                      : `Balance of ${previewChart.dasha?.balanceDashaPlanet || 'Governing'} Mahadasha for ~${previewChart.dasha?.balanceYears || 'N/A'} years from birth.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          3. ASTROSAGE-INSPIRED 2-COLUMN PORTAL LAYOUT
         ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ====================================================
              LEFT / MAIN COLUMN (8 of 12 cols on desktop)
             ==================================================== */}
          <main className="lg:col-span-8 space-y-14">
            
            {/* A. 12 ZODIAC DAILY HOROSCOPE MODULE (Aaj Ka Rashifal) */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D1F]">
                    {t('home.horoscopeTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#150D2A] mt-0.5">
                    {t('home.horoscopeTitle')}
                  </h2>
                </div>
                <Link
                  href="/horoscope"
                  className="text-xs font-semibold text-[#8C6D1F] hover:text-[#150D2A] flex items-center"
                >
                  <span>{t('home.viewAllSigns')}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              {/* 12 Zodiac Tabs */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {ZODIAC_OVERVIEW.map((z) => {
                  const signLabel = translateSign(z.name);
                  return (
                    <button
                      key={z.name}
                      onClick={() => setSelectedZodiac(z)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        selectedZodiac.name === z.name
                          ? 'bg-[#150D2A] border-[#D4AF37] text-[#F7DF94] shadow-md scale-105'
                          : 'bg-[#FAF6F0] border-[#D4AF37]/20 text-gray-700 hover:border-[#D4AF37]'
                      }`}
                    >
                      <span className="text-base">{z.symbol}</span>
                      <span className="text-[11px] font-semibold mt-0.5">{signLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Zodiac Card Preview */}
              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#D4AF37]/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl text-[#8C6D1F]">{selectedZodiac.symbol}</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#150D2A]">
                        {translateSign(selectedZodiac.name)} ({selectedZodiac.sanskrit})
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        {language === 'mr' ? 'राशी स्वामी:' : 'Lord:'}{' '}
                        <strong className="text-gray-900">{language === 'mr' ? selectedZodiac.lordMr : selectedZodiac.lord}</strong> •{' '}
                        {language === 'mr' ? 'तत्त्व:' : 'Element:'}{' '}
                        <strong className="text-gray-900">{language === 'mr' ? selectedZodiac.elementMr : selectedZodiac.element}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="bg-white px-3 py-1 rounded-full border border-[#D4AF37]/30 text-[#8C6D1F]">
                      {t('home.luckyNo')} <strong>{formatNumber(selectedZodiac.luckyNumber)}</strong>
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-[#D4AF37]/30 text-[#8C6D1F]">
                      {t('home.luckyColor')} <strong>{language === 'mr' ? selectedZodiac.luckyColorMr : selectedZodiac.luckyColor}</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pt-2 border-t border-[#D4AF37]/15">
                  {language === 'mr' ? selectedZodiac.adviceMr : selectedZodiac.advice}
                </p>

                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/horoscope?sign=${selectedZodiac.name}`}
                    className="px-4 py-2 bg-[#150D2A] text-[#FDFBF7] text-xs font-semibold rounded-lg hover:bg-[#8C6D1F] transition-colors flex items-center space-x-1"
                  >
                    <span>{t('home.readFullForecast', { sign: translateSign(selectedZodiac.name) })}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </section>

            {/* B. FREE VEDIC ASTROLOGY TOOLS GRID */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D1F]">
                    {t('home.toolsTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#150D2A] mt-0.5">
                    {t('home.toolsTitle')}
                  </h2>
                </div>
                <Link
                  href="/tools"
                  className="text-xs font-semibold text-[#8C6D1F] hover:text-[#150D2A] flex items-center"
                >
                  <span>{t('home.allTools')}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {FREE_TOOLS_LIST.map((tool, idx) => {
                  const Icon = tool.icon;
                  const title = language === 'mr' ? tool.titleMr : tool.titleEn;
                  const desc = language === 'mr' ? tool.descMr : tool.descEn;
                  const tag = language === 'mr' ? tool.tagMr : tool.tagEn;
                  return (
                    <Link
                      key={idx}
                      href={tool.link}
                      className="group bg-white p-5 rounded-2xl border border-[#D4AF37]/25 shadow-sm hover:shadow-gold hover:border-[#D4AF37] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#D4AF37]/30 flex items-center justify-center text-[#8C6D1F] group-hover:bg-[#150D2A] group-hover:text-[#F7DF94] transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#FAF6F0] text-[#8C6D1F] border border-[#D4AF37]/30 rounded-full">
                            {tag}
                          </span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#150D2A] group-hover:text-[#8C6D1F] transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-[#8C6D1F] group-hover:translate-x-1 transition-transform">
                        <span>{t('home.calculateNow')}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* C. COMPREHENSIVE VEDIC REPORTS (Connected to Strapi Services) */}
            <section className="bg-[#150D2A] text-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-cosmic space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 pb-4 border-b border-[#D4AF37]/20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    {t('home.reportsTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#F7DF94] mt-0.5">
                    {t('home.reportsTitle')}
                  </h2>
                </div>
                <Link
                  href="/pricing"
                  className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center"
                >
                  <span>{t('home.viewPricing')}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(Array.isArray(services) ? services : []).slice(0, 3).map((service) => {
                  const sTitle = getLocalizedField(service, 'title', language) || service.title;
                  const sDesc = getLocalizedField(service, 'shortDescription', language) || service.shortDescription;
                  return (
                    <div
                      key={service.id}
                      className="bg-[#191233] border border-[#D4AF37]/30 rounded-2xl p-5 flex flex-col justify-between hover:border-[#D4AF37] transition-all shadow-md"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] uppercase font-semibold text-[#D4AF37] bg-[#25184B] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                            {service.category}
                          </span>
                          {service.badge && (
                            <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              {service.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-base font-bold text-[#FDFBF7]">{sTitle}</h3>
                        <p className="text-xs text-[#D8C7A5]/80 mt-1.5 leading-relaxed line-clamp-2">
                          {sDesc}
                        </p>

                        <div className="mt-3 py-2 border-y border-[#D4AF37]/15 flex items-baseline space-x-2">
                          <span className="font-serif text-xl font-bold text-[#F7DF94]">
                            {formatCurrency(service.discountedPrice || service.price)}
                          </span>
                          {service.discountedPrice && (
                            <span className="text-xs text-[#D8C7A5]/50 line-through">
                              {formatCurrency(service.price)}
                            </span>
                          )}
                          <span className="text-[10px] text-[#D8C7A5]/60 ml-auto">{t('home.oneTime')}</span>
                        </div>

                        <ul className="mt-3 space-y-1.5 text-xs text-[#D8C7A5]">
                          {(Array.isArray(service.features) ? service.features : []).slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="flex items-center space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-5 pt-3">
                        <Link
                          href={service.slug === 'detailed-kundli' ? '/reports/premium-kundli' : `/reports/${service.slug}`}
                          className="w-full block text-center py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs tracking-wide shadow-gold hover:opacity-95"
                        >
                          {t('home.viewReportPreview')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* D. CONSULT CERTIFIED VEDIC ASTROLOGERS (from Strapi) */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D1F]">
                    {t('home.astrologersTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#150D2A] mt-0.5">
                    {t('home.astrologersTitle')}
                  </h2>
                </div>
                <Link
                  href="/astrologers"
                  className="text-xs font-semibold text-[#8C6D1F] hover:text-[#150D2A] flex items-center"
                >
                  <span>{t('home.allAstrologers')}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Array.isArray(astrologers) ? astrologers : []).slice(0, 4).map((astrologer) => (
                  <div
                    key={astrologer.id}
                    className="bg-white border border-[#D4AF37]/25 rounded-2xl p-5 shadow-sm hover:shadow-gold hover:border-[#D4AF37] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-3.5 mb-3">
                        <img
                          src={astrologer.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
                          alt={astrologer.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] flex-shrink-0"
                        />
                        <div>
                          <h3 className="font-serif text-base font-bold text-[#150D2A]">{astrologer.name}</h3>
                          <p className="text-xs text-[#8C6D1F] font-medium">{astrologer.title}</p>
                          <div className="flex items-center space-x-1.5 mt-0.5 text-[11px] text-gray-500">
                            <span className="text-amber-500 font-bold">★ {formatNumber(astrologer.rating)}</span>
                            <span>({formatNumber(astrologer.reviewCount)} {t('astrologers.reviews')})</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                        {astrologer.bio}
                      </p>

                      <div className="text-[11px] space-y-1 py-2.5 border-t border-gray-100 text-gray-600">
                        <div>
                          <strong className="text-gray-900">{t('astrologers.experience')}:</strong> {formatNumber(astrologer.experienceYears)}+ {t('common.years')}
                        </div>
                        <div>
                          <strong className="text-gray-900">{t('astrologers.specialties')}:</strong>{' '}
                          {Array.isArray(astrologer.specialties)
                            ? astrologer.specialties.join(', ')
                            : String(astrologer.specialties || '')}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 block">{t('astrologers.consultationFee')}</span>
                        <span className="font-serif text-base font-bold text-[#150D2A]">
                          {formatCurrency(astrologer.consultationFee)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/astrologers/${astrologer.id}`}
                          className="px-3 py-1.5 border border-[#D4AF37]/40 text-xs font-semibold rounded-lg hover:border-[#D4AF37]"
                        >
                          {t('astrologers.profile')}
                        </Link>
                        <Link
                          href={`/booking?astrologerId=${astrologer.id}`}
                          className="px-3.5 py-1.5 bg-[#150D2A] hover:bg-[#8C6D1F] text-[#FDFBF7] text-xs font-semibold rounded-lg transition-colors"
                        >
                          {t('astrologers.bookSession')}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* E. VEDIC ARTICLES & EPHEMERIS RESEARCH (from Strapi) */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D1F]">
                    {t('home.articlesTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#150D2A] mt-0.5">
                    {t('home.articlesTitle')}
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-[#8C6D1F] hover:text-[#150D2A] flex items-center"
                >
                  <span>{t('home.allArticles')}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(Array.isArray(articles) ? articles : []).slice(0, 2).map((art) => {
                  const artTitle = getLocalizedField(art, 'title', language) || art.title;
                  const artExcerpt = getLocalizedField(art, 'excerpt', language) || art.excerpt;
                  return (
                    <Link
                      key={art.id}
                      href={`/blog/${art.slug}`}
                      className="group bg-white rounded-2xl border border-[#D4AF37]/25 overflow-hidden shadow-sm hover:shadow-gold hover:border-[#D4AF37] transition-all flex flex-col justify-between"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-[10px] font-semibold text-[#8C6D1F] uppercase tracking-wider mb-2">
                          <span>{art.category}</span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#150D2A] group-hover:text-[#8C6D1F] transition-colors leading-snug">
                          {artTitle}
                        </h3>
                        <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                          {artExcerpt}
                        </p>
                      </div>
                      <div className="px-6 py-3 bg-[#FAF6F0] border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                        <span>{t('home.byAuthor', { author: art.author })}</span>
                        <span className="font-semibold text-[#8C6D1F] group-hover:translate-x-1 transition-transform flex items-center">
                          {t('home.readGuide')} &rarr;
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* F. FREQUENTLY ASKED QUESTIONS ACCORDION */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-sm space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D1F]">
                  {t('home.faqTag')}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#150D2A] mt-0.5">
                  {t('home.faqTitle')}
                </h2>
              </div>

              <div className="space-y-3">
                {(Array.isArray(faqs) ? faqs : []).map((faq, index) => {
                  const q = getLocalizedField(faq, 'question', language) || faq.question;
                  const a = getLocalizedField(faq, 'answer', language) || faq.answer;
                  return (
                    <div
                      key={faq.id}
                      className="border border-[#D4AF37]/25 rounded-xl overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        className="w-full p-4 text-left flex justify-between items-center text-xs sm:text-sm font-semibold text-[#150D2A] hover:text-[#8C6D1F]"
                      >
                        <span>{q}</span>
                        <span className="text-base font-bold text-[#8C6D1F] ml-2">
                          {activeFaq === index ? '−' : '+'}
                        </span>
                      </button>
                      {activeFaq === index && (
                        <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                          {a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </main>

          {/* ====================================================
              RIGHT / SIDEBAR COLUMN (4 of 12 cols on desktop)
             ==================================================== */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* 1. TODAY'S AUSPICIOUS PANCHANG WIDGET */}
            <div className="bg-[#150D2A] text-[#FDFBF7] p-6 rounded-3xl border-2 border-[#D4AF37]/40 shadow-cosmic space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif text-base font-bold text-[#F7DF94]">
                    {t('home.panchangTitle')}
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#25184B] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  {t('home.panchangCity')}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                  <span className="text-[#D8C7A5]">{t('home.auspiciousTithi')}</span>
                  <strong className="text-[#FDFBF7]">{language === 'mr' ? 'शुक्ल द्वादशी' : 'Shukla Dwadashi'}</strong>
                </div>
                <div className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                  <span className="text-[#D8C7A5]">{t('home.governingNakshatra')}</span>
                  <strong className="text-[#FDFBF7]">{language === 'mr' ? 'रेवती (चरण ३)' : 'Revati (Pada 3)'}</strong>
                </div>
                <div className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                  <span className="text-[#D8C7A5]">{t('home.abhijitMuhurat')}</span>
                  <strong className="text-emerald-400">11:58 AM - 12:44 PM</strong>
                </div>
                <div className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                  <span className="text-[#D8C7A5]">{t('home.rahuKaalam')}</span>
                  <strong className="text-rose-400">04:22 PM - 05:46 PM</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D8C7A5]">{t('home.sunMoonRashi')}</span>
                  <strong className="text-[#D4AF37]">{language === 'mr' ? 'तूळ / मीन' : 'Libra / Pisces'}</strong>
                </div>
              </div>

              <Link
                href="/panchang"
                className="w-full block text-center py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs rounded-xl shadow-gold hover:opacity-95 transition-all"
              >
                {t('home.openPanchang')}
              </Link>
            </div>

            {/* 2. SPOTLIGHT SCHOLAR OF THE DAY */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                <Award className="w-4 h-4 text-[#8C6D1F]" />
                <h3 className="font-serif text-base font-bold text-[#150D2A]">
                  {t('home.astrologerOfDay')}
                </h3>
              </div>

              <div className="flex items-center space-x-3.5">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                  alt="Acharya Vidyadhar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] flex-shrink-0"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#150D2A]">
                    {language === 'mr' ? 'आचार्य विद्याधर शास्त्री' : 'Acharya Vidyadhar Shastri'}
                  </h4>
                  <p className="text-[11px] text-[#8C6D1F] font-medium">
                    {language === 'mr' ? `ज्येष्ठ ज्योतिषरत्न (${formatNumber(28)} वर्षे अनुभव)` : 'Senior Jyotish Ratna (28 Yrs Exp)'}
                  </p>
                  <span className="text-amber-500 text-xs font-bold">
                    ★ {formatNumber(4.98)} ({formatNumber(1450)} {t('astrologers.reviews')})
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'mr'
                  ? 'करिअर, विवाह गुणमेलन आणि रत्न सल्ल्यासाठी तातडीने उपलब्ध.'
                  : 'Available right now for confidential video & voice calls covering career promotions, marriage compatibility, and gemstone prescriptions.'}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 block">{t('home.sessionFee')}</span>
                  <span className="font-serif text-base font-bold text-[#150D2A]">
                    {formatCurrency(1499)}
                  </span>
                </div>
                <Link
                  href="/booking?astrologerId=1"
                  className="px-4 py-2 bg-[#150D2A] text-[#FDFBF7] text-xs font-semibold rounded-xl hover:bg-[#8C6D1F] transition-colors flex items-center space-x-1"
                >
                  <PhoneCall className="w-3 h-3 mr-1" />
                  <span>{t('home.callChatNow')}</span>
                </Link>
              </div>
            </div>

            {/* 3. ASTROPAY WALLET & CONSULTATION CREDITS */}
            <div className="bg-[#191233] text-[#FDFBF7] p-6 rounded-3xl border border-[#D4AF37]/30 shadow-cosmic space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif text-sm font-bold text-[#F7DF94]">
                    {t('home.walletTitle')}
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  {t('home.walletActive')}
                </span>
              </div>

              <div className="p-3.5 bg-[#0F0B1E] rounded-xl border border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#D8C7A5]/70 block">{t('home.availableCredits')}</span>
                  <span className="font-serif text-2xl font-bold text-[#F7DF94]">
                    {formatCurrency(walletBal)}
                  </span>
                </div>
                <Link
                  href="/wallet"
                  className="px-3 py-1.5 bg-[#25184B] border border-[#D4AF37]/40 text-[#F7DF94] text-xs font-semibold rounded-lg hover:border-[#D4AF37]"
                >
                  {t('home.addFunds')}
                </Link>
              </div>

              <p className="text-[11px] text-[#D8C7A5]/70 leading-relaxed">
                {t('home.walletDesc')}
              </p>
            </div>

            {/* 4. VEDIC HEALING & REMEDIES CARD */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                <Shield className="w-4 h-4 text-[#8C6D1F]" />
                <h3 className="font-serif text-base font-bold text-[#150D2A]">
                  {t('home.healingTitle')}
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex items-center justify-between p-2 rounded-lg bg-[#FAF6F0] hover:bg-gray-100 transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>💎</span>
                    <span className="font-medium">{t('home.gemstones')}</span>
                  </span>
                  <Link href="/healing" className="text-[#8C6D1F] font-bold text-[11px]">&rarr;</Link>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-[#FAF6F0] hover:bg-gray-100 transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>📿</span>
                    <span className="font-medium">{t('home.rudraksha')}</span>
                  </span>
                  <Link href="/healing" className="text-[#8C6D1F] font-bold text-[11px]">&rarr;</Link>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-[#FAF6F0] hover:bg-gray-100 transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>🕉️</span>
                    <span className="font-medium">{t('home.mantras')}</span>
                  </span>
                  <Link href="/healing" className="text-[#8C6D1F] font-bold text-[11px]">&rarr;</Link>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-[#FAF6F0] hover:bg-gray-100 transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>🔯</span>
                    <span className="font-medium">{t('home.yantras')}</span>
                  </span>
                  <Link href="/healing" className="text-[#8C6D1F] font-bold text-[11px]">&rarr;</Link>
                </li>
              </ul>

              <Link
                href="/healing"
                className="w-full block text-center py-2 border border-[#D4AF37]/40 text-xs font-semibold text-[#8C6D1F] rounded-xl hover:border-[#D4AF37]"
              >
                {t('home.exploreRemedies')}
              </Link>
            </div>

            {/* 5. UPCOMING AUSPICIOUS FESTIVALS */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-[#8C6D1F]" />
                  <h3 className="font-serif text-base font-bold text-[#150D2A]">
                    {t('home.festivalsTitle')}
                  </h3>
                </div>
                <Link href="/festivals" className="text-[11px] text-[#8C6D1F] font-semibold hover:underline">
                  {t('home.viewAll')}
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                {FESTIVALS_LIST.map((fest, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#D4AF37]/15">
                    <strong className="block text-[#150D2A]">
                      {language === 'mr' ? fest.titleMr : fest.titleEn}
                    </strong>
                    <span className="text-[11px] text-gray-500">
                      {language === 'mr' ? fest.metaMr : fest.metaEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. SANATANA WISDOM COMMUNITY & SOCIAL */}
            <div className="bg-[#150D2A] text-[#FDFBF7] p-6 rounded-3xl border border-[#D4AF37]/30 text-center space-y-3">
              <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto" />
              <h4 className="font-serif text-sm font-bold text-[#F7DF94]">
                {t('home.communityTitle')}
              </h4>
              <p className="text-xs text-[#D8C7A5]/80 leading-relaxed">
                {t('home.communityDesc')}
              </p>
              <div className="pt-2 flex justify-center space-x-2 text-xs">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#25184B] border border-[#D4AF37]/30 rounded-lg text-[#F7DF94] hover:border-[#D4AF37]"
                >
                  {t('home.telegram')}
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#25184B] border border-[#D4AF37]/30 rounded-lg text-[#F7DF94] hover:border-[#D4AF37]"
                >
                  {t('home.youtube')}
                </a>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
