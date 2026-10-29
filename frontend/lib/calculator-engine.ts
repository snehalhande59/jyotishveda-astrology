// JyotishVeda Classical Vedic & Numerological Calculation Engine
// Adheres strictly to Parashari, Jaimini, and Chaldean systems

export interface BirthDetailsInput {
  fullName: string;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:mm
  latitude?: number;
  longitude?: number;
  cityName?: string;
  gender?: 'male' | 'female' | 'other';
}

export const ZODIAC_SIGNS = [
  { id: 1, name: 'Aries', sanskrit: 'Mesha', lord: 'Mars', element: 'Fire' },
  { id: 2, name: 'Taurus', sanskrit: 'Vrishabha', lord: 'Venus', element: 'Earth' },
  { id: 3, name: 'Gemini', sanskrit: 'Mithuna', lord: 'Mercury', element: 'Air' },
  { id: 4, name: 'Cancer', sanskrit: 'Karka', lord: 'Moon', element: 'Water' },
  { id: 5, name: 'Leo', sanskrit: 'Simha', lord: 'Sun', element: 'Fire' },
  { id: 6, name: 'Virgo', sanskrit: 'Kanya', lord: 'Mercury', element: 'Earth' },
  { id: 7, name: 'Libra', sanskrit: 'Tula', lord: 'Venus', element: 'Air' },
  { id: 8, name: 'Scorpio', sanskrit: 'Vrishchika', lord: 'Mars', element: 'Water' },
  { id: 9, name: 'Sagittarius', sanskrit: 'Dhanu', lord: 'Jupiter', element: 'Fire' },
  { id: 10, name: 'Capricorn', sanskrit: 'Makara', lord: 'Saturn', element: 'Earth' },
  { id: 11, name: 'Aquarius', sanskrit: 'Kumbha', lord: 'Saturn', element: 'Air' },
  { id: 12, name: 'Pisces', sanskrit: 'Meena', lord: 'Jupiter', element: 'Water' },
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
];

// Chaldean Numerology Value Map
export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

// Reduce number to single digit (1-9), with master numbers 11, 22, 33 preservation option
export function reduceToSingleDigit(num: number, preserveMaster = false): number {
  if (preserveMaster && (num === 11 || num === 22 || num === 33)) return num;
  while (num > 9) {
    num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    if (preserveMaster && (num === 11 || num === 22 || num === 33)) return num;
  }
  return num;
}

// Calculate Chaldean Name Value
export function calculateNameNumber(name: string): { single: number; compound: number } {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  let compound = 0;
  for (const char of clean) {
    compound += CHALDEAN_MAP[char] || 0;
  }
  return {
    compound,
    single: reduceToSingleDigit(compound),
  };
}

// 1. LOVE CALCULATOR (Moon + Venus/Mars Polarity + Name Numerology)
export function calculateLoveCompatibility(
  person1: { name: string; dob?: string; rashiId?: number },
  person2: { name: string; dob?: string; rashiId?: number }
) {
  const num1 = calculateNameNumber(person1.name);
  const num2 = calculateNameNumber(person2.name);

  // Numerology resonance (0-30 points)
  const diff = Math.abs(num1.single - num2.single);
  let numScore = 20;
  if (diff === 0) numScore = 30;
  else if (diff === 2 || diff === 4 || diff === 6) numScore = 26;
  else if (diff === 1 || diff === 3) numScore = 22;
  else numScore = 15;

  // Astrological Rashi Harmony (0-40 points)
  const rashi1 = person1.rashiId || ((num1.single * 2) % 12) + 1;
  const rashi2 = person2.rashiId || ((num2.single * 3) % 12) + 1;
  const distance = ((rashi2 - rashi1 + 12) % 12) + 1; // Bhavas away

  let astroScore = 25;
  let astroNote = 'Harmonious relationship';
  if ([1, 5, 9].includes(distance)) {
    astroScore = 38;
    astroNote = 'Trikona relationship (Dharma triplicity) - Highly auspicious spiritual & emotional bond.';
  } else if ([3, 11].includes(distance)) {
    astroScore = 35;
    astroNote = 'Upachaya relationship (3/11 growth axis) - Excellent communication and shared progress.';
  } else if ([4, 10].includes(distance)) {
    astroScore = 28;
    astroNote = 'Kendra relationship (4/10 axis) - Dynamic, goal-oriented partnership with mutual respect.';
  } else if (distance === 7) {
    astroScore = 34;
    astroNote = 'Saptama relationship (1/7 polar axis) - Natural magnetism and mutual completion.';
  } else if ([6, 8].includes(distance)) {
    astroScore = 18;
    astroNote = 'Shadashtaka (6/8 axis) - Requires patience and mutual understanding to manage emotional waves.';
  } else if ([2, 12].includes(distance)) {
    astroScore = 20;
    astroNote = 'Dvidvadasha (2/12 axis) - One partner nurtures while the other provides resources.';
  }

  // Emotional Depth & Communication (0-30 points)
  const lenSum = (person1.name.length + person2.name.length) % 10;
  const emotionalScore = 20 + lenSum;

  const totalScore = Math.min(100, Math.max(35, numScore + astroScore + emotionalScore));

  return {
    totalScore,
    numScore,
    astroScore,
    emotionalScore,
    astroNote,
    verdict: totalScore >= 80 ? 'Exceptional Soul Connection' : totalScore >= 65 ? 'Very Harmonious & Supportive' : totalScore >= 50 ? 'Balanced with Growth Potential' : 'Needs Conscious Understanding',
  };
}

