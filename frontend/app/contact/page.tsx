'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
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
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
          Contact JyotishVeda
        </h1>
        <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-lg mx-auto mt-2">
          Have queries regarding consultation bookings, birth chart calculations, or technical support? Our team is at your service.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#150D2A] text-[#FDFBF7] p-8 rounded-3xl border border-[#D4AF37]/30 shadow-cosmic space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#F7DF94]">Vedic Knowledge Center</h3>
            <p className="text-xs text-[#D8C7A5] leading-relaxed">
              Our scholars and support staff operate from New Delhi, offering personalized support across all global timezones.
            </p>

            <div className="space-y-4 text-xs text-[#D8C7A5]/90 pt-2 border-t border-[#D4AF37]/20">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Connaught Place, New Delhi 110001, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>contact@jyotishveda.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>+91 (0) 11 4987 6543</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#150D2A]">Send Us a Message</h3>

          {sent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your inquiry has been dispatched to our support desk.</span>
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
                <label className="block font-semibold text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aryavarta Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-gray-300 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Inquiry Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Consultation query / Report status"
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-gray-300 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How may our scholars assist you?"
                rows={4}
                className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-gray-300 rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm rounded-xl shadow-gold hover:opacity-95 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <span>Dispatching Message...</span> : <span>Send Inquiries to Acharyas</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
