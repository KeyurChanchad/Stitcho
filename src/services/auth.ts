import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isCancelledResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { UserProfile } from '../types';
import { ENV } from '../config/env';

export const GOOGLE_WEB_CLIENT_ID = ENV.GOOGLE_WEB_CLIENT_ID;
export const GOOGLE_IOS_CLIENT_ID = ENV.GOOGLE_IOS_CLIENT_ID;

export function initGoogleSignIn(): void {
  GoogleSignin.configure({
    ...(GOOGLE_WEB_CLIENT_ID ? { webClientId: GOOGLE_WEB_CLIENT_ID } : {}),
    ...(GOOGLE_IOS_CLIENT_ID ? { iosClientId: GOOGLE_IOS_CLIENT_ID } : {}),
  });
}

export async function checkSilentSignIn(): Promise<UserProfile | null> {
  try {
    const res = await GoogleSignin.signInSilently();
    if (res.type === 'success' && res.data?.user) {
      const u = res.data.user;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        photo: u.photo,
        familyName: u.familyName,
        givenName: u.givenName,
        idToken: res.data.idToken,
      };
    }
  } catch (error) {
    console.log('GOOGLE SIGN IN ERROR:', error);
    if (isErrorWithCode(error)) {
      console.log('GOOGLE ERROR CODE:', error.code);
    }
  }
  return null;
}

export type SignInResult =
  | { type: 'success'; user: UserProfile }
  | { type: 'cancelled' }
  | { type: 'error'; message: string };

export async function signInWithGoogle(): Promise<SignInResult> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      const u = response.data.user;
      const user: UserProfile = {
        id: u.id,
        name: u.name,
        email: u.email,
        photo: u.photo,
        familyName: u.familyName,
        givenName: u.givenName,
        idToken: response.data.idToken,
      };
      return { type: 'success', user };
    }

    if (isCancelledResponse(response)) {
      return { type: 'cancelled' };
    }

    return { type: 'error', message: 'Failed to sign in with Google.' };
  } catch (error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          return { type: 'cancelled' };
        case statusCodes.IN_PROGRESS:
          return { type: 'error', message: 'Sign-in is already in progress.' };
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          return {
            type: 'error',
            message: 'Google Play Services is not available or outdated.',
          };
        default:
          return {
            type: 'error',
            message: error.message || 'Failed to sign in with Google.',
          };
      }
    }
    return {
      type: 'error',
      message: error?.message || 'Failed to sign in with Google.',
    };
  }
}

export async function signOutGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {}
}
