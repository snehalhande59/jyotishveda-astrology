'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    try {
      // 1. Ensure permissions are set for Public and Authenticated roles
      const roles = await strapi.service('plugin::users-permissions.role').find();
      const publicRole = roles.find((r) => r.type === 'public');
      const authRole = roles.find((r) => r.type === 'authenticated');

      const publicPermissions = [
        'api::astrologer.astrologer.find',
        'api::astrologer.astrologer.findOne',
        'api::astrology-service.astrology-service.find',
        'api::astrology-service.astrology-service.findOne',
        'api::pricing-plan.pricing-plan.find',
        'api::pricing-plan.pricing-plan.findOne',
        'api::horoscope.horoscope.find',
        'api::horoscope.horoscope.findOne',
        'api::zodiac-sign.zodiac-sign.find',
        'api::zodiac-sign.zodiac-sign.findOne',
        'api::nakshatra.nakshatra.find',
        'api::nakshatra.nakshatra.findOne',
        'api::astrology-article.astrology-article.find',
        'api::astrology-article.astrology-article.findOne',
        'api::faq.faq.find',
        'api::faq.faq.findOne',
        'api::site-setting.site-setting.find',
        'api::contact-message.contact-message.create',
        'api::kundli.kundli.generate',
        'api::kundli.kundli.calculatePanchang',
        'api::kundli.kundli.calculateCompatibility',
        'api::kundli.kundli.findOne',
        'api::payment.payment.createOrder',
        'api::payment.payment.verify',
        'api::payment.payment.findMyOrders',
        'api::payment.payment.webhook',
        'api::birth-profile.birth-profile.create',
        'api::birth-profile.birth-profile.findOne',
        'api::astrology-report.astrology-report.generate',
        'api::astrology-report.astrology-report.findOne',
        'api::consultation-booking.consultation-booking.create',
        'api::consultation-booking.consultation-booking.findOne',
        'api::location.location.search',
        'api::kundli.kundli.find',
        'api::chat-session.chat-session.getEligibility',
      ];

      if (publicRole) {
        for (const action of publicPermissions) {
          const permissionExists = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { role: publicRole.id, action },
          });
          if (!permissionExists) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: publicRole.id },
            });
          }
        }
      }

      if (authRole) {
        // Authenticated users inherit all public catalog read actions plus personal user actions
        const authPermissions = [
          ...publicPermissions,
          'plugin::users-permissions.user.me',
          'plugin::users-permissions.auth.changePassword',
          'api::birth-profile.birth-profile.findMe',
          'api::birth-profile.birth-profile.create',
          'api::birth-profile.birth-profile.findOne',
          'api::birth-profile.birth-profile.delete',
          'api::astrology-report.astrology-report.findMe',
          'api::astrology-report.astrology-report.generate',
          'api::astrology-report.astrology-report.findOne',
          'api::consultation-booking.consultation-booking.create',
          'api::consultation-booking.consultation-booking.findMe',
          'api::consultation-booking.consultation-booking.findOne',
          'api::payment.payment.createOrder',
          'api::payment.payment.verify',
          'api::payment.payment.findMyOrders',
          'api::location.location.search',
          'api::kundli.kundli.findMyLatest',
          'api::kundli.kundli.find',
          'api::kundli.kundli.findOne',
          'api::kundli.kundli.generate',
          'api::chat-session.chat-session.getEligibility',
          'api::chat-session.chat-session.startFreeSession',
          'api::chat-session.chat-session.startPaidSession',
          'api::chat-session.chat-session.getSession',
          'api::chat-session.chat-session.sendMessage',
          'api::chat-session.chat-session.getMessages',
          'api::chat-session.chat-session.endSession',
          'api::chat-session.chat-session.findMySessions',
        ];

        for (const action of authPermissions) {
          const permissionExists = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { role: authRole.id, action },
          });
          if (!permissionExists) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: authRole.id },
            });
          }
        }
      }

      // 2. Seed initial data if empty
      // Seed Zodiac Signs
      const existingZodiac = await strapi.entityService.findMany('api::zodiac-sign.zodiac-sign', { limit: 1 });
      if (!existingZodiac || existingZodiac.length === 0) {
        const zodiacData = [
          { name: 'Aries', sanskritName: 'Mesha', signNumber: 1, element: 'Fire', ruler: 'Mars', symbol: 'Ram', dateRange: 'Apr 14 - May 14', traits: 'Courageous, pioneering, confident, direct', strengths: ['Leadership', 'Bravery', 'Initiative'], weaknesses: ['Impulsive', 'Short-tempered'], compatibleSigns: ['Leo', 'Sagittarius', 'Gemini'] },
          { name: 'Taurus', sanskritName: 'Vrishabha', signNumber: 2, element: 'Earth', ruler: 'Venus', symbol: 'Bull', dateRange: 'May 15 - Jun 14', traits: 'Stable, grounded, sensual, patient, dedicated', strengths: ['Reliability', 'Patience', 'Artistic appreciation'], weaknesses: ['Stubbornness', 'Possessive'], compatibleSigns: ['Virgo', 'Capricorn', 'Cancer'] },
          { name: 'Gemini', sanskritName: 'Mithuna', signNumber: 3, element: 'Air', ruler: 'Mercury', symbol: 'Twins', dateRange: 'Jun 15 - Jul 15', traits: 'Intellectual, communicative, versatile, curious', strengths: ['Adaptability', 'Eloquence', 'Quick-witted'], weaknesses: ['Restless', 'Indecisive'], compatibleSigns: ['Libra', 'Aquarius', 'Aries'] },
          { name: 'Cancer', sanskritName: 'Karka', signNumber: 4, element: 'Water', ruler: 'Moon', symbol: 'Crab', dateRange: 'Jul 16 - Aug 16', traits: 'Intuitive, nurturing, empathetic, protective', strengths: ['Emotional intelligence', 'Loyalty', 'Creativity'], weaknesses: ['Moody', 'Oversensitive'], compatibleSigns: ['Scorpio', 'Pisces', 'Taurus'] },
          { name: 'Leo', sanskritName: 'Simha', signNumber: 5, element: 'Fire', ruler: 'Sun', symbol: 'Lion', dateRange: 'Aug 17 - Sep 16', traits: 'Magnanimous, charismatic, commanding, noble', strengths: ['Generosity', 'Dignity', 'Optimism'], weaknesses: ['Pride', 'Domineering'], compatibleSigns: ['Aries', 'Sagittarius', 'Libra'] },
          { name: 'Virgo', sanskritName: 'Kanya', signNumber: 6, element: 'Earth', ruler: 'Mercury', symbol: 'Maiden', dateRange: 'Sep 17 - Oct 16', traits: 'Analytical, meticulous, service-oriented, discerning', strengths: ['Precision', 'Problem-solving', 'Organization'], weaknesses: ['Perfectionism', 'Critical'], compatibleSigns: ['Taurus', 'Capricorn', 'Scorpio'] },
          { name: 'Libra', sanskritName: 'Tula', signNumber: 7, element: 'Air', ruler: 'Venus', symbol: 'Scales', dateRange: 'Oct 17 - Nov 15', traits: 'Harmonious, diplomatic, aesthetic, balanced', strengths: ['Fairness', 'Charm', 'Partnership skills'], weaknesses: ['Conflict-averse', 'Hesitant'], compatibleSigns: ['Gemini', 'Aquarius', 'Leo'] },
          { name: 'Scorpio', sanskritName: 'Vrishchika', signNumber: 8, element: 'Water', ruler: 'Mars', symbol: 'Scorpion', dateRange: 'Nov 16 - Dec 15', traits: 'Transformative, penetrating, passionate, intense', strengths: ['Willpower', 'Depth', 'Psychological insight'], weaknesses: ['Secretive', 'Vengeful'], compatibleSigns: ['Cancer', 'Pisces', 'Virgo'] },
          { name: 'Sagittarius', sanskritName: 'Dhanu', signNumber: 9, element: 'Fire', ruler: 'Jupiter', symbol: 'Archer / Centaur', dateRange: 'Dec 16 - Jan 13', traits: 'Philosophical, adventurous, righteous, expansive', strengths: ['Wisdom', 'Optimism', 'Spiritual seekers'], weaknesses: ['Bluntness', 'Overconfident'], compatibleSigns: ['Aries', 'Leo', 'Aquarius'] },
          { name: 'Capricorn', sanskritName: 'Makara', signNumber: 10, element: 'Earth', ruler: 'Saturn', symbol: 'Sea-Goat', dateRange: 'Jan 14 - Feb 12', traits: 'Disciplined, pragmatic, ambitious, structured', strengths: ['Perseverance', 'Integrity', 'Strategic patience'], weaknesses: ['Rigidity', 'Pessimistic'], compatibleSigns: ['Taurus', 'Virgo', 'Pisces'] },
          { name: 'Aquarius', sanskritName: 'Kumbha', signNumber: 11, element: 'Air', ruler: 'Saturn', symbol: 'Water Bearer', dateRange: 'Feb 13 - Mar 13', traits: 'Humanitarian, unconventional, visionary, inventive', strengths: ['Originality', 'Objectivity', 'Altruism'], weaknesses: ['Detached', 'Rebellious'], compatibleSigns: ['Gemini', 'Libra', 'Sagittarius'] },
          { name: 'Pisces', sanskritName: 'Meena', signNumber: 12, element: 'Water', ruler: 'Jupiter', symbol: 'Two Fishes', dateRange: 'Mar 14 - Apr 13', traits: 'Mystical, compassionate, artistic, transcendent', strengths: ['Spiritual connection', 'Empathy', 'Imagination'], weaknesses: ['Escapist', 'Overly trusting'], compatibleSigns: ['Cancer', 'Scorpio', 'Capricorn'] },
        ];

        for (const z of zodiacData) {
          await strapi.entityService.create('api::zodiac-sign.zodiac-sign', { data: z });
        }
      }

      // Seed Astrology Services
      const existingServices = await strapi.entityService.findMany('api::astrology-service.astrology-service', { limit: 1 });
      if (!existingServices || existingServices.length === 0) {
        const services = [
          {
            title: 'Detailed Birth Chart (Kundli) Report',
            slug: 'detailed-birth-chart-report',
            category: 'kundli',
            shortDescription: 'Comprehensive sidereal planetary positions, lagna analysis, 12 bhava breakdown, and Vimshottari Mahadasha timeline.',
            fullDescription: 'Our hallmark Vedic Kundli report delivers exhaustive astronomical accuracy using the Lahiri Ayanamsa. Includes ascendant analysis, Nakshatra characteristics, house-by-house interpretations, and practical gemstone and mantra remedies.',
            price: 799,
            discountedPrice: 499,
            features: ['Complete Sidereal Birth Chart (Lagna & Navamsha)', 'Vimshottari Dasha 120-Year Breakdown', 'Planetary Strengths (Shadbala Overview)', 'Personalized Gemstone & Mantra Guidance'],
            deliveryTime: 'Instant Online Access',
            isFeatured: true,
            badge: 'Most Popular',
          },
          {
            title: 'Career, Education & Karma Report',
            slug: 'career-and-education-report',
            category: 'report',
            shortDescription: 'Deep exploration of 10th House Karma Bhava, Dashamsha (D10) trends, and auspicious career advancement windows.',
            fullDescription: 'Discover your divine vocation and career timing. Evaluates 10th and 6th houses, key planetary dasha cycles, business versus service suitability, and optimal phases for transitions or investments.',
            price: 999,
            discountedPrice: 699,
            features: ['10th House Karma Bhava Analysis', 'Business vs Employment Aptitude', 'Promotion & Job Change Windows', 'Remedies for Career Breakthroughs'],
            deliveryTime: 'Instant Online Access',
            isFeatured: true,
            badge: 'High Value',
          },
          {
            title: 'Marriage & Relationship Soulmate Report',
            slug: 'marriage-and-compatibility-report',
            category: 'report',
            shortDescription: '7th House Kalatra Bhava insights, Venus & Mars alignments, marriage timing, and compatibility evaluation.',
            fullDescription: 'Understand your marital destiny and relationship karma. Covers spouse characteristics, timing of union, Manglik Dosha assessment with neutralizing factors, and long-term marital longevity.',
            price: 999,
            discountedPrice: 699,
            features: ['7th House & Venus In-Depth Analysis', 'Spouse Personality & Timing Forecast', 'Manglik Dosha Analysis & Neutralization', 'Harmonizing Relationship Remedies'],
            deliveryTime: 'Instant Online Access',
            isFeatured: true,
            badge: 'Trending',
          },
          {
            title: 'Finance & Wealth Accumulation Report',
            slug: 'finance-and-wealth-report',
            category: 'report',
            shortDescription: '2nd House Dhana and 11th House Labha analysis with Jupiter prosperity cycles and investment guidance.',
            fullDescription: 'Examine wealth potentials through Vedic lens. Analysis of Dhana Yogas, Lakshmi Yogas, real estate indicators, debt mitigation strategies, and high-gain financial periods.',
            price: 1199,
            discountedPrice: 799,
            features: ['Dhana Yoga & Lakshmi Yoga Verification', 'Asset & Real Estate Indications', 'Debt Mitigation & Risk Periods', 'Auspicious Financial Windows'],
            deliveryTime: 'Instant Online Access',
            isFeatured: false,
          },
          {
            title: 'Yearly Planetary Transits & Forecast',
            slug: 'yearly-astrology-report',
            category: 'yearly',
            shortDescription: '12-month month-by-month predictive analysis based on Jupiter, Saturn, Rahu-Ketu transits and Gochara.',
            fullDescription: 'Navigate the year with celestial foresight. Track Major Gochara transits relative to your Moon sign and Lagna, auspicious quarters for initiatives, and dates for cautious navigation.',
            price: 1499,
            discountedPrice: 999,
            features: ['Month-by-Month Predictive Breakdown', 'Saturn Sade Sati & Dhaiya Tracking', 'Jupiter Transit Blessing Zones', 'Key Lunar Muhurats'],
            deliveryTime: 'Instant Online Access',
            isFeatured: true,
            badge: 'Year 2026 Special',
          },
          {
            title: 'Personal Astrologer Video Consultation',
            slug: 'personal-consultation-astrologer',
            category: 'consultation',
            shortDescription: 'Private 1-on-1 direct video consultation with a certified senior Vedic scholar (Shastri).',
            fullDescription: 'Engage in a live, confidential 45-minute discussion with our esteemed astrologers. Ask specific questions regarding marriage, career, progeny, health, and receive bespoke Vedic remedies.',
            price: 2499,
            discountedPrice: 1999,
            features: ['45-Minute Live 1-on-1 Video Session', 'In-Depth Question Answering', 'Customized Vedic Ritual & Remedial Guidance', 'Post-Call Audio Recording & Kundli Copy'],
            deliveryTime: 'Scheduled Appointment',
            isFeatured: true,
            badge: 'Certified Scholars',
          },
        ];

        for (const s of services) {
          await strapi.entityService.create('api::astrology-service.astrology-service', { data: s });
        }
      }

      // Seed Astrologers
      const existingAstrologers = await strapi.entityService.findMany('api::astrologer.astrologer', { limit: 1 });
      if (!existingAstrologers || existingAstrologers.length === 0) {
        const astrologers = [
          {
            name: 'Acharya Vidyadhar Shastri',
            slug: 'acharya-vidyadhar-shastri',
            title: 'Senior Jyotish Ratna & Vedic Scholar',
            bio: 'Over 28 years of rigorous classical practice in Parashara and Jaimini systems. Former faculty at Varanasi Sanskrit University.',
            experienceYears: 28,
            specialties: ['Kundli Deep-Dive', 'Career Transitions', 'Muhurat Selection', 'Vedic Gemstones'],
            languages: ['English', 'Hindi', 'Sanskrit'],
            consultationFee: 2499,
            rating: 4.98,
            reviewCount: 1450,
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
            availableSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'],
            isFeatured: true,
          },
          {
            name: 'Dr. Meenakshi Sundaram',
            slug: 'dr-meenakshi-sundaram',
            title: 'Gold Medalist Jyotish Visharada',
            bio: 'Expert in Nadi Jyotish and Prashna Shastra (Horary Astrology). Holds Doctorate in Ancient Indian Astronavigation.',
            experienceYears: 22,
            specialties: ['Nadi Astrology', 'Marriage Compatibility', 'Prashna Kundli', 'Medical Astrology'],
            languages: ['English', 'Hindi', 'Tamil'],
            consultationFee: 2199,
            rating: 4.95,
            reviewCount: 980,
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
            availableSlots: ['09:30 AM', '01:00 PM', '04:00 PM', '06:30 PM'],
            isFeatured: true,
          },
          {
            name: 'Pandit Rajeshwar Joshi',
            slug: 'pandit-rajeshwar-joshi',
            title: 'Vedic Astrologer & Vastu Consultant',
            bio: 'Specialist in corporate astrology, business partner Kundli matching, and residential energy alignment.',
            experienceYears: 18,
            specialties: ['Business Kundli', 'Wealth Yogas', 'Vastu Shastra', 'Remedial Yagyas'],
            languages: ['English', 'Hindi', 'Gujarati'],
            consultationFee: 1899,
            rating: 4.91,
            reviewCount: 720,
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
            availableSlots: ['11:00 AM', '02:00 PM', '04:30 PM', '07:00 PM'],
            isFeatured: false,
          },
        ];

        for (const a of astrologers) {
          await strapi.entityService.create('api::astrologer.astrologer', { data: a });
        }
      }

      // Seed Site Setting
      const existingSettings = await strapi.entityService.findMany('api::site-setting.site-setting');
      if (!existingSettings || existingSettings.length === 0) {
        await strapi.entityService.create('api::site-setting.site-setting', {
          data: {
            siteName: 'JyotishVeda',
            tagline: 'Timeless Vedic Wisdom with Pure Astronomical Precision',
            heroTitle: 'Discover Your True Celestial Blueprint',
            heroSubtitle: 'Uncover your authentic karmic trajectory, planetary alignments, and profound Jyotish insights computed strictly with the Lahiri Sidereal ephemeris.',
            contactEmail: 'support@jyotishveda.com',
            contactPhone: '+91 (0) 11 4987 6543',
            address: 'Vedic Knowledge Center, Connaught Place, New Delhi 110001, India',
            defaultAyanamsa: 'Lahiri (Chitrapaksha)',
            announcementBar: '✨ Auspicious Muhurat Consultations Now Open for this Vedic Season',
          },
        });
      }

      // Seed FAQs
      const existingFaqs = await strapi.entityService.findMany('api::faq.faq', { limit: 1 });
      if (!existingFaqs || existingFaqs.length === 0) {
        const faqs = [
          {
            question: 'What is the difference between Vedic (Sidereal) and Western (Tropical) astrology?',
            answer: 'Western astrology is fixed to the equinoxes (Tropical zodiac), while Vedic astrology calculates the physical, astronomical positions of constellations (Sidereal zodiac) using the Earth’s axial precession offset known as Ayanamsa (we employ the authoritative Lahiri Chitrapaksha standard).',
            category: 'General',
            order: 1,
          },
          {
            question: 'Why is accurate birth time essential for generating a Kundli?',
            answer: 'The Ascendant (Lagna) changes sign approximately every two hours. A difference of even 4 to 5 minutes can alter your Ascendant degree, the fine Navamsha division, and the timing of your Vimshottari Mahadasha balance.',
            category: 'Kundli',
            order: 2,
          },
          {
            question: 'How are online payments processed on the platform?',
            answer: 'We integrate with Razorpay supporting credit/debit cards, UPI, NetBanking, and digital wallets. During development and staging, test-mode simulation is enabled with mock credentials.',
            category: 'Payments',
            order: 3,
          },
          {
            question: 'How do video consultations with astrologers take place?',
            answer: 'Once your booking is confirmed, you receive an automated video meeting link in your dashboard and email. You can share your Kundli questions directly with the scholar during your 45-minute private call.',
            category: 'Consultation',
            order: 4,
          },
        ];

        for (const f of faqs) {
          await strapi.entityService.create('api::faq.faq', { data: f });
        }
      }

      // Seed Astrology Articles
      const existingArticles = await strapi.entityService.findMany('api::astrology-article.astrology-article', { limit: 1 });
      if (!existingArticles || existingArticles.length === 0) {
        const articles = [
          {
            title: 'The Sacred Astronomy of Lahiri Ayanamsa: Why Sidereal Degrees Differ From Tropical Horoscopes',
            slug: 'sacred-astronomy-lahiri-ayanamsa',
            excerpt: 'Understand the mathematical precession of the equinoxes that differentiates genuine sidereal Vedic astrology from seasonal Western charts.',
            content: 'Vedic astrology (Jyotish) is anchored in the physical sidereal zodiac (Nirayana). Because the Earth experiences axial precession—a slow conical wobble tracing one complete revolution approximately every 25,772 years—the vernal equinox point shifts backward along the ecliptic by approximately 50.3 seconds of arc annually. The gap between the fixed star Chitra (Spica at 180°) and the moving vernal equinox is termed Ayanamsa. In India, the Calendar Reform Committee appointed by the Government in 1952 authenticated the Chitrapaksha / Lahiri Ayanamsa as the national standard.',
            category: 'Astronomical Foundations',
            author: 'Acharya Vidyadhar Shastri',
            readTime: '6 min read',
            coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800',
          },
          {
            title: 'Understanding the 12 Bhavas: The Cosmic Mansions of Human Karma',
            slug: 'understanding-the-12-bhavas',
            excerpt: 'A comprehensive guide to the twelve houses of the Vedic Kundli, from the physical Lagna to the spiritual Moksha of the 12th Bhava.',
            content: 'In Jyotish, the 360-degree celestial sphere is mapped into twelve distinct houses (Bhavas), each governing specific dimensions of earthly existence. The 1st house (Tanu Bhava) represents the physical body, selfhood, and overall life vitality. The Kendra houses (1st, 4th, 7th, and 10th) represent the pillars of life, while the Trikona houses (1st, 5th, and 9th) are the realms of Lakshmi, bestowing grace and dharma. The Dushtana houses (6th, 8th, and 12th) signify adversity, deep spiritual transformation, and liberation.',
            category: 'Kundli Principles',
            author: 'Dr. Meenakshi Sundaram',
            readTime: '8 min read',
            coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
          },
          {
            title: 'Vimshottari Dasha System: Navigating Your 120-Year Planetary Cycles',
            slug: 'vimshottari-dasha-planetary-cycles',
            excerpt: 'How the Moon’s exact Nakshatra at the moment of birth establishes the rhythmic blueprint of your life’s evolving chapters.',
            content: 'Of the many dasha systems outlined in the Brihat Parashara Hora Shastra, Vimshottari (meaning 120) is declared the paramount system for the Kali Yuga. The human lifespan is symbolically mapped to a 120-year cycle divided among nine grahas in an invariant sequence: Ketu (7 yrs), Venus (20 yrs), Sun (6 yrs), Moon (10 yrs), Mars (7 yrs), Rahu (18 yrs), Jupiter (16 yrs), Saturn (19 yrs), and Mercury (17 yrs). Understanding which planet currently rules your life assists in timing decisions with cosmic harmony.',
            category: 'Dasha & Timing',
            author: 'Pandit Rajeshwar Joshi',
            readTime: '7 min read',
            coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
          },
          {
            title: 'The Vedic Science of Kundli Matching: Beyond Simple Guna Scores',
            slug: 'vedic-science-kundli-matching-ashta-kuta',
            excerpt: 'Why the 36 Gunas of Ashta Kuta are only one dimension of holistic marital compatibility and planetary harmony.',
            content: 'Kundli Milan is often reduced to the 36-point Ashta Kuta algorithm. While scoring at least 18 points is a classic benchmark for psychological, physical, and genetic harmony, seasoned scholars also assess the 7th house of both charts, the placement of Venus and Jupiter, the absence of severe Kuja (Manglik) dosha, and the mutual planetary aspects. When two individuals share mutual alignment across Lagna, Moon, and D9 Navamsha, the relationship flourishes in mutual growth.',
            category: 'Relationship Astrology',
            author: 'Dr. Meenakshi Sundaram',
            readTime: '5 min read',
            coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800',
          },
        ];

        for (const art of articles) {
          await strapi.entityService.create('api::astrology-article.astrology-article', { data: art });
        }
      }

      // 3. Admin Bootstrap from Environment (if configured)
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (adminEmail && adminPassword) {
        try {
          const adminUsers = await strapi.db.query('admin::user').findMany({ limit: 1 });
          if (!adminUsers || adminUsers.length === 0) {
            console.log('[Admin Bootstrap] No administrator found. Bootstrapping initial admin account...');
            const superAdminRole = await strapi.db.query('admin::role').findOne({
              where: { code: 'strapi-super-admin' },
            });

            if (superAdminRole) {
              const hashedPassword = await strapi.service('admin::auth').hashPassword(adminPassword);
              await strapi.db.query('admin::user').create({
                data: {
                  email: adminEmail.toLowerCase().trim(),
                  password: hashedPassword,
                  firstname: 'JyotishVeda',
                  lastname: 'Admin',
                  isActive: true,
                  roles: [superAdminRole.id],
                },
              });
              console.log(`[Admin Bootstrap] Successfully created super-admin with email: ${adminEmail}`);
            } else {
              console.warn('[Admin Bootstrap] Super-admin role not found yet. Admin creation deferred.');
            }
          } else {
            console.log('[Admin Bootstrap] Existing admin account detected. Preserving existing admin credentials without overwrite.');
          }
        } catch (adminErr) {
          console.warn('[Admin Bootstrap] Notice during admin bootstrap:', adminErr.message);
        }
      }

      // 4. Synchronize Google OAuth in users-permissions plugin store if credentials exist
      try {
        const syncGoogleOAuth = require('./bootstrap/oauth');
        await syncGoogleOAuth({ strapi });
      } catch (oauthErr) {
        console.warn('[Google OAuth Bootstrap] Notice:', oauthErr.message);
      }

      console.log('✅ Vedic Astrology platform initialized with default settings, roles, and catalog.');
    } catch (err) {
      console.warn('Bootstrap seeding notice:', err.message);
    }
  },
};