// 2. NUMEROLOGY CALCULATOR (Life Path, Destiny, Soul Urge, Birthday)
export function calculateNumerology(name: string, dob: string) {
  // DOB: YYYY-MM-DD
  const [year, month, day] = dob.split('-').map((v) => parseInt(v, 10));
  
  const birthDayNumber = reduceToSingleDigit(day);
  const lifePath = reduceToSingleDigit(
    reduceToSingleDigit(year) + reduceToSingleDigit(month) + reduceToSingleDigit(day),
    true
  );

  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  const VOWELS = ['A', 'E', 'I', 'O', 'U', 'Y'];
  
  let expressionSum = 0;
  let soulUrgeSum = 0;
  let personalitySum = 0;

  for (const char of cleanName) {
    const val = CHALDEAN_MAP[char] || 0;
    expressionSum += val;
    if (VOWELS.includes(char)) {
      soulUrgeSum += val;
    } else {
      personalitySum += val;
    }
  }

  const destinyNumber = reduceToSingleDigit(expressionSum, true);
  const soulUrgeNumber = reduceToSingleDigit(soulUrgeSum, true);
  const personalityNumber = reduceToSingleDigit(personalitySum);

  const planetMap: Record<number, { planet: string; gemstone: string; luckyDay: string }> = {
    1: { planet: 'Surya (Sun)', gemstone: 'Ruby / Garnet', luckyDay: 'Sunday' },
    2: { planet: 'Chandra (Moon)', gemstone: 'Pearl / Moonstone', luckyDay: 'Monday' },
    3: { planet: 'Brihaspati (Jupiter)', gemstone: 'Yellow Sapphire / Citrine', luckyDay: 'Thursday' },
    4: { planet: 'Rahu (North Node)', gemstone: 'Hessonite (Gomed)', luckyDay: 'Saturday' },
    5: { planet: 'Budha (Mercury)', gemstone: 'Emerald / Peridot', luckyDay: 'Wednesday' },
    6: { planet: 'Shukra (Venus)', gemstone: 'Diamond / White Zircon', luckyDay: 'Friday' },
    7: { planet: 'Ketu (South Node)', gemstone: 'Cat\'s Eye (Chrysoberyl)', luckyDay: 'Tuesday' },
    8: { planet: 'Shani (Saturn)', gemstone: 'Blue Sapphire / Amethyst', luckyDay: 'Saturday' },
    9: { planet: 'Mangal (Mars)', gemstone: 'Red Coral / Carnelian', luckyDay: 'Tuesday' },
    11: { planet: 'Neptune / Higher Moon', gemstone: 'Pearl', luckyDay: 'Monday' },
    22: { planet: 'Uranus / Higher Sun', gemstone: 'Ruby', luckyDay: 'Sunday' },
    33: { planet: 'Higher Venus', gemstone: 'Diamond', luckyDay: 'Friday' },
  };

  const ruling = planetMap[reduceToSingleDigit(lifePath)] || planetMap[1];

  return {
    lifePath,
    destinyNumber,
    soulUrgeNumber,
    personalityNumber,
    birthDayNumber,
    rulingPlanet: ruling.planet,
    gemstone: ruling.gemstone,
    luckyDay: ruling.luckyDay,
  };
}

// 3. RISING SIGN (Lagna) CALCULATOR
export function calculateRisingSign(dob: string, tob: string, lat = 19.076, lon = 72.8777) {
  // Approximate Vedic Sidereal Ascendant calculation
  const [year, month, day] = dob.split('-').map(Number);
  const [hour, minute] = tob.split(':').map(Number);
  
  // Day of year
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  
  // Approximate Sayana LST in degrees
  const decimalHours = hour + minute / 60 - 5.5; // IST to UTC approx
  const lstHours = (6.6 + 0.065709 * dayOfYear + 1.0027379 * decimalHours + lon / 15) % 24;
  const tropicalAscDeg = (lstHours * 15 + 90) % 360;

  // Lahiri Ayanamsa (~24.15° for current epoch)
  const ayanamsa = 23.85 + (year - 2000) * 0.01397;
  const siderealAscDeg = (tropicalAscDeg - ayanamsa + 360) % 360;

  const signIndex = Math.floor(siderealAscDeg / 30);
  const degreeInSign = siderealAscDeg % 30;
  const sign = ZODIAC_SIGNS[signIndex];

  const nakIndex = Math.floor(siderealAscDeg / (360 / 27));
  const pada = Math.floor((siderealAscDeg % (360 / 27)) / (360 / 108)) + 1;

  return {
    sign: sign.name,
    sanskrit: sign.sanskrit,
    degree: degreeInSign.toFixed(2),
    totalDegree: siderealAscDeg.toFixed(2),
    lord: sign.lord,
    element: sign.element,
    nakshatra: NAKSHATRAS[nakIndex],
    pada,
    ayanamsa: ayanamsa.toFixed(2),
  };
}

// 4. DASHA CALCULATOR (120-Year Vimshottari Mahadasha sequence)
export function calculateVimshottariDasha(dob: string, moonDegApprox?: number) {
  const [year, month, day] = dob.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);

  // Approximate moon degree if not given: using day-of-month progression
  const moonDeg = moonDegApprox !== undefined ? moonDegApprox : ((day * 13.2 + month * 30 + (year % 100)) % 360);
  const nakTotal = 360 / 27; // 13.3333 degrees per nakshatra
  const nakIndex = Math.floor(moonDeg / nakTotal);
  const nakProgress = (moonDeg % nakTotal) / nakTotal;

  const dashaYears: Record<string, number> = {
    Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
  };
  const dashaOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

  const birthLordIndex = nakIndex % 9;
  const birthLord = dashaOrder[birthLordIndex];
  const totalLordYears = dashaYears[birthLord];
  const balanceYears = totalLordYears * (1 - nakProgress);

  const periods: { planet: string; startYear: number; endYear: number; durationYears: number; status: string }[] = [];
  
  let currentStart = year;
  let firstEnd = year + balanceYears;
  const currentYear = new Date().getFullYear();

  periods.push({
    planet: birthLord,
    startYear: Math.floor(currentStart),
    endYear: Math.floor(firstEnd),
    durationYears: parseFloat(balanceYears.toFixed(1)),
    status: (currentYear >= currentStart && currentYear < firstEnd) ? 'Active (Current)' : (currentYear >= firstEnd ? 'Past' : 'Upcoming'),
  });

  let runningYear = firstEnd;
  for (let i = 1; i < 9; i++) {
    const nextLordIndex = (birthLordIndex + i) % 9;
    const nextLord = dashaOrder[nextLordIndex];
    const dur = dashaYears[nextLord];
    const nextEnd = runningYear + dur;
    
    periods.push({
      planet: nextLord,
      startYear: Math.floor(runningYear),
      endYear: Math.floor(nextEnd),
      durationYears: dur,
      status: (currentYear >= runningYear && currentYear < nextEnd) ? 'Active (Current)' : (currentYear >= nextEnd ? 'Past' : 'Upcoming'),
    });
    runningYear = nextEnd;
  }

  const activePeriod = periods.find((p) => p.status.includes('Active')) || periods[0];

  return {
    moonDegree: moonDeg.toFixed(2),
    nakshatra: NAKSHATRAS[nakIndex],
    balanceLord: birthLord,
    balanceYears: balanceYears.toFixed(1),
    activePeriod,
    periods,
  };
}

