const { createCoreController } = require('@strapi/strapi').factories;
const vedicEngine = require('../../../services/vedic-engine');

function generateVedicReportSections(reportType, chart) {
  const asc = chart.ascendant;
  const moon = chart.moonSign;
  const sun = chart.sunSign;
  const planets = chart.planets;
  const houses = chart.houses;

  const jupiter = planets.find((p) => p.name === 'Jupiter') || {};
  const saturn = planets.find((p) => p.name === 'Saturn') || {};
  const venus = planets.find((p) => p.name === 'Venus') || {};
  const mars = planets.find((p) => p.name === 'Mars') || {};
  const mercury = planets.find((p) => p.name === 'Mercury') || {};

  const base = {
    summary: `Ascendant in ${asc.signName} (${asc.signSanskrit}) with Moon in ${moon.signName} under ${moon.nakshatra} Nakshatra (Pada ${moon.pada}).`,
    ascendantAnalysis: `Your rising sign is ${asc.signName}. It represents physical vitality, personality archetype, and life direction governed by ${houses[0]?.ruler}.`,
    planetarySummary: planets.map((p) => ({
      planet: p.name,
      sanskrit: p.sanskrit,
      sign: p.signName,
      house: p.houseNumber,
      nakshatra: p.nakshatraName,
      pada: p.nakshatraPada,
    })),
    dashaCurrent: chart.dasha.timeline[0] || {},
    nextDasha: chart.dasha.timeline[1] || {},
  };

  if (reportType === 'career') {
    const tenthHouse = houses[9] || {};
    return {
      ...base,
      title: 'In-Depth Career & Education Astrology Report',
      focusHouse: '10th House (Karma Bhava) & 2nd/6th Houses',
      careerSign: tenthHouse.signName,
      careerLord: tenthHouse.ruler,
      analysis: `The 10th house is situated in ${tenthHouse.signName}, ruled by ${tenthHouse.ruler}. Mercury is in house ${mercury.houseNumber} and Saturn is in house ${saturn.houseNumber}, indicating structured analytical thinking and perseverance.`,
      recommendedIndustries: [
        'Technology, Data & Software Architecture',
        'Strategic Consultancy & Advisory',
        'Financial Analytics & Wealth Planning',
        'Academic Research, Publishing & Leadership',
      ],
      timingFavorablePeriods: [
        `Upcoming ${chart.dasha.balanceDashaPlanet} Mahadasha cycle`,
        `Next sub-period phase starting around ${chart.dasha.timeline[1]?.startDate || 'upcoming cycle'}`,
      ],
      remedies: [
        'Perform morning Surya Arghya (offering water to the Sun) for professional radiance and authority.',
        'Wear emerald or yellow sapphire only after individual planetary strength analysis.',
        'Keep workplace desk organized and face North-East during strategic decision-making.',
      ],
    };
  }

  if (reportType === 'marriage') {
    const seventhHouse = houses[6] || {};
    return {
      ...base,
      title: 'Marriage, Relationships & Soulmate Compatibility Report',
      focusHouse: '7th House (Kalatra Bhava) & Venus Position',
      marriageSign: seventhHouse.signName,
      marriageLord: seventhHouse.ruler,
      venusHouse: venus.houseNumber,
      analysis: `Your 7th house of lifelong partnership is configured in ${seventhHouse.signName}, ruled by ${seventhHouse.ruler}. Venus, the natural karaka of matrimonial harmony, resides in house ${venus.houseNumber}. Mars is placed in house ${mars.houseNumber}, showing dynamic romantic instincts.`,
      partnerCharacteristics: [
        `Intellectually curious and emotionally empathetic partner aligned with ${seventhHouse.signName} vibrations.`,
        'Supportive of mutual professional and philosophical aspirations.',
        'Appreciates transparent communication and mutual spiritual respect.',
      ],
      harmonizingRemedies: [
        'Chant the Shukra Gayatri Mantra on Friday mornings for relationship harmony.',
        'Cultivate patience and avoid unilateral decisions during Tuesday Mars hours.',
        'Donate white flowers or rice to those in need on auspicious lunar Fridays.',
      ],
    };
  }

  if (reportType === 'finance') {
    const secondHouse = houses[1] || {};
    const eleventhHouse = houses[10] || {};
    return {
      ...base,
      title: 'Wealth Accumulation & Financial Destiny Report',
      focusHouse: '2nd House (Dhana Bhava) & 11th House (Labha Bhava)',
      dhanaSign: secondHouse.signName,
      labhaSign: eleventhHouse.signName,
      jupiterHouse: jupiter.houseNumber,
      analysis: `The 2nd house of accumulated assets is in ${secondHouse.signName}, while the 11th house of ongoing gains and cash flow is in ${eleventhHouse.signName}. Jupiter, the supreme karaka of prosperity, is seated in house ${jupiter.houseNumber}.`,
      wealthVehicles: [
        'Diversified asset allocation in tangible property and reliable equity funds.',
        'Enterprise-level intellectual property and consulting revenues.',
        'Long-term compounded savings over speculative intraday risks.',
      ],
      auspiciousFinancialWindows: [
        `Mahadasha of ${chart.dasha.timeline[0]?.planet} ending ${chart.dasha.timeline[0]?.endDate}`,
        `Sub-period of ${jupiter.name} conferring wealth expansion`,
      ],
      remedies: [
        'Light a ghee lamp facing North-East every Thursday evening.',
        'Keep a silver or brass coin wrapped in yellow cloth in the personal locker or safe.',
        'Contribute a modest portion of monthly earnings to educational charities.',
      ],
    };
  }

  // Premium Detailed Kundli / Yearly
  return {
    ...base,
    title: reportType === 'yearly' ? 'Yearly Planetary Transits & Vedic Forecast' : 'Comprehensive 360° Kundli Deep-Dive',
    housesDetailed: houses,
    allPlanetsDetailed: planets,
    dashaDetailed: chart.dasha,
    lifeThemes: {
      dharma: `Lagna in ${asc.signName} directs life purpose towards authentic mastery and spiritual duty.`,
      artha: `2nd and 11th houses reveal high aptitude for resource building through disciplined diligence.`,
      kama: `Venus in house ${venus.houseNumber} bestows refined aesthetic tastes and vibrant relationships.`,
      moksha: `12th house dynamics highlight inner wisdom, contemplative peace, and self-realization.`,
    },
    generalGuidanceDisclaimer: 'Astrological guidance indicates energetic inclinations and cycles; personal will, continuous effort, and righteous karma govern destiny.',
  };
}

