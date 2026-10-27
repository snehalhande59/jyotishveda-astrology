'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Astrologer } from '@/lib/types';
import PaymentModal from '@/components/PaymentModal';
import { Video, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function BookingContent() {
  const { t, language, formatNumber, formatCurrency } = useLanguage();
  const searchParams = useSearchParams();
  const astrologerIdParam = searchParams.get('astrologerId');

  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [selectedAstrologerId, setSelectedAstrologerId] = useState<number>(0);
  const [date, setDate] = useState('2026-11-05');
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [topic, setTopic] = useState('Vedic Kundli & Career Guidance');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const list = await api.getAstrologers();
        setAstrologers(list);
        if (list.length > 0) {
          const match = astrologerIdParam ? list.find((a) => String(a.id) === astrologerIdParam) : list[0];
          setSelectedAstrologerId(match ? match.id : list[0].id);
        }
      } catch (e) {
        console.warn('Booking load error:', e);
      }
    }
    load();
  }, [astrologerIdParam]);

  const selectedAstrologer = astrologers.find((a) => a.id === selectedAstrologerId);

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAstrologer) return;
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedAstrologer) return;
    setLoading(true);
    try {
      const res = await api.createBooking({
        astrologerId: selectedAstrologer.id,
        date,
        timeSlot,
        topic,
        clientNotes: notes,
      });
      setConfirmedBooking(res);
    } catch (err: any) {
      alert(err.message || 'Error saving booking');
    } finally {
      setLoading(false);
    }
  };

  const topics = [
    { value: 'Vedic Kundli & Career Guidance', en: 'Vedic Kundli & Career Guidance', mr: 'वैदिक जन्मकुंडली आणि करिअर मार्गदर्शन' },
    { value: 'Marriage Compatibility & Timing', en: 'Marriage Compatibility & Timing', mr: 'विवाह गुणमेलन आणि योग' },
    { value: 'Wealth, Finance & Business Kundli', en: 'Wealth, Finance & Business Kundli', mr: 'धन, वित्त आणि व्यवसाय योग' },
    { value: 'Health, Longevity & Remedial Mantras', en: 'Health, Longevity & Remedial Mantras', mr: 'आरोग्य, दीर्घायुष्य आणि शांती मंत्र' },
  ];

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs text-[#F7DF94]">
            <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('booking.badge')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            {t('booking.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto leading-relaxed">
            {t('booking.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {confirmedBooking ? (
          <div className="bg-[#150D2A] text-[#FDFBF7] p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-cosmic space-y-6 text-center animate-fadeIn">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" />
            <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
              {t('booking.confirmed')}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#F7DF94]">
              {t('booking.appointment')} #{confirmedBooking.bookingNumber}
            </h2>
            <p className="text-xs text-[#D8C7A5]">
              {t('booking.confirmedDesc')}{' '}
              <strong className="text-[#FDFBF7]">{selectedAstrologer?.name}</strong>.
            </p>

            <div className="max-w-md mx-auto bg-[#0F0B1E] p-4 rounded-xl border border-[#D4AF37]/20 text-xs text-left space-y-2">
              <div className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                <span className="text-[#D8C7A5]">{t('booking.dateTime')}:</span>
                <strong className="text-[#FDFBF7]">{confirmedBooking.date} at {confirmedBooking.timeSlot}</strong>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/10 pb-1.5">
                <span className="text-[#D8C7A5]">{t('booking.topic')}:</span>
                <strong className="text-[#FDFBF7]">{confirmedBooking.topic}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#D8C7A5]">{t('booking.meetingLink')}:</span>
                <a
                  href={confirmedBooking.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#D4AF37] underline font-semibold"
                >
                  {t('booking.joinCall')}
                </a>
              </div>
            </div>

            <div className="pt-4 flex justify-center space-x-4">
              <Link
                href="/dashboard/bookings"
                className="px-6 py-2.5 bg-[#D4AF37] text-[#0F0B1E] font-semibold text-xs rounded-xl shadow-gold hover:opacity-95"
              >
                {t('booking.viewMyBookings')}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleStartBooking} className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-gray-700">{t('booking.selectAstrologer')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {astrologers.map((a) => {
                  const isSelected = a.id === selectedAstrologerId;
                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAstrologerId(a.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#150D2A] text-[#FDFBF7] border-[#D4AF37] shadow-gold'
                          : 'bg-[#FAF6F0] border-[#D4AF37]/20 hover:border-[#D4AF37] text-gray-800'
                      }`}
                    >
                      <img
                        src={a.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'}
                        alt={a.name}
                        className="w-12 h-12 rounded-full object-cover mb-2 border border-[#D4AF37]"
                      />
                      <strong className="font-serif text-sm block">{a.name}</strong>
                      <span className="text-[10px] text-[#8C6D1F] block">{a.title}</span>
                      <span className="text-xs font-bold block mt-2">{formatCurrency(a.consultationFee)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('booking.selectDate')}</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-gray-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('booking.selectSlot')}</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-gray-300 rounded-lg text-xs"
                >
                  <option value="10:00 AM">10:00 AM - 10:45 AM</option>
                  <option value="11:30 AM">11:30 AM - 12:15 PM</option>
                  <option value="03:00 PM">03:00 PM - 03:45 PM</option>
                  <option value="05:00 PM">05:00 PM - 05:45 PM</option>
                  <option value="07:00 PM">07:00 PM - 07:45 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('booking.topic')}</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-gray-300 rounded-lg text-xs"
              >
                {topics.map((item) => (
                  <option key={item.value} value={item.value}>
                    {language === 'mr' ? item.mr : item.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('booking.clientNotes')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('booking.clientNotesPlaceholder')}
                rows={3}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-gray-300 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm rounded-xl shadow-gold hover:opacity-95 transition-all disabled:opacity-50"
            >
              {t('booking.confirmAndPay', { amount: formatNumber(selectedAstrologer?.consultationFee || 1999) })}
            </button>
          </form>
        )}
      </div>

      {selectedAstrologer && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          serviceTitle={`Consultation with ${selectedAstrologer.name}`}
          amount={selectedAstrologer.consultationFee}
          serviceType="consultation"
          referenceId={String(selectedAstrologer.id)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#D8C7A5]">Loading booking options...</div>}>
      <BookingContent />
    </Suspense>
  );
}
