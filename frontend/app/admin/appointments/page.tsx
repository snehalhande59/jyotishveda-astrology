'use client';

import React, { Suspense } from 'react';
import CalendarPage from '../calendar/page';

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Appointments...</div>}>
      <CalendarPage />
    </Suspense>
  );
}