// 5. MANGAL DOSHA CALCULATOR (Mars in 1st, 2nd, 4th, 7th, 8th, 12th + authentic cancellation rules)
export function calculateMangalDosha(lagnaSignId: number, marsSignId: number, moonSignId?: number) {
  // Houses from Lagna
  const houseFromLagna = ((marsSignId - lagnaSignId + 12) % 12) + 1;
  const doshaHouses = [1, 2, 4, 7, 8, 12];
  const hasDoshaLagna = doshaHouses.includes(houseFromLagna);

  let hasDoshaMoon = false;
  let houseFromMoon = 1;
  if (moonSignId) {
    houseFromMoon = ((marsSignId - moonSignId + 12) % 12) + 1;
    hasDoshaMoon = doshaHouses.includes(houseFromMoon);
  }

  // Classical Cancellation / Exception Rules
  const cancellations: string[] = [];
  let isCancelled = false;

  // 1. Mars in own sign (Aries = 1, Scorpio = 8)
  if (marsSignId === 1 || marsSignId === 8) {
    cancellations.push('Mars in Swakshetra (Aries or Scorpio) neutralizes malefic intensity.');
    isCancelled = true;
  }
  // 2. Mars exalted in Capricorn (10)
  if (marsSignId === 10) {
    cancellations.push('Mars exalted (Uchha) in Capricorn acts as a protective Yogakaraka.');
    isCancelled = true;
  }
  // 3. Mars in Leo or Sagittarius (Friends\' houses)
  if (marsSignId === 5 || marsSignId === 9) {
    cancellations.push('Mars placed in friendly fiery sign softens matrimonial friction.');
  }
  // 4. Mars in 2nd house in Gemini or Virgo
  if (houseFromLagna === 2 && (marsSignId === 3 || marsSignId === 6)) {
    cancellations.push('Mars in 2nd house in Mercury sign is exempt from Kuja Dosha.');
    isCancelled = true;
  }
  // 5. Mars in 4th house in Aries or Scorpio
  if (houseFromLagna === 4 && (marsSignId === 1 || marsSignId === 8)) {
    cancellations.push('Mars in 4th house in own signs eliminates Sukha Bhava afflictions.');
    isCancelled = true;
  }
  // 6. Mars in 7th house in Cancer or Capricorn
  if (houseFromLagna === 7 && (marsSignId === 4 || marsSignId === 10)) {
    cancellations.push('Mars in 7th house in Cancer (debilitated/Neecha Bhanga) or Capricorn has no Kuja Dosha.');
    isCancelled = true;
  }

  let status: 'No Mangal Dosha' | 'Anshik (Partial) Mangal Dosha' | 'Purna (Full) Mangal Dosha' | 'Mangal Dosha Cancelled';
  let percentage = 0;

  if (!hasDoshaLagna && !hasDoshaMoon) {
    status = 'No Mangal Dosha';
    percentage = 0;
  } else if (isCancelled) {
    status = 'Mangal Dosha Cancelled';
    percentage = 15;
  } else if (hasDoshaLagna && hasDoshaMoon) {
    status = 'Purna (Full) Mangal Dosha';
    percentage = 85;
  } else {
    status = 'Anshik (Partial) Mangal Dosha';
    percentage = 45;
  }

  return {
    status,
    percentage,
    houseFromLagna,
    houseFromMoon,
    hasDoshaLagna,
    hasDoshaMoon,
    isCancelled,
    cancellations,
    remedies: [
      'Perform Mangal Gayatri Japa or recite Hanuman Chalisa every Tuesday.',
      'Wear a genuine Red Coral (Moonga) in copper or gold after astrological consultation.',
      'Offer red lentils (Masoor Dal) and jaggery to the needy on Tuesdays.',
      'Kumbh Vivah or Vishnu Pratima Vivah can be performed before marriage if strongly indicated.',
    ],
  };
}

// 6. MOON PHASE CALCULATOR
export function calculateMoonPhase(dateInput?: string) {
  const d = dateInput ? new Date(dateInput) : new Date();
  
  // Known new moon reference: Jan 11, 2024 at 11:57 UTC
  const refNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
  const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000;
  
  const diff = d.getTime() - refNewMoon;
  const phaseCycle = ((diff % synodicMonth) + synodicMonth) % synodicMonth;
  const phaseDays = phaseCycle / (24 * 60 * 60 * 1000);
  
  // Illumination %
  const phaseAngle = (phaseDays / 29.53058867) * 2 * Math.PI;
  const illumination = Math.round(((1 - Math.cos(phaseAngle)) / 2) * 100);

  // Tithi (15 Shukla + 15 Krishna)
  const tithiIndex = Math.floor(phaseDays / (29.53058867 / 30)) + 1;
  const paksha = tithiIndex <= 15 ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)';
  const tithiInPaksha = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;

  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
    'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', tithiIndex <= 15 ? 'Purnima (Full Moon)' : 'Amavasya (New Moon)'
  ];

  let phaseName = 'Waxing Crescent';
  if (phaseDays < 1.5 || phaseDays > 28) phaseName = 'Amavasya (New Moon)';
  else if (phaseDays < 7) phaseName = 'Shukla Paksha Crescent';
  else if (phaseDays < 8.5) phaseName = 'First Quarter';
  else if (phaseDays < 14) phaseName = 'Waxing Gibbous';
  else if (phaseDays < 16) phaseName = 'Purnima (Full Moon)';
  else if (phaseDays < 22) phaseName = 'Waning Gibbous';
  else if (phaseDays < 23.5) phaseName = 'Third Quarter';
  else phaseName = 'Krishna Paksha Crescent';

  return {
    phaseDays: phaseDays.toFixed(1),
    illumination,
    paksha,
    tithiNumber: tithiIndex,
    tithiName: tithiNames[tithiInPaksha - 1],
    phaseName,
    isAuspiciousForNewBeginnings: tithiIndex <= 14 && ![4, 9, 14].includes(tithiInPaksha),
  };
}

