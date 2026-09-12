/**
 * Centralized Environment Configuration
 * Values are loaded from .env at build time via Babel.
 */

export const ENV = {
  GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID || '',
  GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID || '',
  GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
  
  // AdMob
  ADMOB_ANDROID_APP_ID: process.env.ADMOB_ANDROID_APP_ID || '',
  ADMOB_IOS_APP_ID: process.env.ADMOB_IOS_APP_ID || '',
  ADMOB_BANNER_ANDROID: process.env.ADMOB_BANNER_ANDROID || '',
  ADMOB_BANNER_IOS: process.env.ADMOB_BANNER_IOS || '',
  ADMOB_INTERSTITIAL_ANDROID: process.env.ADMOB_INTERSTITIAL_ANDROID || '',
  ADMOB_INTERSTITIAL_IOS: process.env.ADMOB_INTERSTITIAL_IOS || '',
};

export default ENV;
