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
  const hasGoogleCreds = hasGoogleClientId && hasGoogleClientSecret;

  const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
  const frontendUrl = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')[0].trim()
    : 'http://localhost:3001';
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `${frontendUrl}/connect/google/redirect`;

  // Safe startup diagnostics (never prints secret credentials)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 [JyotishVeda Startup Diagnostics: Google OAuth]');
  console.log(`   • GOOGLE_CLIENT_ID:     ${hasGoogleClientId ? `Configured (Prefix: ${googleClientId.trim().substring(0, 10)}... | Length: ${googleClientId.trim().length})` : 'MISSING (GOOGLE_CLIENT_ID is unset in environment)'}`);
  console.log(`   • GOOGLE_CLIENT_SECRET: ${hasGoogleClientSecret ? `Configured (Length: ${googleClientSecret.trim().length} chars | Secret Hidden)` : 'MISSING (GOOGLE_CLIENT_SECRET is unset in environment)'}`);
  console.log(`   • Google Provider:      ${hasGoogleCreds ? '✅ ENABLED (Ready for OAuth sign-in)' : '⚠️ DISABLED (Set GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET in Render environment)'}`);
  console.log(`   • Backend Callback URL: https://jyotishveda-backend-0epp.onrender.com/api/connect/google/callback`);
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
