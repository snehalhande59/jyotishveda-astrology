'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { openRazorpayModal } from '@/lib/razorpay';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, CreditCard, Sparkles, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  amount: number;
  serviceType: string;
  referenceId: string;
  onSuccess: (paymentRecord: any) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  serviceTitle,
  amount,
  serviceType,
  referenceId,
  onSuccess,
}: PaymentModalProps) {
  const { language, t, formatCurrency, formatNumber } = useLanguage();
  const [step, setStep] = useState<'init' | 'orderCreated' | 'processing' | 'success' | 'failed'>('init');
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  if (!isOpen) return null;

  const handleStartPayment = async () => {
    setIsCreatingOrder(true);
    setErrorMsg('');
    try {
      const order = await api.createPaymentOrder(amount, serviceType, referenceId);
      setOrderData(order);

      // Try opening official Razorpay checkout modal (amount must be in paise: ₹1 = 100 paise)
      try {
        await openRazorpayModal({
          key: order.keyId,
          amount: Math.round(order.amount * 100),
          currency: order.currency || 'INR',
          name: language === 'mr' ? 'ज्योतिषवेदा सुरक्षित देयक' : 'JyotishVeda Astrology',
          description: serviceTitle,
          order_id: order.orderId,
          handler: async (response) => {
            setStep('processing');
            try {
              const res = await api.verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                serviceType,
                referenceId,
              });
              if (res.success) {
                setStep('success');
                setTimeout(() => {
                  onSuccess(res.data);
                  onClose();
                }, 1200);
              } else {
                setStep('failed');
                setErrorMsg(language === 'mr' ? 'बॅकएंडवर स्वाक्षरी पडताळणी अयशस्वी झाली' : 'Signature verification rejected by backend');
              }
            } catch (vErr: any) {
              setStep('failed');
              setErrorMsg(vErr.message || (language === 'mr' ? 'पडताळणी अयशस्वी' : 'Verification failed'));
            }
          },
          onFailure: (failedResp: any) => {
            setStep('failed');
            setErrorMsg(
              failedResp?.error?.description ||
              (language === 'mr' ? 'पेमेंट गेटवेवर अयशस्वी झाले' : 'Payment failed on Razorpay checkout')
            );
          },
          modal: {
            ondismiss: () => {
              setStep('orderCreated');
            },
          },
        });
      } catch (modalErr) {
        // Fallback to simulated test mode confirmation
        setStep('orderCreated');
      }
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'mr' ? 'पेमेंट ऑर्डर तयार करता आली नाही' : 'Failed to initialize payment order'));
      setStep('failed');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleVerifySimulatedPayment = async () => {
    if (!orderData) return;
    setStep('processing');
    try {
      const simulatedPaymentId = `pay_rzp_${Date.now()}`;
      const verificationResult = await api.verifyPayment({
        orderId: orderData.orderId,
        paymentId: simulatedPaymentId,
        signature: 'test_signature_valid',
        serviceType,
        referenceId,
      });

      if (verificationResult.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess(verificationResult.data);
          onClose();
        }, 1200);
      } else {
        setStep('failed');
        setErrorMsg(language === 'mr' ? 'सर्व्हरवर स्वाक्षरी पडताळणी अयशस्वी झाली' : 'Cryptographic signature verification failed on backend');
      }
    } catch (err: any) {
      setStep('failed');
      setErrorMsg(err.message || (language === 'mr' ? 'बॅकएंडद्वारे पडताळणी नाकारली गेली' : 'Verification rejected by backend'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white border-2 border-[#FDE68A] w-full max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-[#2D1810] shadow-xl relative space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#786C60] hover:text-[#2D1810] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 text-[#D97706] border-b border-[#F5EFE6] pb-3">
          <CreditCard className="w-5 h-5" />
          <h3 className="font-serif text-lg font-bold text-[#2D1810]">{t('payment.title')}</h3>
        </div>

        {/* Step 1: Initial Summary */}
        {step === 'init' && (
          <div className="space-y-4">
            <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EAE1D2]">
              <span className="text-[11px] text-[#786C60] font-semibold block">{t('payment.selectedService')}</span>
              <p className="font-serif text-base font-bold text-[#2D1810] mt-0.5">{serviceTitle}</p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#F5EFE6]">
                <span className="text-xs text-[#786C60]">{t('payment.totalPayable')}:</span>
                <span className="text-xl font-extrabold text-[#B45309]">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div className="text-xs text-[#78350F] flex items-start space-x-2 bg-[#FFFBEB] p-3 rounded-xl border border-[#FDE68A]">
              <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <span>{t('payment.testNotice')}</span>
            </div>

            <button
              onClick={handleStartPayment}
              disabled={isCreatingOrder}
              className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-xs rounded-xl shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all cursor-pointer disabled:opacity-50"
            >
              {isCreatingOrder ? t('payment.generatingOrder') : t('payment.proceed')}
            </button>
          </div>
        )}

        {/* Step 2: Order Created, Ready for Verification */}
        {step === 'orderCreated' && orderData && (
          <div className="space-y-4">
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-300 text-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('payment.orderCreated')}</span>
              </div>
              <p><span className="text-emerald-900/70">{t('payment.orderId')}:</span> <code className="text-emerald-950 font-mono font-bold">{orderData.orderId}</code></p>
              <p><span className="text-emerald-900/70">{t('payment.totalPayable')}:</span> {formatCurrency(orderData.amount)} {orderData.currency}</p>
            </div>

            <p className="text-xs text-[#6B5A4E] leading-relaxed">
              {language === 'mr' ? 'टेस्ट पेमेंट पूर्ण करण्यासाठी व स्ट्रॅपी ५ बॅकएंडवर सुरक्षित स्वाक्षरी तपासण्यासाठी खाली क्लिक करा.' : 'Click below to complete the test payment transaction and verify the cryptographic signature with Strapi 5.'}
            </p>

            <button
              onClick={handleVerifySimulatedPayment}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              {t('payment.authorizeTest')}
            </button>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#2D1810]">{t('payment.verifying')}</p>
            <p className="text-xs text-[#786C60]">{t('payment.verifyingDesc')}</p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-emerald-900">{t('payment.successTitle')}</h4>
            <p className="text-xs text-emerald-700">{t('payment.successDesc')}</p>
          </div>
        )}

        {/* Step 5: Failed */}
        {step === 'failed' && (
          <div className="py-4 space-y-3 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="font-serif text-base font-bold text-rose-800">{t('payment.failedTitle')}</h4>
            <p className="text-xs text-rose-600">{errorMsg}</p>
            <button
              onClick={() => setStep('init')}
              className="px-4 py-2 bg-[#FAF7F2] border border-[#EAE1D2] text-xs font-bold text-[#4A2E18] rounded-xl hover:bg-[#FFFDF9] cursor-pointer"
            >
              {t('payment.tryAgain')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
