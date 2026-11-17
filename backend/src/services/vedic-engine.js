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
  { id: 1, name: "Ashwini", gana: "Deva", yoni: "Horse", nadi: "Aadi", rajju: "Pada", ruler: "Ketu" },
  { id: 2, name: "Bharani", gana: "Manushya", yoni: "Elephant", nadi: "Madhya", rajju: "Kati", ruler: "Venus" },
  { id: 3, name: "Krittika", gana: "Rakshasa", yoni: "Sheep", nadi: "Antya", rajju: "Nabhi", ruler: "Sun" },
  { id: 4, name: "Rohini", gana: "Manushya", yoni: "Serpent", nadi: "Antya", rajju: "Kantha", ruler: "Moon" },
  { id: 5, name: "Mrigashira", gana: "Deva", yoni: "Serpent", nadi: "Madhya", rajju: "Shiro", ruler: "Mars" },
  { id: 6, name: "Ardra", gana: "Manushya", yoni: "Dog", nadi: "Aadi", rajju: "Kantha", ruler: "Rahu" },
  { id: 7, name: "Punarvasu", gana: "Deva", yoni: "Cat", nadi: "Aadi", rajju: "Nabhi", ruler: "Jupiter" },
  { id: 8, name: "Pushya", gana: "Deva", yoni: "Sheep", nadi: "Madhya", rajju: "Kati", ruler: "Saturn" },
  { id: 9, name: "Ashlesha", gana: "Rakshasa", yoni: "Cat", nadi: "Antya", rajju: "Pada", ruler: "Mercury" },
  { id: 10, name: "Magha", gana: "Rakshasa", yoni: "Rat", nadi: "Antya", rajju: "Pada", ruler: "Ketu" },
  { id: 11, name: "Purva Phalguni", gana: "Manushya", yoni: "Rat", nadi: "Madhya", rajju: "Kati", ruler: "Venus" },
  { id: 12, name: "Uttara Phalguni", gana: "Manushya", yoni: "Cow", nadi: "Aadi", rajju: "Nabhi", ruler: "Sun" },
  { id: 13, name: "Hasta", gana: "Deva", yoni: "Buffalo", nadi: "Aadi", rajju: "Kantha", ruler: "Moon" },
  { id: 14, name: "Chitra", gana: "Rakshasa", yoni: "Tiger", nadi: "Madhya", rajju: "Shiro", ruler: "Mars" },
  { id: 15, name: "Swati", gana: "Deva", yoni: "Buffalo", nadi: "Antya", rajju: "Kantha", ruler: "Rahu" },
  { id: 16, name: "Vishakha", gana: "Rakshasa", yoni: "Tiger", nadi: "Antya", rajju: "Nabhi", ruler: "Jupiter" },
  { id: 17, name: "Anuradha", gana: "Deva", yoni: "Deer", nadi: "Madhya", rajju: "Kati", ruler: "Saturn" },
  { id: 18, name: "Jyeshtha", gana: "Rakshasa", yoni: "Deer", nadi: "Aadi", rajju: "Pada", ruler: "Mercury" },
  { id: 19, name: "Mula", gana: "Rakshasa", yoni: "Dog", nadi: "Aadi", rajju: "Pada", ruler: "Ketu" },
  { id: 20, name: "Purva Ashadha", gana: "Manushya", yoni: "Monkey", nadi: "Madhya", rajju: "Kati", ruler: "Venus" },
  { id: 21, name: "Uttara Ashadha", gana: "Manushya", yoni: "Mongoose", nadi: "Antya", rajju: "Nabhi", ruler: "Sun" },
  { id: 22, name: "Shravana", gana: "Deva", yoni: "Monkey", nadi: "Antya", rajju: "Kantha", ruler: "Moon" },
  { id: 23, name: "Dhanishta", gana: "Rakshasa", yoni: "Lion", nadi: "Madhya", rajju: "Shiro", ruler: "Mars" },
  { id: 24, name: "Shatabhisha", gana: "Rakshasa", yoni: "Horse", nadi: "Aadi", rajju: "Kantha", ruler: "Rahu" },
  { id: 25, name: "Purva Bhadrapada", gana: "Manushya", yoni: "Lion", nadi: "Aadi", rajju: "Nabhi", ruler: "Jupiter" },
  { id: 26, name: "Uttara Bhadrapada", gana: "Manushya", yoni: "Cow", nadi: "Madhya", rajju: "Kati", ruler: "Saturn" },
  { id: 27, name: "Revati", gana: "Deva", yoni: "Elephant", nadi: "Antya", rajju: "Pada", ruler: "Mercury" },
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

