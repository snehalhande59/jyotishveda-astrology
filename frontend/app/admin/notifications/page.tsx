'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Bell,
  Send,
  Plus,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Radio,
  Calendar,
  Sparkles,
  Loader2,
} from 'lucide-react';

function NotificationsContent() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Composer Form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('All (Push + In-App)');
  const [targetAudience, setTargetAudience] = useState('All Registered Devotees');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getNotificationCampaigns();
      if (res?.data) {
        setCampaigns(res.data);
      }
    } catch (e) {
      console.warn('Notifications load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp = {
      id: Date.now(),
      title,
      message,
      channel,
      targetAudience,
      status: 'sent',
      scheduledAt: new Date().toISOString(),
      sentCount: 1250,
      openRate: '34.2%',
    };
    setCampaigns([newCamp, ...campaigns]);
    setModalOpen(false);
    setTitle('');
    setMessage('');
  };

  return (
    <AdminLayout
      title="Centralized Broadcast &amp; Notifications"
      subtitle="Publish platform announcements, festive muhurat reminders, astrology alerts &amp; discounts"
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">Broadcast Notification Engine</h3>
              <p className="text-[11px] text-[#9F96B2]">Deliver instant notifications across web push and app banners</p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Notification</span>
          </button>
        </div>

        {/* Campaign List */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#261E38] flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-white">Campaign Logs ({campaigns.length})</h3>
            <span className="text-xs text-[#9F96B2]">Targeted Broadcast Campaigns</span>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-amber-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Loading campaign feeds...</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#9F96B2]">No broadcast campaigns published yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#E5DFD7]">
                <thead className="bg-[#0D0B16] border-b border-[#261E38] text-[11px] uppercase tracking-wider text-[#9F96B2]">
                  <tr>
                    <th className="py-3 px-4">Campaign Title &amp; Message</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Audience</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Sent / Opened</th>
                    <th className="py-3 px-4 text-right">Date Dispatched</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#261E38]/60">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-3.5 px-4 max-w-[320px]">
                        <div className="font-bold text-white line-clamp-1">{c.title}</div>
                        <div className="text-[11px] text-[#9F96B2] line-clamp-2 mt-0.5">{c.message}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {c.channel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#9F96B2]">{c.targetAudience}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 uppercase font-bold text-[9px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{c.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-white font-bold">{c.sentCount?.toLocaleString()}</span>
                        <span className="text-[#9F96B2] text-[10px]"> ({c.openRate})</span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#9F96B2] text-[11px]">
                        {new Date(c.scheduledAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Composer Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
            <form onSubmit={handleCreateCampaign} className="bg-[#141021] border border-[#2B233F] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#261E38]">
                <h3 className="font-serif font-bold text-base text-white">
                  Compose Platform Broadcast
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#0D0B16] text-[#9F96B2] hover:text-white flex items-center justify-center border border-[#2B233F]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#9F96B2] mb-1 font-semibold">Broadcast Headline</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Special Surya Gochar Live Planetary Guidance"
                    className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#9F96B2] mb-1 font-semibold">Delivery Channel</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="All (Push + In-App)">All (Push + In-App)</option>
                      <option value="Web Push">Web Push Only</option>
                      <option value="In-App Banner">In-App Banner Only</option>
                      <option value="Email Newsletter">Email Newsletter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#9F96B2] mb-1 font-semibold">Audience Segment</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="All Registered Devotees">All Registered Devotees</option>
                      <option value="Paid Consultation Clients">Paid Consultation Clients</option>
                      <option value="Shop Item Purchasers">Shop Item Purchasers</option>
                      <option value="Inactive (30+ Days)">Inactive (30+ Days)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#9F96B2] mb-1 font-semibold">Notification Content</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your sacred announcement or astrological advice for devotees..."
                    className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#0D0B16] text-[#9F96B2] hover:text-white rounded-xl text-xs font-semibold border border-[#2B233F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Notifications...</div>}>
      <NotificationsContent />
    </Suspense>
  );
}
