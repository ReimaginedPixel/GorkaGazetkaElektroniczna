import { describe, expect, it } from 'vitest';
import {
  getCurrentState,
  getLessonsForDate,
  hmToMinutes,
  parseHM,
  toISODate,
  weekdayKey,
  type ScheduleInput,
} from './schedule';
import type { FreePeriod, Holiday, ScheduleMap } from './types';

// ── Dane testowe ────────────────────────────────────────────────────────────
// 2026-06-01 to PONIEDZIAŁEK. Plan: L1 08:00–08:45, przerwa 10 min,
// L2 08:55–09:40, przerwa 15 min (DŁUGA), L3 09:55–10:40.
const MONDAY_SCHEDULE: ScheduleMap = {
  '1': [
    { nr: 1, start: '08:00', koniec: '08:45' },
    { nr: 2, start: '08:55', koniec: '09:40' },
    { nr: 3, start: '09:55', koniec: '10:40' },
  ],
};

const INPUT: ScheduleInput = {
  schedule: MONDAY_SCHEDULE,
  longBreakMinutes: 15,
  lessonNames: { '1': { '1': 'Matematyka' } },
};

const NO_HOLIDAYS: Holiday[] = [];

/** Wygodny konstruktor czasu lokalnego (miesiąc 1–12). */
function at(y: number, mo: number, d: number, h: number, mi: number, s = 0): Date {
  return new Date(y, mo - 1, d, h, mi, s, 0);
}

describe('pomocnicze', () => {
  it('parseHM akceptuje poprawne i odrzuca błędne', () => {
    expect(parseHM('07:30')).toEqual({ h: 7, m: 30 });
    expect(parseHM('7:05')).toEqual({ h: 7, m: 5 });
    expect(parseHM('24:00')).toBeNull();
    expect(parseHM('10:60')).toBeNull();
    expect(parseHM('abc')).toBeNull();
  });

  it('hmToMinutes liczy minuty od północy', () => {
    expect(hmToMinutes('00:00')).toBe(0);
    expect(hmToMinutes('07:30')).toBe(450);
    expect(hmToMinutes('15:40')).toBe(940);
  });

  it('weekdayKey mapuje niedzielę na 7 a sobotę na 6', () => {
    expect(weekdayKey(at(2026, 6, 1, 12, 0))).toBe('1'); // poniedziałek
    expect(weekdayKey(at(2026, 6, 6, 12, 0))).toBe('6'); // sobota
    expect(weekdayKey(at(2026, 6, 7, 12, 0))).toBe('7'); // niedziela
  });

  it('toISODate zwraca lokalną datę', () => {
    expect(toISODate(at(2026, 6, 1, 23, 59))).toBe('2026-06-01');
  });

  it('getLessonsForDate sortuje i odrzuca błędne wpisy', () => {
    const messy: ScheduleMap = {
      '1': [
        { nr: 2, start: '08:55', koniec: '09:40' },
        { nr: 1, start: '08:00', koniec: '08:45' },
        { nr: 9, start: 'zła', koniec: '15:40' },
      ],
    };
    const lessons = getLessonsForDate(at(2026, 6, 1, 9, 0), messy);
    expect(lessons.map((l) => l.nr)).toEqual([1, 2]);
  });
});