// Incompatible Vedha Nakshatra Pairs
const VEDHA_PAIRS = [
  [1, 18], [2, 17], [3, 16], [4, 15], [6, 22], [7, 21],
  [8, 20], [9, 19], [10, 27], [11, 26], [12, 25], [13, 24]
];

/**
 * Vedic Ashta Kuta (Guna Milan) Kundli Matching Engine
 * 36 points total across 8 Kutas:
 * Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), Nadi (8)
 */
function calculateGunaMilan(boyMoonDeg, girlMoonDeg, boyChart = null, girlChart = null) {
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
    if ([3, 7, 11].includes(sIdx)) return { rank: 4, name: 'Brahmin', marathi: 'ब्राह्मण' };
    if ([0, 4, 8].includes(sIdx)) return { rank: 3, name: 'Kshatriya', marathi: 'क्षत्रिय' };
    if ([1, 5, 9].includes(sIdx)) return { rank: 2, name: 'Vaishya', marathi: 'वैश्य' };
    return { rank: 1, name: 'Shudra', marathi: 'शूद्र' };
  };
  const boyVarna = getVarnaRank(boySignIdx);
  const girlVarna = getVarnaRank(girlSignIdx);
  const varnaScore = boyVarna.rank >= girlVarna.rank ? 1 : 0;

  // 2. Vashya (Max 2 pts)
  // Chatushpada: Aries(0), Taurus(1), Cap 2nd half(9), Sag 2nd half(8)
  // Manava: Gemini(2), Virgo(5), Libra(6), Sag 1st(8), Aqu(10)
  // Jalachara: Cancer(3), Pisces(11), Cap 2nd(9)
  // Vanachara: Leo(4)
  // Keeta: Scorpio(7)
  let vashyaScore = 1;
  if (boySignIdx === girlSignIdx) {
    vashyaScore = 2;
  } else if (
    ([3, 11].includes(boySignIdx) && girlSignIdx === 7) ||
    ([3, 11].includes(girlSignIdx) && boySignIdx === 7)
  ) {
    vashyaScore = 1; // Jalachara & Keeta
  } else if ([0, 1].includes(boySignIdx) && [2, 5, 6].includes(girlSignIdx)) {
    vashyaScore = 1;
  } else if (boySignIdx === 4 && [0, 1, 7].includes(girlSignIdx)) {
    vashyaScore = 0; // Vanachara vs Chatushpada/Keeta (Bhakshya)
  } else if (girlSignIdx === 4 && [0, 1, 7].includes(boySignIdx)) {
    vashyaScore = 0;
  }

  // 3. Tara / Dina (Max 3 pts)
  const diffNak1 = (girlNakIdx - boyNakIdx + 27) % 9;
  const diffNak2 = (boyNakIdx - girlNakIdx + 27) % 9;
  const isAuspiciousTara = (diff) => [1, 3, 5, 7, 8].includes(diff); // Sampat(1), Kshema(3), Sadhaka(5), Mitra(7), Ati-Mitra(8)
  let taraScore = 0;
  if (isAuspiciousTara(diffNak1) && isAuspiciousTara(diffNak2)) taraScore = 3;
  else if (isAuspiciousTara(diffNak1) || isAuspiciousTara(diffNak2)) taraScore = 1.5;
  else taraScore = 0;

  // 4. Yoni (Max 4 pts)
  const boyYoni = boyNakAttr.yoni;
  const girlYoni = girlNakAttr.yoni;
  let yoniScore = 2; // Neutral default
  if (boyYoni === girlYoni) {
    yoniScore = 4;
  } else {
    const enemyYonis = [
      ['Horse', 'Buffalo'], ['Elephant', 'Lion'], ['Sheep', 'Monkey'],
      ['Serpent', 'Mongoose'], ['Dog', 'Deer'], ['Cat', 'Rat'], ['Cow', 'Tiger']
    ];
    const isEnemy = enemyYonis.some(
      ([a, b]) => (boyYoni === a && girlYoni === b) || (boyYoni === b && girlYoni === a)
    );
    yoniScore = isEnemy ? 0 : 2;
  }

  // 5. Graha Maitri (Max 5 pts)
  const boyLord = SIGN_LORDS[boySignIdx];
  const girlLord = SIGN_LORDS[girlSignIdx];
  let grahaScore = 3;
  if (boyLord === girlLord) {
    grahaScore = 5;
  } else {
    const friendsMap = {
      Sun: ['Moon', 'Mars', 'Jupiter'],
      Moon: ['Sun', 'Mercury'],
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
  if (boyGana === girlGana) {
    ganaScore = 6;
  } else if (
    (boyGana === 'Deva' && girlGana === 'Manushya') ||
    (boyGana === 'Manushya' && girlGana === 'Deva')
  ) {
    ganaScore = 5;
  } else if (boyGana === 'Deva' && girlGana === 'Rakshasa') {
    ganaScore = 1;
  } else if (boyGana === 'Manushya' && girlGana === 'Rakshasa') {
    ganaScore = 0;
  } else {
    ganaScore = 1;
  }

  // 7. Bhakoot (Max 7 pts)
  const dist1 = ((girlSignIdx - boySignIdx + 12) % 12) + 1;
  const dist2 = ((boySignIdx - girlSignIdx + 12) % 12) + 1;
  let bhakootScore = 7;
  let bhakootDosha = false;
  let bhakootCancelled = false;
  let bhakootReason = 'Harmonious Rashi placement promoting mutual emotional fulfillment and prosperity.';

  if ((dist1 === 2 && dist2 === 12) || (dist1 === 12 && dist2 === 2)) {
    bhakootDosha = true;
    bhakootScore = 0;
    bhakootReason = 'Dwirdwadash (2/12) axis indicating potential financial variation or separate residences.';
  } else if ((dist1 === 6 && dist2 === 8) || (dist1 === 8 && dist2 === 6)) {
    bhakootDosha = true;
    bhakootScore = 0;
    bhakootReason = 'Shadashtak (6/8) axis requiring conscious health awareness and open communication.';
  } else if ((dist1 === 5 && dist2 === 9) || (dist1 === 9 && dist2 === 5)) {
    bhakootDosha = true;
    bhakootScore = 0;
    bhakootReason = 'Navapancham (5/9) axis requiring alignment on family planning and mutual creative endeavors.';
  }

  // Bhakoot Dosha Parihara (Cancellations)
  if (bhakootDosha) {
    if (SIGN_LORDS[boySignIdx] === SIGN_LORDS[girlSignIdx]) {
      bhakootCancelled = true;
      bhakootScore = 7;
      bhakootReason = 'Bhakoot Dosha Parihara: Both Rashi lords are identical, neutralizing all Shadashtak/Dwirdwadash afflictions.';
    } else if (
      (boySignIdx === 11 && girlSignIdx === 0) || (boySignIdx === 0 && girlSignIdx === 11) || // Pisces & Aries (Jupiter & Mars)
      (boySignIdx === 3 && girlSignIdx === 4) || (boySignIdx === 4 && girlSignIdx === 3)     // Cancer & Leo (Moon & Sun)
    ) {
      bhakootCancelled = true;
      bhakootScore = 7;
      bhakootReason = 'Bhakoot Dosha Parihara: Friendly planetary lords of adjacent signs eliminate negative matrimonial effects.';
    }
  }

  // 8. Nadi (Max 8 pts)
  const boyNadi = boyNakAttr.nadi;
  const girlNadi = girlNakAttr.nadi;
  let nadiScore = boyNadi !== girlNadi ? 8 : 0;
  let nadiDosha = boyNadi === girlNadi;
  let nadiCancelled = false;
  let nadiReason = nadiDosha
    ? 'Same Nadi indicated; physiological and genetic synergy requires traditional astrological scrutiny.'
    : 'Flawless Nadi alignment (No Nadi Dosha). Outstanding physiological harmony and blessed progeny.';

  // Nadi Dosha Parihara (Cancellations)
  if (nadiDosha) {
    const boyPada = boyChart?.moonSign?.pada || 1;
    const girlPada = girlChart?.moonSign?.pada || 2;

    if (boySignIdx === girlSignIdx && boyNakIdx !== girlNakIdx) {
      nadiCancelled = true;
      nadiScore = 8;
      nadiReason = 'Nadi Dosha Parihara: Both partners share the same Rashi but possess different Nakshatras, nullifying Nadi Dosha.';
    } else if (boyNakIdx === girlNakIdx && boySignIdx !== girlSignIdx) {
      nadiCancelled = true;
      nadiScore = 8;
      nadiReason = 'Nadi Dosha Parihara: Same Nakshatra across different Rashi signs cancels Nadi Dosha completely.';
    } else if (boyNakIdx === girlNakIdx && boyPada !== girlPada) {
      nadiCancelled = true;
      nadiScore = 8;
      nadiReason = 'Nadi Dosha Parihara: Same Nakshatra with distinct Padas (quarters) removes genetic affliction according to sage Parashara.';
    } else if ([3, 4, 5, 17, 20, 21, 23, 25].includes(boyNakIdx)) {
      // Rohini(3), Mrigashira(4), Ardra(5), Jyeshtha(17), Uttara Ashadha(20), Shravana(21), Shatabhisha(23), Uttara Bhadrapada(25)
      nadiCancelled = true;
      nadiScore = 8;
      nadiReason = 'Nadi Dosha Parihara: Sage Atri exemption applies to these sacred birth stars, releasing Nadi Dosha.';
    }
  }

  // Rajju Dosha
  const boyRajju = boyNakAttr.rajju;
  const girlRajju = girlNakAttr.rajju;
  const rajjuDosha = boyRajju === girlRajju;
  const rajjuDescriptions = {
    Shiro: 'Shiro (Head) Rajju - Relates to longevity of marriage and mental tranquility.',
    Kantha: 'Kantha (Neck) Rajju - Relates to physical health, vitality, and partner well-being.',
    Nabhi: 'Nabhi (Navel) Rajju - Relates to progeny, childbirth, and children’s prosperity.',
    Kati: 'Kati (Waist) Rajju - Relates to material wealth, accumulation, and home stability.',
    Pada: 'Pada (Feet) Rajju - Relates to traveling, foreign residency, and stability in occupation.',
  };

  // Vedha Dosha (Incompatible Nakshatra Pairs)
  const isVedha = VEDHA_PAIRS.some(
    ([a, b]) =>
      (boyNakAttr.id === a && girlNakAttr.id === b) ||
      (boyNakAttr.id === b && girlNakAttr.id === a)
  ) || (
    [5, 14, 23].includes(boyNakAttr.id) && [5, 14, 23].includes(girlNakAttr.id) && boyNakAttr.id !== girlNakAttr.id
  );

  const totalPoints =
    varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore;

  let recommendation = "Low Compatibility - Consultation & Remedies Advised";
  let matchStatus = "AVERAGE MATCH";
  if (totalPoints >= 28) {
    recommendation = "Excellent Compatibility (Uttama Milan - Highly Recommended)";
    matchStatus = "EXCELLENT MATCH";
  } else if (totalPoints >= 18) {
    recommendation = "Good Compatibility (Madhyama Milan - Auspicious & Approved)";
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
      description: 'Varna reflects mental ego, professional temperament, and spiritual capability between partners.',
      analysis: varnaScore === 1
        ? 'Auspicious mental and professional harmony. Both partners share mutual respect in spiritual and intellectual pursuits.'
        : 'Different vocational instincts; mutual respect and emotional equality preserve domestic harmony.'
    },
    {
      id: 'vashya',
      name: 'Innate Dominance / Influence (Vashya)',
      sanskrit: 'वश्य',
      shortName: 'Vashya',
      obtainedPoints: vashyaScore,
      maxPoints: 2,
      boyValue: SIGN_NAMES_SAN[boySignIdx],
      girlValue: SIGN_NAMES_SAN[girlSignIdx],
      description: 'Vashya indicates the mutual attraction, power equation, and degree of magnetic influence one partner has on the other.',
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
      name: 'Animal Symbol / Biological Intimacy (Yoni)',
      sanskrit: 'योनि',
      shortName: 'Yoni',
      obtainedPoints: yoniScore,
      maxPoints: 4,
      boyValue: `${boyYoni} Yoni`,
      girlValue: `${girlYoni} Yoni`,
      description: 'Yoni measures physiological compatibility, physical attraction, and mutual biological affinity.',
      analysis: yoniScore >= 2
        ? 'Mutual physical harmony and affectionate romantic connection between partners.'
        : 'Patience and gentle emotional communication recommended for deeper bonding.'
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
        : 'Different dispositions; mutual respect for individual perspectives required.'
    },
    {
      id: 'bhakoot',
      name: 'Emotional & Family Growth (Bhakoot / Rashi)',
      sanskrit: 'भकूट',
      shortName: 'Bhakoot',
      obtainedPoints: bhakootScore,
      maxPoints: 7,
      boyValue: `${SIGN_NAMES_ENG[boySignIdx]} (${SIGN_NAMES_SAN[boySignIdx]})`,
      girlValue: `${SIGN_NAMES_ENG[girlSignIdx]} (${SIGN_NAMES_SAN[girlSignIdx]})`,
      description: 'Bhakoot evaluates overall emotional connection, financial prosperity, and marital longevity.',
      analysis: bhakootReason,
    },
    {
      id: 'nadi',
      name: 'Physiological / Genetic Synergy (Nadi)',
      sanskrit: 'नाडी',
      shortName: 'Nadi',
      obtainedPoints: nadiScore,
      maxPoints: 8,
      boyValue: `${boyNadi} Nadi`,
      girlValue: `${girlNadi} Nadi`,
      description: 'Nadi indicates genetic compatibility, nervous system harmony, and progeny prospects.',
      analysis: nadiReason,
    },
  ];

  const kutasMap = {
    varna: { points: varnaScore, max: 1 },
    vashya: { points: vashyaScore, max: 2 },
    tara: { points: taraScore, max: 3 },
    yoni: { points: yoniScore, max: 4 },
    grahaMaitri: { points: grahaScore, max: 5 },
    gana: { points: ganaScore, max: 6 },
    bhakoot: { points: bhakootScore, max: 7, hasDosha: bhakootDosha, isCancelled: bhakootCancelled },
    nadi: { points: nadiScore, max: 8, hasDosha: nadiDosha, isCancelled: nadiCancelled },
  };

  return {
    kutas: kutasArray,
    kutasMap,
    totalScore: Number(totalPoints.toFixed(1)),
    maxScore: 36,
    percentage: Number(((totalPoints / 36) * 100).toFixed(1)),
    recommendation,
    matchStatus,
    doshas: {
      nadiDosha: {
        present: nadiDosha && !nadiCancelled,
        cancelled: nadiCancelled,
        boyNadi,
        girlNadi,
        reason: nadiReason,
      },
      bhakootDosha: {
        present: bhakootDosha && !bhakootCancelled,
        cancelled: bhakootCancelled,
        dist1,
        dist2,
        reason: bhakootReason,
      },
      rajjuDosha: {
        present: rajjuDosha,
        boyRajju,
        girlRajju,
        area: rajjuDescriptions[boyRajju] || 'Physical and domestic harmony',
      },
      vedhaDosha: {
        present: isVedha,
        reason: isVedha
          ? 'Vedha (Obstruction) detected between birth stars; traditional remedies and chanting advised.'
          : 'No Vedha affliction between Nakshatras; clear spiritual pathway.',
      },
    },
  };
}

