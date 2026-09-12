import {Alert, Linking, Platform} from 'react-native';

export const APP_PACKAGE_NAME = 'com.apexinfocom.stitcho';
export const CURRENT_APP_VERSION = '1.0.0';

export interface UpdateInfo {
  updateAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  storeUrl: string;
  releaseNotes?: string;
}

/**
 * Compares two SemVer strings (e.g. '1.0.1' and '1.0.0').
 * Returns:
 *   1 if v1 > v2 (newer)
 *  -1 if v1 < v2 (older)
 *   0 if equal
 */
export function compareVersions(v1: string, v2: string): number {
  const parse = (v: string) =>
    (v || '')
      .replace(/[^0-9.]/g, '')
      .split('.')
      .map(part => parseInt(part, 10) || 0);

  const a = parse(v1);
  const b = parse(v2);
  const len = Math.max(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const num1 = a[i] || 0;
    const num2 = b[i] || 0;
    if (num1 > num2) {
      return 1;
    }
    if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

/**
 * Checks iOS App Store via Apple's official iTunes Lookup API.
 */
export async function checkIOSUpdate(): Promise<UpdateInfo | null> {
  const defaultStoreUrl = `https://apps.apple.com/app/id${APP_PACKAGE_NAME}`;
  try {
    const url = `https://itunes.apple.com/lookup?bundleId=${APP_PACKAGE_NAME}&t=${Date.now()}`;
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      const appData = data.results[0];
      const latestVersion = appData.version;
      const trackId = appData.trackId;
      const storeUrl = trackId
        ? `itms-apps://apps.apple.com/app/id${trackId}`
        : appData.trackViewUrl || defaultStoreUrl;

      const hasUpdate = compareVersions(latestVersion, CURRENT_APP_VERSION) > 0;
      return {
        updateAvailable: hasUpdate,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion,
        storeUrl,
        releaseNotes: appData.releaseNotes,
      };
    }
  } catch (error) {
    console.log('[UpdateService] iOS update check:', error);
  }
  return null;
}

/**
 * Checks Google Play Store for newer published version.
 */
export async function checkAndroidUpdate(): Promise<UpdateInfo | null> {
  const storeUrl = `market://details?id=${APP_PACKAGE_NAME}`;
  const webStoreUrl = `https://play.google.com/store/apps/details?id=${APP_PACKAGE_NAME}`;

  try {
    const response = await fetch(`${webStoreUrl}&hl=en&gl=US`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Cache-Control': 'no-cache',
      },
    });

    if (response.ok) {
      const html = await response.text();
      // Google Play page contains versions in JSON or HTML markup
      const match =
        html.match(/\[\[\["([0-9]+\.[0-9]+(?:\.[0-9]+)?)"\]\]/) ||
        html.match(/\[\["([0-9]+\.[0-9]+(?:\.[0-9]+)?)"\]\]/) ||
        html.match(/itemprop="softwareVersion">([^<]+)</);

      if (match && match[1]) {
        const latestVersion = match[1].trim();
        const hasUpdate =
          compareVersions(latestVersion, CURRENT_APP_VERSION) > 0;
        return {
          updateAvailable: hasUpdate,
          currentVersion: CURRENT_APP_VERSION,
          latestVersion,
          storeUrl,
        };
      }
    }
  } catch (error) {
    console.log('[UpdateService] Android update check:', error);
  }

  return {
    updateAvailable: false,
    currentVersion: CURRENT_APP_VERSION,
    latestVersion: CURRENT_APP_VERSION,
    storeUrl,
  };
}

/**
 * Main update checker function supporting iOS and Android.
 */
export async function checkForUpdate(): Promise<UpdateInfo | null> {
  try {
    if (Platform.OS === 'ios') {
      return await checkIOSUpdate();
    }
    if (Platform.OS === 'android') {
      return await checkAndroidUpdate();
    }
  } catch (err) {
    console.log('[UpdateService] Failed to check for update:', err);
  }
  return null;
}

/**
 * Opens the platform app store to update the application.
 */
export async function openAppStore(storeUrl?: string): Promise<void> {
  const fallbackUrl =
    Platform.OS === 'ios'
      ? `https://apps.apple.com/app/id${APP_PACKAGE_NAME}`
      : `https://play.google.com/store/apps/details?id=${APP_PACKAGE_NAME}`;

  const target = storeUrl || fallbackUrl;

  try {
    const supported = await Linking.canOpenURL(target);
    if (supported) {
      await Linking.openURL(target);
    } else {
      await Linking.openURL(fallbackUrl);
    }
  } catch {
    try {
      await Linking.openURL(fallbackUrl);
    } catch {
      Alert.alert(
        'Unable to open store',
        `Please open ${
          Platform.OS === 'ios' ? 'App Store' : 'Play Store'
        } and search for "Stitcho".`,
      );
    }
  }
}
