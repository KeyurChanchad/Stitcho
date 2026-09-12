import { Platform } from 'react-native';
import mobileAds, { MaxAdContentRating, InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { ENV } from '../config/env';

// Ad Unit IDs (use env if available, else test IDs)
export const BANNER_UNIT_ID =
  Platform.OS === 'ios'
    ? ENV?.ADMOB_BANNER_IOS || TestIds.BANNER
    : ENV?.ADMOB_BANNER_ANDROID || TestIds.BANNER;

export const INTERSTITIAL_UNIT_ID =
  Platform.OS === 'ios'
    ? ENV?.ADMOB_INTERSTITIAL_IOS || TestIds.INTERSTITIAL
    : ENV?.ADMOB_INTERSTITIAL_ANDROID || TestIds.INTERSTITIAL;

let interstitialAd: InterstitialAd | null = null;
let saveCounter = 0;
const SAVES_BEFORE_AD = 3;

export async function initAds() {
  try {
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });
    
    const status = await mobileAds().initialize();
    console.log('Mobile Ads Initialized:', status);
    
    // Preload first interstitial
    loadInterstitial();
  } catch (error) {
    console.log('Ads init error', error);
  }
}

export function loadInterstitial() {
  if (interstitialAd) return; // Already loading/loaded

  const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  ad.addAdEventListener(AdEventType.LOADED, () => {
    interstitialAd = ad;
  });

  ad.addAdEventListener(AdEventType.CLOSED, () => {
    interstitialAd = null;
    loadInterstitial(); // Load next one
  });

  ad.addAdEventListener(AdEventType.ERROR, (error) => {
    console.log('Interstitial error:', error);
    interstitialAd = null;
  });

  ad.load();
}

export function showInterstitialIfNeeded() {
  saveCounter++;
  if (saveCounter >= SAVES_BEFORE_AD) {
    saveCounter = 0; // reset
    if (interstitialAd) {
      interstitialAd.show().catch(e => console.log('Show ad error', e));
      interstitialAd = null; // will be reloaded on close
      return true; // indicates ad was triggered
    }
  }
  return false;
}
