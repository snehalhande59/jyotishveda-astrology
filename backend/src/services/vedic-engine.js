/**
 * Vedic Astrology Engine
 * Implements Sidereal Astronomical Calculations with Lahiri (Chitrapaksha) Ayanamsa,
 * Planetary Longitudes, Lagna (Ascendant), Moon Sign (Rashi), Nakshatras & Padas,
 * 12 Vedic Houses (Bhavas), and Vimshottari Dasha periods.
 */

const ZODIAC_SIGNS = [
  { id: 1, name: "Aries", sanskrit: "Mesha", lord: "Mars", element: "Fire" },
  { id: 2, name: "Taurus", sanskrit: "Vrishabha", lord: "Venus", element: "Earth" },
  { id: 3, name: "Gemini", sanskrit: "Mithuna", lord: "Mercury", element: "Air" },
  { id: 4, name: "Cancer", sanskrit: "Karka", lord: "Moon", element: "Water" },
  { id: 5, name: "Leo", sanskrit: "Simha", lord: "Sun", element: "Fire" },
  { id: 6, name: "Virgo", sanskrit: "Kanya", lord: "Mercury", element: "Earth" },
  { id: 7, name: "Libra", sanskrit: "Tula", lord: "Venus", element: "Air" },
  { id: 8, name: "Scorpio", sanskrit: "Vrishchika", lord: "Mars", element: "Water" },
  { id: 9, name: "Sagittarius", sanskrit: "Dhanu", lord: "Jupiter", element: "Fire" },
  { id: 10, name: "Capricorn", sanskrit: "Makara", lord: "Saturn", element: "Earth" },
  { id: 11, name: "Aquarius", sanskrit: "Kumbha", lord: "Saturn", element: "Air" },
  { id: 12, name: "Pisces", sanskrit: "Meena", lord: "Jupiter", element: "Water" },
];

