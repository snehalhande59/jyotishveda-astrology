const vedicEngine = require('../src/services/vedic-engine');

const birth = {
  fullName: "Snehal Hande",
  dateOfBirth: "2003-10-20",
  timeOfBirth: "21:45",
  placeOfBirth: "Sangamner, Maharashtra, India",
  latitude: 19.5678,
  longitude: 74.2115,
  timezoneOffsetHours: 5.5,
  ayanamsa: "Lahiri"
};

try {
  const chart = vedicEngine.calculateKundli(birth);
  const panchang = vedicEngine.calculatePanchang({
    date: birth.dateOfBirth,
    time: birth.timeOfBirth,
    latitude: birth.latitude,
    longitude: birth.longitude,
    timezoneOffset: 5.5
  });

  console.log('=== CALCULATED KUNDLI ===');
  console.log('Ascendant Sign:', chart.ascendant.signName, '(Number:', chart.ascendant.signNumber, ')');
  console.log('Moon Sign:', chart.moonSign.signName, '(Number:', chart.moonSign.signNumber, ')');
  console.log('Nakshatra:', chart.moonSign.nakshatra, 'Pada:', chart.moonSign.pada, 'Lord:', chart.moonSign.nakshatraLord);
  console.log('Sun Sign:', chart.sunSign.signName, '(Number:', chart.sunSign.signNumber, ')');
  console.log('Ayanamsa:', chart.meta.ayanamsa);

  console.log('\n=== CALCULATED PANCHANG ===');
  console.log('Tithi:', panchang.tithi.name, 'Paksha:', panchang.tithi.paksha);
  console.log('Karana:', panchang.karana.name);
  console.log('Yoga:', panchang.yoga.name);
  console.log('Nakshatra:', panchang.nakshatra.name, 'Lord:', panchang.nakshatra.lord);
  console.log('Sunrise:', panchang.timings.sunrise);
  console.log('Sunset:', panchang.timings.sunset);

  console.log('\n=== PLANETS ===');
  chart.planets.forEach(p => {
    console.log(`${p.name} (${p.sanskrit}): House ${p.houseNumber}, Sign ${p.signName} (${p.degreeFormatted}) ${p.isRetrograde ? '[R]' : ''}`);
  });

} catch (e) {
  console.error('Error:', e);
}
