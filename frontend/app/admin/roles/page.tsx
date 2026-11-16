'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Shield,
  Key,
  Users,
  CheckCircle2,
  Lock,
  Plus,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

function RolesContent() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAdminRoles();
      if (res?.data) {
        setRoles(res.data);
      }
    } catch (e) {
      console.warn('Roles load error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Admin Roles &amp; Permissions Matrix"
      subtitle="Role-based access control (RBAC), security scopes, staff delegations &amp; operator capabilities"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-12 flex flex-col items-center justify-center text-amber-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Loading RBAC matrix...</span>
            </div>
          ) : (
            roles.map((r) => (
              <div
                key={r.id}
                className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-bold text-sm text-white">{r.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300">
                      {r.usersCount} Staff
                    </span>
                  </div>

                  <p className="text-xs text-[#9F96B2] leading-relaxed mb-3">{r.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-[#261E38]">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                      Enforced Permissions ({r.permissions?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(r.permissions || []).map((perm: string) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 rounded bg-[#0D0B16] text-[10px] font-mono text-[#E5DFD7] border border-[#2B233F]"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#261E38] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>System Active</span>
                  </span>
                  <span className="text-[10px] text-[#786C60] font-mono">{r.code}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function RolesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Roles...</div>}>
      <RolesContent />
    </Suspense>
  );
}
