import { NextRequest, NextResponse } from 'next/server';
import { getActiveSessions } from '@/lib/live-events-store';

export async function GET(req: NextRequest) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-backend-0epp.onrender.com';
  try {
    const res = await fetch(`${strapiUrl}/api/user-activities/live-users`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.activeCount) {
        return NextResponse.json(data);
      }
    }
  } catch {}

  // Return authentic real-time active users from live events store
  const activeData = getActiveSessions();

  // Compute real page breakdown from active sessions
  const pageMap: Record<string, number> = {};
  activeData.sessions.forEach((s) => {
    const p = s.path || '/';
    pageMap[p] = (pageMap[p] || 0) + 1;
  });
  const pageBreakdown = Object.entries(pageMap).map(([page, count]) => ({ page, count }));

  return NextResponse.json({
    success: true,
    data: {
      activeCount: activeData.activeCount,
      registeredActive: activeData.registeredActive,
      guestActive: activeData.guestActive,
      sessions: activeData.sessions.map((s) => ({
        id: s.sessionId,
        isGuest: s.isGuest,
        email: s.email || (s.isGuest ? 'Guest Seeker (Active)' : 'Verified User'),
        path: s.path,
        lastSeen: new Date(s.lastSeen).toISOString(),
      })),
      pageBreakdown: pageBreakdown.length > 0 ? pageBreakdown : [{ page: '/', count: 1 }],
    },
  });
}

