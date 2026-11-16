'use client';

import React, { Suspense } from 'react';
import ProductsPage from '../products/page';

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Categories...</div>}>
      <ProductsPage />
    </Suspense>
  );
}