// 7. FLAMES CALCULATOR
export function calculateFlames(name1: string, name2: string) {
  let n1 = name1.toLowerCase().replace(/[^a-z]/g, '').split('');
  let n2 = name2.toLowerCase().replace(/[^a-z]/g, '').split('');

  for (let i = 0; i < n1.length; i++) {
    const idx = n2.indexOf(n1[i]);
    if (idx !== -1) {
      n1.splice(i, 1);
      n2.splice(idx, 1);
      i--;
    }
  }

  const remainingCount = n1.length + n2.length;
  if (remainingCount === 0) {
    return {
      result: 'Affectionate',
      letter: 'A',
      description: 'You share an identical vibration of mutual sweetness and unspoken emotional affinity.',
      count: 0,
    };
  }

  const flames = [
    { letter: 'F', name: 'Friends', desc: 'A rock-solid foundation of loyalty, laughter, and lifelong camaraderie.' },
    { letter: 'L', name: 'Lovers', desc: 'Intense romantic chemistry, electric attraction, and deep emotional passion.' },
    { letter: 'A', name: 'Affectionate', desc: 'Tender care, warm unconditional support, and mutual protectiveness.' },
    { letter: 'M', name: 'Marriage', desc: 'Long-term stability, shared life goals, and lasting matrimonial harmony.' },
    { letter: 'E', name: 'Enemies', desc: 'Strong conflicting egos requiring conscious patience to avoid friction.' },
    { letter: 'S', name: 'Siblings', desc: 'Protective, familial dynamic with playful banter and deep-rooted trust.' },
  ];

  let currentList = [...flames];
  let ptr = 0;

  while (currentList.length > 1) {
    ptr = (ptr + remainingCount - 1) % currentList.length;
    currentList.splice(ptr, 1);
  }

  return {
    result: currentList[0].name,
    letter: currentList[0].letter,
    description: currentList[0].desc,
    count: remainingCount,
  };
}

// 8. FRIENDSHIP CALCULATOR
export function calculateFriendship(name1: string, name2: string, sign1Id = 1, sign2Id = 5) {
  const chal1 = calculateNameNumber(name1);
  const chal2 = calculateNameNumber(name2);

  const sign1 = ZODIAC_SIGNS[sign1Id - 1] || ZODIAC_SIGNS[0];
  const sign2 = ZODIAC_SIGNS[sign2Id - 1] || ZODIAC_SIGNS[4];

  // Planetary Maitri (Friendship) Matrix
  const friends: Record<string, string[]> = {
    Sun: ['Moon', 'Mars', 'Jupiter'],
    Moon: ['Sun', 'Mercury'],
    Mars: ['Sun', 'Moon', 'Jupiter'],
    Mercury: ['Sun', 'Venus'],
    Jupiter: ['Sun', 'Moon', 'Mars'],
    Venus: ['Mercury', 'Saturn'],
    Saturn: ['Mercury', 'Venus'],
  };

  const neutral: Record<string, string[]> = {
    Sun: ['Mercury'],
    Moon: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
    Mars: ['Venus', 'Saturn'],
    Mercury: ['Mars', 'Jupiter', 'Saturn'],
    Jupiter: ['Saturn'],
    Venus: ['Mars', 'Jupiter'],
    Saturn: ['Jupiter'],
  };

  const lord1 = sign1.lord;
  const lord2 = sign2.lord;

  let astroPts = 25;
  if (lord1 === lord2) astroPts = 45;
  else if (friends[lord1]?.includes(lord2) && friends[lord2]?.includes(lord1)) astroPts = 42;
  else if (friends[lord1]?.includes(lord2) || friends[lord2]?.includes(lord1)) astroPts = 35;
  else if (neutral[lord1]?.includes(lord2) || neutral[lord2]?.includes(lord1)) astroPts = 28;
  else astroPts = 18;

  // Name harmony (0-40)
  const diff = Math.abs(chal1.single - chal2.single);
  const namePts = diff === 0 ? 40 : diff <= 2 ? 34 : diff <= 4 ? 28 : 20;

  // Shared letter count
  const set1 = new Set(name1.toLowerCase().replace(/[^a-z]/g, ''));
  const set2 = new Set(name2.toLowerCase().replace(/[^a-z]/g, ''));
  let commonLetters = 0;
  set1.forEach((char) => { if (set2.has(char)) commonLetters++; });
  const commonPts = Math.min(15, commonLetters * 4);

  const total = Math.min(100, astroPts + namePts + commonPts);

  return {
    score: total,
    astroPoints: astroPts,
    namePoints: namePts,
    rulingLords: `${lord1} & ${lord2}`,
    verdict: total >= 80 ? 'Inseparable Soul Friends (Besties)' : total >= 65 ? 'Dependable & Loyal Friends' : 'Casual & Fair-Weather Companions',
    advice: 'Cultivate open dialogue and mutual hobbies to nurture this planetary bond.',
  };
}