/**
 * Classical Manglik (Kuja) Dosha Evaluation
 * Checks Mars from Lagna and Moon (1, 2, 4, 7, 8, 12) + classical cancellation rules
 */
function calculateManglikDosha(chart) {
  if (!chart || !chart.planets) {
    return {
      status: 'No Manglik Dosha',
      severity: 'None',
      percentage: 0,
      hasDosha: false,
      houseFromLagna: 1,
      houseFromMoon: 1,
      isCancelled: false,
      cancellations: [],
      remedies: [],
    };
  }

  const mars = chart.planets.find((p) => p.name === 'Mars');
  const ascSign = chart.ascendant ? chart.ascendant.signNumber : 1;
  const moonSign = chart.moonSign ? chart.moonSign.signNumber : (chart.planets[1]?.signNumber || 1);
  const marsSign = mars ? mars.signNumber : 1;

  // House of Mars from Lagna
  const houseFromLagna = mars ? (((marsSign - ascSign + 12) % 12) + 1) : 1;
  // House of Mars from Moon
  const houseFromMoon = mars ? (((marsSign - moonSign + 12) % 12) + 1) : 1;

  const doshaHouses = [1, 2, 4, 7, 8, 12];
  const hasDoshaLagna = doshaHouses.includes(houseFromLagna);
  const hasDoshaMoon = doshaHouses.includes(houseFromMoon);

  const cancellations = [];
  let isCancelled = false;

  // Classical Parashari Cancellations
  if (marsSign === 1 || marsSign === 8) {
    cancellations.push('Mars in Swakshetra (Aries or Scorpio) neutralizes malefic intensity.');
    isCancelled = true;
  }
  if (marsSign === 10) {
    cancellations.push('Mars exalted (Uchha) in Capricorn acts as a benefic Yogakaraka.');
    isCancelled = true;
  }
  if (marsSign === 5 || marsSign === 9) {
    cancellations.push('Mars in friendly fiery signs (Leo or Sagittarius) softens matrimonial severity.');
  }
  if (houseFromLagna === 2 && (marsSign === 3 || marsSign === 6)) {
    cancellations.push('Mars in 2nd house in Mercury sign (Gemini or Virgo) is exempt from Kuja Dosha.');
    isCancelled = true;
  }
  if (houseFromLagna === 4 && (marsSign === 1 || marsSign === 8)) {
    cancellations.push('Mars in 4th house in its own signs eliminates Sukha Bhava afflictions.');
    isCancelled = true;
  }
  if (houseFromLagna === 7 && (marsSign === 4 || marsSign === 10)) {
    cancellations.push('Mars in 7th house in Cancer (Neecha Bhanga) or Capricorn has no Kuja Dosha.');
    isCancelled = true;
  }
  if (houseFromLagna === 8 && (marsSign === 9 || marsSign === 12)) {
    cancellations.push('Mars in 8th house in Jupiter signs (Sagittarius or Pisces) cancels Kuja Dosha.');
    isCancelled = true;
  }
  if (houseFromLagna === 12 && (marsSign === 2 || marsSign === 7)) {
    cancellations.push('Mars in 12th house in Venus signs (Taurus or Libra) cancels Kuja Dosha.');
    isCancelled = true;
  }

  // Jupiter aspect or conjunction
  const jupiter = chart.planets.find((p) => p.name === 'Jupiter');
  if (jupiter && mars) {
    if (jupiter.signNumber === mars.signNumber) {
      cancellations.push('Guru-Mangala Yoga: Jupiter conjunct Mars completely purifies Kuja Dosha.');
      isCancelled = true;
    } else {
      const distFromJupiter = ((mars.signNumber - jupiter.signNumber + 12) % 12) + 1;
      if ([5, 7, 9].includes(distFromJupiter)) {
        cancellations.push('Divine aspect (Drishti) of Jupiter on Mars pacifies matrimonial afflictions.');
        isCancelled = true;
      }
    }
  }

  let status = 'No Manglik Dosha';
  let percentage = 0;
  let severity = 'None';

  if (!hasDoshaLagna && !hasDoshaMoon) {
    status = 'No Manglik Dosha';
    percentage = 0;
    severity = 'None';
  } else if (isCancelled) {
    status = 'Manglik Dosha Cancelled (Parihara)';
    percentage = 15;
    severity = 'Cancelled';
  } else if (hasDoshaLagna && hasDoshaMoon) {
    status = 'Purna (Full) Manglik Dosha';
    percentage = 85;
    severity = 'High';
  } else {
    status = 'Anshik (Partial) Manglik Dosha';
    percentage = 45;
    severity = 'Low';
  }

  return {
    status,
    severity,
    percentage,
    hasDosha: hasDoshaLagna || hasDoshaMoon,
    houseFromLagna,
    houseFromMoon,
    marsSignName: mars?.signName || 'Unknown',
    marsSignNumber: marsSign,
    hasDoshaLagna,
    hasDoshaMoon,
    isCancelled,
    cancellations,
    remedies: [
      'Recite Mangal Gayatri Mantra (ॐ क्षितिपुत्राय विद्महे...) or Hanuman Chalisa on Tuesdays.',
      'Wear a certified Red Coral (Moonga) in copper or gold after astrological consultation.',
      'Perform Kumbh Vivah or Vishnu Pratima Vivah before marriage if strongly indicated.',
      'Donate red lentils (Masoor Dal) and jaggery on Tuesdays to seek Lord Hanuman’s blessings.',
    ],
  };
}

