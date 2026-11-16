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
      // Merge with recent live events from memory
      return NextResponse.json({
        success: true,
        data: {
          ...data.data,
          recentEvents: localLiveStats.recentEvents,
          metrics: {
            ...data.data.metrics,
            totalSearches: Math.max(data.data.metrics.totalSearches || 0, localLiveStats.metrics.totalSearches),
            totalKundlisCalculated: localLiveStats.metrics.totalKundlisCalculated,
          },
        },
      });
    }
  } catch {}

  // Fallback to live in-memory stats
  return NextResponse.json({
    success: true,
    data: localLiveStats,
  });
}