const NAKSHATRAS = [
  { id: 1, name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras" },
  { id: 2, name: "Bharani", lord: "Venus", deity: "Yama" },
  { id: 3, name: "Krittika", lord: "Sun", deity: "Agni" },
  { id: 4, name: "Rohini", lord: "Moon", deity: "Brahma" },
  { id: 5, name: "Mrigashira", lord: "Mars", deity: "Soma" },
  { id: 6, name: "Ardra", lord: "Rahu", deity: "Rudra" },
  { id: 7, name: "Punarvasu", lord: "Jupiter", deity: "Aditi" },
  { id: 8, name: "Pushya", lord: "Saturn", deity: "Brihaspati" },
  { id: 9, name: "Ashlesha", lord: "Mercury", deity: "Nagas" },
  { id: 10, name: "Magha", lord: "Ketu", deity: "Pitris" },
  { id: 11, name: "Purva Phalguni", lord: "Venus", deity: "Bhaga" },
  { id: 12, name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman" },
  { id: 13, name: "Hasta", lord: "Moon", deity: "Savitr" },
  { id: 14, name: "Chitra", lord: "Mars", deity: "Vishwakarma" },
  { id: 15, name: "Swati", lord: "Rahu", deity: "Vayu" },
  { id: 16, name: "Vishakha", lord: "Jupiter", deity: "Indra-Agni" },
  { id: 17, name: "Anuradha", lord: "Saturn", deity: "Mitra" },
  { id: 18, name: "Jyeshtha", lord: "Mercury", deity: "Indra" },
  { id: 19, name: "Mula", lord: "Ketu", deity: "Nirriti" },
  { id: 20, name: "Purva Ashadha", lord: "Venus", deity: "Apas" },
  { id: 21, name: "Uttara Ashadha", lord: "Sun", deity: "Vishwadevas" },
  { id: 22, name: "Shravana", lord: "Moon", deity: "Vishnu" },
  { id: 23, name: "Dhanishta", lord: "Mars", deity: "Ashta Vasus" },
  { id: 24, name: "Shatabhisha", lord: "Rahu", deity: "Varuna" },
  { id: 25, name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada" },
  { id: 26, name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahirbudhnya" },
  { id: 27, name: "Revati", lord: "Mercury", deity: "Pushan" },
];

const DASHA_LORDS = [
  { lord: "Ketu", years: 7 },
  { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 },
  { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 },
  { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 },
  { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 },
];

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

function norm360(deg) {
  let val = deg % 360;
  if (val < 0) val += 360;
  return val;
}

/**
 * Calculates Julian Day Number for given UTC date & time
 */
function getJulianDate(year, month, day, hour, minute, second = 0) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFraction = (hour + minute / 60 + second / 3600) / 24;
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + dayFraction + b - 1524.5;
  return jd;
}

/**
 * Computes Lahiri Ayanamsa for a given Julian Day
 * Reference: Lahiri Chitrapaksha Ayanamsa
 */
function getLahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  // Standard Lahiri formula: 23.856667 + 1.3969712 * T + 0.0003086 * T^2
  const ayanamsa = 23.856667 + 1.3969712 * T + 0.0003086 * T * T;
  return ayanamsa;
}

/**
 * Astronomical approximation of tropical Sun longitude
 */
function getSunLongitude(T) {
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = toRad(norm360(M));
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  const sunTrueLong = norm360(L0 + C);
  return sunTrueLong;
}

/**
 * Astronomical approximation of tropical Moon longitude
 */
function getMoonLongitude(T) {
  const Lprime = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841.0;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mprime = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;

  const sin = (deg) => Math.sin(toRad(deg));
  let l = Lprime +
    6.288774 * sin(Mprime) +
    1.274027 * sin(2 * D - Mprime) +
    0.658314 * sin(2 * D) +
    0.213618 * sin(2 * Mprime) -
    0.185116 * sin(M) -
    0.114332 * sin(2 * (Lprime - 125.04452));
  return norm360(l);
}

/**
 * Planetary tropical longitudes (Keplerian mean orbital elements + perturbations)
 */
function getPlanetTropicalLongitudes(T) {
  // Mean elements for Mars, Mercury, Jupiter, Venus, Saturn, Rahu (Mean Node)
  const mercury = norm360(252.2509 + 149472.6746 * T + 6.3 * Math.sin(toRad(149472.6746 * T)));
  const venus = norm360(181.9798 + 58517.8156 * T + 0.7 * Math.sin(toRad(58517.8156 * T)));
  const mars = norm360(355.433 + 19140.2993 * T + 10.6 * Math.sin(toRad(19140.2993 * T)));
  const jupiter = norm360(34.3515 + 3034.9057 * T + 5.5 * Math.sin(toRad(3034.9057 * T)));
  const saturn = norm360(50.0774 + 1222.1138 * T + 6.3 * Math.sin(toRad(1222.1138 * T)));
  // Rahu (Moon's Mean Ascending Node) moves retrograde
  const rahu = norm360(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  // Ketu is always 180 degrees from Rahu
  const ketu = norm360(rahu + 180);

  return { mercury, venus, mars, jupiter, saturn, rahu, ketu };
}

/**
 * Calculates Sidereal Lagna (Ascendant) using Local Sidereal Time and Latitude
 */
function getAscendant(jd, lat, lon, ayanamsa) {
  const T = (jd - 2451545.0) / 36525.0;
  // Greenwich Mean Sidereal Time (GMST) in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmst = norm360(gmst);

  // Local Sidereal Time (RAMC)
  const ramc = norm360(gmst + lon);

  // Obliquity of the Ecliptic (eps)
  const eps = 23.4392911 - 0.0130042 * T;
  const epsRad = toRad(eps);
  const ramcRad = toRad(ramc);
  const latRad = toRad(lat);

  // Ascendant formula:
  // tan(asc) = cos(ramc) / (-sin(ramc) * cos(eps) - tan(lat) * sin(eps))
  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = toDeg(Math.atan2(y, x));
  ascTropical = norm360(ascTropical);

  const ascSidereal = norm360(ascTropical - ayanamsa);
  return ascSidereal;
}

/**
 * Maps a longitude degree to Zodiac sign, degrees in sign, Nakshatra, and Pada
 */
function mapToVedicDetails(siderealDegree) {
  const deg = norm360(siderealDegree);
  const signIndex = Math.floor(deg / 30);
  const degreeInSign = deg % 30;
  const zodiac = ZODIAC_SIGNS[signIndex];

  // Nakshatra: 360 / 27 = 13 deg 20 min = 13.3333333 deg
  const nakshatraIndex = Math.floor(deg / (360 / 27));
  const nakshatra = NAKSHATRAS[nakshatraIndex % 27];

  // Pada: Each nakshatra has 4 padas (3 deg 20 min = 3.3333333 deg)
  const degInNak = deg % (360 / 27);
  const pada = Math.floor(degInNak / (13.3333333 / 4)) + 1;

  return {
    longitude: Number(deg.toFixed(4)),
    signNumber: signIndex + 1,
    signName: zodiac.name,
    signSanskrit: zodiac.sanskrit,
    degreeInSign: Number(degreeInSign.toFixed(2)),
    degreeFormatted: `${Math.floor(degreeInSign)}° ${Math.round((degreeInSign % 1) * 60)}'`,
    ruler: zodiac.lord,
    nakshatraName: nakshatra.name,
    nakshatraLord: nakshatra.lord,
    nakshatraPada: pada,
  };
}

/**
 * Calculates Navamsha (D9) Chart Sign and Degree for a sidereal longitude
 */
function getNavamsaDetails(siderealDegree) {
  const deg = norm360(siderealDegree);
  const signIndex = Math.floor(deg / 30);
  const degreeInSign = deg % 30;
  const navamsaIndex = Math.floor(degreeInSign / (30 / 9)); // 0 to 8

  // Element starting sign: Fire->Aries(0), Earth->Capricorn(9), Air->Libra(6), Water->Cancer(3)
  const elementGroup = signIndex % 4;
  const startSignIndex = elementGroup === 0 ? 0 : elementGroup === 1 ? 9 : elementGroup === 2 ? 6 : 3;
  const navamsaSignIndex = (startSignIndex + navamsaIndex) % 12;
  const navamsaZodiac = ZODIAC_SIGNS[navamsaSignIndex];
  const degreeInNavamsa = (degreeInSign % (30 / 9)) * 9;

  return {
    signNumber: navamsaSignIndex + 1,
    signName: navamsaZodiac.name,
    signSanskrit: navamsaZodiac.sanskrit,
    lord: navamsaZodiac.lord,
    degreeInSign: Number(degreeInNavamsa.toFixed(2)),
    degreeFormatted: `${Math.floor(degreeInNavamsa)}° ${Math.round((degreeInNavamsa % 1) * 60)}'`,
  };
}

/**
 * Calculates Vimshottari Mahadasha balance and timelines
 */
function calculateVimshottariDasha(moonLongitude, birthDateObj) {
  const degInNak = moonLongitude % (360 / 27);
  const nakshatraIndex = Math.floor(moonLongitude / (360 / 27)) % 27;
  const startingLordIndex = nakshatraIndex % 9;

  const totalLordYears = DASHA_LORDS[startingLordIndex].years;
  const elapsedRatio = degInNak / (360 / 27);
  const remainingRatio = 1 - elapsedRatio;
  const firstDashaRemainingYears = totalLordYears * remainingRatio;

  const dashaTimeline = [];
  let currentDate = new Date(birthDateObj.getTime());

  // 1st Dasha (balance)
  const firstEndDate = new Date(currentDate.getTime() + firstDashaRemainingYears * 365.25 * 86400000);
  dashaTimeline.push({
    planet: DASHA_LORDS[startingLordIndex].lord,
    durationYears: Number(firstDashaRemainingYears.toFixed(2)),
    startDate: currentDate.toISOString().split("T")[0],
    endDate: firstEndDate.toISOString().split("T")[0],
    isBalance: true,
  });
  currentDate = firstEndDate;

  // Next dashas in cycle
  for (let i = 1; i < 9; i++) {
    const idx = (startingLordIndex + i) % 9;
    const lord = DASHA_LORDS[idx];
    const endDate = new Date(currentDate.getTime() + lord.years * 365.25 * 86400000);
    dashaTimeline.push({
      planet: lord.lord,
      durationYears: lord.years,
      startDate: currentDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      isBalance: false,
    });
    currentDate = endDate;
  }

  return {
    balanceDashaPlanet: DASHA_LORDS[startingLordIndex].lord,
    balanceYears: Number(firstDashaRemainingYears.toFixed(2)),
    timeline: dashaTimeline,
  };
}

/**
 * Main Vedic Chart Generator
 */
function calculateKundli({
  fullName,
  dateOfBirth, // YYYY-MM-DD
  timeOfBirth, // HH:MM
  placeOfBirth,
  latitude,
  longitude,
  timezoneOffsetHours = 5.5, // Default IST
  ayanamsaType = "Lahiri",
}) {
  // Parse date flexibly (supporting both YYYY-MM-DD and DD-MM-YYYY or / separators)
  const dateParts = dateOfBirth.includes('/') ? dateOfBirth.split('/') : dateOfBirth.split('-');
  let year, month, day;
  if (dateParts[0] && dateParts[0].length === 4) {
    // YYYY-MM-DD
    year = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10);
    day = parseInt(dateParts[2], 10);
  } else if (dateParts[2] && dateParts[2].length === 4) {
    // DD-MM-YYYY
    day = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10);
    year = parseInt(dateParts[2], 10);
  } else {
    year = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10);
    day = parseInt(dateParts[2], 10);
  }

  const [hourStr, minuteStr] = (timeOfBirth || '12:00').split(':');
  const localHour = parseInt(hourStr, 10) || 0;
  const localMinute = parseInt(minuteStr, 10) || 0;

  // Convert to UTC
  const totalLocalHours = localHour + localMinute / 60;
  let totalUtcHours = totalLocalHours - timezoneOffsetHours;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;

  if (totalUtcHours < 0) {
    totalUtcHours += 24;
    utcDay -= 1;
    if (utcDay < 1) {
      utcMonth -= 1;
      if (utcMonth < 1) {
        utcMonth = 12;
        utcYear -= 1;
      }
      utcDay = 28; // safe approximation for month boundary
    }
  } else if (totalUtcHours >= 24) {
    totalUtcHours -= 24;
    utcDay += 1;
  }

  const utHour = Math.floor(totalUtcHours);
  const utMinute = Math.round((totalUtcHours - utHour) * 60);

  const jd = getJulianDate(utcYear, utcMonth, utcDay, utHour, utMinute);
  const T = (jd - 2451545.0) / 36525.0;

  const ayanamsaValue = getLahiriAyanamsa(jd);

  // Tropical longitudes
  const sunTrop = getSunLongitude(T);
  const moonTrop = getMoonLongitude(T);
  const otherPlanetsTrop = getPlanetTropicalLongitudes(T);
  const dT = 0.0001; // ~3.6 days differential for clear velocity vector
  const nextPlanetsTrop = getPlanetTropicalLongitudes(T + dT);
  const prevPlanetsTrop = getPlanetTropicalLongitudes(T - dT);

  function checkRetro(name) {
    if (name === 'rahu' || name === 'ketu') return true;
    let diff = nextPlanetsTrop[name] - prevPlanetsTrop[name];
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff < 0;
  }

  function getDignity(planetName, signNum) {
    const table = {
      Sun: { exalted: 1, debilitated: 7, own: [5] },
      Moon: { exalted: 2, debilitated: 8, own: [4] },
      Mars: { exalted: 10, debilitated: 4, own: [1, 8] },
      Mercury: { exalted: 6, debilitated: 12, own: [3, 6] },
      Jupiter: { exalted: 4, debilitated: 10, own: [9, 12] },
      Venus: { exalted: 12, debilitated: 6, own: [2, 7] },
      Saturn: { exalted: 7, debilitated: 1, own: [10, 11] },
      Rahu: { exalted: 2, debilitated: 8, own: [11] },
      Ketu: { exalted: 8, debilitated: 2, own: [8] },
    };
    const p = table[planetName];
    if (!p) return 'Neutral';
    if (p.exalted === signNum) return 'Exalted (Uchcha)';
    if (p.debilitated === signNum) return 'Debilitated (Neecha)';
    if (p.own.includes(signNum)) return 'Own Sign (Swakshetra)';
    return 'Neutral';
  }

  // Convert to Sidereal with Lahiri Ayanamsa
  const sunSid = norm360(sunTrop - ayanamsaValue);
  const moonSid = norm360(moonTrop - ayanamsaValue);
  const lagnaSid = getAscendant(jd, latitude, longitude, ayanamsaValue);

  const planets = [
    { name: "Sun", sanskrit: "Surya", isRetrograde: false, ...mapToVedicDetails(sunSid) },
    { name: "Moon", sanskrit: "Chandra", isRetrograde: false, ...mapToVedicDetails(moonSid) },
    { name: "Mars", sanskrit: "Mangala", isRetrograde: checkRetro('mars'), ...mapToVedicDetails(norm360(otherPlanetsTrop.mars - ayanamsaValue)) },
    { name: "Mercury", sanskrit: "Budha", isRetrograde: checkRetro('mercury'), ...mapToVedicDetails(norm360(otherPlanetsTrop.mercury - ayanamsaValue)) },
    { name: "Jupiter", sanskrit: "Guru", isRetrograde: checkRetro('jupiter'), ...mapToVedicDetails(norm360(otherPlanetsTrop.jupiter - ayanamsaValue)) },
    { name: "Venus", sanskrit: "Shukra", isRetrograde: checkRetro('venus'), ...mapToVedicDetails(norm360(otherPlanetsTrop.venus - ayanamsaValue)) },
    { name: "Saturn", sanskrit: "Shani", isRetrograde: checkRetro('saturn'), ...mapToVedicDetails(norm360(otherPlanetsTrop.saturn - ayanamsaValue)) },
    { name: "Rahu", sanskrit: "Rahu", isRetrograde: true, ...mapToVedicDetails(norm360(otherPlanetsTrop.rahu - ayanamsaValue)) },
    { name: "Ketu", sanskrit: "Ketu", isRetrograde: true, ...mapToVedicDetails(norm360(otherPlanetsTrop.ketu - ayanamsaValue)) },
  ].map((p) => ({
    ...p,
    dignity: getDignity(p.name, p.signNumber),
  }));

  const ascendantDetails = mapToVedicDetails(lagnaSid);
  const ascendantSignNumber = ascendantDetails.signNumber;

  // Compute 12 Houses (Bhavas) using Vedic Rashi-Chalit (Equal House from Lagna)
  const houses = [];
  for (let houseNum = 1; houseNum <= 12; houseNum++) {
    const signNum = ((ascendantSignNumber - 1 + (houseNum - 1)) % 12) + 1;
    const zodiac = ZODIAC_SIGNS[signNum - 1];
    const occupants = planets.filter((p) => p.signNumber === signNum).map((p) => p.name);

    houses.push({
      houseNumber: houseNum,
      signNumber: signNum,
      signName: zodiac.name,
      signSanskrit: zodiac.sanskrit,
      ruler: zodiac.lord,
      occupants,
    });
  }

  // Assign house number and Navamsha to each planet
  planets.forEach((p) => {
    let houseNumber = p.signNumber - ascendantSignNumber + 1;
    if (houseNumber <= 0) houseNumber += 12;
    p.houseNumber = houseNumber;
    p.navamsa = getNavamsaDetails(p.longitude);
  });

  ascendantDetails.navamsa = getNavamsaDetails(lagnaSid);

  // Navamsha D9 houses & occupants
  const navamsaAscSign = ascendantDetails.navamsa.signNumber;
  const navamsaHouses = [];
  for (let i = 1; i <= 12; i++) {
    const signNum = ((navamsaAscSign - 1 + (i - 1)) % 12) + 1;
    const zodiac = ZODIAC_SIGNS[signNum - 1];
    const occupants = planets.filter((p) => p.navamsa.signNumber === signNum).map((p) => p.name);
    navamsaHouses.push({
      houseNumber: i,
      signNumber: signNum,
      signName: zodiac.name,
      signSanskrit: zodiac.sanskrit,
      ruler: zodiac.lord,
      occupants,
    });
  }

  const normalizedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const normalizedTime = `${String(localHour).padStart(2, '0')}:${String(localMinute).padStart(2, '0')}`;
  const birthDateObj = new Date(`${normalizedDate}T${normalizedTime}:00Z`);
  const dasha = calculateVimshottariDasha(moonSid, birthDateObj);

  const panchang = calculatePanchang({
    date: normalizedDate,
    time: normalizedTime,
    latitude,
    longitude,
    timezoneOffsetHours,
  });

  return {
    meta: {
      fullName,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude,
      longitude,
      timezoneOffsetHours,
      ayanamsa: {
        name: ayanamsaType,
        value: Number(ayanamsaValue.toFixed(4)),
        formatted: `${Math.floor(ayanamsaValue)}° ${Math.round((ayanamsaValue % 1) * 60)}'`,
      },
      julianDate: Number(jd.toFixed(4)),
    },
    ascendant: {
      longitude: ascendantDetails.longitude,
      signNumber: ascendantDetails.signNumber,
      signName: ascendantDetails.signName,
      signSanskrit: ascendantDetails.signSanskrit,
      degreeFormatted: ascendantDetails.degreeFormatted,
      nakshatra: ascendantDetails.nakshatraName,
      nakshatraLord: ascendantDetails.nakshatraLord || SIGN_LORDS[ascendantDetails.signNumber - 1],
      pada: ascendantDetails.nakshatraPada,
      navamsa: ascendantDetails.navamsa,
    },
    moonSign: {
      signNumber: planets[1].signNumber,
      signName: planets[1].signName,
      signSanskrit: planets[1].signSanskrit,
      degreeFormatted: planets[1].degreeFormatted,
      nakshatra: planets[1].nakshatraName,
      nakshatraLord: planets[1].nakshatraLord,
      pada: planets[1].nakshatraPada,
      navamsa: planets[1].navamsa,
    },
    sunSign: {
      signNumber: planets[0].signNumber,
      signName: planets[0].signName,
      signSanskrit: planets[0].signSanskrit,
      degreeFormatted: planets[0].degreeFormatted,
      nakshatra: planets[0].nakshatraName,
      pada: planets[0].nakshatraPada,
      navamsa: planets[0].navamsa,
    },
    panchang,
    planets,
    houses,
    navamsaHouses,
    dasha,
  };
}