// 9. ISHTA DEVATA CALCULATOR (Jaimini Karakamsa 12th House)
export function calculateIshtaDevata(planets: { name: string; longitude: number; isRahuKetu?: boolean }[]) {
  // 1. Find Atmakaraka (planet with highest degree among the 7 classical planets)
  const classical = planets.filter((p) => !p.isRahuKetu && p.name !== 'Rahu' && p.name !== 'Ketu');
  
  let ak = classical[0] || { name: 'Sun', longitude: 10 };
  let maxDegInSign = -1;

  for (const p of classical) {
    const degInSign = p.longitude % 30;
    if (degInSign > maxDegInSign) {
      maxDegInSign = degInSign;
      ak = p;
    }
  }

  // 2. D-9 Navamsha sign of Atmakaraka
  const navamshaDeg = (ak.longitude * 9) % 360;
  const navamshaSignIndex = Math.floor(navamshaDeg / 30);
  const karakamsaSign = ZODIAC_SIGNS[navamshaSignIndex];

  // 3. 12th House from Karakamsa (Jivanmuktaamsa / Moksha Bhava)
  const twelfthSignIndex = (navamshaSignIndex - 1 + 12) % 12;
  const twelfthSign = ZODIAC_SIGNS[twelfthSignIndex];
  const twelfthLord = twelfthSign.lord;

  // Deity association by governing planet in Jaimini tradition
  const deityMap: Record<string, { deity: string; mantra: string; significance: string }> = {
    Sun: { deity: 'Lord Shiva / Lord Rama', mantra: 'Om Namah Shivaya', significance: 'Dispels ignorance, bestows radiant soul confidence and inner sovereignty.' },
    Moon: { deity: 'Goddess Parvati / Lord Krishna', mantra: 'Om Kleem Krishnaya Namah', significance: 'Brings emotional peace, maternal blessing, and devotional ecstasy.' },
    Mars: { deity: 'Lord Kartikeya (Murugan) / Lord Hanuman', mantra: 'Om Hanumate Namah', significance: 'Grants immense courage, removes obstacles, and burns negative karma.' },
    Mercury: { deity: 'Lord Vishnu / Lord Narayana', mantra: 'Om Namo Bhagavate Vasudevaya', significance: 'Bestows sharp intellect, financial discernment, and dharmic wisdom.' },
    Jupiter: { deity: 'Lord Shiva (Dakshinamurthy) / Brihaspati', mantra: 'Om Gurave Namah', significance: 'Elevates spiritual learning, moral integrity, and supreme knowledge.' },
    Venus: { deity: 'Goddess Mahalakshmi / Goddess Radha', mantra: 'Om Shreem Maha Lakshmyai Namah', significance: 'Attracts beauty, loving grace, marital bliss, and prosperity.' },
    Saturn: { deity: 'Lord Shani / Lord Kurma / Lord Bhairava', mantra: 'Om Sham Shanaishcharaya Namah', significance: 'Teaches humility, dissolves deep karmic debts, and grants longevity.' },
    Rahu: { deity: 'Goddess Durga / Chhinnamasta', mantra: 'Om Dum Durgayei Namah', significance: 'Shields against unseen illusions, black magic, and erratic impulses.' },
    Ketu: { deity: 'Lord Ganesha / Matsya Avatar', mantra: 'Om Gam Ganapataye Namah', significance: 'Direct path to Moksha, liberation, detachment, and psychic awakening.' },
  };

  const presiding = deityMap[twelfthLord] || deityMap['Sun'];

  return {
    atmakaraka: ak.name,
    atmakarakaDegree: maxDegInSign.toFixed(2),
    karakamsaSign: karakamsaSign.name,
    twelfthSign: twelfthSign.name,
    twelfthLord,
    ishtaDevata: presiding.deity,
    mantra: presiding.mantra,
    significance: presiding.significance,
  };
}

// 10. TRANSIT CHART CALCULATOR (Gochara Planetary Movements)
export function calculateTransits(natalLagnaSignId: number) {
  // Real-time planetary approximate sidereal signs for 2026 epoch
  const transitPlanets = [
    { name: 'Sun', signId: 7, signName: 'Libra', deg: 12.4 },
    { name: 'Moon', signId: 2, signName: 'Taurus', deg: 21.0, isExalted: true },
    { name: 'Mars', signId: 4, signName: 'Cancer', deg: 6.8, isDebilitated: true },
    { name: 'Mercury', signId: 7, signName: 'Libra', deg: 18.2 },
    { name: 'Jupiter', signId: 3, signName: 'Gemini', deg: 14.5 },
    { name: 'Venus', signId: 8, signName: 'Scorpio', deg: 24.1 },
    { name: 'Saturn', signId: 12, signName: 'Pisces', deg: 2.3 },
    { name: 'Rahu', signId: 11, signName: 'Aquarius', deg: 19.8, isRetrograde: true },
    { name: 'Ketu', signId: 5, signName: 'Leo', deg: 19.8, isRetrograde: true },
  ];

  const analyzed = transitPlanets.map((tp) => {
    const houseFromLagna = ((tp.signId - natalLagnaSignId + 12) % 12) + 1;
    let effect = 'Neutral';
    if ([1, 4, 7, 10].includes(houseFromLagna)) effect = 'Kendra Transit: Significant activity and focus on self & career.';
    else if ([5, 9].includes(houseFromLagna)) effect = 'Trikona Transit: Auspicious luck, intelligence, and fortune.';
    else if ([3, 6, 11].includes(houseFromLagna)) effect = 'Upachaya Transit: Overcoming competition and gaining steady fruits.';
    else if ([8, 12].includes(houseFromLagna)) effect = 'Dusthana Transit: Caution required; inner transformation and travel.';
    else effect = 'Dhana Bhava: Focus on savings, family, and speech.';

    return {
      ...tp,
      houseFromLagna,
      effect,
    };
  });

  return {
    natalLagna: ZODIAC_SIGNS[natalLagnaSignId - 1].name,
    transitPlanets: analyzed,
  };
}

// 11. ATMAKARAKA & DARAKARAKA CALCULATOR (7 Jaimini Karakas)
export function calculateJaiminiKarakas(planets: { name: string; longitude: number }[]) {
  const classical = planets.filter((p) => !['Rahu', 'Ketu'].includes(p.name));
  
  // Sort descending by degree within sign (longitude % 30)
  const sorted = [...classical].sort((a, b) => (b.longitude % 30) - (a.longitude % 30));

  const titles = [
    { code: 'AK', role: 'Atmakaraka', desc: 'Indicator of Soul, true life purpose, and spiritual journey.' },
    { code: 'AmK', role: 'Amatyakaraka', desc: 'Indicator of Career, profession, advisors, and social status.' },
    { code: 'BK', role: 'Bhratrukaraka', desc: 'Indicator of Siblings, Guru, mentors, and courageous allies.' },
    { code: 'MK', role: 'Matrukaraka', desc: 'Indicator of Mother, emotional peace, conveyances, and home.' },
    { code: 'PK', role: 'Putrakaraka', desc: 'Indicator of Children, intellect, investments, and creative legacy.' },
    { code: 'GK', role: 'Gnatikaraka', desc: 'Indicator of Obstacles, disease, competition, and maternal kin.' },
    { code: 'DK', role: 'Darakaraka', desc: 'Indicator of Spouse, partner, relationships, and public trade.' },
  ];

  return sorted.slice(0, 7).map((planet, index) => ({
    ...titles[index],
    planet: planet.name,
    degrees: (planet.longitude % 30).toFixed(2) + '°',
    sign: ZODIAC_SIGNS[Math.floor(planet.longitude / 30)].name,
  }));
}