/**
 * Cross-Chart Manglik Compatibility Evaluation
 */
function evaluateManglikMatching(boyManglik, girlManglik) {
  const bHas = boyManglik.hasDosha && !boyManglik.isCancelled;
  const gHas = girlManglik.hasDosha && !girlManglik.isCancelled;

  if (bHas && gHas) {
    return {
      compatible: true,
      verdict: 'Excellent Match (Both Manglik - Dosha Nullified)',
      verdictSanskrit: 'दोष साम्य (दोष निरसन)',
      description: 'Both individuals possess Manglik Dosha. According to classical Parashari principles, mutual Manglik placement completely neutralizes the affliction (Dosha Samyam), making this union highly auspicious and emotionally balanced.',
      scoreBonus: 5,
    };
  }

  if (!bHas && !gHas) {
    return {
      compatible: true,
      verdict: 'Auspicious Match (Neither is Manglik)',
      verdictSanskrit: 'शुभ साम्य (दोष रहित)',
      description: 'Neither bride nor groom is affected by Manglik Dosha. Both birth charts are free from Kuja afflictions in the marital houses, ensuring natural peaceful domestic harmony.',
      scoreBonus: 5,
    };
  }

  if (boyManglik.isCancelled || girlManglik.isCancelled) {
    return {
      compatible: true,
      verdict: 'Approved Match (Manglik Dosha Cancelled via Parihara)',
      verdictSanskrit: 'दोष परिहार (अनुकूल)',
      description: 'Manglik affliction is present but successfully cancelled due to classical planetary conditions (exaltation, own house, or Jupiter aspect). The union is safe and approved with minor traditional prayers.',
      scoreBonus: 3,
    };
  }

  return {
    compatible: false,
    verdict: 'Conditional Match (One Partner is Manglik - Consultation Advised)',
    verdictSanskrit: 'एकांगी भौम दोष (परामर्श आवश्यक)',
    description: 'One partner carries active Manglik Dosha while the other does not. In traditional Vedic Jyotish, remedial measures such as Kumbh Vivah, Tuesday Hanuman prayers, or a detailed astrologer consultation are recommended before finalizing.',
    scoreBonus: 0,
  };
}