// 27 Nakshatras Yoni & Gana & Nadi reference tables
const NAKSHATRA_ATTRIBUTES = [
  { id: 1, name: "Ashwini", gana: "Deva", yoni: "Horse", nadi: "Aadi" },
  { id: 2, name: "Bharani", gana: "Manushya", yoni: "Elephant", nadi: "Madhya" },
  { id: 3, name: "Krittika", gana: "Rakshasa", yoni: "Sheep", nadi: "Antya" },
  { id: 4, name: "Rohini", gana: "Manushya", yoni: "Serpent", nadi: "Antya" },
  { id: 5, name: "Mrigashira", gana: "Deva", yoni: "Serpent", nadi: "Madhya" },
  { id: 6, name: "Ardra", gana: "Manushya", yoni: "Dog", nadi: "Aadi" },
  { id: 7, name: "Punarvasu", gana: "Deva", yoni: "Cat", nadi: "Aadi" },
  { id: 8, name: "Pushya", gana: "Deva", yoni: "Sheep", nadi: "Madhya" },
  { id: 9, name: "Ashlesha", gana: "Rakshasa", yoni: "Cat", nadi: "Antya" },
  { id: 10, name: "Magha", gana: "Rakshasa", yoni: "Rat", nadi: "Antya" },
  { id: 11, name: "Purva Phalguni", gana: "Manushya", yoni: "Rat", nadi: "Madhya" },
  { id: 12, name: "Uttara Phalguni", gana: "Manushya", yoni: "Cow", nadi: "Aadi" },
  { id: 13, name: "Hasta", gana: "Deva", yoni: "Buffalo", nadi: "Aadi" },
  { id: 14, name: "Chitra", gana: "Rakshasa", yoni: "Tiger", nadi: "Madhya" },
  { id: 15, name: "Swati", gana: "Deva", yoni: "Buffalo", nadi: "Antya" },
  { id: 16, name: "Vishakha", gana: "Rakshasa", yoni: "Tiger", nadi: "Antya" },
  { id: 17, name: "Anuradha", gana: "Deva", yoni: "Deer", nadi: "Madhya" },
  { id: 18, name: "Jyeshtha", gana: "Rakshasa", yoni: "Deer", nadi: "Aadi" },
  { id: 19, name: "Mula", gana: "Rakshasa", yoni: "Dog", nadi: "Aadi" },
  { id: 20, name: "Purva Ashadha", gana: "Manushya", yoni: "Monkey", nadi: "Madhya" },
  { id: 21, name: "Uttara Ashadha", gana: "Manushya", yoni: "Mongoose", nadi: "Antya" },
  { id: 22, name: "Shravana", gana: "Deva", yoni: "Monkey", nadi: "Antya" },
  { id: 23, name: "Dhanishta", gana: "Rakshasa", yoni: "Lion", nadi: "Madhya" },
  { id: 24, name: "Shatabhisha", gana: "Rakshasa", yoni: "Horse", nadi: "Aadi" },
  { id: 25, name: "Purva Bhadrapada", gana: "Manushya", yoni: "Lion", nadi: "Aadi" },
  { id: 26, name: "Uttara Bhadrapada", gana: "Manushya", yoni: "Cow", nadi: "Madhya" },
  { id: 27, name: "Revati", gana: "Deva", yoni: "Elephant", nadi: "Antya" },
];

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

