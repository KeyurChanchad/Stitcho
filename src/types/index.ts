export type SectionKey = 'c' | 'pallu' | 'sct' | 'blouse';

export const SECTIONS: SectionKey[] = ['c', 'pallu', 'sct', 'blouse'];

export const SECTION_LABELS: Record<SectionKey, string> = {
  c: 'C',
  pallu: 'Pallu',
  sct: 'Sct',
  blouse: 'Blouse',
};

export interface SectionValues {
  head: string;
  stich: string;
}

export interface FormState {
  designName: string;
  ratePerStitch: string;
  sections: Record<SectionKey, SectionValues>;
}

export interface ComputedValues {
  totalStich: Record<SectionKey, number>;
  rate: Record<SectionKey, number>;
  sareesStitch: number;
  sareesRate: number;
}

export interface HistoryEntry {
  id: string;
  savedAt: string;
  form: FormState;
  computed: ComputedValues;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName?: string | null;
  givenName?: string | null;
  idToken?: string | null;
}
