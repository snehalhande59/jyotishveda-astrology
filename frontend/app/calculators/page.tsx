'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Calculator,
  Sparkles,
  Heart,
  Compass,
  Star,
  Moon,
  Flame,
  Users,
  Shield,
  Layers,
  Car,
  Grid,
  Search,
  ChevronRight,
  Sun,
} from 'lucide-react';

interface CalcCard {
  href: string;
  title: string;
  titleMr: string;
  category: 'vedic' | 'numerology' | 'love' | 'celestial';
  desc: string;
  descMr: string;
  icon: any;
  badge?: string;
}

const ALL_CALCULATORS: CalcCard[] = [
  // 1. Love
  {
    href: '/calculators/love',
    title: 'Love Calculator',
    titleMr: 'लव्ह कॅल्क्युलेटर',
    category: 'love',
    desc: 'Combines Vedic Moon sign polarity, Venus-Mars magnetic axis, and Chaldean name resonance.',
    descMr: 'चंद्र राशी सुसंगतता आणि शुक्र-मंगळ योगावर आधारित अचूक प्रेम टक्केवारी.',
    icon: Heart,
    badge: 'Popular',
  },
  // 2. Numerology
  {
    href: '/calculators/numerology',
    title: 'Numerology Calculator',
    titleMr: 'संख्याशास्त्र (न्यूमरोलॉजी) कॅल्क्युलेटर',
    category: 'numerology',
    desc: 'Calculates Life Path, Destiny, Soul Urge, Birthday number, and ruling cosmic planet.',
    descMr: 'मूलांक, भाग्यांक, नामांक आणि अनुकूल ग्रहांची शास्त्रीय माहिती.',
    icon: Calculator,
    badge: 'Essential',
  },
  // 3. Rising Sign
  {
    href: '/calculators/rising-sign',
    title: 'Rising Sign (Lagna) Calculator',
    titleMr: 'लग्न राशी कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Calculates your authentic 1st house rising sign using pure Lahiri Ayanamsa and exact birth time.',
    descMr: 'लाहिरी अयनांशानुसार जन्म वेळेवर आधारित अचूक उदित लग्न राशी व अंश.',
    icon: Compass,
    badge: 'Core Vedic',
  },
  // 4. Dasha
  {
    href: '/calculators/dasha',
    title: 'Vimshottari Dasha Calculator',
    titleMr: 'विंशोत्तरी दशा कॅल्क्युलेटर',
    category: 'vedic',
    desc: '120-year chronological sequence of planetary Mahadashas and Antardashas from birth constellation.',
    descMr: 'जन्म नक्षत्रावर आधारित १२० वर्षांची महादशा आणि चालू कालखंड चक्र.',
    icon: Layers,
    badge: 'Core Vedic',
  },
  // 5. Mangal Dosha
  {
    href: '/calculators/mangal-dosha',
    title: 'Mangal Dosha (Kuja) Calculator',
    titleMr: 'मंगळ दोष कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Analyzes Mars in 1st, 2nd, 4th, 7th, 8th, 12th houses with authentic Parashari cancellation rules.',
    descMr: 'मंगळाचे स्थान आणि पराशरोक्त दोष निवारण व अपवाद नियमांची तपासणी.',
    icon: Shield,
    badge: 'Crucial for Vivah',
  },
  // 6. Moon Phase
  {
    href: '/calculators/moon-phase',
    title: 'Moon Phase & Tithi Calculator',
    titleMr: 'चंद्र कला व तिथी कॅल्क्युलेटर',
    category: 'celestial',
    desc: 'Real-time lunar illumination, Shukla/Krishna Paksha, and auspicious Tithi for any date.',
    descMr: 'चंद्र प्रकाश टक्केवारी, शुक्ल/कृष्ण पक्ष आणि शुभ तिथी गणना.',
    icon: Moon,
  },
  // 7. Flames
  {
    href: '/calculators/flames',
    title: 'Flames Calculator',
    titleMr: 'फ्लेम्स (FLAMES) कॅल्क्युलेटर',
    category: 'love',
    desc: 'Algorithmic relationship compatibility (Friends, Lovers, Affectionate, Marriage, Enemies, Siblings).',
    descMr: 'नावांमधील अक्षरांवरून मैत्री, प्रेम, विवाह किंवा बंधुभाव संबंधांची शास्त्रीय पडताळणी.',
    icon: Flame,
  },
  // 8. Friendship
  {
    href: '/calculators/friendship',
    title: 'Friendship Calculator',
    titleMr: 'मैत्री सुसंगतता कॅल्क्युलेटर',
    category: 'love',
    desc: 'Planetary Maitri matrix between ruling grahas blended with name vibrations.',
    descMr: 'ग्रह मैत्री चक्र आणि नावांच्या कंपनांवर आधारित प्रामाणिक मैत्री गुण.',
    icon: Users,
  },
  // 9. Ishta Devata
  {
    href: '/calculators/ishta-devata',
    title: 'Ishta Devata Calculator',
    titleMr: 'इष्ट देवता कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Jaimini Sutra method finding your guiding deity via the 12th house from Karakamsa in D-9 Navamsha.',
    descMr: 'जैमिनी ज्योतिषानुसार आत्मकारकाच्या नवमांश १२ व्या स्थानावरून वैयक्तिक इष्ट देवता.',
    icon: Star,
    badge: 'Jaimini Shastra',
  },
  // 10. Transit Chart
  {
    href: '/calculators/transit-chart',
    title: 'Transit Chart (Gochara) Calculator',
    titleMr: 'गोचर कुंडली कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Real-time planetary positions across 12 houses evaluated against your natal Lagna.',
    descMr: 'सध्याचे ग्रहांचे गोचर भ्रमण आणि तुमच्या जन्म लग्नावरील प्रभाव.',
    icon: Compass,
  },
  // 11. Atmakaraka & Darakaraka
  {
    href: '/calculators/atmakaraka-darakaraka',
    title: 'Atmakaraka & Darakaraka Calculator',
    titleMr: 'आत्मकारक व दारकारक कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Calculates the 7 Jaimini Karakas revealing Soul Mission (AK) and Life Partner energy (DK).',
    descMr: 'जैमिनी पद्धतीनुसार आत्मकारक (आत्मा), अमात्यकारक आणि दारकारक (जीवनसाथी).',
    icon: Star,
    badge: 'Jaimini Shastra',
  },
  // 12. Sun Sign
  {
    href: '/calculators/sun-sign',
    title: 'Sun Sign Calculator (Vedic vs Western)',
    titleMr: 'सूर्य राशी कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Compares your true Nirayana Sidereal Sun sign against Tropical Western dates.',
    descMr: 'भारतीय सौर निरयन सूर्य राशी आणि पाश्चात्य सायन राशीतील फरक.',
    icon: Sun,
  },
  // 13. Rashi
  {
    href: '/calculators/rashi',
    title: 'Chandra Rashi (Moon Sign) Calculator',
    titleMr: 'चंद्र राशी कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Determines your authentic Vedic Moon sign from birth date, time, and coordinates.',
    descMr: 'जन्म वेळेनुसार चंद्र ज्या राशीत उपस्थित असतो ती खरी वैदिक चंद्र राशी.',
    icon: Moon,
    badge: 'Core Vedic',
  },
  // 14. Nakshatra
  {
    href: '/calculators/nakshatra',
    title: 'Nakshatra & Pada Calculator',
    titleMr: 'नक्षत्र व चरण कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Identifies your Janma Nakshatra (out of 27), Pada (1-4), governing deity, and Lord.',
    descMr: '२७ नक्षत्रांपैकी तुमचे जन्म नक्षत्र, चरण, देवता आणि स्वामी ग्रह.',
    icon: Sparkles,
    badge: 'Core Vedic',
  },
  // 15. Shani Sade Sati
  {
    href: '/calculators/sade-sati',
    title: 'Shani Sade Sati Calculator',
    titleMr: 'शनि साडेसाती कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Calculates whether you are in the Rising, Peak, or Setting phase of Saturn 7.5-year cycle.',
    descMr: 'शनि साडेसातीचे चालू चरण (प्रथम, द्वितीय, तृतीय) व प्रभावी उपाय.',
    icon: Shield,
    badge: 'High Impact',
  },
  // 16. Birth Chart
  {
    href: '/calculators/birth-chart',
    title: 'Birth Chart (Janam Kundli) Calculator',
    titleMr: 'जन्म कुंडली कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Computes complete 12 Bhavas, planetary degrees, retrograde status, and North/South chart SVGs.',
    descMr: '१२ भाव, ९ ग्रह, वक्री स्थिती आणि उत्तर/दक्षिण भारतीय कुंडली आलेख.',
    icon: Compass,
    badge: 'Complete Kundli',
  },
  // 17. Lucky Vehicle Number
  {
    href: '/calculators/lucky-vehicle-number',
    title: 'Lucky Vehicle Number Calculator',
    titleMr: 'शुभ वाहन क्रमांक कॅल्क्युलेटर',
    category: 'numerology',
    desc: 'Evaluates number plate vibrations via Chaldean reduction against your Life Path.',
    descMr: 'तुमच्या वाहनाच्या नंबर प्लेटची संख्याशास्त्रीय सुसंगतता व शुभ रंग.',
    icon: Car,
  },
  // 18. Kaal Sarp Dosh
  {
    href: '/calculators/kaal-sarp-dosh',
    title: 'Kaal Sarp Dosh Calculator',
    titleMr: 'कालसर्प दोष कॅल्क्युलेटर',
    category: 'vedic',
    desc: 'Identifies whether 7 planets are hemmed inside Rahu-Ketu axis across 12 distinct varieties.',
    descMr: 'राहु-केतू अक्षावर आधारित १२ प्रकारच्या कालसर्प दोषांचे सखोल विश्लेषण.',
    icon: Shield,
    badge: 'Vedic Dosha',
  },
  // 19. Lo Shu Grid
  {
    href: '/calculators/lo-shu-grid',
    title: 'Lo Shu Grid Calculator',
    titleMr: 'लो शू ग्रिड कॅल्क्युलेटर',
    category: 'numerology',
    desc: 'Maps birth date into the 3x3 Magic Square to reveal Mental, Emotional, and Will planes.',
    descMr: '३x३ च्या प्राचीन जादुई चौकोनावरून मानसिक, भावनिक व कृती योगांचे विश्लेषण.',
    icon: Grid,
    badge: 'Ancient 3x3 Grid',
  },
  // 20. Name Compatibility
  {
    href: '/calculators/name-compatibility',
    title: 'Name Compatibility Calculator',
    titleMr: 'नाव सुसंगतता कॅल्क्युलेटर',
    category: 'numerology',
    desc: 'Chaldean compound number comparison revealing interpersonal vibrational harmony.',
    descMr: 'काल्डियन संख्याशास्त्रावर आधारित दोन नावांची ध्वनी व ऊर्जा सुसंगतता.',
    icon: Users,
  },
];

