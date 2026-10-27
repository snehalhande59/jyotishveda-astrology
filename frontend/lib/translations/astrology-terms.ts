export const MARATHI_ZODIAC: Record<string, { mr: string; sanskrit: string; element: string }> = {
  Aries: { mr: 'मेष', sanskrit: 'मेष', element: 'अग्नी' },
  Taurus: { mr: 'वृषभ', sanskrit: 'वृषभ', element: 'पृथ्वी' },
  Gemini: { mr: 'मिथुन', sanskrit: 'मिथुन', element: 'वायू' },
  Cancer: { mr: 'कर्क', sanskrit: 'कर्क', element: 'जल' },
  Leo: { mr: 'सिंह', sanskrit: 'सिंह', element: 'अग्नी' },
  Virgo: { mr: 'कन्या', sanskrit: 'कन्या', element: 'पृथ्वी' },
  Libra: { mr: 'तूळ', sanskrit: 'तुला', element: 'वायू' },
  Scorpio: { mr: 'वृश्चिक', sanskrit: 'वृश्चिक', element: 'जल' },
  Sagittarius: { mr: 'धनु', sanskrit: 'धनु', element: 'अग्नी' },
  Capricorn: { mr: 'मकर', sanskrit: 'मकर', element: 'पृथ्वी' },
  Aquarius: { mr: 'कुंभ', sanskrit: 'कुंभ', element: 'वायू' },
  Pisces: { mr: 'मीन', sanskrit: 'मीन', element: 'जल' },
};

export const MARATHI_PLANETS: Record<string, { mr: string; sanskrit: string }> = {
  Sun: { mr: 'सूर्य', sanskrit: 'सूर्य' },
  Moon: { mr: 'चंद्र', sanskrit: 'चंद्र' },
  Mars: { mr: 'मंगळ', sanskrit: 'मंगळ' },
  Mercury: { mr: 'बुध', sanskrit: 'बुध' },
  Jupiter: { mr: 'गुरू', sanskrit: 'गुरू' },
  Venus: { mr: 'शुक्र', sanskrit: 'शुक्र' },
  Saturn: { mr: 'शनी', sanskrit: 'शनी' },
  Rahu: { mr: 'राहू', sanskrit: 'राहू' },
  Ketu: { mr: 'केतू', sanskrit: 'केतू' },
  Ascendant: { mr: 'लग्न', sanskrit: 'लग्न' },
  Lagna: { mr: 'लग्न', sanskrit: 'लग्न' },
};

export const MARATHI_DIGNITIES: Record<string, string> = {
  Exalted: 'उच्च (Uchcha)',
  Debilitated: 'नीच (Neecha)',
  'Own Sign': 'स्वराशी (Sva)',
  Neutral: 'सम / तटस्थ (Neutral)',
  Friendly: 'मित्र राशी',
  Enemy: 'शत्रू राशी',
};

export const MARATHI_MOTIONS: Record<string, string> = {
  Direct: 'मार्गी',
  Retrograde: 'वक्री (R)',
};

export const MARATHI_BHAVAS: Record<number, { name: string; title: string }> = {
  1: { name: 'प्रथम भाव', title: 'तनु भाव (शरीर, व्यक्तिमत्त्व, स्वास्थ्य)' },
  2: { name: 'द्वितीय भाव', title: 'धन भाव (कुटुंब, संपत्ती, वाणी)' },
  3: { name: 'तृतीय भाव', title: 'पराक्रम भाव (बंधू, धैर्य, शौर्य)' },
  4: { name: 'चतुर्थ भाव', title: 'सुख भाव (माता, घर, वाहन, मन)' },
  5: { name: 'पंचम भाव', title: 'पुत्र भाव (संतती, बुद्धी, पूर्वपुण्य)' },
  6: { name: 'षष्ठ भाव', title: 'रिपू भाव (रोग, शत्रू, स्पर्धा, ऋण)' },
  7: { name: 'सप्तम भाव', title: 'विवाह भाव (पती/पत्नी, भागीदारी, संसार)' },
  8: { name: 'अष्टम भाव', title: 'आयुष्य भाव (गूढ विद्या, संकट, वारसा)' },
  9: { name: 'नवम भाव', title: 'भाग्य भाव (धर्म, तीर्थयात्रा, गुरू, उच्च शिक्षण)' },
  10: { name: 'दशम भाव', title: 'कर्म भाव (व्यवसाय, पद, प्रतिष्ठा, सत्ता)' },
  11: { name: 'एकादश भाव', title: 'लाभ भाव (उत्पन्न, मित्र, इच्छापूर्ती)' },
  12: { name: 'द्वादश भाव', title: 'व्यय भाव (खर्च, परदेश गमन, मोक्ष, दान)' },
};

export function toDevanagariNumerals(input: string | number): string {
  if (input === null || input === undefined) return '';
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(input).replace(/[0-9]/g, (digit) => devanagariDigits[parseInt(digit, 10)]);
}

export function translatePlanetName(name: string, lang: 'en' | 'mr'): string {
  if (lang !== 'mr') return name;
  const match = MARATHI_PLANETS[name] || Object.entries(MARATHI_PLANETS).find(([k]) => name.toLowerCase().includes(k.toLowerCase()))?.[1];
  return match ? `${match.mr} (${match.sanskrit})` : name;
}

export function translateZodiacSign(sign: string, lang: 'en' | 'mr'): string {
  if (lang !== 'mr') return sign;
  const cleanSign = sign.split(' ')[0];
  const match = MARATHI_ZODIAC[cleanSign] || Object.entries(MARATHI_ZODIAC).find(([k]) => sign.toLowerCase().includes(k.toLowerCase()))?.[1];
  return match ? `${match.mr} (${cleanSign})` : sign;
}

export function translateDignity(dignity: string, lang: 'en' | 'mr'): string {
  if (lang !== 'mr') return dignity;
  return MARATHI_DIGNITIES[dignity] || dignity;
}

export function translateMotion(motion: string, lang: 'en' | 'mr'): string {
  if (lang !== 'mr') return motion;
  return MARATHI_MOTIONS[motion] || motion;
}
