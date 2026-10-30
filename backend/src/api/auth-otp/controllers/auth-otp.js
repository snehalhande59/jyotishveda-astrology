'use strict';

const crypto = require('crypto');
const notificationService = require('../../../services/notification-service');

// In-memory OTP storage with TTL & rate-limiting guards
// Structure: { [identifier]: { code, expiresAt, attempts, createdAt } }
const otpStore = new Map();
const requestRateLimits = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 request per 60 seconds per target

module.exports = {
  /**
   * Request OTP delivery via Email or SMS
   * POST /api/auth-otp/send
   * Body: { type: 'email' | 'sms', target: string, name?: string }
   */
  async sendOtp(ctx) {
    const { type, target, name } = ctx.request.body || {};

    if (!type || !['email', 'sms'].includes(type) || !target) {
      return ctx.badRequest('Valid type ("email" or "sms") and target (email address or phone number) are required.');
    }

    const cleanTarget = target.trim().toLowerCase();
    const now = Date.now();

    // 1. Rate-limiting guard: prevent spamming OTP requests
    const lastRequestTime = requestRateLimits.get(cleanTarget);
    if (lastRequestTime && now - lastRequestTime < RATE_LIMIT_WINDOW_MS) {
      const waitSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequestTime)) / 1000);
      return ctx.badRequest(`Please wait ${waitSec} seconds before requesting a new verification code.`);
    }

    // 2. Generate cryptographically strong 6-digit numeric OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // 3. Save OTP in store
    otpStore.set(cleanTarget, {
      code: otpCode,
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      createdAt: now,
      type,
    });
    requestRateLimits.set(cleanTarget, now);

    // 4. Dispatch via NotificationService
    let dispatchResult;
    if (type === 'email') {
      dispatchResult = await notificationService.sendOtpEmail({
        to: cleanTarget,
        otp: otpCode,
      });
    } else {
      dispatchResult = await notificationService.sendOtpSMS({
        to: cleanTarget,
        otp: otpCode,
      });
    }

    return ctx.send({
      success: true,
      message: `Verification code sent to ${cleanTarget}`,
      type,
      deliveryStatus: dispatchResult.success ? 'dispatched' : (dispatchResult.configured === false ? 'simulated_pending_credentials' : 'failed'),
      expiresInSeconds: 600,
    });
  },

  /**
   * Verify submitted OTP
   * POST /api/auth-otp/verify
   * Body: { target: string, code: string }
   */
  async verifyOtp(ctx) {
    const { target, code } = ctx.request.body || {};

    if (!target || !code) {
      return ctx.badRequest('Target and verification code are required.');
    }

    const cleanTarget = target.trim().toLowerCase();
    const entry = otpStore.get(cleanTarget);

    if (!entry) {
      return ctx.badRequest('No active verification code found for this destination. Please request a new code.');
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(cleanTarget);
      return ctx.badRequest('Verification code has expired. Please request a new code.');
    }

    if (entry.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(cleanTarget);
      return ctx.badRequest('Too many failed verification attempts. Please request a new code.');
    }

    if (entry.code !== code.trim()) {
      entry.attempts += 1;
      const remaining = MAX_ATTEMPTS - entry.attempts;
      return ctx.badRequest(`Invalid verification code. ${remaining} attempt(s) remaining.`);
    }

    // OTP verified successfully -> clear OTP to prevent replay attacks
    otpStore.delete(cleanTarget);

    // If target is an email, find or prepare user account
    let user = null;
    let jwt = null;

    try {
      if (entry.type === 'email') {
        user = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { email: cleanTarget },
        });

        if (user) {
          jwt = strapi.service('plugin::users-permissions.jwt').issue({ id: user.id });
        }
      }
    } catch (e) {
      console.warn('User query notice during OTP verify:', e.message);
    }

    return ctx.send({
      success: true,
      verified: true,
      message: 'Verification successful',
      target: cleanTarget,
      userExists: Boolean(user),
      jwt,
      user: user
        ? {
            id: user.id,
            username: user.username,
            email: user.email,
          }
        : null,
    });
  },
};
