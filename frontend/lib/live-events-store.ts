// In-memory live events buffer for real-time telemetry across Next.js API routes

export interface LiveEventItem {
  id: string;
  eventType: string;
  serviceName: string;
  serviceCategory: string;
  userIdentifier: string;
  isGuest: boolean;
  timestamp: string;
  location?: string;
  metadata?: Record<string, any>;
}

declare global {
  var __astroveda_live_events: LiveEventItem[] | undefined;
  var __astroveda_event_stats: {
    totalEvents: number;
    totalSearches: number;
    totalKundlis: number;
    toolCounts: Record<string, number>;
    keywordCounts: Record<string, number>;
    astrologerViews: Record<string, number>;
  } | undefined;
}

if (!global.__astroveda_live_events) {
  global.__astroveda_live_events = [
    {
      id: 'evt_init_1',
      eventType: 'tool_usage',
      serviceName: 'Janam Kundli Calculator',
      serviceCategory: 'free_tool',
      userIdentifier: 'Devotee (Pune)',
      isGuest: false,
      timestamp: new Date(Date.now() - 35000).toISOString(),
      location: 'Pune, Maharashtra',
      metadata: { lagna: 'Taurus', moonRashi: 'Taurus', nakshatra: 'Rohini' },
    },
    {
      id: 'evt_init_2',
      eventType: 'tool_usage',
      serviceName: 'Ashtakoot Kundli Matching',
      serviceCategory: 'free_tool',
      userIdentifier: 'Priyanka Sharma & Rahul Verma',
      isGuest: true,
      timestamp: new Date(Date.now() - 95000).toISOString(),
      location: 'Mumbai, Maharashtra',
      metadata: { gunaScore: '28/36', compatibility: 'Auspicious' },
    },
    {
      id: 'evt_init_3',
      eventType: 'search',
      serviceName: 'Keyword Search',
      serviceCategory: 'search',
      userIdentifier: 'Guest Devotee (Nashik)',
      isGuest: true,
      timestamp: new Date(Date.now() - 160000).toISOString(),
      location: 'Nashik, Maharashtra',
      metadata: { keyword: 'Shubh Vivah Muhurat 2026' },
    },
    {
      id: 'evt_init_4',
      eventType: 'astrologer_view',
      serviceName: 'Acharya Devendra Shastri',
      serviceCategory: 'astrologer',
      userIdentifier: 'Anita Patil',
      isGuest: false,
      timestamp: new Date(Date.now() - 240000).toISOString(),
      location: 'Nagpur, Maharashtra',
      metadata: { specialty: 'Vedic Kundli & Vastu' },
    },
  ];
}

if (!global.__astroveda_event_stats) {
  global.__astroveda_event_stats = {
    totalEvents: 184,
    totalSearches: 52,
    totalKundlis: 68,
    toolCounts: {
      'Janam Kundli': 68,
      'Kundli Milan (Compatibility)': 44,
      'Daily Vedic Panchang': 32,
      'Numerology Calculator': 22,
      'Kaal Sarp Dosha Check': 18,
    },
    keywordCounts: {
      'kundli matching': 28,
      'janam kundli': 24,
      'shani sade sati': 16,
      'career report': 12,
      'panchang today': 9,
    },
    astrologerViews: {
      'Acharya Devendra Shastri': 48,
      'Dr. Radhika Joshi': 38,
      'Pandit Suresh Kulkarni': 31,
      'Astro Heena': 25,
    },
  };
}

export function recordLiveEvent(payload: Partial<LiveEventItem> & { metadata?: any }): LiveEventItem {
  const store = global.__astroveda_live_events!;
  const stats = global.__astroveda_event_stats!;

  const name =
    payload.userIdentifier ||
    payload.metadata?.name ||
    payload.metadata?.fullName ||
    (payload.isGuest ? 'Guest Visitor' : 'Registered User');

  const location =
    payload.location ||
    payload.metadata?.place ||
    payload.metadata?.placeOfBirth ||
    'India (Live)';

  const newEvent: LiveEventItem = {
    id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    eventType: payload.eventType || 'tool_usage',
    serviceName: payload.serviceName || 'Astrology Tool',
    serviceCategory: payload.serviceCategory || 'free_tool',
    userIdentifier: name,
    isGuest: payload.isGuest ?? true,
    timestamp: new Date().toISOString(),
    location,
    metadata: payload.metadata || {},
  };

  // Prepend to array, keep latest 150 events
  store.unshift(newEvent);
  if (store.length > 150) {
    store.pop();
  }

  // Update stats
  stats.totalEvents += 1;

  if (newEvent.eventType === 'search' || newEvent.serviceCategory === 'search') {
    stats.totalSearches += 1;
    const kw = (payload.metadata?.keyword || newEvent.serviceName || 'astrology').toLowerCase();
    stats.keywordCounts[kw] = (stats.keywordCounts[kw] || 0) + 1;
  }

  if (newEvent.serviceName.includes('Kundli') || newEvent.serviceCategory === 'free_tool') {
    stats.totalKundlis += 1;
    const toolKey = newEvent.serviceName;
    stats.toolCounts[toolKey] = (stats.toolCounts[toolKey] || 0) + 1;
  }

  if (newEvent.eventType === 'astrologer_view' || newEvent.serviceCategory === 'astrologer') {
    const astroName = newEvent.serviceName;
    stats.astrologerViews[astroName] = (stats.astrologerViews[astroName] || 0) + 1;
  }

  return newEvent;
}

export function getRecentLiveEvents(limit = 25): LiveEventItem[] {
  return (global.__astroveda_live_events || []).slice(0, limit);
}

export function getLiveStats() {
  const stats = global.__astroveda_event_stats!;

  // Format top searched
  const topSearchedServices = Object.entries(stats.keywordCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Format most used tools
  const mostUsedFreeTools = Object.entries(stats.toolCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Format most viewed astrologers
  const mostViewedAstrologers = Object.entries(stats.astrologerViews)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return {
    metrics: {
      totalUsers: 24,
      totalAstrologers: 12,
      activeAstrologers: 8,
      totalBookings: 15,
      pendingBookings: 3,
      completedBookings: 9,
      confirmedBookings: 3,
      totalRevenue: 28450,
      totalSearches: stats.totalSearches,
      totalKundlisCalculated: stats.totalKundlis,
      totalEvents: stats.totalEvents,
    },
    topSearchedServices,
    mostUsedFreeTools,
    mostViewedAstrologers,
    recentEvents: getRecentLiveEvents(10),
  };
}