describe('Stan 1: LEKCJA TRWA', () => {
  it('w środku lekcji zwraca lesson z gigantycznym timerem do końca', () => {
    const s = getCurrentState(at(2026, 6, 1, 8, 20), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('lesson');
    expect(s.current?.nr).toBe(1);
    expect(s.current?.name).toBe('Matematyka');
    expect(s.msUntilEnd).toBe(25 * 60 * 1000); // 08:20 -> 08:45
    expect(s.next?.nr).toBe(2);
    expect(s.progress).toBeGreaterThan(0);
    expect(s.progress).toBeLessThan(1);
  });

  it('lekcja bez nazwy w planie -> name === null', () => {
    const s = getCurrentState(at(2026, 6, 1, 9, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('lesson');
    expect(s.current?.nr).toBe(2);
    expect(s.current?.name).toBeNull();
  });
});

describe('Stan 2: PRZERWA ZWYKŁA (10 min)', () => {
  it('między lekcjami zwraca break z czasem do następnej lekcji', () => {
    const s = getCurrentState(at(2026, 6, 1, 8, 50), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('break');
    expect(s.previous?.nr).toBe(1);
    expect(s.next?.nr).toBe(2);
    expect(s.breakMinutes).toBe(10);
    expect(s.msUntilNextStart).toBe(5 * 60 * 1000); // 08:50 -> 08:55
  });
});

describe('Stan 3: DŁUGA PRZERWA (>= longBreakMinutes)', () => {
  it('15-minutowa luka klasyfikowana jako longBreak', () => {
    const s = getCurrentState(at(2026, 6, 1, 9, 45), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('longBreak');
    expect(s.previous?.nr).toBe(2);
    expect(s.next?.nr).toBe(3);
    expect(s.breakMinutes).toBe(15);
  });

  it('duża luka w środku dnia też jest długą przerwą', () => {
    const gappy: ScheduleInput = {
      schedule: {
        '1': [
          { nr: 1, start: '08:00', koniec: '08:45' },
          { nr: 2, start: '09:30', koniec: '10:15' }, // 45-min luka
        ],
      },
      longBreakMinutes: 15,
    };
    const s = getCurrentState(at(2026, 6, 1, 9, 0), gappy, NO_HOLIDAYS);
    expect(s.status).toBe('longBreak');
    expect(s.breakMinutes).toBe(45);
  });
});

describe('Stan 4: PRZED 1. LEKCJĄ', () => {
  it('przed startem zwraca beforeSchool z czasem do 1. lekcji', () => {
    const s = getCurrentState(at(2026, 6, 1, 7, 30), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('beforeSchool');
    expect(s.next?.nr).toBe(1);
    expect(s.msUntilNextStart).toBe(30 * 60 * 1000); // 07:30 -> 08:00
  });
});

describe('Stan 5: PO LEKCJACH', () => {
  it('po ostatniej lekcji zwraca afterSchool', () => {
    const s = getCurrentState(at(2026, 6, 1, 11, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('afterSchool');
    expect(s.previous?.nr).toBe(3);
  });
});

describe('Stan 6: WEEKEND / ŚWIĘTO / DZIEŃ WOLNY', () => {
  it('sobota -> dayOff (weekend)', () => {
    const s = getCurrentState(at(2026, 6, 6, 10, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('dayOff');
    expect(s.dayOffReason).toBe('weekend');
  });

  it('niedziela -> dayOff (weekend)', () => {
    const s = getCurrentState(at(2026, 6, 7, 10, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('dayOff');
    expect(s.dayOffReason).toBe('weekend');
  });

  it('święto ma priorytet nawet w dzień roboczy z lekcjami', () => {
    const holidays: Holiday[] = [{ date: '2026-06-01', name: 'Boże Ciało' }];
    const s = getCurrentState(at(2026, 6, 1, 9, 0), INPUT, holidays);
    expect(s.status).toBe('dayOff');
    expect(s.dayOffReason).toBe('Boże Ciało');
    expect(s.label).toBe('Boże Ciało');
  });

  it('okres wolny (ferie) obejmujący dzisiejszą datę -> dayOff', () => {
    const periods: FreePeriod[] = [{ name: 'Ferie zimowe', from: '2026-05-25', to: '2026-06-05' }];
    const s = getCurrentState(at(2026, 6, 1, 9, 0), INPUT, NO_HOLIDAYS, periods);
    expect(s.status).toBe('dayOff');
    expect(s.dayOffReason).toBe('Ferie zimowe');
    expect(s.label).toBe('Ferie zimowe');
  });

  it('dzień po końcu okresu wolnego -> normalne lekcje', () => {
    const periods: FreePeriod[] = [{ name: 'Ferie zimowe', from: '2026-05-25', to: '2026-05-31' }];
    const s = getCurrentState(at(2026, 6, 1, 9, 0), INPUT, NO_HOLIDAYS, periods);
    expect(s.status).toBe('lesson');
  });
});

describe('Edge case: północ', () => {
  it('o północy w dzień roboczy jest beforeSchool', () => {
    const s = getCurrentState(at(2026, 6, 1, 0, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('beforeSchool');
    expect(s.next?.nr).toBe(1);
  });

  it('o północy w weekend jest dayOff', () => {
    const s = getCurrentState(at(2026, 6, 6, 0, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('dayOff');
    expect(s.dayOffReason).toBe('weekend');
  });
});

describe('Edge case: dzień bez lekcji', () => {
  it('dzień roboczy bez wpisów w planie -> dayOff (no-lessons)', () => {
    // wtorek 2026-06-02; w planie jest tylko klucz '1'
    const s = getCurrentState(at(2026, 6, 2, 10, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('dayOff');
    expect(s.dayOffReason).toBe('no-lessons');
  });
});

describe('Edge case: lekcja do 15:40 (L9)', () => {
  const late: ScheduleInput = {
    schedule: {
      '1': [
        { nr: 8, start: '14:00', koniec: '14:45' },
        { nr: 9, start: '14:55', koniec: '15:40' },
      ],
    },
    longBreakMinutes: 15,
  };

  it('w trakcie L9 trwa lekcja', () => {
    const s = getCurrentState(at(2026, 6, 1, 15, 30), late, NO_HOLIDAYS);
    expect(s.status).toBe('lesson');
    expect(s.current?.nr).toBe(9);
    expect(s.msUntilEnd).toBe(10 * 60 * 1000); // 15:30 -> 15:40
  });

  it('po 15:40 jest afterSchool', () => {
    const s = getCurrentState(at(2026, 6, 1, 15, 45), late, NO_HOLIDAYS);
    expect(s.status).toBe('afterSchool');
    expect(s.previous?.nr).toBe(9);
  });
});

describe('Edge case: czas DOKŁADNIE na dzwonku', () => {
  it('dokładnie na starcie lekcji -> lekcja trwa (start włącznie)', () => {
    const s = getCurrentState(at(2026, 6, 1, 8, 0, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('lesson');
    expect(s.current?.nr).toBe(1);
    expect(s.msUntilEnd).toBe(45 * 60 * 1000);
    expect(s.progress).toBe(0);
  });

  it('dokładnie na końcu lekcji (nie ostatniej) -> zaczyna się przerwa', () => {
    const s = getCurrentState(at(2026, 6, 1, 8, 45, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('break');
    expect(s.previous?.nr).toBe(1);
    expect(s.next?.nr).toBe(2);
    expect(s.progress).toBe(0);
  });

  it('dokładnie na starcie kolejnej lekcji (koniec przerwy) -> lekcja', () => {
    const s = getCurrentState(at(2026, 6, 1, 8, 55, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('lesson');
    expect(s.current?.nr).toBe(2);
  });

  it('dokładnie na końcu ostatniej lekcji -> afterSchool', () => {
    const s = getCurrentState(at(2026, 6, 1, 10, 40, 0), INPUT, NO_HOLIDAYS);
    expect(s.status).toBe('afterSchool');
  });
});
