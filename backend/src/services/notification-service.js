'use strict';

const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.emailTransporter = null;
    this.initEmailTransporter();
  }

  initEmailTransporter() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_SMTP_PORT || '465', 10);
    const secure = process.env.EMAIL_SMTP_SECURE !== 'false';

    if (user && pass) {
      try {
        this.emailTransporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user,
            pass,
          },
        });
      } catch (err) {
        console.warn('[NotificationService] Email transporter initialization notice:', err.message);
      }
    }
  }

  // --- 1. EMAIL NOTIFICATION DISPATCH ---
  async sendEmail({ to, subject, html, text }) {
    if (!to) {
      return { success: false, message: 'Recipient email address missing' };
    }

    if (!this.emailTransporter) {
      this.initEmailTransporter();
    }

    if (!this.emailTransporter) {
      console.warn(`[NotificationService] EMAIL_USER or EMAIL_PASS not configured. Email suppressed for: ${to}`);
      return {
        success: false,
        configured: false,
        message: 'Email service credentials not configured. Please set EMAIL_USER and EMAIL_PASS.',
      };
    }

    try {
      const from = process.env.EMAIL_FROM || `JyotishVeda Astrology <${process.env.EMAIL_USER}>`;
      const info = await this.emailTransporter.sendMail({
        from,
        to,
        subject,
        text: text || html?.replace(/<[^>]*>/g, ''),
        html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err) {
      console.error('[NotificationService] Failed to send email via SMTP:', err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  // --- 2. TWILIO SMS DISPATCH ---
  async sendSMS({ to, message }) {
    if (!to || !message) {
      return { success: false, message: 'Recipient phone number and message text required' };
    }

    const accountSid = process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE || process.env.TWILIO_PHONE_NUMBER;
    const defaultCountryCode = process.env.DEFAULT_COUNTRY_CODE || '+91';

    let formattedPhone = to.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `${defaultCountryCode}${formattedPhone.replace(/^0+/, '')}`;
    }

    if (!accountSid || !authToken || !fromPhone) {
      console.warn(`[NotificationService] Twilio credentials not configured. SMS suppressed for: ${formattedPhone}`);
      return {
        success: false,
        configured: false,
        message: 'Twilio SMS credentials not configured. Please set TWILIO_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE.',
      };
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const params = new URLSearchParams();
      params.append('To', formattedPhone);
      params.append('From', fromPhone);
      params.append('Body', message);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Twilio error code: ${data.code}`);
      }

      return {
        success: true,
        sid: data.sid,
        status: data.status,
      };
    } catch (err) {
      console.error('[NotificationService] Failed to send SMS via Twilio:', err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  // --- 3. DOMAIN NOTIFICATION HELPERS ---

  async sendPaymentConfirmationEmail({ to, userName, orderId, paymentId, amount, serviceType }) {
    const subject = `Payment Confirmed – JyotishVeda Consultation #${orderId}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2D1810; background-color: #FFFDF9; border: 1px solid #EAE1D2; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #78350F; padding: 24px; text-align: center; color: #FFFBEB;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">ज्योतिषवेदा JyotishVeda</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #FDE68A;">Sacred Vedic Astrological Services</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="font-size: 18px; color: #92400E; margin-top: 0;">Payment Received & Verified</h2>
          <p>Namaste <strong>${userName || 'Valued Devotee'}</strong>,</p>
          <p>Your payment for <strong>${serviceType || 'Astrological Consultation'}</strong> has been securely received and confirmed.</p>
          <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${paymentId}</p>
            <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹${amount} INR</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #047857; font-weight: bold;">Captured & Confirmed</span></p>
          </div>
          <p style="font-size: 13px; color: #786C60; line-height: 1.5;">You can view your complete birth chart, bookings, and consultation history directly in your user dashboard.</p>
        </div>
        <div style="background-color: #FAF7F2; padding: 16px; text-align: center; font-size: 11px; color: #786C60; border-top: 1px solid #EAE1D2;">
          <p style="margin: 0;">© ${new Date().getFullYear()} JyotishVeda Platform. Grounded in authentic Parashari principles.</p>
        </div>
      </div>
    `;

    return this.sendEmail({ to, subject, html });
  }

  async sendBookingConfirmationEmail({ to, userName, bookingNumber, astrologerName, bookingDate, timeSlot, fee }) {
    const subject = `Consultation Booked – JyotishVeda #${bookingNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2D1810; background-color: #FFFDF9; border: 1px solid #EAE1D2; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #78350F; padding: 24px; text-align: center; color: #FFFBEB;">
          <h1 style="margin: 0; font-size: 24px;">ज्योतिषवेदा JyotishVeda</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #FDE68A;">Sacred Vedic Astrological Consultation</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="font-size: 18px; color: #92400E; margin-top: 0;">Your Consultation is Confirmed</h2>
          <p>Pranam <strong>${userName || 'Devotee'}</strong>,</p>
          <p>Your upcoming Vedic astrological consultation with <strong>${astrologerName || 'our Acharya'}</strong> has been scheduled.</p>
          <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Booking Number:</strong> ${bookingNumber}</p>
            <p style="margin: 4px 0;"><strong>Astrologer:</strong> ${astrologerName}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${bookingDate}</p>
            <p style="margin: 4px 0;"><strong>Time Slot:</strong> ${timeSlot}</p>
            <p style="margin: 4px 0;"><strong>Consultation Fee:</strong> ₹${fee}</p>
          </div>
          <p style="font-size: 13px; color: #786C60;">Please have your exact birth date, time, and birth city ready for maximum astrological accuracy during your reading.</p>
        </div>
        <div style="background-color: #FAF7F2; padding: 16px; text-align: center; font-size: 11px; color: #786C60; border-top: 1px solid #EAE1D2;">
          <p style="margin: 0;">© ${new Date().getFullYear()} JyotishVeda Platform.</p>
        </div>
      </div>
    `;

    return this.sendEmail({ to, subject, html });
  }

  async sendOtpEmail({ to, otp }) {
    const subject = `Your JyotishVeda Verification Code: ${otp}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; color: #2D1810; padding: 24px; border: 1px solid #EAE1D2; border-radius: 16px; background-color: #FFFDF9;">
        <h2 style="color: #78350F; margin-top: 0;">JyotishVeda Verification</h2>
        <p>Use the sacred one-time passcode below to verify your account or login:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #B45309; background: #FEF3C7; padding: 12px 24px; border-radius: 12px; border: 1px dashed #F59E0B;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #786C60;">This code is valid for 10 minutes. Never share this OTP with anyone.</p>
      </div>
    `;

    return this.sendEmail({ to, subject, html });
  }

  async sendOtpSMS({ to, otp }) {
    const message = `Your JyotishVeda verification OTP is: ${otp}. Valid for 10 minutes. Grounded in Vedic wisdom.`;
    return this.sendSMS({ to, message });
  }
}

module.exports = new NotificationService();
