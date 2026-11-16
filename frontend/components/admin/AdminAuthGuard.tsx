'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminToken, getAdminUser } from '@/lib/admin-auth';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    const user = getAdminUser();

    if (!token || !user) {
      router.replace('/admin/login');
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0F0D15] flex flex-col items-center justify-center text-[#EAE1D2]">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 animate-pulse">
          <Sparkles className="w-7 h-7 text-amber-400" />
        </div>
        <p className="text-sm font-medium tracking-wide text-amber-200/80 flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Verifying AstroVeda Admin Credentials...</span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
