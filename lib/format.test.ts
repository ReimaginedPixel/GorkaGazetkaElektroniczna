import { describe, expect, it } from 'vitest';
import { daysBetween, formatCountdown, minutesCeil, pluralPl, splitDuration } from './format';

describe('formatCountdown', () => {
  it('poniżej godziny -> MM:SS', () => {
    expect(formatCountdown(0)).toBe('00:00');
    expect(formatCountdown(5_000)).toBe('00:05');
    expect(formatCountdown(25 * 60 * 1000)).toBe('25:00');
    expect(formatCountdown(12 * 60 * 1000 + 34 * 1000)).toBe('12:34');
  });

  it('od godziny w górę -> H:MM:SS', () => {
    expect(formatCountdown(60 * 60 * 1000)).toBe('1:00:00');
    expect(formatCountdown(2 * 3600_000 + 5 * 60_000 + 9 * 1000)).toBe('2:05:09');
  });

  it('wartości ujemne traktuje jak zero', () => {
    expect(formatCountdown(-5000)).toBe('00:00');
  });
});

describe('splitDuration', () => {
  it('rozbija ms na h/m/s', () => {
    expect(splitDuration(3661_000)).toEqual({ h: 1, m: 1, s: 1, totalSeconds: 3661 });
  });
});

describe('minutesCeil', () => {
  it('zaokrągla minuty w górę', () => {
    expect(minutesCeil(0)).toBe(0);
    expect(minutesCeil(1)).toBe(1);
    expect(minutesCeil(60_000)).toBe(1);
    expect(minutesCeil(61_000)).toBe(2);
  });
});

describe('pluralPl', () => {
  it('dobiera polskie formy', () => {
    expect(pluralPl(1, 'dzień', 'dni', 'dni')).toBe('dzień');
    expect(pluralPl(2, 'minuta', 'minuty', 'minut')).toBe('minuty');
    expect(pluralPl(5, 'minuta', 'minuty', 'minut')).toBe('minut');
    expect(pluralPl(22, 'minuta', 'minuty', 'minut')).toBe('minuty');
    expect(pluralPl(12, 'minuta', 'minuty', 'minut')).toBe('minut');
  });
});

describe('daysBetween', () => {
  it('liczy pełne dni kalendarzowe', () => {
    expect(daysBetween(new Date(2026, 5, 1), new Date(2026, 5, 26))).toBe(25);
    expect(daysBetween(new Date(2026, 5, 1, 23), new Date(2026, 5, 2, 1))).toBe(1);
  });
});
