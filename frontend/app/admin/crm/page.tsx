'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
  DollarSign,
  Loader2,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

function CrmContent() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [tier]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCustomers({ search, tier: tier === 'All' ? undefined : tier });
      if (res?.data) {
        setCustomers(res.data);
      }
    } catch (e) {
      console.warn('CRM load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  const totalSpendSum = customers.reduce((acc, c) => acc + (c.totalSpend || 0), 0);
  const vipCount = customers.filter((c) => c.tier === 'VIP').length;

  return (
    <AdminLayout
      title="Customer CRM Management"
      subtitle="Comprehensive 360° customer dossiers, lifetime spend, birth charts & consulting records"
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-[#9F96B2] mb-1">
              <span>Managed Customers</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-white">{customers.length}</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>100% Verified Accounts</span>
            </div>
          </div>

          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-[#9F96B2] mb-1">
              <span>VIP Devotees</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-purple-300">{vipCount}</div>
            <div className="text-[10px] text-[#9F96B2] mt-1">High-value recurring clients</div>
          </div>

          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-[#9F96B2] mb-1">
              <span>Total CRM Value</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-emerald-400">
              ₹{totalSpendSum.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Combined lifetime spend</div>
          </div>

          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-[#9F96B2] mb-1">
              <span>Follow-ups Pending</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-amber-300">2 Clients</div>
            <div className="text-[10px] text-amber-400/80 mt-1">Nadi / Vivaha follow-up required</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#786C60] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500"
            />
          </form>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs text-[#9F96B2]">Segment:</span>
            {['All', 'VIP', 'Regular', 'Prospect'].map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tier === t
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[#0D0B16] text-[#9F96B2] hover:text-white border border-[#2B233F]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#261E38] flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-white">Registered Customer Profiles</h3>
            <span className="text-xs text-[#9F96B2]">{customers.length} total entries</span>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-amber-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Loading CRM dossier...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#9F96B2]">No customers found matching filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#E5DFD7]">
                <thead className="bg-[#0D0B16] border-b border-[#261E38] text-[11px] uppercase tracking-wider text-[#9F96B2]">
                  <tr>
                    <th className="py-3 px-4">Client / Contact</th>
                    <th className="py-3 px-4">Segment</th>
                    <th className="py-3 px-4">Vedic Kundli Details</th>
                    <th className="py-3 px-4">Bookings</th>
                    <th className="py-3 px-4">Lifetime Spend</th>
                    <th className="py-3 px-4">Follow-up Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#261E38]/60">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{c.fullName}</div>
                        <div className="text-[11px] text-[#9F96B2] flex items-center space-x-2 mt-0.5">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-[#786C60]" />
                            <span>{c.email}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-[#786C60]" />
                            <span>{c.phone}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.tier === 'VIP'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : c.tier === 'Regular'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {c.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-amber-300 font-medium">
                          {c.birthDetails?.rashi || 'N/A'}
                        </div>
                        <div className="text-[10px] text-[#9F96B2]">
                          Nakshatra: {c.birthDetails?.nakshatra || 'Calculated on request'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white">{c.totalBookings}</span>
                        <div className="text-[10px] text-[#9F96B2]">{c.servicesUsed?.length || 0} services</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ₹{(c.totalSpend || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          <CheckCircle2 className="w-3 h-3 text-amber-400" />
                          <span>{c.followUpStatus}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Dossier Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-[#141021] border border-[#2B233F] rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-4 border-b border-[#261E38]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {selectedCustomer.fullName} - Customer 360° Dossier
                  </h3>
                  <p className="text-xs text-[#9F96B2]">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-8 h-8 rounded-full bg-[#0D0B16] text-[#9F96B2] hover:text-white flex items-center justify-center border border-[#2B233F]"
                >
                  ✕
                </button>
              </div>

              {/* Birth Chart Data */}
              <div className="bg-[#0D0B16] border border-[#261E38] rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Vedic Natal Profile</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#9F96B2] block">Birth Date</span>
                    <span className="font-semibold text-white">{selectedCustomer.birthDetails?.dob}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9F96B2] block">Birth Time</span>
                    <span className="font-semibold text-white">{selectedCustomer.birthDetails?.tob}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9F96B2] block">Moon Rashi</span>
                    <span className="font-semibold text-amber-300">{selectedCustomer.birthDetails?.rashi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9F96B2] block">Birth Place</span>
                    <span className="font-semibold text-white">{selectedCustomer.birthDetails?.pob}</span>
                  </div>
                </div>
              </div>

              {/* Financial & Services */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#0D0B16] border border-[#261E38] rounded-xl p-4">
                  <span className="text-[#9F96B2] block mb-1">Lifetime Value (LTV)</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    ₹{selectedCustomer.totalSpend?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#9F96B2] mt-1">{selectedCustomer.totalBookings} Total Completed Bookings</div>
                </div>

                <div className="bg-[#0D0B16] border border-[#261E38] rounded-xl p-4">
                  <span className="text-[#9F96B2] block mb-1">Follow-up Status</span>
                  <div className="text-sm font-bold text-amber-300">{selectedCustomer.followUpStatus}</div>
                  <div className="text-[10px] text-[#9F96B2] mt-1">Tier: {selectedCustomer.tier} Devotee</div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="bg-[#0D0B16] border border-[#261E38] rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Staff Consultation Notes
                </span>
                <p className="text-xs text-[#E5DFD7] leading-relaxed">
                  {selectedCustomer.internalNotes || 'No internal staff notes recorded yet.'}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function CrmPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading CRM...</div>}>
      <CrmContent />
    </Suspense>
  );
}
