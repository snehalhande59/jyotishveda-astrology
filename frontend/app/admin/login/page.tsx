'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { setAdminSession, getAdminToken } from '@/lib/admin-auth';
import { Sparkles, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);

  // If already authenticated as admin, redirect to dashboard
  useEffect(() => {
    if (getAdminToken()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  useEffect(() => {
    if (searchParams?.get('error') === 'session_expired') {
      setError('Your administrative session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First try Next.js API route or direct backend login
      let res;
      try {
        res = await adminApi.login(email.trim(), password);
      } catch (directErr) {
        // Fallback to local Next.js route
        const localRes = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        if (!localRes.ok) {
          const errData = await localRes.json().catch(() => ({}));
          throw new Error(errData?.error || 'Authentication failed. Please verify credentials.');
        }
        res = await localRes.json();
      }

      if (res && res.jwt && res.admin) {
        setAdminSession(res.jwt, res.admin);
        router.push('/admin/dashboard');
      } else {
        throw new Error('Invalid administrative response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0812] text-[#E5DFD7] font-sans flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Zodiac Geometry Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-[800px] h-[800px] text-amber-500 animate-spin-slow">
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="1" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="1" />
          <line x1="72.7" y1="72.7" x2="327.3" y2="327.3" stroke="currentColor" strokeWidth="0.8" />
          <line x1="72.7" y1="327.3" x2="327.3" y2="72.7" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Banner */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 shadow-xl shadow-amber-600/30 mb-2">
            <Sparkles className="w-7 h-7 text-black" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
            ASTROVEDA <span className="text-amber-400">ADMIN</span>
          </h1>
          <p className="text-xs text-[#9F96B2]">
            Central Management System &amp; Platform Controls
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-[#261E38]">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Restricted Access Portal</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
              v2.5
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#C7BED6] block">Admin Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A7091] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@astroveda.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#C7BED6]">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A7091] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7091] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to AstroVeda Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#261E38] text-center">
            <p className="text-[11px] text-[#786D8E]">
              Protected with role-based JWT authorization. Unauthorized access attempts are monitored and logged.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151122] border border-[#2D2444] rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Admin Password Recovery</h3>
            <p className="text-xs text-[#9F96B2] leading-relaxed">
              For administrative security, password resets are processed via the primary platform host administrator or Strapi environment keys (<code className="text-amber-300">ADMIN_PASSWORD</code>).
            </p>
            <p className="text-[11px] text-[#7A7091] bg-[#0C0A14] p-3 rounded-xl border border-[#261E38]">
              Contact system support or check server environment configuration for credentials.
            </p>
            <button
              onClick={() => setForgotOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#231B36] hover:bg-[#2C2344] text-white text-xs font-bold transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0812] flex items-center justify-center text-amber-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