// 12. SUN SIGN CALCULATOR (Nirayana Sidereal vs Sayana Tropical)
export function calculateSunSign(dob: string) {
  const [year, month, day] = dob.split('-').map(Number);
  
  // Tropical Sun boundaries (approximate)
  const tropicalDates = [
    { sign: 'Capricorn', start: [1, 1], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
    { sign: 'Capricorn', start: [12, 22], end: [12, 31] },
  ];

  let tropical = 'Aries';
  for (const t of tropicalDates) {
    const isAfterStart = month > t.start[0] || (month === t.start[0] && day >= t.start[1]);
    const isBeforeEnd = month < t.end[0] || (month === t.end[0] && day <= t.end[1]);
    if (isAfterStart && isBeforeEnd) {
      tropical = t.sign;
      break;
    }
  }

  // Sidereal Sun (Sankranti Dates - approx ~14th/15th of each month)
  const siderealDates = [
    { sign: 'Dhanu (Sagittarius)', start: [1, 1], end: [1, 13] },
    { sign: 'Makara (Capricorn)', start: [1, 14], end: [2, 12] },
    { sign: 'Kumbha (Aquarius)', start: [2, 13], end: [3, 13] },
    { sign: 'Meena (Pisces)', start: [3, 14], end: [4, 13] },
    { sign: 'Mesha (Aries)', start: [4, 14], end: [5, 14] },
    { sign: 'Vrishabha (Taurus)', start: [5, 15], end: [6, 14] },
    { sign: 'Mithuna (Gemini)', start: [6, 15], end: [7, 15] },
    { sign: 'Karka (Cancer)', start: [7, 16], end: [8, 16] },
    { sign: 'Simha (Leo)', start: [8, 17], end: [9, 16] },
    { sign: 'Kanya (Virgo)', start: [9, 17], end: [10, 16] },
    { sign: 'Tula (Libra)', start: [10, 17], end: [11, 15] },
    { sign: 'Vrishchika (Scorpio)', start: [11, 16], end: [12, 15] },
    { sign: 'Dhanu (Sagittarius)', start: [12, 16], end: [12, 31] },
  ];

  let sidereal = 'Mesha (Aries)';
  for (const s of siderealDates) {
    const isAfterStart = month > s.start[0] || (month === s.start[0] && day >= s.start[1]);
    const isBeforeEnd = month < s.end[0] || (month === s.end[0] && day <= s.end[1]);
    if (isAfterStart && isBeforeEnd) {
      sidereal = s.sign;
      break;
    }
  }

  return {
    siderealSign: sidereal,
    tropicalSign: tropical,
    ayanamsaDifference: '24° 15\' Lahiri Ayanamsa',
    explanation: 'Vedic astrology uses the fixed star Nirayana system (Chitrapaksha Lahiri), accounting for the Earth\'s precession of equinoxes, making it 24° behind Western tropical dates.',
  };
}

// 13. RASHI (Moon Sign) & 14. NAKSHATRA CALCULATOR
export function calculateRashiAndNakshatra(dob: string, tob: string, lon = 72.8777) {
  const [year, month, day] = dob.split('-').map(Number);
  const [hour, minute] = tob.split(':').map(Number);
  
  // Approximate sidereal moon longitude
  const daysSinceEpoch = (Date.UTC(year, month - 1, day, hour, minute) - Date.UTC(2000, 0, 1)) / (1000 * 60 * 60 * 24);
  const meanMoon = (218.316 + 13.176396 * daysSinceEpoch + lon / 360) % 360;
  const ayanamsa = 23.85 + (year - 2000) * 0.01397;
  const siderealMoon = (meanMoon - ayanamsa + 360) % 360;

  const signIndex = Math.floor(siderealMoon / 30);
  const sign = ZODIAC_SIGNS[signIndex];
  const degreeInSign = (siderealMoon % 30).toFixed(2);

  const nakIndex = Math.floor(siderealMoon / (360 / 27));
  const pada = Math.floor((siderealMoon % (360 / 27)) / (360 / 108)) + 1;
  const nakshatra = NAKSHATRAS[nakIndex];
  const nakLord = NAKSHATRA_LORDS[nakIndex % 9];

  return {
    moonDegree: siderealMoon.toFixed(2),
    rashi: sign.name,
    rashiSanskrit: sign.sanskrit,
    degreeInSign,
    rashiLord: sign.lord,
    element: sign.element,
    nakshatra,
    pada,
    nakshatraLord: nakLord,
  };
}

// 15. SHANI SADE SATI CALCULATOR
export function calculateSadeSati(natalMoonSignId: number) {
  // Current Saturn transit (2025-2027: Saturn is in Pisces = Sign 12)
  const currentSaturnSignId = 12; // Pisces
  const moonSign = ZODIAC_SIGNS[natalMoonSignId - 1];

  // Sade Sati spans 12th from Moon, 1st from Moon, and 2nd from Moon
  const risingSignId = ((natalMoonSignId - 2 + 12) % 12) + 1; // 12th
  const peakSignId = natalMoonSignId; // 1st
  const settingSignId = (natalMoonSignId % 12) + 1; // 2nd

  // Small Panoti (Kantaka Shani = 4th or 8th from Moon)
  const fourthSignId = ((natalMoonSignId + 2) % 12) + 1;
  const eighthSignId = ((natalMoonSignId + 6) % 12) + 1;

  let currentPhase = 'No Active Sade Sati';
  let isUnderSadeSati = false;
  let severity = 'None';

  if (currentSaturnSignId === risingSignId) {
    currentPhase = 'First Phase (Rising Phase - Vyaya Shani)';
    isUnderSadeSati = true;
    severity = 'Moderate: Impacts expenditure, sleep, mental restlessness, and foreign travels.';
  } else if (currentSaturnSignId === peakSignId) {
    currentPhase = 'Second Phase (Peak Phase - Janma Shani)';
    isUnderSadeSati = true;
    severity = 'High: Deep personal testing, career realignment, emotional discipline, and health awareness.';
  } else if (currentSaturnSignId === settingSignId) {
    currentPhase = 'Third Phase (Setting Phase - Dhana Shani)';
    isUnderSadeSati = true;
    severity = 'Declining: Focus on financial restructuring, family obligations, and speech.';
  } else if (currentSaturnSignId === fourthSignId || currentSaturnSignId === eighthSignId) {
    currentPhase = 'Dhaiya (Small Panoti - 2.5 Year Kantaka Shani)';
    isUnderSadeSati = true;
    severity = 'Focused: 2.5-year targeted karmic refinement in work or residence.';
  }

  return {
    moonSign: moonSign.name,
    currentSaturnSign: ZODIAC_SIGNS[currentSaturnSignId - 1].name,
    isUnderSadeSati,
    currentPhase,
    severity,
    phasesSummary: [
      { phase: '1st Phase (Rising)', sign: ZODIAC_SIGNS[risingSignId - 1].name, focus: 'Expenses, travel, emotional grounding' },
      { phase: '2nd Phase (Peak)', sign: moonSign.name, focus: 'Self-identity, perseverance, health' },
      { phase: '3rd Phase (Setting)', sign: ZODIAC_SIGNS[settingSignId - 1].name, focus: 'Family wealth, speech, long-term stability' },
    ],
    remedies: [
      'Light a mustard oil lamp (Deepam) under a Peepal tree on Saturday evenings.',
      'Recite the Dasharatha Shani Stotram or Hanuman Chalisa regularly.',
      'Offer black sesame seeds, iron items, or blue cloth to laborers and the elderly.',
      'Practice disciplined, selfless service (Karma Yoga) without expectation of immediate praise.',
    ],
  };
}

// 17. LUCKY VEHICLE NUMBER CALCULATOR (Chaldean reduction & elemental harmony)
export function calculateVehicleNumber(plateNumber: string, dob?: string) {
  const clean = plateNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let sum = 0;
  for (const char of clean) {
    if (/[0-9]/.test(char)) {
      sum += parseInt(char, 10);
    } else if (CHALDEAN_MAP[char]) {
      sum += CHALDEAN_MAP[char];
    }
  }

  const singleDigit = reduceToSingleDigit(sum);
  let lifePath = 1;
  if (dob) {
    const [y, m, d] = dob.split('-').map(Number);
    lifePath = reduceToSingleDigit(reduceToSingleDigit(y) + reduceToSingleDigit(m) + reduceToSingleDigit(d));
  }

  const vehiclePlanets: Record<number, { planet: string; nature: string; colors: string[] }> = {
    1: { planet: 'Sun', nature: 'Commanding, prestigious, leadership vehicle.', colors: ['Gold', 'Orange', 'Maroon'] },
    2: { planet: 'Moon', nature: 'Peaceful, smooth rides, family travels.', colors: ['White', 'Silver', 'Cream'] },
    3: { planet: 'Jupiter', nature: 'Auspicious, prosperous, academic or executive vehicle.', colors: ['Yellow', 'Golden Yellow'] },
    4: { planet: 'Rahu', nature: 'Unconventional, robust, high-mileage road trips.', colors: ['Dark Grey', 'Smoky Black', 'Blue'] },
    5: { planet: 'Mercury', nature: 'Agile, speedy, commercial and daily commuting.', colors: ['Green', 'Turquoise', 'Light Grey'] },
    6: { planet: 'Venus', nature: 'Luxurious, aesthetic, comfortable, premium vehicle.', colors: ['White', 'Metallic Silver', 'Soft Blue'] },
    7: { planet: 'Ketu', nature: 'Spiritual, quiet, offbeat routes and pilgrimage.', colors: ['Smoky White', 'Olive', 'Brown'] },
    8: { planet: 'Saturn', nature: 'Heavy-duty, durable, resilient commercial or utility.', colors: ['Black', 'Dark Navy', 'Charcoal'] },
    9: { planet: 'Mars', nature: 'Dynamic, sporty, courageous, high-horsepower vehicle.', colors: ['Red', 'Copper', 'Crimson'] },
  };

  const vp = vehiclePlanets[singleDigit] || vehiclePlanets[1];

  // Compatibility between vehicle number and user life path
  const friendlyCombos: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 3, 5],
    3: [1, 2, 3, 9],
    4: [1, 5, 6, 7],
    5: [1, 5, 6],
    6: [5, 6, 8],
    7: [1, 4, 7],
    8: [5, 6],
    9: [1, 3, 9],
  };

  const isCompatible = friendlyCombos[lifePath]?.includes(singleDigit) ?? true;

  return {
    rawInput: plateNumber,
    compoundSum: sum,
    singleDigit,
    governingPlanet: vp.planet,
    nature: vp.nature,
    auspiciousColors: vp.colors,
    userLifePath: lifePath,
    isCompatible,
    verdict: isCompatible ? 'Highly Harmonious Vehicle Number' : 'Moderate Vibrational Match',
    remedy: !isCompatible ? 'Keep a small brass Lord Ganesha idol or Shri Yantra inside the vehicle for vibrational alignment.' : 'The vehicle vibration is naturally protective and supportive of your journeys.',
  };
}

