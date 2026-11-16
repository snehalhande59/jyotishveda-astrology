'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthSession } from '@/lib/auth';
import { getStrapiUrl } from '@/lib/api';
import { Sparkles, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const rawError = searchParams.get('error') || searchParams.get('message') || searchParams.get('error_description');
    if (rawError) {
      if (rawError.includes('access_denied')) {
        setError(
          language === 'mr'
            ? 'गुगल लॉगिन प्रक्रिया रद्द केली गेली आहे.'
            : 'Google sign-in was cancelled by user.'
        );
      } else {
        setError(decodeURIComponent(rawError));
      }
      return;
    }

    const accessToken =
      searchParams.get('access_token') ||
      searchParams.get('id_token') ||
      searchParams.get('raw[access_token]');

    const strapiUrl = getStrapiUrl();
    const allParams = searchParams.toString();

    // Determine target redirect URL
    let targetRedirect = '/dashboard';
    try {
      const stored = sessionStorage.getItem('auth_redirect_target');
      if (stored && stored.startsWith('/')) {
        targetRedirect = stored;
        sessionStorage.removeItem('auth_redirect_target');
      }
    } catch {}

    const queryUrl = accessToken
      ? `${strapiUrl}/api/auth/google/callback?${allParams}`
      : `${strapiUrl}/api/auth/google/callback?${allParams}`;

    if (!allParams && !accessToken) {
      setError(
        language === 'mr'
          ? 'गुगलकडून प्रमाणीकरण टोकन प्राप्त झाले नाही.'
          : 'No authentication credentials received from Google.'
      );
      return;
    }

    fetch(queryUrl)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.jwt) {
          const msg = data?.error?.message || data?.message || 'Authentication with Google failed';
          throw new Error(msg);
        }
        setAuthSession(data.jwt, data.user);
        router.push(targetRedirect);
      })
      .catch((err) => {
        const msg = err?.message || '';
        if (msg.includes('already taken')) {
          setError(
            language === 'mr'
              ? 'या ईमेल पत्त्यावर आधीपासूनच खाते अस्तित्वात आहे. कृपया पासवर्ड वापरून लॉगिन करा.'
              : 'An account with this email already exists. Please log in with your email and password.'
          );
        } else if (msg.includes('fetch') || msg.includes('Failed') || msg.includes('network')) {
          setError(
            language === 'mr'
              ? 'सर्व्हरशी संपर्क साधता आला नाही. कृपया इंटरनेट तपासा आणि पुन्हा प्रयत्न करा.'
              : 'Unable to reach authentication server. Please check your network and retry.'
          );
        } else {
          setError(
            msg ||
              (language === 'mr'
                ? 'गुगल प्रमाणीकरण अयशस्वी झाले.'
                : 'Google authentication failed.')
          );
        }
      });
  }, [searchParams, router, language]);

  const handleRetry = () => {
    setIsRetrying(true);
    router.push('/login');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center p-4 font-sans text-[#2D1810]">
      <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-sm">
        {error ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-rose-800">
              {language === 'mr' ? 'प्रमाणीकरण अयशस्वी' : 'Authentication Notice'}
            </h2>
            <div className="text-xs text-rose-700 bg-rose-50/80 p-3.5 rounded-xl border border-rose-200 leading-relaxed text-left">
              {error}
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-xs hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'लॉगिनकडे परत जा' : 'Return to Login'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto shadow-xs text-[#D97706]">
              <Sparkles className="w-7 h-7 animate-spin" />
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2D1810]">
              {language === 'mr' ? 'गुगल खात्याची पडताळणी करत आहे...' : 'Verifying Google Account...'}
            </h2>
            <p className="text-xs text-[#786C60] leading-relaxed max-w-xs mx-auto">
              {language === 'mr'
                ? 'कृपया प्रतीक्षा करा, तुमचे ज्योतिषवेदा सत्र सुरक्षितपणे सुरू होत आहे.'
                : 'Please wait while your JyotishVeda session is securely initialized.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConnectGoogleRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
