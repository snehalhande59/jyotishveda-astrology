'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  LifeBuoy,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Send,
  Loader2,
  ChevronRight,
} from 'lucide-react';

function SupportContent() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadTickets();
  }, [status]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSupportTickets({ status: status === 'all' ? undefined : status });
      if (res?.data) {
        setTickets(res.data);
      }
    } catch (e) {
      console.warn('Support tickets load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newReply = {
      authorName: 'Support Supervisor',
      authorRole: 'support',
      message: replyText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...selectedTicket,
      replies: [...(selectedTicket.replies || []), newReply],
    };

    setSelectedTicket(updated);
    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText('');
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedTicket) return;
    const updated = { ...selectedTicket, status: newStatus };
    setSelectedTicket(updated);
    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
  };

  return (
    <AdminLayout
      title="Customer Support &amp; Helpdesk"
      subtitle="Manage customer assistance tickets, consultation queries, chat escalations &amp; service inquiries"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#9F96B2]">Filter Status:</span>
            {['all', 'open', 'in_progress', 'resolved'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase text-[10px] tracking-wider transition-colors ${
                  status === s
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[#0D0B16] text-[#9F96B2] hover:text-white border border-[#2B233F]'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#9F96B2]">{tickets.length} Helpdesk Tickets</span>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-5 space-y-3">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-amber-400 space-y-2 bg-[#141021] rounded-2xl border border-[#2B233F]">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs">Loading support tickets...</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#9F96B2] bg-[#141021] rounded-2xl border border-[#2B233F]">
                No support tickets found.
              </div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTicket?.id === t.id
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg'
                      : 'bg-[#141021] border-[#2B233F] hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-amber-400">{t.ticketNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        t.priority === 'high'
                          ? 'bg-red-500/20 text-red-300'
                          : t.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {t.priority} Priority
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white line-clamp-1">{t.subject}</h4>
                  <p className="text-[11px] text-[#9F96B2] line-clamp-2 mt-1">{t.description}</p>

                  <div className="pt-2 mt-2 border-t border-[#261E38] flex items-center justify-between text-[10px] text-[#786C60]">
                    <span>{t.customerName}</span>
                    <span className="uppercase font-semibold text-amber-300/80">{t.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Conversation Detail */}
          <div className="lg:col-span-7 bg-[#141021] border border-[#2B233F] rounded-2xl p-5 flex flex-col min-h-[480px]">
            {selectedTicket ? (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                {/* Header */}
                <div className="pb-3 border-b border-[#261E38] flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{selectedTicket.ticketNumber}</span>
                      <span className="text-xs text-[#9F96B2]">• {selectedTicket.category}</span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-white mt-0.5">{selectedTicket.subject}</h3>
                    <p className="text-[11px] text-[#9F96B2]">
                      Client: {selectedTicket.customerName} ({selectedTicket.customerEmail})
                    </p>
                  </div>

                  <div className="flex items-center space-x-1">
                    {['open', 'in_progress', 'resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                          selectedTicket.status === st
                            ? 'bg-amber-500 text-black'
                            : 'bg-[#0D0B16] text-[#9F96B2] border border-[#2B233F]'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Initial Description */}
                <div className="bg-[#0D0B16] p-3.5 rounded-xl border border-[#261E38] text-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                    Customer Query Description
                  </span>
                  <p className="text-white leading-relaxed">{selectedTicket.description}</p>
                </div>

                {/* Conversation Stream */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-1">
                  {(selectedTicket.replies || []).map((rep: any, i: number) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-xs max-w-[85%] ${
                        rep.authorRole === 'support'
                          ? 'ml-auto bg-amber-500/15 border border-amber-500/30 text-amber-100'
                          : 'bg-[#0D0B16] border border-[#261E38] text-[#E5DFD7]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#9F96B2] mb-1">
                        <span className="font-bold text-white">{rep.authorName}</span>
                        <span>{new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed">{rep.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-[#261E38] flex items-center space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official reply to customer..."
                    className="flex-1 bg-[#0D0B16] border border-[#2B233F] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center space-x-1 shadow-lg shadow-amber-500/20"
                  >
                    <span>Reply</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-[#9F96B2] space-y-2">
                <MessageSquare className="w-8 h-8 text-[#554C68]" />
                <span>Select a ticket from the list to view conversation &amp; respond</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Support...</div>}>
      <SupportContent />
    </Suspense>
  );
}
