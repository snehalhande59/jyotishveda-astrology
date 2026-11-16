'use strict';

/**
 * Dedicated Google OAuth Bootstrap Synchronizer for Strapi 5.6.0 Users & Permissions Plugin.
 *
 * In Strapi 5, OAuth provider configs are stored exclusively in the database store
 * (plugin: users-permissions, key: grant). This module checks for environment variables
 * on backend boot and ensures the Google provider is active in the database store.
 */
module.exports = async function syncGoogleOAuth({ strapi }) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const hasGoogleClientId = Boolean(googleClientId && googleClientId.trim());
  const hasGoogleClientSecret = Boolean(googleClientSecret && googleClientSecret.trim());
  const isDummyGoogleCreds =
    !hasGoogleClientId ||
    googleClientId.includes('your_clien') ||
    googleClientId.includes('placeholder') ||
    googleClientId.includes('xxxx');
  const hasGoogleCreds = hasGoogleClientId && hasGoogleClientSecret && !isDummyGoogleCreds;

  const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
  const backendUrl = (process.env.PUBLIC_URL || 'https://jyotishveda-strapi-8f1717-150-136-44-53.sslip.io').replace(/\/+$/, '');
  const defaultFrontend = process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || 'https://jyotishveda-frontend-0o9pvi-4004bd-150-136-66-155.sslip.io')
    : 'http://localhost:3000';
  const frontendUrl = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')[0].trim()
    : defaultFrontend;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `${frontendUrl}/connect/google/redirect`;

  // Safe startup diagnostics (never prints secret credentials)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 [JyotishVeda Startup Diagnostics: Google OAuth]');
  console.log(`   • GOOGLE_CLIENT_ID:     ${hasGoogleClientId ? (isDummyGoogleCreds ? '⚠️ PLACEHOLDER (your_client_id... must be replaced with real Google Cloud Console Client ID)' : `Configured (...${googleClientId.trim().slice(-20)})`) : 'MISSING'}`);
  console.log(`   • GOOGLE_CLIENT_SECRET: ${hasGoogleClientSecret ? 'Configured (Secret Hidden)' : 'MISSING'}`);
  console.log(`   • Google Provider:      ${hasGoogleCreds ? '✅ ENABLED (Ready for OAuth sign-in)' : '⚠️ DISABLED (Valid Google Client ID needed from Google Cloud Console)'}`);
  console.log(`   • Backend Callback URL: ${backendUrl}/api/connect/google/callback`);
  console.log(`   • Frontend Redirect:    ${callbackUrl}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (hasGoogleCreds) {
    try {
      const grantSettings = (await pluginStore.get({ key: 'grant' })) || {};
      const currentGoogle = grantSettings.google || {};

      grantSettings.google = {
        ...currentGoogle,
        enabled: true,
        icon: 'google',
        key: googleClientId.trim(),
        secret: googleClientSecret.trim(),
        callback: callbackUrl,
        callbackUrl: callbackUrl,
        scope: ['email', 'profile'],
      };

      await pluginStore.set({ key: 'grant', value: grantSettings });
      console.log('✅ [Google OAuth] Successfully synchronized Google provider in Strapi core_store (enabled: true).');
    } catch (oauthErr) {
      console.error('❌ [Google OAuth] Error synchronizing Google provider in store:', oauthErr.message);
    }
  }
};