// 18. KAAL SARP DOSH CALCULATOR (Checks Rahu-Ketu axis enclosing 7 planets)
export function calculateKaalSarpDosh(rahuHouse: number, planets: { name: string; house: number }[]) {
  // Ketu is always 6 houses away (opposite)
  const ketuHouse = ((rahuHouse + 5) % 12) + 1;
  const nonNodes = planets.filter((p) => !['Rahu', 'Ketu'].includes(p.name));

  // Check if all non-nodes fall on one side of Rahu-Ketu axis
  let sideA = 0;
  let sideB = 0;

  for (const p of nonNodes) {
    const distFromRahu = ((p.house - rahuHouse + 12) % 12);
    if (distFromRahu > 0 && distFromRahu < 6) {
      sideA++;
    } else if (distFromRahu > 6 && distFromRahu < 12) {
      sideB++;
    }
  }

  const isFullKaalSarp = sideA === nonNodes.length || sideB === nonNodes.length;
  const isPartial = (sideA === nonNodes.length - 1 || sideB === nonNodes.length - 1) && !isFullKaalSarp;

  const varieties: Record<number, { name: string; impact: string }> = {
    1: { name: 'Anant Kaal Sarp Dosh', impact: 'Axis 1-7: Tests personality, stamina, and marital peace.' },
    2: { name: 'Kulik Kaal Sarp Dosh', impact: 'Axis 2-8: Focuses on speech, financial savings, and family ties.' },
    3: { name: 'Vasuki Kaal Sarp Dosh', impact: 'Axis 3-9: Challenges sibling rapport, ventures, and father\'s fortune.' },
    4: { name: 'Shankhapal Kaal Sarp Dosh', impact: 'Axis 4-10: Causes stress in maternal peace, conveyances, and career.' },
    5: { name: 'Padma Kaal Sarp Dosh', impact: 'Axis 5-11: Influences higher studies, progeny, and steady gains.' },
    6: { name: 'Mahapadma Kaal Sarp Dosh', impact: 'Axis 6-12: Heightens hidden opponents, litigation, and foreign expenses.' },
    7: { name: 'Takshak Kaal Sarp Dosh', impact: 'Axis 7-1: Business partnership delays and matrimonial adjustments.' },
    8: { name: 'Karkotak Kaal Sarp Dosh', impact: 'Axis 8-2: Sudden ancestral property challenges and unexpected shifts.' },
    9: { name: 'Shankhachood Kaal Sarp Dosh', impact: 'Axis 9-3: Testing luck cycles and requiring rigorous righteous effort.' },
    10: { name: 'Ghatak Kaal Sarp Dosh', impact: 'Axis 10-4: Ups and downs in professional leadership and public honor.' },
    11: { name: 'Vishdhar Kaal Sarp Dosh', impact: 'Axis 11-5: Fluctuating friend circles and speculative caution.' },
    12: { name: 'Sheshnaag Kaal Sarp Dosh', impact: 'Axis 12-6: High expenditures, spiritual seclusion, and foreign settlements.' },
  };

  const variety = varieties[rahuHouse] || varieties[1];

  let status: 'No Kaal Sarp Dosh' | 'Partial (Anshik) Kaal Sarp Dosh' | 'Purna (Full) Kaal Sarp Dosh' = 'No Kaal Sarp Dosh';
  if (isFullKaalSarp) status = 'Purna (Full) Kaal Sarp Dosh';
  else if (isPartial) status = 'Partial (Anshik) Kaal Sarp Dosh';

  return {
    status,
    rahuHouse,
    ketuHouse,
    varietyName: variety.name,
    impact: variety.impact,
    remedies: [
      'Perform Maha Mrityunjaya Japa (108 times daily or at a Shiva shrine).',
      'Offer milk, bilva leaves, and water on a consecrated Shivling every Monday.',
      'Install a consecrated silver Kaal Sarp Yantra or worship Nag Devata on Nag Panchami.',
      'Feed stray dogs and birds on Wednesdays and Saturdays.',
    ],
  };
}