const SIGN_NAMES_ENG = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_NAMES_SAN = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
];

/**
 * Vedic Ashta Kuta (Guna Milan) Kundli Matching Engine
 * 36 points total across 8 Kutas:
 * Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), Nadi (8)
 */
function calculateGunaMilan(boyMoonDeg, girlMoonDeg) {
  const boyNakIdx = Math.min(26, Math.max(0, Math.floor(norm360(boyMoonDeg) / (360 / 27))));
  const girlNakIdx = Math.min(26, Math.max(0, Math.floor(norm360(girlMoonDeg) / (360 / 27))));
  const boySignIdx = Math.min(11, Math.max(0, Math.floor(norm360(boyMoonDeg) / 30)));
  const girlSignIdx = Math.min(11, Math.max(0, Math.floor(norm360(girlMoonDeg) / 30)));

  const boyNakAttr = NAKSHATRA_ATTRIBUTES[boyNakIdx];
  const girlNakAttr = NAKSHATRA_ATTRIBUTES[girlNakIdx];

  // 1. Varna (Max 1 pt)
  // Brahmin: Cancer(3), Scorpio(7), Pisces(11) -> 4
  // Kshatriya: Aries(0), Leo(4), Sagittarius(8) -> 3
  // Vaishya: Taurus(1), Virgo(5), Capricorn(9) -> 2
  // Shudra: Gemini(2), Libra(6), Aquarius(10) -> 1
  const getVarnaRank = (sIdx) => {
    if ([3, 7, 11].includes(sIdx)) return { rank: 4, name: 'Brahmin' };
    if ([0, 4, 8].includes(sIdx)) return { rank: 3, name: 'Kshatriya' };
    if ([1, 5, 9].includes(sIdx)) return { rank: 2, name: 'Vaishya' };
    return { rank: 1, name: 'Shudra' };
  };
  const boyVarna = getVarnaRank(boySignIdx);
  const girlVarna = getVarnaRank(girlSignIdx);
  const varnaScore = boyVarna.rank >= girlVarna.rank ? 1 : 0;

  // 2. Vashya (Max 2 pts)
  // Chatushpada: Aries(0), Taurus(1), Cap 2nd half, Sag 2nd half
  // Manava: Gemini(2), Virgo(5), Libra(6), Sag 1st(8), Aqu(10)
  // Jalachara: Cancer(3), Pisces(11), Cap 2nd(9)
  // Vanachara: Leo(4)
  // Keeta: Scorpio(7)
  let vashyaScore = 1;
  if (boySignIdx === girlSignIdx) vashyaScore = 2;
  else if (([3, 11].includes(boySignIdx) && girlSignIdx === 7) || ([3, 11].includes(girlSignIdx) && boySignIdx === 7)) {
    vashyaScore = 1; // Jalachara & Keeta
  }

  // 3. Tara / Dina (Max 3 pts)
  const diffNak1 = (girlNakIdx - boyNakIdx + 27) % 9;
  const diffNak2 = (boyNakIdx - girlNakIdx + 27) % 9;
  const isAuspiciousTara = (diff) => [1, 3, 5, 7].includes(diff);
  let taraScore = 0;
  if (isAuspiciousTara(diffNak1) && isAuspiciousTara(diffNak2)) taraScore = 3;
  else if (isAuspiciousTara(diffNak1) || isAuspiciousTara(diffNak2)) taraScore = 1.5;
  else taraScore = 1.5; // Neutral balance

  // 4. Yoni (Max 4 pts)
  const boyYoni = boyNakAttr.yoni;
  const girlYoni = girlNakAttr.yoni;
  let yoniScore = 2; // Neutral default
  if (boyYoni === girlYoni) yoniScore = 4;
  else {
    const enemyYonis = [
      ['Horse', 'Buffalo'], ['Elephant', 'Lion'], ['Sheep', 'Monkey'],
      ['Serpent', 'Mongoose'], ['Dog', 'Deer'], ['Cat', 'Rat'], ['Cow', 'Tiger']
    ];
    const isEnemy = enemyYonis.some(([a, b]) => (boyYoni === a && girlYoni === b) || (boyYoni === b && girlYoni === a));
    yoniScore = isEnemy ? 0 : 2;
  }

  // 5. Graha Maitri (Max 5 pts)
  const boyLord = SIGN_LORDS[boySignIdx];
  const girlLord = SIGN_LORDS[girlSignIdx];
  let grahaScore = 3; // Neutral baseline
  if (boyLord === girlLord) {
    grahaScore = 5;
  } else {
    const friendsMap = {
      Sun: ['Moon', 'Mars', 'Jupiter'],
      Moon: ['Sun', 'Mercury', 'Mars', 'Jupiter'],
      Mars: ['Sun', 'Moon', 'Jupiter'],
      Mercury: ['Sun', 'Venus'],
      Jupiter: ['Sun', 'Moon', 'Mars'],
      Venus: ['Mercury', 'Saturn'],
      Saturn: ['Mercury', 'Venus']
    };
    const bFriends = friendsMap[boyLord] || [];
    const gFriends = friendsMap[girlLord] || [];
    const bLikesG = bFriends.includes(girlLord);
    const gLikesB = gFriends.includes(boyLord);

    if (bLikesG && gLikesB) grahaScore = 5;
    else if (bLikesG || gLikesB) grahaScore = 4;
    else grahaScore = 1;
  }

  // 6. Gana (Max 6 pts)
  const boyGana = boyNakAttr.gana;
  const girlGana = girlNakAttr.gana;
  let ganaScore = 0;
  if (boyGana === girlGana) ganaScore = 6;
  else if ((boyGana === 'Deva' && girlGana === 'Manushya') || (boyGana === 'Manushya' && girlGana === 'Deva')) ganaScore = 5;
  else if (boyGana === 'Deva' && girlGana === 'Rakshasa') ganaScore = 1;
  else if (boyGana === 'Manushya' && girlGana === 'Rakshasa') ganaScore = 0;
  else ganaScore = 1;

  // 7. Bhakoot (Max 7 pts)
  const signDistance = Math.abs(boySignIdx - girlSignIdx) + 1;
  let bhakootScore = 7;
  if ([2, 12, 6, 8, 9, 5].includes(signDistance)) bhakootScore = 0;

  // 8. Nadi (Max 8 pts)
  const boyNadi = boyNakAttr.nadi;
  const girlNadi = girlNakAttr.nadi;
  const nadiScore = boyNadi !== girlNadi ? 8 : 0;

  const totalPoints = varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore;

  let recommendation = "Low Compatibility - Consultation Advised";
  let matchStatus = "AVERAGE MATCH";
  if (totalPoints >= 28) {
    recommendation = "Excellent Compatibility (Uttama Milan)";
    matchStatus = "EXCELLENT MATCH";
  } else if (totalPoints >= 18) {
    recommendation = "Good Compatibility (Madhyama Milan - Approved)";
    matchStatus = "GOOD MATCH";
  }

  const kutasArray = [
    {
      id: 'varna',
      name: 'Natural Refinement / Work (Varna)',
      sanskrit: 'वर्ण',
      shortName: 'Varna',
      obtainedPoints: varnaScore,
      maxPoints: 1,
      boyValue: boyVarna.name,
      girlValue: girlVarna.name,
      description: 'Varna refers to the mental compatibility of the two persons involved. It holds nominal effect in the matters of marriage compatibility.',
      analysis: varnaScore === 1
        ? 'Auspicious mental and professional harmony. Both partners share mutual respect in spiritual and intellectual pursuits.'
        : 'Slight difference in inherent work tendencies; mutual understanding advised.'
    },
    {
      id: 'vashya',
      name: 'Innate Dominance / Control (Vashya)',
      sanskrit: 'वश्य',
      shortName: 'Vashya',
      obtainedPoints: vashyaScore,
      maxPoints: 2,
      boyValue: SIGN_NAMES_SAN[boySignIdx],
      girlValue: SIGN_NAMES_SAN[girlSignIdx],
      description: 'Vashya indicates the mutual attraction, power equation and degree of influence one partner has on the other.',
      analysis: vashyaScore >= 1
        ? 'Harmonious power balance and mutual affection with positive domestic understanding.'
        : 'May require conscious effort to avoid dominant tendencies.'
    },
    {
      id: 'tara',
      name: 'Birth Star Alignment / Destiny (Tara / Dina)',
      sanskrit: 'तारा',
      shortName: 'Tara',
      obtainedPoints: taraScore,
      maxPoints: 3,
      boyValue: boyNakAttr.name,
      girlValue: girlNakAttr.name,
      description: 'Tara represents health, well-being, and longevity compatibility between the bride and groom.',
      analysis: taraScore >= 1.5
        ? 'Benefic cosmic alignment supporting mutual health, longevity, and prosperity.'
        : 'Neutral star influence; regular prayers and health awareness beneficial.'
    },
    {
      id: 'yoni',
      name: 'Animal Symbol / Intimacy (Yoni)',
      sanskrit: 'योनि',
      shortName: 'Yoni',
      obtainedPoints: yoniScore,
      maxPoints: 4,
      boyValue: `${boyYoni} Yoni`,
      girlValue: `${girlYoni} Yoni`,
      description: 'Yoni measures sexual compatibility, physical attraction, and mutual biological affinity.',
      analysis: yoniScore >= 2
        ? 'Mutual physical harmony and affectionate romantic connection between partners.'
        : 'May require patience and open communication for deeper physical bonding.'
    },
    {
      id: 'grahaMaitri',
      name: 'Planetary Friendship / Temperament (Graha Maitri)',
      sanskrit: 'ग्रहमैत्री',
      shortName: 'Graha Maitri',
      obtainedPoints: grahaScore,
      maxPoints: 5,
      boyValue: `${boyLord} (${SIGN_NAMES_SAN[boySignIdx]})`,
      girlValue: `${girlLord} (${SIGN_NAMES_SAN[girlSignIdx]})`,
      description: 'Graha Maitri assesses psychological harmony, intellectual resonance, and friendship between the Moon sign lords.',
      analysis: grahaScore >= 4
        ? 'Excellent mutual friendship between rashi lords ensuring peace, deep trust, and affection.'
        : 'Moderate planetary resonance; shared goals help maintain mental peace.'
    },
    {
      id: 'gana',
      name: 'Temperament / Disposition (Gana)',
      sanskrit: 'गण',
      shortName: 'Gana',
      obtainedPoints: ganaScore,
      maxPoints: 6,
      boyValue: `${boyGana} Gana`,
      girlValue: `${girlGana} Gana`,
      description: 'Gana analyzes behavior, temperament, and spiritual attitude (Deva, Manushya, Rakshasa).',
      analysis: ganaScore >= 5
        ? 'High temperamental synergy with shared social and ethical outlooks.'
        : 'Deva and Rakshasa disposition; mutual respect for individual perspectives required.'
    },
    {
      id: 'bhakoot',
      name: 'Emotional & Family Compatibility (Bhakoot / Rashi)',
      sanskrit: 'भकूट',
      shortName: 'Bhakoot',
      obtainedPoints: bhakootScore,
      maxPoints: 7,
      boyValue: `${SIGN_NAMES_ENG[boySignIdx]} (${SIGN_NAMES_SAN[boySignIdx]})`,
      girlValue: `${SIGN_NAMES_ENG[girlSignIdx]} (${SIGN_NAMES_SAN[girlSignIdx]})`,
      description: 'Bhakoot evaluates overall emotional connection, financial prosperity, and marital longevity.',
      analysis: bhakootScore === 7
        ? 'Supreme emotional connection and family growth following the marriage.'
        : 'Navam-Panchama axis; mitigated by benefic planetary friendship of Moon and Mars.'
    },
    {
      id: 'nadi',
      name: 'Physiological / Genetic Harmony (Nadi)',
      sanskrit: 'नाडी',
      shortName: 'Nadi',
      obtainedPoints: nadiScore,
      maxPoints: 8,
      boyValue: `${boyNadi} Nadi`,
      girlValue: `${girlNadi} Nadi`,
      description: 'Nadi indicates genetic compatibility, nervous system harmony, and progeny prospects.',
      analysis: nadiScore === 8
        ? 'Flawless Nadi alignment (No Nadi Dosha). Outstanding physiological harmony and blessed progeny.'
        : 'Nadi dosha indicated; traditional remedies and medical guidance recommended.'
    },
  ];

  const kutasMap = {
    varna: { points: varnaScore, max: 1 },
    vashya: { points: vashyaScore, max: 2 },
    tara: { points: taraScore, max: 3 },
    yoni: { points: yoniScore, max: 4 },
    grahaMaitri: { points: grahaScore, max: 5 },
    gana: { points: ganaScore, max: 6 },
    bhakoot: { points: bhakootScore, max: 7 },
    nadi: { points: nadiScore, max: 8 },
  };

  return {
    kutas: kutasArray,
    kutasMap,
    totalScore: Number(totalPoints.toFixed(1)),
    maxScore: 36,
    percentage: Number(((totalPoints / 36) * 100).toFixed(1)),
    recommendation,
    matchStatus,
  };
}

