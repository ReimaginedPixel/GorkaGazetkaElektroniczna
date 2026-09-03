import type { LessonStatus } from '@lib/schedule';
import type { GGArtKey } from './gg/assets';
import type { GGTone } from './gg';

export interface StatusTheme {
  /** Akcent statusu (timer, ramka, etykiety) - paleta GórkaGuesser. */
  accent: string;
  /** Kolor tekstu na akcencie. */
  onAccent: string;
  /** Kolor twardego cienia pod olbrzymią liczbą / nagłówkiem. */
  shadow: string;
  /** Krótka nazwa statusu PL. */
  name: string;
  /** Delikatna poświata pod treść. */
  glow: string;
  /** Ton chipów/pasków. */
  tone: GGTone;
  /** Plama sprayu pod tło ekranu. */
  splotch: Extract<GGArtKey, `splotch${string}`>;
  /** Maskotka (blob) tego stanu. */
  blob: GGArtKey;
  /** Drobne wlepki na krawędziach. */
  trinkets: [GGArtKey, GGArtKey];
}

const DARK_INK = '#141118';

// Kolor = STATUS, nie dekoracja. Akcenty identyczne w obu schematach.
export function statusTheme(status: LessonStatus): StatusTheme {
  switch (status) {
    case 'lesson':
      return {
        accent: '#8fd41f',
        onAccent: DARK_INK,
        shadow: '#7b2ff2',
        name: 'Lekcja',
        glow: 'rgba(143,212,31,0.16)',
        tone: 'lime',
        splotch: 'splotchMint',
        blob: 'blobThinking',
        trinkets: ['star', 'sparkleStar'],
      };
    case 'break':
      return {
        accent: '#ffd02e',
        onAccent: DARK_INK,
        shadow: '#7b2ff2',
        name: 'Przerwa',
        glow: 'rgba(255,208,46,0.16)',
        tone: 'yellow',
        splotch: 'splotchGold',
        blob: 'blobLaughing',
        trinkets: ['smileyRed', 'cd'],
      };
    case 'longBreak':
      return {
        accent: '#7b2ff2',
        onAccent: '#ffffff',
        shadow: '#ff3d9a',
        name: 'Długa przerwa',
        glow: 'rgba(123,47,242,0.2)',
        tone: 'purple',
        splotch: 'splotchLavender',
        blob: 'blobCelebrate',
        trinkets: ['balloon', 'confetti'],
      };
    case 'beforeSchool':
      return {
        accent: '#22c9e0',
        onAccent: DARK_INK,
        shadow: '#7b2ff2',
        name: 'Przed lekcjami',
        glow: 'rgba(34,201,224,0.14)',
        tone: 'cyan',
        splotch: 'splotchBlue',
        blob: 'blobIdle',
        trinkets: ['sparkleStar', 'planetWhite'],
      };
    case 'afterSchool':
      return {
        accent: '#ff6b1a',
        onAccent: DARK_INK,
        shadow: '#7b2ff2',
        name: 'Po lekcjach',
        glow: 'rgba(255,107,26,0.14)',
        tone: 'orange',
        splotch: 'splotchMagenta',
        blob: 'blobSleeping',
        trinkets: ['planetBlack', 'sparkleWhite'],
      };
    case 'dayOff':
      return {
        accent: '#22c9e0',
        onAccent: DARK_INK,
        shadow: '#ff3d9a',
        name: 'Dzień wolny',
        glow: 'rgba(34,201,224,0.16)',
        tone: 'cyan',
        splotch: 'splotchBlue',
        blob: 'blobCool',
        trinkets: ['butterfly', 'pixelHeart'],
      };
    default:
      return {
        accent: '#f5edff',
        onAccent: DARK_INK,
        shadow: '#7b2ff2',
        name: '',
        glow: 'rgba(255,255,255,0.08)',
        tone: 'cream',
        splotch: 'splotchLavender',
        blob: 'blobIdle',
        trinkets: ['star', 'sparkleStar'],
      };
  }
}