export default function CalculatorsPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = ALL_CALCULATORS.filter((calc) => {
    const matchesCat = selectedCategory === 'all' || calc.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      calc.title.toLowerCase().includes(q) ||
      calc.titleMr.toLowerCase().includes(q) ||
      calc.desc.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans pb-24">
      {/* Hero Header */}
      <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span>{isMr ? '२०+ मोफत वैदिक व संख्याशास्त्र कॅल्क्युलेटर' : '20+ Authentic Vedic & Numerology Calculators'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D1810]">
            {isMr ? 'ज्योतिषवेद अचूक कॅल्क्युलेटर संच' : 'JyotishVeda Classical Calculators'}
          </h1>

          <p className="text-sm sm:text-base text-[#786C60] max-w-2xl mx-auto leading-relaxed">
            {isMr
              ? 'महर्षी पराशर, जैमिनी सूत्रे आणि काल्डियन संख्याशास्त्रावर आधारित प्रामाणिक गणितीय पद्धत. कोणतीही बनावट माहिती नाही.'
              : 'Grounded in Maharishi Parashara, Jaimini Sutras, and Chaldean Numerology. Real astronomical formulas and authentic ephemeris.'}
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search className="w-4 h-4 text-[#A89887] absolute left-3.5 top-7 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isMr ? 'कॅल्क्युलेटर शोधा (उदा. प्रेम, मंगळ दोष, दशा)...' : 'Search calculator (e.g. Love, Dasha, Sade Sati)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#EAE1D2] rounded-2xl text-xs sm:text-sm text-[#2D1810] placeholder-[#A89887] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex items-center justify-center flex-wrap gap-2 pb-4">
          {[
            { id: 'all', label: isMr ? 'सर्व (२०)' : 'All Calculators (20)' },
            { id: 'vedic', label: isMr ? 'वैदिक ज्योतिष (१२)' : 'Vedic Astrology (12)' },
            { id: 'numerology', label: isMr ? 'संख्याशास्त्र (४)' : 'Numerology (4)' },
            { id: 'love', label: isMr ? 'प्रेम व नातेसंबंध (३)' : 'Love & Compatibility (3)' },
            { id: 'celestial', label: isMr ? 'चंद्र कला (१)' : 'Moon & Celestial (1)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === tab.id
                  ? 'bg-[#D97706] text-white shadow-md'
                  : 'bg-white text-[#5C4535] border border-[#EAE1D2] hover:bg-[#FFF9EB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((calc, idx) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-white rounded-3xl border border-[#EAE1D2] p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-[#D97706] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    {calc.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                        {calc.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                    {idx + 1}. {isMr ? calc.titleMr : calc.title}
                  </h3>

                  <p className="text-xs text-[#786C60] mt-2 line-clamp-3 leading-relaxed">
                    {isMr ? calc.descMr : calc.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F5EFE6] flex items-center justify-between text-xs font-semibold text-[#D97706]">
                  <span>{isMr ? 'आता मोजा' : 'Calculate Now'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