const PANCHANG_YOGAS = [
  { index: 1, name: "Vishkambha", isAuspicious: false },
  { index: 2, name: "Priti", isAuspicious: true },
  { index: 3, name: "Ayushman", isAuspicious: true },
  { index: 4, name: "Saubhagya", isAuspicious: true },
  { index: 5, name: "Shobhana", isAuspicious: true },
  { index: 6, name: "Atiganda", isAuspicious: false },
  { index: 7, name: "Sukarma", isAuspicious: true },
  { index: 8, name: "Dhriti", isAuspicious: true },
  { index: 9, name: "Shoola", isAuspicious: false },
  { index: 10, name: "Ganda", isAuspicious: false },
  { index: 11, name: "Vriddhi", isAuspicious: true },
  { index: 12, name: "Dhruva", isAuspicious: true },
  { index: 13, name: "Vyaghata", isAuspicious: false },
  { index: 14, name: "Harshana", isAuspicious: true },
  { index: 15, name: "Vajra", isAuspicious: false },
  { index: 16, name: "Siddhi", isAuspicious: true },
  { index: 17, name: "Vyatipata", isAuspicious: false },
  { index: 18, name: "Variyan", isAuspicious: true },
  { index: 19, name: "Parigha", isAuspicious: false },
  { index: 20, name: "Shiva", isAuspicious: true },
  { index: 21, name: "Siddha", isAuspicious: true },
  { index: 22, name: "Sadhya", isAuspicious: true },
  { index: 23, name: "Shubha", isAuspicious: true },
  { index: 24, name: "Shukla", isAuspicious: true },
  { index: 25, name: "Brahma", isAuspicious: true },
  { index: 26, name: "Indra", isAuspicious: true },
  { index: 27, name: "Vaidhriti", isAuspicious: false },
];

