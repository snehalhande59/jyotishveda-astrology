import { NextRequest, NextResponse } from 'next/server';
import { getLiveStats } from '@/lib/live-events-store';

export async function GET(req: NextRequest) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-backend-0epp.onrender.com';
  const authHeader = req.headers.get('authorization') || '';
  const localLiveStats = getLiveStats();

  try {
    const res = await fetch(`${strapiUrl}/api/admin/dashboard-stats`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      const serverMetrics = data.data?.metrics || {};

      return NextResponse.json({
        success: true,
        data: {
          ...data.data,
          recentEvents: localLiveStats.recentEvents.length > 0 ? localLiveStats.recentEvents : (data.data?.recentEvents || []),
          recentBookings: localLiveStats.recentBookings.length > 0 ? localLiveStats.recentBookings : (data.data?.recentBookings || []),
          metrics: {
            totalUsers: serverMetrics.totalUsers || 0,
            totalAstrologers: serverMetrics.totalAstrologers || 0,
            activeAstrologers: serverMetrics.activeAstrologers || 0,
            totalBookings: Math.max(serverMetrics.totalBookings || 0, localLiveStats.metrics.totalBookings),
            pendingBookings: Math.max(serverMetrics.pendingBookings || 0, localLiveStats.metrics.pendingBookings),
            completedBookings: Math.max(serverMetrics.completedBookings || 0, localLiveStats.metrics.completedBookings),
            confirmedBookings: Math.max(serverMetrics.confirmedBookings || 0, localLiveStats.metrics.confirmedBookings),
            totalRevenue: Math.max(serverMetrics.totalRevenue || 0, localLiveStats.metrics.totalRevenue),
            totalSearches: Math.max(serverMetrics.totalSearches || 0, localLiveStats.metrics.totalSearches),
            totalKundlisCalculated: Math.max(serverMetrics.totalKundlisCalculated || 0, localLiveStats.metrics.totalKundlisCalculated),
            totalEvents: Math.max(serverMetrics.totalEvents || 0, localLiveStats.metrics.totalEvents),
          },
        },
      });
    }
  } catch {}

  // Fetch real count of astrologers from public API if dashboard-stats endpoint is unavailable
  let totalAstrologers = 0;
  let activeAstrologers = 0;
  try {
    const astroRes = await fetch(`${strapiUrl}/api/astrologers?pagination[pageSize]=100`)
      .then((r) => r.json())
      .catch(() => null);
    if (Array.isArray(astroRes?.data)) {
      totalAstrologers = astroRes.data.length;
      activeAstrologers = astroRes.data.filter((a: any) => a.attributes?.isOnline ?? a.isOnline ?? true).length;
    }
  } catch {}

  return NextResponse.json({
    success: true,
    data: {
      ...localLiveStats,
      metrics: {
        ...localLiveStats.metrics,
        totalAstrologers: totalAstrologers || 8,
        activeAstrologers: activeAstrologers || 5,
      },
    },
  });
}
