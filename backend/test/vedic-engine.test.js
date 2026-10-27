/**
 * Automated Unit Test Suite for Vedic Astrology Engine
 * Tests astronomical calculations, Julian Day, Lahiri Ayanamsa,
 * Lagna, Moon Sign, Nakshatras, Navamsha (D9), Vimshottari Dasha,
 * Ashta Kuta Milan, and Panchanga components against reference test cases.
 */

const assert = require('assert');
const vedicEngine = require('../src/services/vedic-engine');

console.log('🧪 Starting Vedic Astrology Engine Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// 1. Julian Day & Lahiri Ayanamsa
test('Lahiri Ayanamsa computes accurately within expected 23°-25° range for modern epochs', () => {
  // Epoch J2000.0 (JD = 2451545.0)
  const ayanamsa2000 = vedicEngine.getLahiriAyanamsa(2451545.0);
  assert(ayanamsa2000 >= 23.85 && ayanamsa2000 <= 23.87, `Ayanamsa 2000 should be ~23.856°, got ${ayanamsa2000}`);

  // Year 2026 (~2451545.0 + 26*365.25 = ~2461041.5)
  const ayanamsa2026 = vedicEngine.getLahiriAyanamsa(2461041.5);
  assert(ayanamsa2026 >= 24.15 && ayanamsa2026 <= 24.30, `Ayanamsa 2026 should be ~24.22°, got ${ayanamsa2026}`);
});

// 2. Map Longitude to Vedic Details
test('mapToVedicDetails accurately maps 0° to Aries / Ashwini Pada 1', () => {
  const details = vedicEngine.mapToVedicDetails(0.5);
  assert.strictEqual(details.signName, 'Aries');
  assert.strictEqual(details.signNumber, 1);
  assert.strictEqual(details.nakshatraName, 'Ashwini');
  assert.strictEqual(details.nakshatraPada, 1);
  assert.strictEqual(details.ruler, 'Mars');
});

test('mapToVedicDetails accurately maps 180° to Libra / Chitra Pada 3', () => {
  const details = vedicEngine.mapToVedicDetails(180.5);
  assert.strictEqual(details.signName, 'Libra');
  assert.strictEqual(details.signNumber, 7);
  assert.strictEqual(details.nakshatraName, 'Chitra');
  assert.strictEqual(details.nakshatraPada, 3);
});

// 3. Navamsha (D9) Chart Mechanics
test('getNavamsaDetails assigns correct D9 sign for Fire, Earth, Air, Water elements', () => {
  // Aries (Fire): starts at Aries
  const navAries = vedicEngine.getNavamsaDetails(2.0); // 1st Navamsa of Aries -> Aries
  assert.strictEqual(navAries.signName, 'Aries');

  // Taurus (Earth): starts at Capricorn
  const navTaurus = vedicEngine.getNavamsaDetails(31.0); // 1st Navamsa of Taurus -> Capricorn
  assert.strictEqual(navTaurus.signName, 'Capricorn');

  // Gemini (Air): starts at Libra
  const navGemini = vedicEngine.getNavamsaDetails(61.0); // 1st Navamsa of Gemini -> Libra
  assert.strictEqual(navGemini.signName, 'Libra');

  // Cancer (Water): starts at Cancer
  const navCancer = vedicEngine.getNavamsaDetails(91.0); // 1st Navamsa of Cancer -> Cancer
  assert.strictEqual(navCancer.signName, 'Cancer');
});

// 4. Kundli Calculation
test('calculateKundli computes complete 12 houses and 9 Vedic planets with Navamsha', () => {
  const chart = vedicEngine.calculateKundli({
    fullName: 'Arjuna Pandava',
    dateOfBirth: '1995-05-15',
    timeOfBirth: '14:30',
    placeOfBirth: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezoneOffsetHours: 5.5,
    ayanamsaType: 'Lahiri',
  });

  assert(chart.meta, 'Chart should contain meta');
  assert.strictEqual(chart.houses.length, 12, 'Must have 12 Bhavas');
  assert.strictEqual(chart.planets.length, 9, 'Must have 9 Vedic grahas (Sun through Ketu)');
  assert(chart.ascendant.signName, 'Must calculate Ascendant');
  assert(chart.ascendant.navamsa, 'Must include D9 Navamsha for Ascendant');
  assert.strictEqual(chart.navamsaHouses.length, 12, 'Must have 12 Navamsha Bhavas');

  // Ketu must be precisely 180° opposite to Rahu
  const rahu = chart.planets.find((p) => p.name === 'Rahu');
  const ketu = chart.planets.find((p) => p.name === 'Ketu');
  const angularDist = Math.abs(rahu.longitude - ketu.longitude);
  assert(Math.abs(angularDist - 180) < 0.01, 'Ketu must be exactly 180° opposite Rahu');
});

// 5. Vimshottari Dasha
test('Vimshottari Dasha calculates valid 120-year sequence starting with balance dasha', () => {
  const chart = vedicEngine.calculateKundli({
    fullName: 'Test User',
    dateOfBirth: '2000-01-01',
    timeOfBirth: '12:00',
    placeOfBirth: 'Mumbai, India',
    latitude: 19.0760,
    longitude: 72.8777,
    timezoneOffsetHours: 5.5,
  });

  assert(chart.dasha, 'Chart should have dasha');
  assert(chart.dasha.timeline.length >= 9, 'Should have full 9-mahadasha cycle');
  assert(chart.dasha.balanceYears > 0, 'Balance dasha should be greater than 0');
  assert.strictEqual(chart.dasha.timeline[0].isBalance, true, 'First period is balance dasha');
});

// 6. Guna Milan (36 Points)
test('calculateGunaMilan computes 8 Kutas summing between 0 and 36', () => {
  // Same Moon position test
  const matchSame = vedicEngine.calculateGunaMilan(45.0, 45.0);
  assert(matchSame.totalScore >= 0 && matchSame.totalScore <= 36, 'Score must be 0-36');
  assert.strictEqual(matchSame.maxScore, 36);

  // Different Moon position test
  const matchDiff = vedicEngine.calculateGunaMilan(25.0, 185.0);
  assert(matchDiff.totalScore >= 0 && matchDiff.totalScore <= 36);
  assert(matchDiff.recommendation, 'Must provide recommendation');
});

// 7. Panchang Calculation
test('calculatePanchang returns complete 5 limbs with authentic astrological data', () => {
  const panchang = vedicEngine.calculatePanchang({
    date: '2026-10-27',
    time: '06:30',
    latitude: 28.6139,
    longitude: 77.2090,
    timezoneOffsetHours: 5.5,
  });

  assert(panchang.vaara.name, 'Must have Vaara name');
  assert(panchang.vaara.ruler, 'Must have Vaara ruler');
  assert(panchang.tithi.name, 'Must have Tithi name');
  assert(['Shukla', 'Krishna'].includes(panchang.tithi.paksha), 'Paksha must be Shukla or Krishna');
  assert(panchang.tithi.number >= 1 && panchang.tithi.number <= 30, 'Tithi number must be 1-30');
  assert(panchang.nakshatra.name, 'Must have Nakshatra name');
  assert(panchang.nakshatra.pada >= 1 && panchang.nakshatra.pada <= 4, 'Pada must be 1-4');
  assert(panchang.yoga.name, 'Must have Yoga name');
  assert(panchang.yoga.index >= 1 && panchang.yoga.index <= 27, 'Yoga index must be 1-27');
  assert(panchang.karana.name, 'Must have Karana name');
  assert(panchang.timings.sunrise, 'Must calculate Sunrise');
  assert(panchang.timings.sunset, 'Must calculate Sunset');
  assert(panchang.timings.rahuKalam, 'Must have Rahu Kalam');
  assert(panchang.timings.yamaganda, 'Must have Yamaganda');
  assert(panchang.timings.gulikaKalam, 'Must have Gulika Kalam');
  assert(panchang.timings.abhijitMuhurat, 'Must have Abhijit Muhurat');
});

console.log(`\n🏁 Test Suite Results: ${passedTests}/${totalTests} Passed.`);
if (passedTests === totalTests) {
  console.log('✨ ALL VEDIC CALCULATION TESTS PASSED!\n');
  process.exit(0);
} else {
  console.error('💥 Some tests failed.\n');
  process.exit(1);
}