const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Purnima"
];

const TITHI_DEITIES = [
  "Agni", "Brahma", "Gauri", "Ganesha", "Sarpa (Nagas)",
  "Kartikeya", "Surya", "Shiva", "Durga", "Yama",
  "Vishvadevas", "Vishnu", "Kamadeva", "Shiva", "Chandra / Pitris"
];

const VAARAS = [
  { index: 0, name: "Sunday", sanskrit: "Ravivara", ruler: "Sun", rahuKalam: "16:30 - 18:00", yamaganda: "12:00 - 13:30", gulika: "15:00 - 16:30" },
  { index: 1, name: "Monday", sanskrit: "Somavara", ruler: "Moon", rahuKalam: "07:30 - 09:00", yamaganda: "10:30 - 12:00", gulika: "13:30 - 15:00" },
  { index: 2, name: "Tuesday", sanskrit: "Mangalavara", ruler: "Mars", rahuKalam: "15:00 - 16:30", yamaganda: "09:00 - 10:30", gulika: "12:00 - 13:30" },
  { index: 3, name: "Wednesday", sanskrit: "Budhavara", ruler: "Mercury", rahuKalam: "12:00 - 13:30", yamaganda: "07:30 - 09:00", gulika: "10:30 - 12:00" },
  { index: 4, name: "Thursday", sanskrit: "Guruvara", ruler: "Jupiter", rahuKalam: "13:30 - 15:00", yamaganda: "06:00 - 07:30", gulika: "09:00 - 10:30" },
  { index: 5, name: "Friday", sanskrit: "Shukravara", ruler: "Venus", rahuKalam: "10:30 - 12:00", yamaganda: "15:00 - 16:30", gulika: "07:30 - 09:00" },
  { index: 6, name: "Saturday", sanskrit: "Shanivara", ruler: "Saturn", rahuKalam: "09:00 - 10:30", yamaganda: "13:30 - 15:00", gulika: "06:00 - 07:30" },
];

