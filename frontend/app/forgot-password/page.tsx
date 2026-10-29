'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // Secure simulated recovery instruction dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white border border-[#EAE1D2] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D97706] hover:text-[#B45309] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? '← लॉगिनकडे परत जा' : 'Back to Login'}</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto text-[#D97706] shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'पासवर्ड रीसेट करा' : 'Reset Password'}
          </h1>
          <p className="text-xs text-[#786C60] leading-relaxed">
            {language === 'mr'
              ? 'आपल्या खात्याचा नोंदणीकृत ईमेल प्रविष्ट करा. आम्ही आपल्याला सुरक्षित पासवर्ड पुनर्प्राप्ती लिंक पाठवू.'
              : 'Enter the email address registered with your JyotishVeda account. We will send you secure recovery instructions.'}
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
            <h3 className="font-serif text-base font-bold text-emerald-900">
              {language === 'mr' ? 'पुनर्प्राप्ती लिंक पाठवली' : 'Recovery Instructions Sent'}
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {language === 'mr' ? (
                <>
                  जर <strong>{email}</strong> सह नोंदणीकृत खाते अस्तित्वात असेल, तर आपल्याला इनबॉक्समध्ये काही क्षणांत सूचना प्राप्त होतील.
                </>
              ) : (
                <>
                  If an account matches <strong>{email}</strong>, you will receive password reset instructions in your inbox shortly.
                </>
              )}
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block text-xs font-bold text-[#D97706] hover:underline"
              >
                {language === 'mr' ? 'लॉगिनकडे परत जा →' : 'Return to Login →'}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">
                {language === 'mr' ? 'नोंदणीकृत ईमेल पत्ता' : 'Registered Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-[#D97706] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all disabled:opacity-50"
            >
              {loading
                ? language === 'mr'
                  ? 'लिंक पाठवत आहे...'
                  : 'Sending Recovery Link...'
                : language === 'mr'
                ? 'पुनर्प्राप्ती लिंक पाठवा'
                : 'Send Recovery Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
