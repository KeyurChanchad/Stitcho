import AsyncStorage from '@react-native-async-storage/async-storage';
import {HistoryEntry} from '../types';
import {compute, normalizeFormState} from './calculation';

export const Storage = AsyncStorage;

// ─── History Storage ──────────────────────────────────────────────────────────
const HISTORY_KEY = 'stitcho_history';

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const r = await AsyncStorage.getItem(HISTORY_KEY);
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
  } catch (error) {
    console.error('Error loading history from storage:', error);
  }
  return [];
}

export async function persistHistory(entries: HistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error persisting history to storage:', error);
  }
}
