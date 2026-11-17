/**
 * Dedicated Unit Test Suite for Vedic Janma Kundali Matching & Marriage Compatibility Engine
 * Validates 8 Kutas, 36 Points calculation, Manglik Dosha, Nadi & Bhakoot Cancellations,
 * and Full Compatibility Report Generation.
 */

const assert = require('assert');
const vedicEngine = require('../src/services/vedic-engine');

console.log('🧪 Starting Vedic Janma Kundali Matching Engine Test Suite...\n');

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

// 1. Eight Kootas & 36 Maximum Points
test('calculateGunaMilan computes all 8 Kootas with correct maximum possible weights summing to 36', () => {
  const match = vedicEngine.calculateGunaMilan(40.0, 40.0);
  assert.strictEqual(match.maxScore, 36, 'Max score must be exactly 36 points');
  assert.strictEqual(match.kutas.length, 8, 'Must return 8 traditional Kootas');

  const maxPointsMap = {
    varna: 1,
    vashya: 2,
    tara: 3,
    yoni: 4,
    grahaMaitri: 5,
    gana: 6,
    bhakoot: 7,
    nadi: 8,
  };

  let totalMax = 0;
  match.kutas.forEach((k) => {
    assert.strictEqual(k.maxPoints, maxPointsMap[k.id], `Koota ${k.id} must have max weight ${maxPointsMap[k.id]}`);
    totalMax += k.maxPoints;
  });
  assert.strictEqual(totalMax, 36, 'Sum of all Koota weights must be 36');
});

// 2. Deterministic Calculation & Consistency
test('The same Moon degrees always produce the exact same Guna Milan score', () => {
  const run1 = vedicEngine.calculateGunaMilan(52.5, 195.2);
  const run2 = vedicEngine.calculateGunaMilan(52.5, 195.2);

  assert.strictEqual(run1.totalScore, run2.totalScore, 'Score must be deterministic');
  assert.strictEqual(run1.percentage, run2.percentage);
  assert.strictEqual(run1.matchStatus, run2.matchStatus);
});

// 3. Bhakoot Dosha Parihara (Cancellation)
test('Bhakoot Dosha is cancelled when both Rashis share the same planetary lord', () => {
  // Aries (Mars, sign 0) and Scorpio (Mars, sign 7) -> 6/8 Shadashtak axis
  // Moon in Aries ~15°, Moon in Scorpio ~225°
  const match = vedicEngine.calculateGunaMilan(15.0, 225.0);
  const bhakoot = match.kutas.find((k) => k.id === 'bhakoot');
  assert.strictEqual(bhakoot.obtainedPoints, 7, 'Bhakoot score must be 7 due to common ruler Mars');
  assert(bhakoot.analysis.includes('Bhakoot Dosha Parihara'), 'Must document cancellation reason');
});

// 4. Manglik Dosha Verification
test('calculateManglikDosha detects Mars placement from Lagna and Moon accurately', () => {
  // Chart with Aries Ascendant (sign 1) and Mars in Libra (sign 7) -> 7th house Mars
  const mockChart = {
    ascendant: { signNumber: 1, signName: 'Aries' },
    moonSign: { signNumber: 1, signName: 'Aries' },
    planets: [
      { name: 'Sun', signNumber: 1 },
      { name: 'Moon', signNumber: 1 },
      { name: 'Mars', signNumber: 7, signName: 'Libra' }, // 7th house from Lagna & Moon
    ],
  };

  const manglik = vedicEngine.calculateManglikDosha(mockChart);
  assert.strictEqual(manglik.houseFromLagna, 7, 'Mars should be in 7th house from Lagna');
  assert.strictEqual(manglik.hasDosha, true, 'Mars in 7th house must trigger Kuja Dosha');
});

test('calculateManglikDosha respects cancellation when Mars is in own swakshetra Aries', () => {
  // Mars in Aries (sign 1) in 1st house -> Swakshetra cancellation
  const mockChart = {
    ascendant: { signNumber: 1, signName: 'Aries' },
    moonSign: { signNumber: 4, signName: 'Cancer' },
    planets: [
      { name: 'Sun', signNumber: 2 },
      { name: 'Moon', signNumber: 4 },
      { name: 'Mars', signNumber: 1, signName: 'Aries' },
    ],
  };

  const manglik = vedicEngine.calculateManglikDosha(mockChart);
  assert.strictEqual(manglik.isCancelled, true, 'Mars in Aries should cancel Kuja Dosha');
  assert.strictEqual(manglik.status, 'Manglik Dosha Cancelled (Parihara)');
});

// 5. Cross-Chart Manglik Compatibility
test('evaluateManglikMatching nullifies dosha when both individuals are Manglik', () => {
  const boyManglik = { hasDosha: true, isCancelled: false };
  const girlManglik = { hasDosha: true, isCancelled: false };

  const evaluation = vedicEngine.evaluateManglikMatching(boyManglik, girlManglik);
  assert.strictEqual(evaluation.compatible, true, 'Both Manglik must be declared compatible');
  assert(evaluation.verdict.includes('Both Manglik - Dosha Nullified'));
});

// 6. Master calculateCompatibilityReport
test('calculateCompatibilityReport generates full charts and compatibility analysis', () => {
  const report = vedicEngine.calculateCompatibilityReport(
    {
      fullName: 'Vikramaditya',
      dateOfBirth: '1995-10-12',
      timeOfBirth: '08:30',
      placeOfBirth: 'Pune, Maharashtra',
      latitude: 18.5204,
      longitude: 73.8567,
      timezoneOffsetHours: 5.5,
    },
    {
      fullName: 'Ananya',
      dateOfBirth: '1997-04-25',
      timeOfBirth: '15:45',
      placeOfBirth: 'Mumbai, Maharashtra',
      latitude: 19.0760,
      longitude: 72.8777,
      timezoneOffsetHours: 5.5,
    }
  );

  // Check boy chart
  assert(report.boyChart, 'Report must contain boyChart');
  assert.strictEqual(report.boyChart.planets.length, 9, 'Boy chart must have 9 planets');
  assert.strictEqual(report.boyChart.houses.length, 12, 'Boy chart must have 12 houses');
  assert(report.boyChart.ascendant.signName, 'Boy chart must have Ascendant');
  assert(report.boyChart.manglik, 'Boy chart must have Manglik details');

  // Check girl chart
  assert(report.girlChart, 'Report must contain girlChart');
  assert.strictEqual(report.girlChart.planets.length, 9, 'Girl chart must have 9 planets');
  assert.strictEqual(report.girlChart.houses.length, 12, 'Girl chart must have 12 houses');
  assert(report.girlChart.ascendant.signName, 'Girl chart must have Ascendant');
  assert(report.girlChart.manglik, 'Girl chart must have Manglik details');

  // Check Guna Milan
  assert(report.gunaMilan, 'Report must contain Guna Milan');
  assert.strictEqual(report.gunaMilan.maxScore, 36);
  assert(report.gunaMilan.totalScore >= 0 && report.gunaMilan.totalScore <= 36);

  // Check Manglik Comparison & Summary
  assert(report.manglikMatching, 'Report must contain manglikMatching');
  assert(report.summary.score >= 0, 'Report must contain overall score in summary');
  assert(report.summary.recommendation, 'Report must contain recommendation in summary');
});

console.log(`\n🏁 Test Suite Results: ${passedTests}/${totalTests} Passed.`);
if (passedTests === totalTests) {
  console.log('✨ ALL COMPATIBILITY CALCULATION TESTS PASSED!\n');
  process.exit(0);
} else {
  console.error('💥 Some tests failed.\n');
  process.exit(1);
}
