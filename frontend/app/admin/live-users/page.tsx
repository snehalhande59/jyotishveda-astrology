'use client';

import React, { Suspense } from 'react';
import AnalyticsPage from '../analytics/page';

export default function LiveUsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Live Users...</div>}>
      <AnalyticsPage />
    </Suspense>
  );
}
