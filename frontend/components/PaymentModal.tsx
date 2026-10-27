'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { openRazorpayModal } from '@/lib/razorpay';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, CreditCard, Sparkles, X, CheckCircle, AlertTriangle } from 'lucide-react';

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

      // Try opening official Razorpay checkout modal
      try {
        await openRazorpayModal({
          key: order.keyId,
          amount: order.amount,
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
        }, 1500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#150D2A] border border-[#D4AF37]/40 w-full max-w-md rounded-2xl p-6 text-[#FDFBF7] shadow-cosmic relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#D8C7A5]/60 hover:text-[#FDFBF7] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#D4AF37] border-b border-[#D4AF37]/20 pb-3">
          <CreditCard className="w-5 h-5" />
          <h3 className="font-serif text-lg font-bold">{t('payment.title')}</h3>
        </div>

        {/* Step 1: Initial Summary */}
        {step === 'init' && (
          <div className="space-y-4">
            <div className="bg-[#0F0B1E] p-4 rounded-xl border border-[#D4AF37]/20">
              <span className="text-xs text-[#D8C7A5]/70">{t('payment.selectedService')}</span>
              <p className="font-serif text-base font-semibold text-[#F7DF94] mt-0.5">{serviceTitle}</p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#D4AF37]/10">
                <span className="text-xs text-[#D8C7A5]">{t('payment.totalPayable')}:</span>
                <span className="text-xl font-bold text-[#FDFBF7]">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div className="text-xs text-[#D8C7A5]/80 flex items-start space-x-2 bg-[#25184B]/60 p-3 rounded-lg border border-[#D4AF37]/20">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span>{t('payment.testNotice')}</span>
            </div>

            <button
              onClick={handleStartPayment}
              disabled={isCreatingOrder}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm rounded-xl shadow-gold hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isCreatingOrder ? t('payment.generatingOrder') : t('payment.proceed')}
            </button>
          </div>
        )}

        {/* Step 2: Order Created, Ready for Verification */}
        {step === 'orderCreated' && orderData && (
          <div className="space-y-4">
            <div className="bg-[#0F0B1E] p-4 rounded-xl border border-green-500/30 text-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-green-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>{t('payment.orderCreated')}</span>
              </div>
              <p><span className="text-[#D8C7A5]/60">{t('payment.orderId')}:</span> <code className="text-[#F7DF94] font-mono">{orderData.orderId}</code></p>
              <p><span className="text-[#D8C7A5]/60">{t('payment.totalPayable')}:</span> {formatCurrency(orderData.amount)} {orderData.currency}</p>
              <p><span className="text-[#D8C7A5]/60">{t('payment.merchantKey')}:</span> <code className="text-gray-300 font-mono text-[11px]">{orderData.keyId}</code></p>
            </div>

            <p className="text-xs text-[#D8C7A5]/80 leading-relaxed">
              {language === 'mr' ? 'टेस्ट पेमेंट पूर्ण करण्यासाठी व स्ट्रॅपी ५ बॅकएंडवर सुरक्षित स्वाक्षरी तपासण्यासाठी खाली क्लिक करा.' : 'Click below to complete the test payment transaction and verify the cryptographic signature with Strapi 5.'}
            </p>

            <button
              onClick={handleVerifySimulatedPayment}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-[#FDFBF7] font-semibold text-sm rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              {t('payment.authorizeTest')}
            </button>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#F7DF94]">{t('payment.verifying')}</p>
            <p className="text-xs text-[#D8C7A5]/60">{t('payment.verifyingDesc')}</p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-green-300">{t('payment.successTitle')}</h4>
            <p className="text-xs text-[#D8C7A5]">{t('payment.successDesc')}</p>
          </div>
        )}

        {/* Step 5: Failed */}
        {step === 'failed' && (
          <div className="py-4 space-y-3 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h4 className="font-serif text-base font-bold text-red-400">{t('payment.failedTitle')}</h4>
            <p className="text-xs text-red-300/80">{errorMsg}</p>
            <button
              onClick={() => setStep('init')}
              className="px-4 py-2 bg-[#25184B] border border-[#D4AF37]/30 text-xs rounded-lg hover:border-[#D4AF37] cursor-pointer"
            >
              {t('payment.tryAgain')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
