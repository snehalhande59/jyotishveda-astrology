'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/admin/Modal';
import { adminApi } from '@/lib/admin-api';
import {
  Users,
  Search,
  Calendar,
  IndianRupee,
  Activity,
  CheckCircle,
  XCircle,
  Eye,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, pageCount: 1, total: 0 });

  // Detail Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [userDetail, setUserDetail] = useState<any | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, pageSize: 20, search });
      if (res && res.data) {
        setUsers(res.data);
        if (res.meta?.pagination) {
          setPagination(res.meta.pagination);
        }
      }
    } catch (err: any) {
      console.warn('Users API fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const handleViewUser = async (user: any) => {
    setSelectedUser(user);
    setDetailLoading(true);
    setUserDetail(null);
    try {
      const res = await adminApi.getUserById(user.id);
      if (res && res.data) {
        setUserDetail(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch detailed profile:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout
      title="User Management &amp; Directory"
      subtitle="View registered clients, booking histories, account statuses, and service usage patterns"
    >
      {/* Search & Actions Bar */}
      <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7A7091] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs text-[#8E84A6]">
          <span>
            Total Registered Users: <strong className="text-white font-mono">{pagination.total}</strong>
          </span>
          <button
            onClick={loadUsers}
            className="p-2 rounded-xl bg-[#1D162C] hover:bg-[#251D38] border border-[#2B233F] text-[#9F96B2] hover:text-white transition-colors"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#141021] border border-[#2B233F] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F0C1A] text-[#8E84A6] uppercase tracking-wider font-semibold border-b border-[#261E38]">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Bookings</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211A31] text-[#D6CEE5]">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8E84A6]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
                      <span>Loading registered users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8E84A6]">
                    No registered users found matching &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#1A1428] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600/30 to-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs uppercase">
                          {u.username?.[0] || 'U'}
                        </div>
                        <span className="font-semibold text-white">{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-300">{u.email}</td>
                    <td className="py-3.5 px-4 text-[#8E84A6]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.blocked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : u.confirmed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {u.status || (u.confirmed ? 'Active' : 'Unconfirmed')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {u.totalBookings || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewUser(u)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#231B36] hover:bg-[#2F2448] text-amber-300 transition-colors font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.pageCount > 1 && (
          <div className="px-6 py-3.5 bg-[#0F0C1A] border-t border-[#261E38] flex items-center justify-between text-xs text-[#8E84A6]">
            <span>
              Page {pagination.page} of {pagination.pageCount} ({pagination.total} total)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg bg-[#1A1428] border border-[#2B233F] text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= pagination.pageCount}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg bg-[#1A1428] border border-[#2B233F] text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={`Client Dossier: ${selectedUser?.username || 'User Profile'}`}
        subtitle={`Registered account profile for ${selectedUser?.email || ''}`}
        maxWidth="xl"
      >
        {detailLoading ? (
          <div className="py-12 text-center text-[#8E84A6] flex flex-col items-center justify-center space-y-2">
            <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
            <span>Fetching user details and consultation records...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Overview Pill */}
            <div className="p-4 rounded-xl bg-[#0F0C18] border border-[#261E38] grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-[#8E84A6] uppercase tracking-wider block">Username</span>
                <strong className="text-white text-sm">{selectedUser?.username}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8E84A6] uppercase tracking-wider block">Email Address</span>
                <span className="text-gray-300 font-mono text-xs">{selectedUser?.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8E84A6] uppercase tracking-wider block">Account Status</span>
                <span className="text-emerald-400 font-semibold">{selectedUser?.status || 'Active Client'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8E84A6] uppercase tracking-wider block">Joined Platform</span>
                <span className="text-gray-300">
                  {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Consultation Bookings ({userDetail?.bookings?.length || 0})</span>
              </h4>
              {(!userDetail?.bookings || userDetail.bookings.length === 0) ? (
                <p className="text-xs text-[#7A7091] py-3 text-center bg-[#0C0A14] rounded-xl border border-[#231B34]">
                  No consultations booked yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userDetail.bookings.map((b: any) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-[#0F0C18] border border-[#261E38] flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-white block">#{b.bookingNumber}</strong>
                        <span className="text-[11px] text-[#8E84A6]">
                          {b.astrologer?.name ? `with ${b.astrologer.name}` : 'General Consultation'} • {b.date} at {b.timeSlot}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent User Activities */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recent Platform Activity ({userDetail?.activities?.length || 0})</span>
              </h4>
              {(!userDetail?.activities || userDetail.activities.length === 0) ? (
                <p className="text-xs text-[#7A7091] py-3 text-center bg-[#0C0A14] rounded-xl border border-[#231B34]">
                  No recent logged events for this user.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {userDetail.activities.map((act: any) => (
                    <div
                      key={act.id}
                      className="px-3 py-2 rounded-lg bg-[#0F0C18] border border-[#221A32] flex items-center justify-between text-[11px]"
                    >
                      <span className="text-white">
                        <strong className="text-amber-400 uppercase text-[9px] mr-2">[{act.eventType}]</strong>
                        {act.serviceName || act.keyword || 'Page Interaction'}
                      </span>
                      <span className="text-[#7A7091] font-mono text-[10px]">
                        {act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
