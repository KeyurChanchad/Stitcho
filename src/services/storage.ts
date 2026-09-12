import {HistoryEntry, UserProfile} from '../types';
import {compute, normalizeFormState} from './calculation';

// ─── Local Storage shim ───────────────────────────────────────────────────────
declare const global: {__stitchoStore?: string};

function readStore(): Record<string, string> {
  try {
    if (global.__stitchoStore) {
      return JSON.parse(global.__stitchoStore);
    }
  } catch {}
  return {};
}

function writeStore(data: Record<string, string>) {
  global.__stitchoStore = JSON.stringify(data);
}

export const Storage = {
  getItem: (key: string): string | null => readStore()[key] ?? null,
  setItem: (key: string, value: string) => {
    const s = readStore();
    s[key] = value;
    writeStore(s);
  },
  removeItem: (key: string) => {
    const s = readStore();
    delete s[key];
    writeStore(s);
  },
};

// ─── User Profile Storage ─────────────────────────────────────────────────────
const USER_PROFILE_KEY = 'stitcho_user_profile';

export function loadUserProfile(): UserProfile | null {
  try {
    const r = Storage.getItem(USER_PROFILE_KEY);
    if (r) {
      return JSON.parse(r);
    }
  } catch {}
  return null;
}

export function persistUserProfile(user: UserProfile | null) {
  if (user) {
    Storage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
  } else {
    Storage.removeItem(USER_PROFILE_KEY);
  }
}

// ─── History Storage ──────────────────────────────────────────────────────────
const HISTORY_KEY = 'stitcho_history';

export function loadHistory(): HistoryEntry[] {
  try {
    const r = Storage.getItem(HISTORY_KEY);
    if (r) {
      const list = JSON.parse(r);
      return list.map((item: any) => {
        const form = normalizeFormState(item.form);
        return {
          ...item,
          form,
          computed: compute(form),
        };
      });
    }
  } catch {}
  return [];
}

export function persistHistory(entries: HistoryEntry[]) {
  Storage.setItem(HISTORY_KEY, JSON.stringify(entries));
}
