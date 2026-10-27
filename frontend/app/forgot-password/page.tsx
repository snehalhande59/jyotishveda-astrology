'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending password reset link
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#191233]/90 border border-[#D4AF37]/30 rounded-2xl p-8 shadow-cosmic space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 text-xs text-[#D4AF37] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-[#F7DF94] to-[#D4AF37] bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-xs text-[#D8C7A5]/80">
            Enter the email address registered with your JyotishVeda account. We will send you secure recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-5 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-serif text-sm font-bold text-emerald-300">
              Recovery Link Sent
            </h3>
            <p className="text-xs text-[#D8C7A5]/80">
              If an account matches <strong>{email}</strong>, you will receive password reset instructions in your inbox shortly.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                Return to Login →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 pl-10 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
                />
                <Mail className="w-4 h-4 text-[#D8C7A5]/50 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-bold text-xs uppercase tracking-wider hover:shadow-gold transition-all disabled:opacity-50"
            >
              {loading ? 'Sending Recovery Link...' : 'Send Recovery Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
