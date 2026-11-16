'use client';

import React, { Suspense } from 'react';
import CrmPage from '../crm/page';

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Customers...</div>}>
      <CrmPage />
    </Suspense>
  );
}