module.exports = createCoreController('api::astrology-report.astrology-report', ({ strapi }) => ({
  async generate(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body.data || ctx.request.body;

    if (!body.reportType || !body.birthDetails) {
      return ctx.badRequest('Missing required fields: reportType and birthDetails');
    }

    const { fullName, dateOfBirth, timeOfBirth, placeOfBirth, latitude, longitude, timezoneOffset } = body.birthDetails;
    if (!fullName || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return ctx.badRequest('Incomplete birth details provided');
    }

    const lat = parseFloat(latitude) || 28.6139;
    const lon = parseFloat(longitude) || 77.2090;

    const chart = vedicEngine.calculateKundli({
      fullName,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude: lat,
      longitude: lon,
      timezoneOffsetHours: parseFloat(timezoneOffset) || 5.5,
    });

    const reportContent = generateVedicReportSections(body.reportType, chart);

    const isPurchased = body.isPurchased === true || Boolean(body.paymentId);

    const report = await strapi.entityService.create('api::astrology-report.astrology-report', {
      data: {
        title: `${body.reportType.toUpperCase()} Vedic Astrology Report - ${fullName}`,
        reportType: body.reportType,
        birthDetails: body.birthDetails,
        reportContent,
        isPurchased,
        user: user ? user.id : null,
      },
    });

    return { data: report };
  },

  async findMe(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required to view personal reports');
    }

    const reports = await strapi.entityService.findMany('api::astrology-report.astrology-report', {
      filters: { user: user.id },
      sort: { createdAt: 'desc' },
    });

    return { data: reports };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    const report = await strapi.entityService.findOne('api::astrology-report.astrology-report', id, {
      populate: ['user'],
    });

    if (!report) {
      return ctx.notFound('Report not found');
    }

    // Access control: if user is attached, must match logged-in user unless public sample
    if (report.user && (!user || (user.id !== report.user.id && user.role?.name !== 'Admin'))) {
      return ctx.forbidden('Access restricted to the owner of this report');
    }

    return { data: report };
  },
}));
