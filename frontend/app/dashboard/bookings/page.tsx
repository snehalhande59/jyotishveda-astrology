'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Calendar, ArrowLeft, Video, Clock } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getMyBookings();
        setBookings(data || []);
      } catch (e) {
        console.warn('Error loading bookings:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-[#D8C7A5] hover:text-[#FDFBF7] flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-[#FDFBF7]">My Consultations &amp; Appointments</h1>
          </div>
          <Link
            href="/astrologers"
            className="px-4 py-2 bg-[#D4AF37] text-[#0F0B1E] font-semibold text-xs rounded-xl shadow-gold hover:opacity-95"
          >
            + Book New Session
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-2xl border border-[#D4AF37]/25 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-gray-500">
                      Booking #{booking.bookingNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#150D2A] mt-1">
                    {booking.astrologer?.name || 'Vedic Acharya Consultation'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Topic: {booking.topic} • Date: {booking.date} at {booking.timeSlot}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {booking.meetingLink ? (
                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#150D2A] hover:bg-[#8C6D1F] text-[#FDFBF7] text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Join Video Call</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">Meeting Link Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-[#D4AF37]/20 text-center max-w-lg mx-auto space-y-4">
            <Calendar className="w-12 h-12 text-[#8C6D1F]/50 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#150D2A]">No Consultations Booked</h3>
            <p className="text-xs text-gray-600">
              Schedule your first private 1-on-1 video call with our certified scholars to resolve personal life queries.
            </p>
            <Link
              href="/astrologers"
              className="inline-block px-5 py-2.5 bg-[#150D2A] text-[#FDFBF7] font-semibold text-xs rounded-xl shadow-md hover:bg-[#8C6D1F]"
            >
              Browse Certified Astrologers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
