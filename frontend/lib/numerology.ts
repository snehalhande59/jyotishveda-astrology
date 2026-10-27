/**
 * Vedic and Classical Numerology Engine
 * Implements Life Path (Birth Number), Destiny/Expression Number,
 * Soul Urge Number, and Ruling Planetary Deity.
 */

const PYTHAGOREAN_MAP: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const PLANETARY_RULERS: Record<number, { planet: string; sanskrit: string; description: string }> = {
  1: { planet: 'Sun', sanskrit: 'Surya', description: 'Leadership, self-confidence, pioneering spirit, and executive authority.' },
  2: { planet: 'Moon', sanskrit: 'Chandra', description: 'Diplomacy, intuitive empathy, partnership, and imaginative depth.' },
  3: { planet: 'Jupiter', sanskrit: 'Guru / Brihaspati', description: 'Wisdom, creative expression, optimism, and spiritual mentorship.' },
  4: { planet: 'Rahu', sanskrit: 'Rahu', description: 'Practical structure, discipline, unorthodox solutions, and perseverance.' },
  5: { planet: 'Mercury', sanskrit: 'Budha', description: 'Agility, versatile intellect, communication, and vibrant adaptability.' },
  6: { planet: 'Venus', sanskrit: 'Shukra', description: 'Harmonious beauty, artistic refinement, domestic peace, and gracious empathy.' },
  7: { planet: 'Ketu', sanskrit: 'Ketu', description: 'Analytical introspection, mystic inquiry, philosophical mastery, and solitude.' },
  8: { planet: 'Saturn', sanskrit: 'Shani', description: 'Material mastery, karmic justice, organizational governance, and patience.' },
  9: { planet: 'Mars', sanskrit: 'Mangala', description: 'Humanitarian devotion, universal courage, philanthropy, and noble purpose.' },
  11: { planet: 'Sun / Moon Spiritual Fusion', sanskrit: 'Master Intuitive', description: 'Illumination, high sensory perception, inspirational idealism.' },
  22: { planet: 'Cosmic Architect', sanskrit: 'Master Builder', description: 'Grand systemic manifestations, transforming spiritual ideals into physical reality.' },
  33: { planet: 'Master Teacher', sanskrit: 'Param Guru', description: 'Universal compassion, profound blessing, and spiritual elevation of humanity.' },
};

function reduceDigits(num: number, preserveMaster = true): number {
  if (preserveMaster && (num === 11 || num === 22 || num === 33)) return num;
  let current = num;
  while (current > 9) {
    if (preserveMaster && (current === 11 || current === 22 || current === 33)) break;
    current = String(current)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return current;
}

export function calculateNumerology(fullName: string, birthDateStr: string) {
  // 1. Life Path Number (from Date of Birth)
  const cleanDate = birthDateStr.replace(/[^0-9]/g, '');
  let sumDate = 0;
  for (const ch of cleanDate) {
    sumDate += parseInt(ch, 10);
  }
  const lifePath = reduceDigits(sumDate, true);

  // 2. Expression / Destiny Number (all letters)
  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  let sumName = 0;
  let sumVowels = 0;
  let sumConsonants = 0;
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

  for (const ch of cleanName) {
    const val = PYTHAGOREAN_MAP[ch] || 0;
    sumName += val;
    if (vowels.has(ch)) {
      sumVowels += val;
    } else {
      sumConsonants += val;
    }
  }

  const destiny = reduceDigits(sumName, true);
  const soulUrge = reduceDigits(sumVowels, true);
  const personality = reduceDigits(sumConsonants, true);

  return {
    fullName,
    birthDate: birthDateStr,
    lifePath: {
      number: lifePath,
      ...PLANETARY_RULERS[lifePath] || PLANETARY_RULERS[reduceDigits(lifePath, false)],
    },
    destiny: {
      number: destiny,
      ...PLANETARY_RULERS[destiny] || PLANETARY_RULERS[reduceDigits(destiny, false)],
    },
    soulUrge: {
      number: soulUrge,
      ...PLANETARY_RULERS[soulUrge] || PLANETARY_RULERS[reduceDigits(soulUrge, false)],
    },
    personality: {
      number: personality,
      ...PLANETARY_RULERS[personality] || PLANETARY_RULERS[reduceDigits(personality, false)],
    },
  };
}
