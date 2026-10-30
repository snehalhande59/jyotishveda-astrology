'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthSession } from '@/lib/auth';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get('access_token') || searchParams.get('id_token') || searchParams.get('raw[access_token]');
    const rawError = searchParams.get('error') || searchParams.get('message');

    if (rawError) {
      setError(decodeURIComponent(rawError));
      return;
    }

    if (!accessToken) {
      // Check if user came with code/query directly from Strapi
      const allParams = searchParams.toString();
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

      fetch(`${strapiUrl}/api/auth/google/callback?${allParams}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || !data.jwt) {
            throw new Error(data?.error?.message || data?.message || 'Authentication with Google failed');
          }
          setAuthSession(data.jwt, data.user);
          router.push('/dashboard');
        })
        .catch((err) => {
          setError(err.message || (language === 'mr' ? 'गुगल प्रमाणीकरण अयशस्वी झाले.' : 'Google authentication failed.'));
        });
      return;
    }

    // Connect with token
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    fetch(`${strapiUrl}/api/auth/google/callback?access_token=${accessToken}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.jwt) {
          throw new Error(data?.error?.message || data?.message || 'Authentication with Google failed');
        }
        setAuthSession(data.jwt, data.user);
        router.push('/dashboard');
      })
      .catch((err) => {
        setError(err.message || (language === 'mr' ? 'गुगल प्रमाणीकरण अयशस्वी झाले.' : 'Google authentication failed.'));
      });
  }, [searchParams, router, language]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center p-4 font-sans text-[#2D1810]">
      <div className="bg-white border border-[#EAE1D2] rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
        {error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-lg font-bold text-rose-800">
              {language === 'mr' ? 'प्रमाणीकरण अयशस्वी' : 'Authentication Error'}
            </h2>
            <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              {language === 'mr' ? 'लॉगिनकडे परत जा' : 'Return to Login'}
            </button>
          </div>
        ) : (
          <div className="space-y-3 py-6">
            <Sparkles className="w-10 h-10 text-[#D97706] animate-spin mx-auto" />
            <h2 className="font-serif text-lg font-bold text-[#2D1810]">
              {language === 'mr' ? 'गुगल खात्याची पडताळणी करत आहे...' : 'Verifying Google Account...'}
            </h2>
            <p className="text-xs text-[#786C60]">
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
