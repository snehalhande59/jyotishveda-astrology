'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.sendContactMessage({ name, email, phone, subject, message });
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
          {language === 'mr' ? 'ज्योतिषवेदशी संपर्क साधा' : 'Contact JyotishVeda'}
        </h1>
        <p className="text-xs sm:text-sm text-[#786C60] max-w-lg mx-auto mt-2 leading-relaxed">
          {language === 'mr'
            ? 'सल्लामसलत बुकिंग, पत्रिका गणना किंवा तांत्रिक मदतीबद्दल काही प्रश्न आहेत का? आमची टीम आपल्या सेवेसाठी तत्पर आहे.'
            : 'Have queries regarding consultation bookings, birth chart calculations, or technical support? Our team is at your service.'}
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white text-[#2D1810] p-5 sm:p-6 md:p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2D1810]">
              {language === 'mr' ? 'वैदिक ज्ञान केंद्र' : 'Vedic Knowledge Center'}
            </h3>
            <p className="text-xs text-[#786C60] leading-relaxed">
              {language === 'mr'
                ? 'आमचे विद्वान आणि सहाय्यक कर्मचारी नवी दिल्ली येथून मार्गदर्शन पुरवतात.'
                : 'Our scholars and support staff operate from New Delhi, offering personalized support across all global timezones.'}
            </p>

            <div className="space-y-4 text-xs text-[#5C4033] pt-2 border-t border-[#EAE1D2]">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <span>Connaught Place, New Delhi 110001, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span>contact@jyotishveda.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span>+91 (0) 11 4987 6543</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 md:p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#2D1810]">
            {language === 'mr' ? 'आम्हाला संदेश पाठवा' : 'Send Us a Message'}
          </h3>

          {sent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                {language === 'mr'
                  ? 'धन्यवाद! आपली विचारणा यशस्वीपणे पाठवली गेली आहे.'
                  : 'Thank you! Your inquiry has been dispatched to our support desk.'}
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#5C4033] mb-1">
                  {language === 'mr' ? 'आपले नाव' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aryavarta Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EAE1D2] rounded-xl text-sm focus:outline-none focus:border-[#D97706] text-[#2D1810]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#5C4033] mb-1">
                  {language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EAE1D2] rounded-xl text-sm focus:outline-none focus:border-[#D97706] text-[#2D1810]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#5C4033] mb-1">
                  {language === 'mr' ? 'फोन नंबर (ऐच्छिक)' : 'Phone Number (Optional)'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EAE1D2] rounded-xl text-sm focus:outline-none focus:border-[#D97706] text-[#2D1810]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#5C4033] mb-1">
                  {language === 'mr' ? 'विषय' : 'Inquiry Subject'}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Consultation query / Report status"
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EAE1D2] rounded-xl text-sm focus:outline-none focus:border-[#D97706] text-[#2D1810]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#5C4033] mb-1">
                {language === 'mr' ? 'आपला संदेश' : 'Your Message'}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How may our scholars assist you?"
                rows={4}
                className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EAE1D2] rounded-xl text-sm focus:outline-none focus:border-[#D97706] text-[#2D1810]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>{language === 'mr' ? 'संदेश पाठवत आहे...' : 'Dispatching Message...'}</span>
              ) : (
                <span>{language === 'mr' ? 'संदेश पाठवा' : 'Send Inquiries to Acharyas'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}