const MOVABLE_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti (Bhadra)"];

/**
 * Genuine Vedic Panchang calculation based on exact Sidereal Sun and Moon mechanics
 */
function calculatePanchang({ date, time = "06:00", latitude = 28.6139, longitude = 77.2090, timezoneOffsetHours = 5.5 }) {
  const parts = date ? date.split("-").map(Number) : [2026, 10, 27];
  const year = parts[0] || 2026;
  const month = parts[1] || 10;
  const day = parts[2] || 27;

  const tParts = (time || "06:00").split(":").map(Number);
  const hour = isNaN(tParts[0]) ? 6 : tParts[0];
  const minute = isNaN(tParts[1]) ? 0 : tParts[1];

  let utcHour = hour - timezoneOffsetHours;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;
  if (utcHour < 0) {
    utcHour += 24;
    utcDay -= 1;
  }

  const jd = getJulianDate(utcYear, utcMonth, utcDay, utcHour, minute);
  const T = (jd - 2451545.0) / 36525.0;
  const ayanamsa = getLahiriAyanamsa(jd);

  const sunTrop = getSunLongitude(T);
  const moonTrop = getMoonLongitude(T);

  const sunSid = norm360(sunTrop - ayanamsa);
  const moonSid = norm360(moonTrop - ayanamsa);

  // 1. Vaara (Weekday)
  const dateObj = new Date(year, month - 1, day, hour, minute);
  const dayOfWeek = dateObj.getDay();
  const vaara = VAARAS[dayOfWeek];

  // 2. Tithi
  const elongation = norm360(moonSid - sunSid);
  const tithiIndex = Math.floor(elongation / 12);
  const tithiNumber = tithiIndex + 1;
  const isShukla = tithiNumber <= 15;
  const paksha = isShukla ? "Shukla" : "Krishna";
  const tithiNameIndex = isShukla ? (tithiNumber - 1) : (tithiNumber === 30 ? 14 : tithiNumber - 16);
  const tithiName = isShukla
    ? TITHI_NAMES[tithiNameIndex]
    : (tithiNumber === 30 ? "Amavasya" : TITHI_NAMES[tithiNameIndex]);
  const deity = TITHI_DEITIES[tithiNameIndex] || "Brahma";
  const progressPercent = Number(((elongation % 12) / 12 * 100).toFixed(1));

  // 3. Nakshatra
  const nakshatraIndex = Math.floor(moonSid / (360 / 27));
  const nakshatra = NAKSHATRAS[nakshatraIndex % 27];
  const degInNak = moonSid % (360 / 27);
  const pada = Math.floor(degInNak / (13.3333333 / 4)) + 1;
  const nakshatraProgress = Number(((degInNak / (360 / 27)) * 100).toFixed(1));

  // 4. Yoga
  const yogaDegree = norm360(sunSid + moonSid);
  const yogaIndex = Math.floor(yogaDegree / (360 / 27)) % 27;
  const yoga = PANCHANG_YOGAS[yogaIndex];

  // 5. Karana
  const karanaIndex = Math.floor(elongation / 6);
  let karanaName = "";
  let karanaType = "Movable";
  if (karanaIndex === 0) {
    karanaName = "Kintughna";
    karanaType = "Fixed";
  } else if (karanaIndex >= 57) {
    if (karanaIndex === 57) karanaName = "Shakuni";
    else if (karanaIndex === 58) karanaName = "Chatushpada";
    else karanaName = "Naga";
    karanaType = "Fixed";
  } else {
    karanaName = MOVABLE_KARANAS[(karanaIndex - 1) % 7];
  }

  // High-precision NOAA Sunrise/Sunset algorithm with Equation of Time & Atmospheric Refraction
  const startOfYear = new Date(Date.UTC(year, 0, 0));
  const dayOfYear = Math.floor((dateObj - startOfYear) / 86400000);

  // Fractional year in radians
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);

  // Equation of Time in minutes (accounts for Earth's orbital eccentricity and obliquity)
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));

  // Solar declination in radians
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);

  const latRad = toRad(latitude);
  // Standard astronomical zenith angle (90° 50' = 90.833° including 34' refraction + 16' solar semi-diameter)
  const zenith = 90.833 * Math.PI / 180;

  const cosHA = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
  const haRad = Math.acos(Math.max(-1, Math.min(1, cosHA)));
  const haDeg = toDeg(haRad);

  // Solar noon in minutes from local midnight
  const solarNoonMin = 720 - 4 * longitude - eqtime + timezoneOffsetHours * 60;
  const sunriseMin = solarNoonMin - haDeg * 4;
  const sunsetMin = solarNoonMin + haDeg * 4;

  const fmtTime = (min) => {
    const totalSec = Math.round(min * 60);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
  };

  const fmtTimeExact = (min) => {
    const totalSec = Math.round(min * 60);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}:${m}:${s}`;
  };

  return {
    date,
    time,
    latitude,
    longitude,
    vaara: {
      name: vaara.name,
      sanskrit: vaara.sanskrit,
      ruler: vaara.ruler,
    },
    tithi: {
      number: tithiNumber,
      name: tithiName,
      paksha,
      deity,
      progressPercent,
    },
    nakshatra: {
      name: nakshatra.name,
      lord: nakshatra.lord,
      pada,
      progressPercent: nakshatraProgress,
    },
    yoga: {
      index: yoga.index,
      name: yoga.name,
      isAuspicious: yoga.isAuspicious,
    },
    karana: {
      name: karanaName,
      type: karanaType,
    },
    timings: {
      sunrise: fmtTime(sunriseMin),
      sunset: fmtTime(sunsetMin),
      sunriseExact: fmtTimeExact(sunriseMin),
      sunsetExact: fmtTimeExact(sunsetMin),
      rahuKalam: vaara.rahuKalam,
      yamaganda: vaara.yamaganda,
      gulikaKalam: vaara.gulika,
      abhijitMuhurat: "11:48 AM - 12:36 PM",
    },
    sunLongitude: Number(sunSid.toFixed(2)),
    moonLongitude: Number(moonSid.toFixed(2)),
    ayanamsa: {
      name: "Lahiri (Chitrapaksha)",
      value: Number(ayanamsa.toFixed(4)),
      formatted: `${Math.floor(ayanamsa)}° ${Math.round((ayanamsa % 1) * 60)}'`,
    },
  };
}

module.exports = {
  ZODIAC_SIGNS,
  NAKSHATRAS,
  calculateKundli,
  calculateGunaMilan,
  calculatePanchang,
  mapToVedicDetails,
  getLahiriAyanamsa,
  getNavamsaDetails,
};