/**
 * Evaluates 7th House, Venus, Jupiter & Navamsha Compatibility
 */
function evaluatePlanetaryHarmony(boyChart, girlChart) {
  const boy7thSign = ((boyChart.ascendant.signNumber + 5) % 12) + 1;
  const girl7thSign = ((girlChart.ascendant.signNumber + 5) % 12) + 1;
  const boy7thLord = SIGN_LORDS[boy7thSign - 1];
  const girl7thLord = SIGN_LORDS[girl7thSign - 1];

  const boyVenus = boyChart.planets.find((p) => p.name === 'Venus');
  const girlVenus = girlChart.planets.find((p) => p.name === 'Venus');
  const venusDist = boyVenus && girlVenus ? (((girlVenus.signNumber - boyVenus.signNumber + 12) % 12) + 1) : 1;
  const isVenusHarmonious = [1, 5, 7, 9, 11].includes(venusDist);

  const boyD9Lagna = boyChart.ascendant?.navamsa?.signNumber || 1;
  const girlD9Lagna = girlChart.ascendant?.navamsa?.signNumber || 1;
  const d9LagnaDist = (((girlD9Lagna - boyD9Lagna + 12) % 12) + 1);
  const isD9Harmonious = [1, 5, 7, 9, 11].includes(d9LagnaDist);

  return {
    boy7thHouse: {
      signNumber: boy7thSign,
      signName: SIGN_NAMES_ENG[boy7thSign - 1],
      lord: boy7thLord,
    },
    girl7thHouse: {
      signNumber: girl7thSign,
      signName: SIGN_NAMES_ENG[girl7thSign - 1],
      lord: girl7thLord,
    },
    venusHarmony: isVenusHarmonious
      ? 'Auspicious Venus Alignment: Harmonious emotional intimacy and mutual aesthetic appreciation.'
      : 'Venus Placements require mutual patience and regular quality romantic time.',
    d9Harmony: isD9Harmonious
      ? 'Strong Navamsha (D9) Harmony: The subtle inner soul charts resonate favorably for long-term spiritual growth.'
      : 'Navamsha shows complementary life paths that benefit from shared spiritual goals.',
  };
}

