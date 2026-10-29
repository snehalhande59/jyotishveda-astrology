'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Astrologer } from '@/lib/types';
import PaymentModal from '@/components/PaymentModal';
import { Video, CheckCircle, Phone, Calendar, Clock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
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
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [pendingBooking, setPendingBooking] = useState<any>(null);

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

  const handleStartBooking = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setPendingBookingId(String(res.id));
      setPendingBooking(res);
      setShowPayment(true);
    } catch (err: any) {
      alert(err.message || 'Error initializing booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData?: any) => {
    if (!selectedAstrologer) return;
    setConfirmedBooking(pendingBooking || {
      id: pendingBookingId || 'BK-CONFIRMED',
      astrologer: selectedAstrologer,
      date,
      timeSlot,
      topic,
      payment: paymentData,
    });
  };

  const topics = [
    { value: 'Vedic Kundli & Career Guidance', en: 'Vedic Kundli & Career Guidance', mr: 'वैदिक जन्मकुंडली आणि करिअर मार्गदर्शन' },
    { value: 'Marriage Compatibility & Timing', en: 'Marriage Compatibility & Timing', mr: 'विवाह गुणमेलन आणि योग' },
    { value: 'Wealth, Finance & Business Kundli', en: 'Wealth, Finance & Business Kundli', mr: 'धन, वित्त आणि व्यवसाय योग' },
    { value: 'Health, Longevity & Remedial Mantras', en: 'Health, Longevity & Remedial Mantras', mr: 'आरोग्य, दीर्घायुष्य आणि शांती मंत्र' },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t('booking.badge')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {t('booking.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {t('booking.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {confirmedBooking ? (
          <div className="bg-white p-5 sm:p-8 md:p-12 rounded-3xl border-2 border-[#FDE68A] shadow-md text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2D1810]">
              {language === 'mr' ? 'सल्लामसलत सत्र यशस्वीरित्या बुक झाले!' : 'Consultation Session Confirmed!'}
            </h2>
            <p className="text-xs sm:text-sm text-[#786C60] max-w-md mx-auto">
              {language === 'mr'
                ? `आपले १-ऑन-१ खाजगी सत्र ${selectedAstrologer?.name} यांच्यासोबत ${date} रोजी ${timeSlot} वाजता निश्चित झाले आहे.`
                : `Your confidential 1-on-1 consultation with ${selectedAstrologer?.name} is confirmed for ${date} at ${timeSlot}.`}
            </p>

            <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] text-xs text-[#4A2E18] max-w-sm mx-auto space-y-1">
              <div><strong>{language === 'mr' ? 'मार्गदर्शन विषय:' : 'Topic:'}</strong> {topic}</div>
              <div><strong>{language === 'mr' ? 'सत्र प्रकार:' : 'Format:'}</strong> {language === 'mr' ? 'थेट व्हॉईस/व्हिडिओ कॉल' : 'Private Voice / Video'}</div>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard/bookings"
                className="px-5 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                {language === 'mr' ? 'माझे बुकिंग्ज पहा' : 'View My Bookings'}
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] text-xs font-bold text-[#4A2E18] rounded-xl hover:bg-[#FFFDF9]"
              >
                {language === 'mr' ? 'मुख्यपृष्ठावर जा' : 'Return Home'}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleStartBooking} className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6 sm:space-y-8">
            {/* Astrologer Selector */}
            <div>
              <label className="block text-xs font-bold text-[#4A2E18] mb-3">
                {language === 'mr' ? '१. वैदिक ज्योतिषी निवडा:' : '1. Select Your Vedic Astrologer:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {astrologers.map((a) => {
                  const isSelected = a.id === selectedAstrologerId;
                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAstrologerId(a.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3.5 ${
                        isSelected
                          ? 'bg-[#FFFBEB] border-2 border-[#F59E0B] shadow-xs'
                          : 'bg-[#FAF7F2] border-[#EAE1D2] hover:border-[#F59E0B]'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={a.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
                          alt={a.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 ring-offset-2 flex-shrink-0"
                        />
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#2D1810] line-clamp-1">{a.name}</h4>
                        <p className="text-[10px] text-[#D97706] font-medium">{formatCurrency(a.consultationFee)}</p>
                        <span className="text-[10px] text-amber-500 font-bold">★ {formatNumber(a.rating)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-2 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{language === 'mr' ? '२. तारीख निवडा:' : '2. Consultation Date:'}</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-2 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{language === 'mr' ? '३. वेळ निवडा:' : '3. Preferred Time Window:'}</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                >
                  <option value="10:00 AM">10:00 AM - 10:45 AM</option>
                  <option value="11:00 AM">11:00 AM - 11:45 AM</option>
                  <option value="02:00 PM">02:00 PM - 02:45 PM</option>
                  <option value="04:30 PM">04:30 PM - 05:15 PM</option>
                  <option value="07:00 PM">07:00 PM - 07:45 PM</option>
                </select>
              </div>
            </div>

            {/* Topic & Notes */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-2">
                  {language === 'mr' ? '४. सल्लामसलत विषय:' : '4. Consultation Topic:'}
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                >
                  {topics.map((tItem) => (
                    <option key={tItem.value} value={tItem.value}>
                      {language === 'mr' ? tItem.mr : tItem.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-2">
                  {language === 'mr' ? '५. अतिरिक्त प्रश्न / नोंदी (ऐच्छिक):' : '5. Specific Questions or Notes (Optional):'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'mr'
                      ? 'उदा. मला माझ्या नवीन नोकरीच्या योगाबद्दल आणि विवाह वेळेबद्दल माहिती हवी आहे.'
                      : 'e.g. Inquiring about overseas job transit, business partnerships, or specific dasha remedies.'
                  }
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                />
              </div>
            </div>

            {/* Price & Submit CTA */}
            <div className="pt-4 border-t border-[#F5EFE6] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] text-[#786C60] block font-bold uppercase">
                  {language === 'mr' ? 'एकूण देय रक्कम' : 'Total Payable'}
                </span>
                <span className="font-serif text-2xl font-extrabold text-[#2D1810]">
                  {formatCurrency(selectedAstrologer ? selectedAstrologer.consultationFee : 999)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{language === 'mr' ? 'सत्र बुक करा आणि पुढे जा' : 'Proceed to Payment & Book'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
          referenceId={pendingBookingId || String(selectedAstrologer.id)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center text-xs text-[#786C60]">Loading booking portal...</div>}>
      <BookingContent />
    </Suspense>
  );
}
