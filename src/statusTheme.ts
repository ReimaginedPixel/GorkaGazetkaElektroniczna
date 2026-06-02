import type { LessonStatus } from '@lib/schedule';

export interface StatusTheme {
  /** Akcent statusu (timer, ramka, etykiety). */
  accent: string;
  /** Krótka nazwa statusu PL. */
  name: string;
  /** Delikatny gradient tła pod treść. */
  glow: string;
}

// Kolor = STATUS, nie dekoracja.
export function statusTheme(status: LessonStatus): StatusTheme {
  switch (status) {
    case 'lesson':
      return { accent: '#22C55E', name: 'Lekcja', glow: 'rgba(34,197,94,0.16)' };
    case 'break':
      return { accent: '#F59E0B', name: 'Przerwa', glow: 'rgba(245,158,11,0.16)' };
    case 'longBreak':
      return { accent: '#A855F7', name: 'Długa przerwa', glow: 'rgba(168,85,247,0.18)' };
    case 'beforeSchool':
      return { accent: '#34D399', name: 'Przed lekcjami', glow: 'rgba(52,211,153,0.14)' };
    case 'afterSchool':
      return { accent: '#60A5FA', name: 'Po lekcjach', glow: 'rgba(96,165,250,0.14)' };
    case 'dayOff':
      return { accent: '#3B82F6', name: 'Dzień wolny', glow: 'rgba(59,130,246,0.16)' };
    default:
      return { accent: '#FFFFFF', name: '', glow: 'rgba(255,255,255,0.08)' };
  }
}