/**
 * Master Compatibility Report Generator
 * Computes full Kundlis, Ashtakoota Guna Milan, Manglik, Doshas, and Planetary Harmony
 */
function calculateCompatibilityReport(boyBirth, girlBirth) {
  const boyChart = calculateKundli({
    fullName: boyBirth.fullName || 'Groom',
    dateOfBirth: boyBirth.dateOfBirth,
    timeOfBirth: boyBirth.timeOfBirth || '12:00',
    placeOfBirth: boyBirth.placeOfBirth || 'New Delhi',
    latitude: parseFloat(boyBirth.latitude) || 28.6139,
    longitude: parseFloat(boyBirth.longitude) || 77.2090,
    timezoneOffsetHours: parseFloat(boyBirth.timezoneOffset ?? boyBirth.timezoneOffsetHours) || 5.5,
  });

  const girlChart = calculateKundli({
    fullName: girlBirth.fullName || 'Bride',
    dateOfBirth: girlBirth.dateOfBirth,
    timeOfBirth: girlBirth.timeOfBirth || '12:00',
    placeOfBirth: girlBirth.placeOfBirth || 'New Delhi',
    latitude: parseFloat(girlBirth.latitude) || 28.6139,
    longitude: parseFloat(girlBirth.longitude) || 77.2090,
    timezoneOffsetHours: parseFloat(girlBirth.timezoneOffset ?? girlBirth.timezoneOffsetHours) || 5.5,
  });

  const boyMoonDeg = boyChart.planets[1].longitude;
  const girlMoonDeg = girlChart.planets[1].longitude;

  const gunaMilan = calculateGunaMilan(boyMoonDeg, girlMoonDeg, boyChart, girlChart);
  const boyManglik = calculateManglikDosha(boyChart);
  const girlManglik = calculateManglikDosha(girlChart);
  const manglikMatching = evaluateManglikMatching(boyManglik, girlManglik);
  const planetaryHarmony = evaluatePlanetaryHarmony(boyChart, girlChart);

  // Derive top strengths and challenges
  const strengths = [];
  const challenges = [];

  gunaMilan.kutas.forEach((k) => {
    const ratio = k.obtainedPoints / k.maxPoints;
    if (ratio >= 0.75) {
      strengths.push(`${k.shortName} (${k.obtainedPoints}/${k.maxPoints} pts): ${k.analysis}`);
    } else if (ratio < 0.5) {
      challenges.push(`${k.shortName} (${k.obtainedPoints}/${k.maxPoints} pts): ${k.analysis}`);
    }
  });

  if (manglikMatching.compatible) {
    strengths.push(`Manglik Harmony: ${manglikMatching.verdict}`);
  } else {
    challenges.push(`Manglik Consideration: ${manglikMatching.verdict}`);
  }

  const traditionalRemedies = [
    'Perform Gauri-Shankar Puja or Rudrabhishek together on Mondays to enhance marital bliss and long-term peace.',
    'Chant the Maha Mrityunjaya Mantra (ॐ त्र्यम्बकं यजामहे...) 108 times daily for mutual health and longevity.',
    'Feed green grass or spinach to cows on Wednesdays to invoke the auspicious blessings of Mercury and Jupiter.',
    'Offer milk and white flowers at a Shiva-Parvati temple on Shukla Paksha Fridays for domestic harmony.',
  ];

  return {
    boyChart: {
      fullName: boyBirth.fullName || 'Groom',
      gender: 'male',
      dateOfBirth: boyBirth.dateOfBirth,
      timeOfBirth: boyBirth.timeOfBirth || '12:00',
      placeOfBirth: boyBirth.placeOfBirth || 'New Delhi',
      latitude: parseFloat(boyBirth.latitude) || 28.6139,
      longitude: parseFloat(boyBirth.longitude) || 77.2090,
      timezoneOffsetHours: parseFloat(boyBirth.timezoneOffset ?? boyBirth.timezoneOffsetHours) || 5.5,
      ascendant: boyChart.ascendant,
      moonSign: boyChart.moonSign,
      sunSign: boyChart.sunSign,
      planets: boyChart.planets,
      houses: boyChart.houses,
      navamsaHouses: boyChart.navamsaHouses,
      dasha: boyChart.dasha,
      manglik: boyManglik,
    },
    girlChart: {
      fullName: girlBirth.fullName || 'Bride',
      gender: 'female',
      dateOfBirth: girlBirth.dateOfBirth,
      timeOfBirth: girlBirth.timeOfBirth || '12:00',
      placeOfBirth: girlBirth.placeOfBirth || 'New Delhi',
      latitude: parseFloat(girlBirth.latitude) || 28.6139,
      longitude: parseFloat(girlBirth.longitude) || 77.2090,
      timezoneOffsetHours: parseFloat(girlBirth.timezoneOffset ?? girlBirth.timezoneOffsetHours) || 5.5,
      ascendant: girlChart.ascendant,
      moonSign: girlChart.moonSign,
      sunSign: girlChart.sunSign,
      planets: girlChart.planets,
      houses: girlChart.houses,
      navamsaHouses: girlChart.navamsaHouses,
      dasha: girlChart.dasha,
      manglik: girlManglik,
    },
    gunaMilan,
    manglikMatching,
    doshaAnalysis: gunaMilan.doshas,
    planetaryHarmony,
    summary: {
      score: gunaMilan.totalScore,
      maxScore: 36,
      percentage: gunaMilan.percentage,
      category: gunaMilan.matchStatus,
      recommendation: gunaMilan.recommendation,
      isApproved: gunaMilan.totalScore >= 18,
      strengths,
      challenges,
      traditionalRemedies,
    },
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
  NAKSHATRA_ATTRIBUTES,
  SIGN_LORDS,
  SIGN_NAMES_ENG,
  SIGN_NAMES_SAN,
  calculateKundli,
  calculateGunaMilan,
  calculateManglikDosha,
  evaluateManglikMatching,
  evaluatePlanetaryHarmony,
  calculateCompatibilityReport,
  calculatePanchang,
  mapToVedicDetails,
  getLahiriAyanamsa,
  getNavamsaDetails,
};
