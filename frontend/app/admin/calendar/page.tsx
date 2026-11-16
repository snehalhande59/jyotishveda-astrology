'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Filter,
} from 'lucide-react';

function CalendarContent() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAstrologer, setSelectedAstrologer] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [selectedAstrologer]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCalendarAppointments({
        astrologerId: selectedAstrologer === 'all' ? undefined : selectedAstrologer,
      });
      if (res?.data) {
        setAppointments(res.data);
      }
    } catch (e) {
      console.warn('Calendar load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const DAYS = ['Mon Nov 03', 'Tue Nov 04', 'Wed Nov 05', 'Thu Nov 06', 'Fri Nov 07', 'Sat Nov 08', 'Sun Nov 09'];

  return (
    <AdminLayout
      title="Astrologer Appointment Calendar"
      subtitle="Master schedule, consultation video links, slot blocking & live session orchestrations"
    >
      <div className="space-y-6">
        {/* Top Controls */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">November 2026 • Week 45</h3>
              <p className="text-[11px] text-[#9F96B2]">All times shown in IST (UTC+05:30)</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <span className="text-xs text-[#9F96B2]">Filter Astrologer:</span>
            <select
              value={selectedAstrologer}
              onChange={(e) => setSelectedAstrologer(e.target.value)}
              className="bg-[#0D0B16] border border-[#2B233F] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Astrologers</option>
              <option value="1">Acharya Devendra Shastri</option>
              <option value="2">Dr. Radhika Joshi</option>
              <option value="3">Pandit Suresh Kulkarni</option>
            </select>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 overflow-x-auto shadow-xl">
          <div className="grid grid-cols-7 gap-3 min-w-[840px]">
            {DAYS.map((day, idx) => {
              const dayStr = `2026-11-0${idx + 3}`;
              const dayAppointments = appointments.filter((a) => a.appointmentDate === dayStr);

              return (
                <div key={day} className="bg-[#0D0B16] border border-[#261E38] rounded-xl p-3 min-h-[360px] flex flex-col">
                  <div className="pb-2 border-b border-[#261E38] mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">{day}</span>
                    <span className="text-[10px] bg-[#141021] px-1.5 py-0.5 rounded text-[#9F96B2]">
                      {dayAppointments.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    {dayAppointments.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[10px] text-[#554C68] italic">
                        No appointments
                      </div>
                    ) : (
                      dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                            apt.status === 'confirmed'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                              : apt.status === 'completed'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              : 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>{apt.appointmentTime}</span>
                            </span>
                            <span className="uppercase text-[9px] px-1 rounded bg-black/40">
                              {apt.durationMinutes}m
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-white truncate">{apt.customerName}</div>
                          <div className="text-[10px] text-[#9F96B2] truncate mt-0.5">{apt.astrologerName}</div>
                          <div className="text-[9px] text-amber-400/80 truncate mt-1">{apt.serviceType}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-[#141021] border border-[#2B233F] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#261E38]">
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    {selectedAppointment.serviceType}
                  </h3>
                  <p className="text-xs text-[#9F96B2]">{selectedAppointment.appointmentDate} at {selectedAppointment.appointmentTime}</p>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="w-8 h-8 rounded-full bg-[#0D0B16] text-[#9F96B2] hover:text-white flex items-center justify-center border border-[#2B233F]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#0D0B16] p-3 rounded-xl border border-[#261E38] space-y-1">
                  <span className="text-[10px] text-[#9F96B2] block">Client Contact</span>
                  <div className="font-bold text-white text-sm">{selectedAppointment.customerName}</div>
                  <div className="text-[#9F96B2]">{selectedAppointment.customerEmail} • {selectedAppointment.customerPhone}</div>
                </div>

                <div className="bg-[#0D0B16] p-3 rounded-xl border border-[#261E38] space-y-1">
                  <span className="text-[10px] text-[#9F96B2] block">Assigned Astrologer</span>
                  <div className="font-bold text-amber-300">{selectedAppointment.astrologerName}</div>
                </div>

                {selectedAppointment.meetingLink && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-300">
                      <Video className="w-4 h-4 text-amber-400" />
                      <span>Live Video Consultation Link</span>
                    </div>
                    <a
                      href={selectedAppointment.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg inline-flex items-center space-x-1"
                    >
                      <span>Join Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="bg-[#0D0B16] p-3 rounded-xl border border-[#261E38] space-y-1">
                  <span className="text-[10px] text-[#9F96B2] block">Consultation Notes</span>
                  <p className="text-white leading-relaxed">{selectedAppointment.notes || 'None recorded'}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Calendar...</div>}>
      <CalendarContent />
    </Suspense>
  );
}
