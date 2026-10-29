'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Calendar, ArrowLeft, Video, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MyBookingsPage() {
  const { language } = useLanguage();
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
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-[#786C60] hover:text-[#2D1810] flex items-center space-x-1 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'डॅशबोर्डवर परत जा' : 'Back to Dashboard'}</span>
            </Link>
            <h1 className="font-serif text-3xl font-extrabold text-[#2D1810]">
              {language === 'mr' ? 'माझी सल्लामसलत आणि भेटी' : 'My Consultations & Appointments'}
            </h1>
          </div>
          <Link
            href="/astrologers"
            className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs rounded-xl shadow-md transition-all"
          >
            {language === 'mr' ? '+ नवीन सत्र बुक करा' : '+ Book New Session'}
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#D97706] transition-all"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-[#786C60]">
                      {language === 'mr' ? 'बुकिंग #' : 'Booking #'}{booking.bookingNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810] mt-1">
                    {booking.astrologer?.name || (language === 'mr' ? 'वैदिक आचार्य सल्लामसलत' : 'Vedic Acharya Consultation')}
                  </h3>
                  <p className="text-xs text-[#5C4033] mt-0.5">
                    {language === 'mr' ? 'विषय:' : 'Topic:'} {booking.topic} • {language === 'mr' ? 'दिनांक:' : 'Date:'} {booking.date} at {booking.timeSlot}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {booking.meetingLink ? (
                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{language === 'mr' ? 'व्हिडिओ कॉल सुरू करा' : 'Join Video Call'}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-[#786C60]">
                      {language === 'mr' ? 'कॉल लिंक प्रलंबित' : 'Meeting Link Pending'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-[#EAE1D2] text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <Calendar className="w-12 h-12 text-[#D97706]/50 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2D1810]">
              {language === 'mr' ? 'कोणतेही बुकिंग सापडले नाही' : 'No Consultations Booked'}
            </h3>
            <p className="text-xs text-[#786C60] leading-relaxed">
              {language === 'mr'
                ? 'आपल्या वैयक्तिक जीवन समस्यांवर मार्गदर्शनासाठी प्रमाणित विद्वानांशी थेट व्हिडिओ कॉल शेड्यूल करा.'
                : 'Schedule your first private 1-on-1 video call with our certified scholars to resolve personal life queries.'}
            </p>
            <Link
              href="/astrologers"
              className="inline-block px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              {language === 'mr' ? 'प्रमाणित ज्योतिषी शोधा' : 'Browse Certified Astrologers'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
