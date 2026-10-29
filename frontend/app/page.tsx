'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  Award,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Heart,
  ArrowRight,
  PhoneCall,
  Phone,
  Moon,
  Wallet,
  CheckCircle2,
  Flame,
  Shield,
  ShieldCheck,
  Lock,
  Zap,
  MessageCircle,
  Clock,
  Sun,
  UserCheck,
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

const TESTIMONIALS = [
  {
    name: 'Anjali Deshmukh',
    nameMr: 'अंजली देशमुख',
    city: 'Pune, Maharashtra',
    cityMr: 'पुणे, महाराष्ट्र',
    rating: 5,
    text: 'Acharya Vidyadhar’s career dasha prediction was astonishingly precise. His recommendation of Panna (Emerald) brought tangible clarity and a major promotion within 4 months.',
    textMr: 'आचार्य विद्याधर शास्त्री यांचे करिअर दशा विश्लेषण अतिशय अचूक ठरले. त्यांच्या पन्ना रत्न सल्ल्यामुळे ४ महिन्यांत पदोन्नती व नवीन संधी मिळाली.',
    role: 'Software Architect',
    roleMr: 'सॉफ्टवेअर आर्किटेक्ट',
  },
  {
    name: 'Rohit Kulkarni',
    nameMr: 'रोहित कुलकर्णी',
    city: 'Mumbai, Maharashtra',
    cityMr: 'मुंबई, महाराष्ट्र',
    rating: 5,
    text: 'The 36-point Kundli Milan report gave us deep clarity on Nadi and Bhakoot doshas. The pandit ji gave very practical, non-fearful Vedic remedies that blessed our wedding.',
    textMr: '३६ गुण गुणमेलन अहवालाने आम्हाला नाडी व भकूट दोषाविषयी पूर्ण स्पष्टता दिली. आचार्यांनी अतिशय साधे व शास्त्रीय तोडगे सुचवले.',
    role: 'Financial Analyst',
    roleMr: 'फायनान्शिअल अ‍ॅनालिस्ट',
  },
  {
    name: 'Pooja Joshi',
    nameMr: 'पूजा जोशी',
    city: 'Nashik, Maharashtra',
    cityMr: 'नाशिक, महाराष्ट्र',
    rating: 5,
    text: 'I used the First Free Chat feature and was so impressed by the astrologer’s patience and accuracy that I immediately booked a 30-minute detailed voice session. Highly recommended!',
    textMr: 'मी मोफत चॅट सुविधेचा वापर केला आणि ज्योतिषांच्या अचूक मार्गदर्शनाने प्रभावित होऊन सविस्तर कॉल सत्र घेतले. अत्यंत विश्वासार्ह सेवा!',
    role: 'Entrepreneur',
    roleMr: 'उद्योजक',
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

  const carouselRef = useRef<HTMLDivElement>(null);

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

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const heroTitle =
    getLocalizedField(siteSettings, 'heroTitle', language) ||
    (language === 'mr'
      ? 'आपली खरी ग्रहस्थिती आणि वैश्विक नशीब जाणून घ्या'
      : 'Discover Your True Celestial Destiny');
  const heroSubtitle =
    getLocalizedField(siteSettings, 'heroSubtitle', language) ||
    (language === 'mr'
      ? 'अचूक वैदिक ग्रहगणित, लाहिरी अयनांश आणि सखोल ज्योतिषीय मार्गदर्शनाने आपले जीवन समृद्ध करा.'
      : 'Authentic karmic trajectory, planetary alignments, and profound Jyotish insights computed strictly with the Lahiri Sidereal ephemeris.');

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans antialiased selection:bg-[#FDE68A] selection:text-[#78350F]">
      
      {/* ========================================================
          1. LIVE ACTIVITY TICKER (Smooth Marquee with Pause on Hover)
         ======================================================== */}
      <div className="bg-[#FFFBEB] border-y border-[#FDE68A] py-2.5 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused] gap-10 items-center text-xs font-medium text-[#92400E]">
          <span className="flex items-center gap-1.5 font-semibold text-[#B45309]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            {t('ticker.msg1')}
          </span>
          <span className="text-[#D97706]">•</span>
          <span>{t('ticker.msg2')}</span>
          <span className="text-[#D97706]">•</span>
          <span className="font-semibold text-[#B45309]">{t('ticker.msg3')}</span>
          <span className="text-[#D97706]">•</span>
          <span>{t('ticker.msg4')}</span>
          <span className="text-[#D97706]">•</span>
          <span>{t('ticker.msg5')}</span>
          <span className="text-[#D97706]">•</span>

          {/* Seamless duplicate loop */}
          <span className="flex items-center gap-1.5 font-semibold text-[#B45309]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            {t('ticker.msg1')}
          </span>
          <span className="text-[#D97706]">•</span>
          <span>{t('ticker.msg2')}</span>
          <span className="text-[#D97706]">•</span>
          <span className="font-semibold text-[#B45309]">{t('ticker.msg3')}</span>
          <span className="text-[#D97706]">•</span>
          <span>{t('ticker.msg4')}</span>
          <span className="text-[#D97706]">•</span>
          <span>{t('ticker.msg5')}</span>
        </div>
      </div>

      {/* ========================================================
          2. HERO SECTION (Warm Ivory & Cream + Instant Birth Form)
         ======================================================== */}
      <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] overflow-hidden">
        {/* Soft Golden Ambient Radial Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FEF3C7]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#FDE68A]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-4 py-1.5 rounded-full text-xs font-semibold text-[#92400E] shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="tracking-wide">{t('hero.badge')}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D1810] leading-tight">
              {heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-[#6B5A4E] leading-relaxed max-w-xl">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/kundli"
                className="px-6 py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>{t('hero.ctaKundli')}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/chat"
                className="px-5 py-3.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-bold text-xs sm:text-sm rounded-xl hover:bg-[#FEF3C7] shadow-sm transition-all flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 text-[#D97706]" />
                <span>{t('hero.ctaChat')}</span>
              </Link>
              <Link
                href="/astrologers"
                className="px-5 py-3.5 bg-white border border-[#EAE1D2] text-xs font-bold text-[#4A2E18] rounded-xl hover:border-[#D97706] hover:text-[#92400E] shadow-sm transition-all flex items-center space-x-1.5"
              >
                <PhoneCall className="w-4 h-4 text-[#F59E0B]" />
                <span>{t('home.btnConsult')}</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EAE1D2] max-w-md">
              <div className="bg-white/80 p-3 rounded-xl border border-[#EAE1D2] text-center shadow-xs">
                <span className="block font-serif text-2xl font-bold text-[#B45309]">
                  {formatNumber(27)}
                </span>
                <span className="text-[11px] text-[#786C60] font-medium">
                  {t('home.metricNakshatras')}
                </span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-[#EAE1D2] text-center shadow-xs">
                <span className="block font-serif text-2xl font-bold text-[#B45309]">100%</span>
                <span className="text-[11px] text-[#786C60] font-medium">
                  {t('home.metricAccuracy')}
                </span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-[#EAE1D2] text-center shadow-xs">
                <span className="block font-serif text-2xl font-bold text-[#B45309]">
                  {formatNumber(4.98)}★
                </span>
                <span className="text-[11px] text-[#786C60] font-medium">
                  {t('home.metricRating')}
                </span>
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
          3. INSTANT CHART PREVIEW SECTION (When Form Submitted)
         ======================================================== */}
      {previewChart && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12">
          <div className="bg-white border-2 border-[#F59E0B] rounded-3xl p-6 sm:p-8 shadow-xl text-[#2D1810]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 border-b border-[#EAE1D2] gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E] bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A]">
                  {language === 'mr' ? 'ग्रहगणित आधारित कुंडली' : 'Ephemeris Computed Kundli'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1810] mt-2">
                  {previewChart.meta?.fullName || 'User'}&apos;s{' '}
                  {language === 'mr' ? 'वैदिक जन्मकुंडली' : 'Vedic Kundli'}
                </h2>
                <p className="text-xs text-[#786C60] mt-1">
                  {language === 'mr' ? 'जन्म' : 'Born'}: {previewChart.meta?.dateOfBirth}{' '}
                  {language === 'mr' ? 'वेळ' : 'at'} {previewChart.meta?.timeOfBirth} (
                  {previewChart.meta?.placeOfBirth})
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/kundli"
                  className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-semibold text-xs rounded-lg hover:opacity-95 shadow-md"
                >
                  {language === 'mr' ? '१२ भाव आणि महादशा पहा' : 'View 12 Bhavas & Dasha'}
                </Link>
                <button
                  onClick={() => setPreviewChart(null)}
                  className="px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] text-xs font-medium rounded-lg text-[#6B5A4E] hover:text-[#2D1810]"
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
                <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#EAE1D2] space-y-3">
                  <h4 className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                    {language === 'mr' ? 'महत्त्वपूर्ण खगोलीय ग्रहस्थिती' : 'Core Astronomical Coordinates'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between border-b border-[#EAE1D2] pb-1.5">
                      <span className="text-[#786C60]">{t('kundli.pillarLagna')}:</span>
                      <strong className="text-[#2D1810]">
                        {translateSign(previewChart.ascendant?.signName)} ({previewChart.ascendant?.degreeFormatted})
                      </strong>
                    </li>
                    <li className="flex justify-between border-b border-[#EAE1D2] pb-1.5">
                      <span className="text-[#786C60]">{t('kundli.pillarMoon')}:</span>
                      <strong className="text-[#2D1810]">
                        {translateSign(previewChart.moonSign?.signName)} ({previewChart.moonSign?.degreeFormatted})
                      </strong>
                    </li>
                    <li className="flex justify-between border-b border-[#EAE1D2] pb-1.5">
                      <span className="text-[#786C60]">{t('kundli.pillarNakshatra')}:</span>
                      <strong className="text-[#2D1810]">
                        {previewChart.moonSign?.nakshatra} ({language === 'mr' ? 'चरण' : 'Pada'}{' '}
                        {formatNumber(previewChart.moonSign?.pada)})
                      </strong>
                    </li>
                    <li className="flex justify-between border-b border-[#EAE1D2] pb-1.5">
                      <span className="text-[#786C60]">{t('kundli.pillarSun')}:</span>
                      <strong className="text-[#2D1810]">
                        {translateSign(previewChart.sunSign?.signName)} ({previewChart.sunSign?.degreeFormatted})
                      </strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#786C60]">
                        {language === 'mr' ? 'अयनांश पद्धती' : 'Ayanamsa Standard'}:
                      </span>
                      <strong className="text-[#B45309]">
                        {previewChart.meta?.ayanamsa?.formatted || '24° (Lahiri)'}
                      </strong>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#FFFBEB] p-4 rounded-xl border border-[#FDE68A] text-xs">
                  <h5 className="font-bold text-[#92400E]">
                    {language === 'mr' ? 'सध्याचे महादशा चक्र' : 'Current Mahadasha Cycle'}
                  </h5>
                  <p className="text-[#78350F] mt-1 leading-relaxed">
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
          4. FOUR PROMINENT SERVICE / CONSULTATION CARDS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Chat with Astrologer */}
          <Link
            href="/chat"
            className="group bg-white rounded-2xl p-5 border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center text-[#D97706] flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                {t('cards.chatTitle')}
              </h3>
              <p className="text-xs text-[#786C60] mt-0.5">{t('cards.chatSub')}</p>
              <span className="inline-flex items-center text-xs font-bold text-[#D97706] mt-2 group-hover:translate-x-1 transition-transform">
                {language === 'mr' ? 'चॅट सुरू करा' : 'Chat Now'} &rarr;
              </span>
            </div>
          </Link>

          {/* Card 2: Call Astrologer */}
          <Link
            href="/booking"
            className="group bg-white rounded-2xl p-5 border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center text-[#D97706] flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                {t('cards.callTitle')}
              </h3>
              <p className="text-xs text-[#786C60] mt-0.5">{t('cards.callSub')}</p>
              <span className="inline-flex items-center text-xs font-bold text-[#D97706] mt-2 group-hover:translate-x-1 transition-transform">
                {language === 'mr' ? 'कॉल सुरू करा' : 'Call Now'} &rarr;
              </span>
            </div>
          </Link>

          {/* Card 3: Daily Horoscope */}
          <Link
            href="/horoscope"
            className="group bg-white rounded-2xl p-5 border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center text-[#D97706] flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Sun className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                {t('cards.horoscopeTitle')}
              </h3>
              <p className="text-xs text-[#786C60] mt-0.5">{t('cards.horoscopeSub')}</p>
              <span className="inline-flex items-center text-xs font-bold text-[#D97706] mt-2 group-hover:translate-x-1 transition-transform">
                {language === 'mr' ? 'आजचे राशीभविष्य' : 'Read Today'} &rarr;
              </span>
            </div>
          </Link>

          {/* Card 4: Get Free Kundli */}
          <Link
            href="/kundli"
            className="group bg-white rounded-2xl p-5 border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center text-[#D97706] flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                {t('cards.kundliTitle')}
              </h3>
              <p className="text-xs text-[#786C60] mt-0.5">{t('cards.kundliSub')}</p>
              <span className="inline-flex items-center text-xs font-bold text-[#D97706] mt-2 group-hover:translate-x-1 transition-transform">
                {language === 'mr' ? 'मोफत पत्रिका' : 'Generate Free'} &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================
          5. ASTROLOGER LISTING CAROUSEL ("Talk to Our Expert Astrologers")
         ======================================================== */}
      <section className="bg-[#FFFDF9] py-12 border-y border-[#EAE1D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'प्रमाणित वैदिक तज्ज्ञ' : 'Verified Vedic Experts'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
                {t('carousel.title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#786C60] mt-1">
                {t('carousel.subtitle')}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 rounded-full border border-[#EAE1D2] bg-white text-[#4A2E18] hover:bg-[#FAF7F2] hover:border-[#D97706] flex items-center justify-center transition-colors shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 rounded-full border border-[#EAE1D2] bg-white text-[#4A2E18] hover:bg-[#FAF7F2] hover:border-[#D97706] flex items-center justify-center transition-colors shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <Link
                href="/astrologers"
                className="ml-2 text-xs font-bold text-[#D97706] hover:text-[#B45309] hover:underline flex items-center"
              >
                <span>{language === 'mr' ? 'सर्व ज्योतिषी पहा' : 'View All'}</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Horizontal Scrollable Row */}
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {(Array.isArray(astrologers) && astrologers.length > 0 ? astrologers : [
              {
                id: 1,
                name: 'Acharya Vidyadhar Shastri',
                title: 'Senior Jyotish Ratna',
                avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
                rating: 4.98,
                reviewCount: 1450,
                experienceYears: 28,
                specialties: ['Vedic Kundli', 'Career', 'Gemstones'],
                consultationFee: 1125,
                isOnline: true,
              },
              {
                id: 2,
                name: 'Pt. Rameshwar Dwivedi',
                title: 'Parashari & Vastu Specialist',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                rating: 4.92,
                reviewCount: 980,
                experienceYears: 19,
                specialties: ['Kundli Milan', 'Marriage', 'Navamsha'],
                consultationFee: 990,
                isOnline: true,
              },
              {
                id: 3,
                name: 'Dr. Sunita Upadhyay',
                title: 'Vedic Numerologist & KP Astro',
                avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
                rating: 4.89,
                reviewCount: 840,
                experienceYears: 15,
                specialties: ['Numerology', 'Health', 'Prashna'],
                consultationFee: 900,
                isOnline: true,
              },
              {
                id: 4,
                name: 'Acharya Brijesh Tiwari',
                title: 'Jaimini & Remedial Jyotish',
                avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
                rating: 4.95,
                reviewCount: 1120,
                experienceYears: 22,
                specialties: ['Dasha Bhukti', 'Sade Sati', 'Puja'],
                consultationFee: 1350,
                isOnline: true,
              },
            ]).map((astrologer: any) => {
              const perMinute = Math.round(astrologer.consultationFee / 45) || 25;
              return (
                <div
                  key={astrologer.id}
                  className="w-[280px] sm:w-[310px] flex-shrink-0 bg-white border border-[#EAE1D2] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Photo with Green Border + Verified Badge */}
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="relative">
                        <img
                          src={
                            astrologer.avatarUrl ||
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={astrologer.name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500 ring-offset-2 ring-offset-white shadow-xs"
                        />
                        {/* Green Online Dot */}
                        <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0 shadow-xs" />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{language === 'mr' ? 'प्रमाणित' : 'Verified'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                          <span>{t('carousel.online')}</span>
                        </span>
                      </div>
                    </div>

                    {/* Astrologer Info */}
                    <h3 className="font-serif text-base font-bold text-[#2D1810] line-clamp-1">
                      {astrologer.name}
                    </h3>
                    <p className="text-xs text-[#D97706] font-medium line-clamp-1">
                      {astrologer.title}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center space-x-2 mt-1.5 text-xs">
                      <span className="text-amber-500 font-bold flex items-center">
                        ★ {formatNumber(astrologer.rating || 4.9)}
                      </span>
                      <span className="text-[#786C60]">
                        ({formatNumber(astrologer.reviewCount || 450)} {t('astrologers.reviews')})
                      </span>
                    </div>

                    {/* Experience & Specialties */}
                    <div className="mt-3 pt-2.5 border-t border-[#F5EFE6] space-y-2 text-xs text-[#6B5A4E]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span>{t('carousel.exp')}:</span>
                        <strong className="text-[#2D1810]">
                          {formatNumber(astrologer.experienceYears || 15)}+ {t('common.years')}
                        </strong>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {(Array.isArray(astrologer.specialties)
                          ? astrologer.specialties.slice(0, 3)
                          : ['Vedic', 'Kundli', 'Career']
                        ).map((spec: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-[#FAF7F2] text-[#4A2E18] px-2 py-0.5 rounded-md border border-[#EAE1D2]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rate & Green Outlined Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-[#F5EFE6]">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-[11px] text-[#786C60]">
                        {language === 'mr' ? 'सल्ला दर:' : 'Rate:'}
                      </span>
                      <span className="font-serif text-base font-bold text-[#2D1810]">
                        {formatCurrency(perMinute)}
                        <span className="text-xs font-normal text-[#786C60]">{t('carousel.perMin')}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Outlined Green Chat Button */}
                      <Link
                        href={`/chat`}
                        className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('carousel.chatBtn')}</span>
                      </Link>

                      {/* Outlined Green Call Button */}
                      <Link
                        href={`/booking?astrologerId=${astrologer.id}`}
                        className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('carousel.callBtn')}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. MAIN 2-COLUMN PORTAL SECTION
         ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ====================================================
              LEFT / MAIN COLUMN (8 of 12 cols on desktop)
             ==================================================== */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* A. 12 ZODIAC DAILY HOROSCOPE MODULE (Aaj Ka Rashifal) */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-[#F5EFE6]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
                    {t('home.horoscopeTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2D1810] mt-0.5">
                    {t('home.horoscopeTitle')}
                  </h2>
                </div>
                <Link
                  href="/horoscope"
                  className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center"
                >
                  <span>{t('home.viewAllSigns')}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              {/* 12 Zodiac Tabs */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {ZODIAC_OVERVIEW.map((z) => {
                  const signLabel = translateSign(z.name);
                  const isSelected = selectedZodiac.name === z.name;
                  return (
                    <button
                      key={z.name}
                      onClick={() => setSelectedZodiac(z)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#FFFBEB] border-2 border-[#F59E0B] text-[#92400E] shadow-sm scale-105 font-bold'
                          : 'bg-[#FAF7F2] border-[#EAE1D2] text-[#4A2E18] hover:border-[#F59E0B]'
                      }`}
                    >
                      <span className="text-lg">{z.symbol}</span>
                      <span className="text-[11px] font-semibold mt-0.5">{signLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Zodiac Card Preview */}
              <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EAE1D2] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl text-[#D97706]">{selectedZodiac.symbol}</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                        {translateSign(selectedZodiac.name)} ({selectedZodiac.sanskrit})
                      </h3>
                      <p className="text-[11px] text-[#786C60]">
                        {language === 'mr' ? 'राशी स्वामी:' : 'Lord:'}{' '}
                        <strong className="text-[#2D1810]">
                          {language === 'mr' ? selectedZodiac.lordMr : selectedZodiac.lord}
                        </strong>{' '}
                        • {language === 'mr' ? 'तत्त्व:' : 'Element:'}{' '}
                        <strong className="text-[#2D1810]">
                          {language === 'mr' ? selectedZodiac.elementMr : selectedZodiac.element}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A] text-[#92400E] font-medium">
                      {t('home.luckyNo')}: <strong>{formatNumber(selectedZodiac.luckyNumber)}</strong>
                    </span>
                    <span className="bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A] text-[#92400E] font-medium">
                      {t('home.luckyColor')}:{' '}
                      <strong>{language === 'mr' ? selectedZodiac.luckyColorMr : selectedZodiac.luckyColor}</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4A2E18] leading-relaxed pt-2 border-t border-[#F5EFE6]">
                  {language === 'mr' ? selectedZodiac.adviceMr : selectedZodiac.advice}
                </p>

                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/horoscope?sign=${selectedZodiac.name}`}
                    className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs font-semibold rounded-lg hover:opacity-95 shadow-xs flex items-center space-x-1"
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
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
                    {t('home.toolsTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2D1810] mt-0.5">
                    {t('home.toolsTitle')}
                  </h2>
                </div>
                <Link
                  href="/tools"
                  className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center"
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
                      className="group bg-white p-5 rounded-2xl border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] hover:-translate-y-1 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] group-hover:bg-[#F59E0B] group-hover:text-white transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#FAF7F2] text-[#92400E] border border-[#EAE1D2] rounded-full">
                            {tag}
                          </span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs text-[#786C60] mt-1.5 leading-relaxed">{desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#F5EFE6] flex items-center text-xs font-bold text-[#D97706] group-hover:translate-x-1 transition-transform">
                        <span>{t('home.calculateNow')}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* C. COMPREHENSIVE VEDIC REPORTS (Connected to Strapi Services) */}
            <section className="bg-[#FFFDF9] text-[#2D1810] p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 pb-4 border-b border-[#F5EFE6]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
                    {t('home.reportsTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2D1810] mt-0.5">
                    {t('home.reportsTitle')}
                  </h2>
                </div>
                <Link
                  href="/pricing"
                  className="text-xs font-bold text-[#D97706] hover:underline flex items-center"
                >
                  <span>{t('home.viewPricing')}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(Array.isArray(services) ? services : []).slice(0, 3).map((service) => {
                  const sTitle = getLocalizedField(service, 'title', language) || service.title;
                  const sDesc =
                    getLocalizedField(service, 'shortDescription', language) || service.shortDescription;
                  return (
                    <div
                      key={service.id}
                      className="bg-white border border-[#EAE1D2] rounded-2xl p-5 flex flex-col justify-between hover:border-[#F59E0B] hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] uppercase font-bold text-[#92400E] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                            {service.category}
                          </span>
                          {service.badge && (
                            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {service.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-base font-bold text-[#2D1810]">{sTitle}</h3>
                        <p className="text-xs text-[#786C60] mt-1.5 leading-relaxed line-clamp-2">
                          {sDesc}
                        </p>

                        <div className="mt-3 py-2 border-y border-[#F5EFE6] flex items-baseline space-x-2">
                          <span className="font-serif text-xl font-bold text-[#B45309]">
                            {formatCurrency(service.discountedPrice || service.price)}
                          </span>
                          {service.discountedPrice && (
                            <span className="text-xs text-[#786C60]/60 line-through">
                              {formatCurrency(service.price)}
                            </span>
                          )}
                          <span className="text-[10px] text-[#786C60] ml-auto">{t('home.oneTime')}</span>
                        </div>

                        <ul className="mt-3 space-y-1.5 text-xs text-[#4A2E18]">
                          {(Array.isArray(service.features) ? service.features : []).slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="flex items-center space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-5 pt-3">
                        <Link
                          href={
                            service.slug === 'detailed-kundli'
                              ? '/reports/premium-kundli'
                              : `/reports/${service.slug}`
                          }
                          className="w-full block text-center py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-xs tracking-wide shadow-xs hover:opacity-95"
                        >
                          {t('home.viewReportPreview')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* D. VEDIC ARTICLES & EPHEMERIS RESEARCH */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
                    {t('home.articlesTag')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2D1810] mt-0.5">
                    {t('home.articlesTitle')}
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center"
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
                      className="group bg-white rounded-2xl border border-[#EAE1D2] overflow-hidden shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all flex flex-col justify-between"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-[#D97706] uppercase tracking-wider mb-2">
                          <span>{art.category}</span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors leading-snug">
                          {artTitle}
                        </h3>
                        <p className="text-xs text-[#786C60] mt-2 line-clamp-3 leading-relaxed">
                          {artExcerpt}
                        </p>
                      </div>
                      <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#F5EFE6] flex items-center justify-between text-xs text-[#6B5A4E]">
                        <span>{t('home.byAuthor', { author: art.author })}</span>
                        <span className="font-bold text-[#D97706] group-hover:translate-x-1 transition-transform flex items-center">
                          {t('home.readGuide')} &rarr;
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* E. FREQUENTLY ASKED QUESTIONS ACCORDION */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
                  {t('home.faqTag')}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2D1810] mt-0.5">
                  {t('home.faqTitle')}
                </h2>
              </div>

              <div className="space-y-3">
                {(Array.isArray(faqs) ? faqs : []).map((faq, index) => {
                  const q = getLocalizedField(faq, 'question', language) || faq.question;
                  const a = getLocalizedField(faq, 'answer', language) || faq.answer;
                  const isOpen = activeFaq === index;
                  return (
                    <div
                      key={faq.id}
                      className="border border-[#EAE1D2] rounded-xl overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="w-full p-4 text-left flex justify-between items-center text-xs sm:text-sm font-semibold text-[#2D1810] hover:text-[#D97706] bg-white transition-colors"
                      >
                        <span>{q}</span>
                        <span className="text-base font-bold text-[#D97706] ml-2">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-[#6B5A4E] leading-relaxed border-t border-[#F5EFE6] bg-[#FAF7F2] pt-3">
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
            <div className="bg-[#FFFDF9] text-[#2D1810] p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE1D2]">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-[#D97706]" />
                  <h3 className="font-serif text-base font-bold text-[#2D1810]">
                    {t('home.panchangTitle')}
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#92400E] bg-[#FFFBEB] px-2.5 py-0.5 rounded border border-[#FDE68A]">
                  {t('home.panchangCity')}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#F5EFE6] pb-1.5">
                  <span className="text-[#786C60]">{t('home.auspiciousTithi')}</span>
                  <strong className="text-[#2D1810]">
                    {language === 'mr' ? 'शुक्ल द्वादशी' : 'Shukla Dwadashi'}
                  </strong>
                </div>
                <div className="flex justify-between border-b border-[#F5EFE6] pb-1.5">
                  <span className="text-[#786C60]">{t('home.governingNakshatra')}</span>
                  <strong className="text-[#2D1810]">
                    {language === 'mr' ? 'रेवती (चरण ३)' : 'Revati (Pada 3)'}
                  </strong>
                </div>
                <div className="flex justify-between border-b border-[#F5EFE6] pb-1.5">
                  <span className="text-[#786C60]">{t('home.abhijitMuhurat')}</span>
                  <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    11:58 AM - 12:44 PM
                  </strong>
                </div>
                <div className="flex justify-between border-b border-[#F5EFE6] pb-1.5">
                  <span className="text-[#786C60]">{t('home.rahuKaalam')}</span>
                  <strong className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
                    04:22 PM - 05:46 PM
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786C60]">{t('home.sunMoonRashi')}</span>
                  <strong className="text-[#D97706]">
                    {language === 'mr' ? 'तूळ / मीन' : 'Libra / Pisces'}
                  </strong>
                </div>
              </div>

              <Link
                href="/panchang"
                className="w-full block text-center py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-xs rounded-xl shadow-xs hover:opacity-95 transition-all"
              >
                {t('home.openPanchang')}
              </Link>
            </div>

            {/* 2. SPOTLIGHT SCHOLAR OF THE DAY */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#F5EFE6]">
                <Award className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-serif text-base font-bold text-[#2D1810]">
                  {t('home.astrologerOfDay')}
                </h3>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                    alt="Acharya Vidyadhar"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500 ring-offset-2 flex-shrink-0"
                  />
                  <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#2D1810]">
                    {language === 'mr' ? 'आचार्य विद्याधर शास्त्री' : 'Acharya Vidyadhar Shastri'}
                  </h4>
                  <p className="text-[11px] text-[#D97706] font-medium">
                    {language === 'mr'
                      ? `ज्येष्ठ ज्योतिषरत्न (${formatNumber(28)} वर्षे अनुभव)`
                      : 'Senior Jyotish Ratna (28 Yrs Exp)'}
                  </p>
                  <span className="text-amber-500 text-xs font-bold">
                    ★ {formatNumber(4.98)} ({formatNumber(1450)} {t('astrologers.reviews')})
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6B5A4E] leading-relaxed">
                {language === 'mr'
                  ? 'करिअर, विवाह गुणमेलन आणि रत्न सल्ल्यासाठी तातडीने उपलब्ध.'
                  : 'Available right now for confidential video & voice calls covering career promotions, marriage compatibility, and gemstone prescriptions.'}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#786C60] block">{t('home.sessionFee')}</span>
                  <span className="font-serif text-base font-bold text-[#2D1810]">
                    {formatCurrency(1499)}
                  </span>
                </div>
                <Link
                  href="/booking?astrologerId=1"
                  className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity flex items-center space-x-1 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 mr-1" />
                  <span>{t('home.callChatNow')}</span>
                </Link>
              </div>
            </div>

            {/* 3. ASTROPAY WALLET & CONSULTATION CREDITS */}
            <div className="bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-[#2D1810] p-6 rounded-3xl border border-[#FDE68A] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-[#D97706]" />
                  <h3 className="font-serif text-sm font-bold text-[#92400E]">
                    {t('home.walletTitle')}
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {t('home.walletActive')}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#FDE68A] flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-[#786C60] block">{t('home.availableCredits')}</span>
                  <span className="font-serif text-2xl font-bold text-[#B45309]">
                    {formatCurrency(walletBal)}
                  </span>
                </div>
                <Link
                  href="/wallet"
                  className="px-3 py-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-bold rounded-lg hover:bg-[#FEF3C7] transition-colors"
                >
                  {t('home.addFunds')}
                </Link>
              </div>

              <p className="text-[11px] text-[#78350F] leading-relaxed">
                {t('home.walletDesc')}
              </p>
            </div>

            {/* 4. VEDIC HEALING & REMEDIES CARD */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#F5EFE6]">
                <Shield className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-serif text-base font-bold text-[#2D1810]">
                  {t('home.healingTitle')}
                </h3>
              </div>

              <ul className="space-y-2 text-xs text-[#4A2E18]">
                <li className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FFFBEB] transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>💎</span>
                    <span className="font-medium">{t('home.gemstones')}</span>
                  </span>
                  <Link href="/healing" className="text-[#D97706] font-bold text-[11px]">&rarr;</Link>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FFFBEB] transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>📿</span>
                    <span className="font-medium">{t('home.rudraksha')}</span>
                  </span>
                  <Link href="/healing" className="text-[#D97706] font-bold text-[11px]">&rarr;</Link>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FFFBEB] transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>🕉️</span>
                    <span className="font-medium">{t('home.mantras')}</span>
                  </span>
                  <Link href="/healing" className="text-[#D97706] font-bold text-[11px]">&rarr;</Link>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FFFBEB] transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>🔯</span>
                    <span className="font-medium">{t('home.yantras')}</span>
                  </span>
                  <Link href="/healing" className="text-[#D97706] font-bold text-[11px]">&rarr;</Link>
                </li>
              </ul>

              <Link
                href="/healing"
                className="w-full block text-center py-2 border border-[#EAE1D2] text-xs font-bold text-[#D97706] rounded-xl hover:border-[#D97706] hover:bg-[#FAF7F2] transition-colors"
              >
                {t('home.exploreRemedies')}
              </Link>
            </div>

            {/* 5. UPCOMING AUSPICIOUS FESTIVALS */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F5EFE6]">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-[#D97706]" />
                  <h3 className="font-serif text-base font-bold text-[#2D1810]">
                    {t('home.festivalsTitle')}
                  </h3>
                </div>
                <Link href="/festivals" className="text-[11px] text-[#D97706] font-semibold hover:underline">
                  {t('home.viewAll')}
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                {FESTIVALS_LIST.map((fest, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE1D2]">
                    <strong className="block text-[#2D1810]">
                      {language === 'mr' ? fest.titleMr : fest.titleEn}
                    </strong>
                    <span className="text-[11px] text-[#786C60]">
                      {language === 'mr' ? fest.metaMr : fest.metaEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. SANATANA WISDOM COMMUNITY & SOCIAL */}
            <div className="bg-[#FFFDF9] text-[#2D1810] p-6 rounded-3xl border border-[#EAE1D2] text-center space-y-3 shadow-xs">
              <Sparkles className="w-7 h-7 text-[#D97706] mx-auto" />
              <h4 className="font-serif text-sm font-bold text-[#2D1810]">
                {t('home.communityTitle')}
              </h4>
              <p className="text-xs text-[#786C60] leading-relaxed">
                {t('home.communityDesc')}
              </p>
              <div className="pt-2 flex justify-center space-x-2 text-xs">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg text-[#92400E] font-medium hover:bg-[#FEF3C7] transition-colors"
                >
                  {t('home.telegram')}
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg text-[#92400E] font-medium hover:bg-[#FEF3C7] transition-colors"
                >
                  {t('home.youtube')}
                </a>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* ========================================================
          7. WHY CHOOSE JYOTISHVEDA (Trust & Authority Pillars)
         ======================================================== */}
      <section className="bg-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#FDE68A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
              {language === 'mr' ? 'विश्वास आणि अचूकता' : 'Trust & Authenticity'}
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#2D1810] mt-1">
              {t('why.title')}
            </h2>
            <p className="text-sm text-[#786C60] mt-2 leading-relaxed">
              {t('why.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center text-[#D97706] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2D1810] mb-2">
                {t('why.card1Title')}
              </h3>
              <p className="text-xs text-[#786C60] leading-relaxed">
                {t('why.card1Desc')}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center text-[#D97706] mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2D1810] mb-2">
                {t('why.card2Title')}
              </h3>
              <p className="text-xs text-[#786C60] leading-relaxed">
                {t('why.card2Desc')}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center text-[#D97706] mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2D1810] mb-2">
                {t('why.card3Title')}
              </h3>
              <p className="text-xs text-[#786C60] leading-relaxed">
                {t('why.card3Desc')}
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center text-[#D97706] mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2D1810] mb-2">
                {t('why.card4Title')}
              </h3>
              <p className="text-xs text-[#786C60] leading-relaxed">
                {t('why.card4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. SEEKER TESTIMONIALS & EXPERIENCES
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
            {language === 'mr' ? 'अनुभव व प्रतिक्रिया' : 'Testimonials & Reviews'}
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-[#2D1810] mt-1">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm text-[#786C60] mt-2 leading-relaxed">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center space-x-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, sIdx) => (
                    <Star key={sIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-[#4A2E18] leading-relaxed italic mb-4">
                  &ldquo;{language === 'mr' ? item.textMr : item.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#2D1810]">
                    {language === 'mr' ? item.nameMr : item.name}
                  </h4>
                  <span className="text-[10px] text-[#786C60] block">
                    {language === 'mr' ? item.cityMr : item.city}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'mr' ? 'पडताळणी' : 'Verified'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          9. FINAL CONSULTATION CTA BANNER
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          {/* Subtle celestial pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{t('ticker.msg1')}</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold leading-tight">
              {language === 'mr'
                ? 'आपल्या ग्रहदशेचे रहस्य जाणून घेण्यासाठी तयार आहात?'
                : 'Ready to Discover What the Stars Have in Store?'}
            </h2>

            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed max-w-xl">
              {language === 'mr'
                ? 'आजच आपल्या जन्मकुंडलीचे सखोल विश्लेषण करा किंवा अनुभवी वैदिक ज्योतिषांशी थेट १-ऑन-१ संवाद साधा.'
                : 'Connect with verified Vedic Acharyas today. First 5 minutes of consultation are completely free for all newly registered seekers.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/chat"
                className="px-6 py-3 bg-white text-[#92400E] font-serif font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-amber-50 transition-all flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 text-[#D97706]" />
                <span>{language === 'mr' ? 'पहिले चॅट मोफत सुरू करा' : 'Start Free First Chat'}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/astrologers"
                className="px-5 py-3 bg-[#78350F]/50 border border-white/40 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#78350F]/70 transition-all flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>{language === 'mr' ? 'सर्व ज्योतिषी शोधा' : 'Explore Astrologers'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
