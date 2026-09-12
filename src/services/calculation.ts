import {
  ComputedValues,
  FormState,
  SectionKey,
  SECTIONS,
  SectionValues,
} from '../types';

export function makeEmpty(): FormState {
  const sections = {} as Record<SectionKey, SectionValues>;
  for (const s of SECTIONS) {
    sections[s] = {head: '', stich: ''};
  }
  return {designName: '', ratePerStitch: '', sections};
}

export function normalizeFormState(raw: any): FormState {
  const empty = makeEmpty();
  if (!raw) {
    return empty;
  }
  const sections = empty.sections;
  if (raw.sections) {
    for (const s of SECTIONS) {
      if (raw.sections[s]) {
        sections[s] = {
          head: raw.sections[s].head || '',
          stich: raw.sections[s].stich || '',
        };
      }
    }
    // Backward-compatibility: map old 'less' -> 'c', 'scut' -> 'sct'
    if (raw.sections.less && !sections.c.head && !sections.c.stich) {
      sections.c = {
        head: raw.sections.less.head || '',
        stich: raw.sections.less.stich || '',
      };
    }
    if (raw.sections.scut && !sections.sct.head && !sections.sct.stich) {
      sections.sct = {
        head: raw.sections.scut.head || '',
        stich: raw.sections.scut.stich || '',
      };
    }
  }
  return {
    designName: raw.designName || '',
    ratePerStitch: raw.ratePerStitch || '',
    sections,
  };
}

export function compute(form: FormState): ComputedValues {
  const rps = parseFloat(form.ratePerStitch) || 0;
  const totalStich = {} as Record<SectionKey, number>;
  const rate = {} as Record<SectionKey, number>;
  let sareesStitch = 0;
  let sareesRate = 0;

  for (const s of SECTIONS) {
    const sec = form.sections[s] || {head: '', stich: ''};
    const h = parseFloat(sec.head) || 0;
    const st = parseFloat(sec.stich) || 0;
    const ts = h * st;
    const r = ((h * st) / 1000) * rps;
    totalStich[s] = ts;
    rate[s] = r;
    sareesStitch += ts;
    sareesRate += r;
  }

  return {totalStich, rate, sareesStitch, sareesRate};
}

export function fmt(n: number, d = 2): string {
  return n === 0 ? (d === 0 ? '0' : '0.00') : n.toFixed(d);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
