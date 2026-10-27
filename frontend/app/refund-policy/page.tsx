import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HelpCircle, ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#D4AF37] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-4 border-b border-[#D4AF37]/20 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Customer Protection & Fair Practice</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#F7DF94] via-[#D4AF37] to-[#E5C058] bg-clip-text text-transparent">
            Refund and Cancellation Policy
          </h1>
          <p className="text-xs text-[#D8C7A5]/70">
            Last updated: October 2026 • JyotishVeda Platform
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#D8C7A5]/90 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#FDFBF7]">
              1. Digital Astrology Reports
            </h2>
            <p>
              Automated astrological reports (such as Detailed Kundli, Career Reports, Marriage Reports, and Finance Reports) are digitally generated immediately upon confirmed payment verification through our astronomical calculation engine.
            </p>
            <p>
              Due to the immediate digital fulfillment and computational generation of these personalized assets, <strong>once a report has been successfully generated or viewed, it is generally non-refundable</strong>. However, if a technical failure prevents the delivery or calculation of your purchased report, please contact support within 7 days for full remediation or refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#FDFBF7]">
              2. Astrologer Consultations & Cancellations
            </h2>
            <p>
              We honor the valuable time of our senior Vedic scholars and our clients alike. For one-on-one live video or phone consultations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>
                <strong>Cancellations with &gt; 24 Hours Notice:</strong> Eligible for a 100% full refund or free rescheduling to any available future slot.
              </li>
              <li>
                <strong>Cancellations within 24 Hours of Appointment:</strong> Eligible for a 50% refund or a one-time rescheduling courtesy.
              </li>
              <li>
                <strong>No-Shows without Prior Notice:</strong> Non-refundable once the appointed time has passed, as the astrologer reserved that exclusive hour for your chart.
              </li>
              <li>
                <strong>Scholar Unavailability:</strong> In the rare event that an astrologer is unable to attend due to unforeseen emergency, the client will receive an immediate option of a full 100% refund or priority rescheduling with a senior scholar.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#FDFBF7]">
              3. Refund Processing Timeline
            </h2>
            <p>
              Approved refunds are processed via our payment gateway (Razorpay) back to the original method of payment (UPI, Credit/Debit Card, or NetBanking). Standard banking clearance times typically take between <strong>5 to 7 business days</strong> to reflect in your bank account statement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#FDFBF7]">
              4. Contacting Support for Refund Requests
            </h2>
            <p>
              To initiate a cancellation or request assistance with a purchase, please email us directly with your Order ID or Booking Number:
            </p>
            <div className="bg-[#191233] border border-[#D4AF37]/30 rounded-xl p-4 text-xs space-y-1">
              <div>Email: <strong className="text-[#FDFBF7]">support@jyotishveda.com</strong></div>
              <div>Support Desk: <strong className="text-[#FDFBF7]">+91 (0) 11 4987 6543</strong></div>
              <div>Hours: Monday to Saturday, 9:00 AM – 7:00 PM IST</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