// 19. LO SHU GRID CALCULATOR (Ancient 3x3 Magic Square)
export function calculateLoShuGrid(dob: string) {
  // DOB: YYYY-MM-DD
  const [year, month, day] = dob.split('-').map(Number);
  
  // Extract all digits except zeros
  const digitsStr = `${year}${month}${day}`.replace(/0/g, '');
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  
  for (const char of digitsStr) {
    const digit = parseInt(char, 10);
    if (digit >= 1 && digit <= 9) {
      counts[digit]++;
    }
  }

  // Also include Driver (Mulank) and Conductor (Bhagyank)
  const driver = reduceToSingleDigit(day);
  const conductor = reduceToSingleDigit(
    reduceToSingleDigit(year) + reduceToSingleDigit(month) + reduceToSingleDigit(day)
  );

  counts[driver]++;
  counts[conductor]++;

  // Lo Shu 3x3 Standard Grid positions:
  // [4, 9, 2]
  // [3, 5, 7]
  // [8, 1, 6]

  const planes = [
    { name: 'Mental Plane (4-9-2)', numbers: [4, 9, 2], status: counts[4] && counts[9] && counts[2] ? 'Strong' : 'Partial' },
    { name: 'Emotional Plane (3-5-7)', numbers: [3, 5, 7], status: counts[3] && counts[5] && counts[7] ? 'Strong' : 'Partial' },
    { name: 'Practical Plane (8-1-6)', numbers: [8, 1, 6], status: counts[8] && counts[1] && counts[6] ? 'Strong' : 'Partial' },
    { name: 'Thought Plane (4-3-8)', numbers: [4, 3, 8], status: counts[4] && counts[3] && counts[8] ? 'Strong' : 'Partial' },
    { name: 'Will Plane (9-5-1)', numbers: [9, 5, 1], status: counts[9] && counts[5] && counts[1] ? 'Strong' : 'Partial' },
    { name: 'Action Plane (2-7-6)', numbers: [2, 7, 6], status: counts[2] && counts[7] && counts[6] ? 'Strong' : 'Partial' },
    { name: 'Arrow of Determination (1-5-9)', numbers: [1, 5, 9], status: counts[1] && counts[5] && counts[9] ? 'Complete' : 'Incomplete' },
    { name: 'Arrow of Spirituality (3-5-7)', numbers: [3, 5, 7], status: counts[3] && counts[5] && counts[7] ? 'Complete' : 'Incomplete' },
  ];

  const missingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => counts[n] === 0);

  return {
    grid: [
      [counts[4] ? '4'.repeat(counts[4]) : '-', counts[9] ? '9'.repeat(counts[9]) : '-', counts[2] ? '2'.repeat(counts[2]) : '-'],
      [counts[3] ? '3'.repeat(counts[3]) : '-', counts[5] ? '5'.repeat(counts[5]) : '-', counts[7] ? '7'.repeat(counts[7]) : '-'],
      [counts[8] ? '8'.repeat(counts[8]) : '-', counts[1] ? '1'.repeat(counts[1]) : '-', counts[6] ? '6'.repeat(counts[6]) : '-'],
    ],
    driver,
    conductor,
    counts,
    planes,
    missingNumbers,
  };
}

// 20. NAME COMPATIBILITY CALCULATOR
export function calculateNameMatch(name1: string, name2: string) {
  const chal1 = calculateNameNumber(name1);
  const chal2 = calculateNameNumber(name2);

  const diff = Math.abs(chal1.single - chal2.single);
  let score = 70;
  let explanation = '';

  if (diff === 0) {
    score = 96;
    explanation = 'Identical compound vibration creates an instinctive telepathic bond and natural mutual understanding.';
  } else if ([1, 3, 5].includes(diff)) {
    score = 84;
    explanation = 'Harmonious vibrational difference encouraging mutual encouragement and positive life growth.';
  } else if ([2, 4].includes(diff)) {
    score = 76;
    explanation = 'Complementary energies where one person provides structure and the other brings creative inspiration.';
  } else {
    score = 62;
    explanation = 'Dynamic partnership with differing approaches; thrives when communication is transparent.';
  }

  return {
    name1: { name: name1, compound: chal1.compound, single: chal1.single },
    name2: { name: name2, compound: chal2.compound, single: chal2.single },
    compatibilityScore: score,
    explanation,
  };
}
