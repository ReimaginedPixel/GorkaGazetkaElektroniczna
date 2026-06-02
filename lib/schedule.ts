// ─────────────────────────────────────────────────────────────────────────
// lib/schedule.ts — SERCE APLIKACJI.
//
// Wyznacza bieżący stan dnia szkolnego na podstawie czasu lokalnego.
// Logika jest GENERYCZNA: czyta kolejne pary lekcja/przerwa z listy dzwonków,
// więc działa dla DOWOLNEGO (także nieregularnego) planu. Długość przerwy jest
// liczona z luki między koniec[i] a start[i+1] — nic nie jest hardkodowane.
// ─────────────────────────────────────────────────────────────────────────

import type { Holiday, Lesson, LessonNamesMap, ScheduleMap } from './types';

// TODO: zweryfikuj realne dzwonki Górki — wpisać w panelu admina.
// Plan placeholder (poniedziałek–piątek). Długa przerwa = po L5 (11:55–12:10).
// L9 (14:55–15:40) bywa dodawana — domyślnie wyłączona.
const DEFAULT_DAY: Lesson[] = [
  { nr: 1, start: '07:30', koniec: '08:15' },
  { nr: 2, start: '08:25', koniec: '09:10' },
  { nr: 3, start: '09:20', koniec: '10:05' },
  { nr: 4, start: '10:15', koniec: '11:00' },
  { nr: 5, start: '11:10', koniec: '11:55' },
  { nr: 6, start: '12:10', koniec: '12:55' },
  { nr: 7, start: '13:05', koniec: '13:50' },
  { nr: 8, start: '14:00', koniec: '14:45' },
];

/** Domyślny plan placeholder dla dni roboczych (1=pon ... 5=pt). */
export const DEFAULT_SCHEDULE: ScheduleMap = {
  '1': DEFAULT_DAY,
  '2': DEFAULT_DAY,
  '3': DEFAULT_DAY,
  '4': DEFAULT_DAY,
  '5': DEFAULT_DAY,
};

export type LessonStatus =
  | 'lesson' // LEKCJA TRWA
  | 'break' // PRZERWA ZWYKŁA
  | 'longBreak' // DŁUGA PRZERWA
  | 'beforeSchool' // PRZED 1. LEKCJĄ
  | 'afterSchool' // PO LEKCJACH
  | 'dayOff'; // WEEKEND / ŚWIĘTO / DZIEŃ WOLNY

export interface ActiveLesson {
  nr: number;
  name: string | null;
  start: string;
  koniec: string;
}

export interface ScheduleState {
  status: LessonStatus;
  /** Czas, dla którego policzono stan (epoch ms). */
  now: number;
  /** Lekcja aktualnie trwająca (status === 'lesson'). */
  current: ActiveLesson | null;
  /** Najbliższa nadchodząca lekcja (przerwa / przed lekcjami). */
  next: ActiveLesson | null;
  /** Ostatnia zakończona lekcja (przerwa / po lekcjach). */
  previous: ActiveLesson | null;
  /** Ms do końca trwającej lekcji (status === 'lesson'). */
  msUntilEnd: number | null;
  /** Ms do startu następnej lekcji (przerwa / przed lekcjami). */
  msUntilNextStart: number | null;
  /** Postęp 0..1 przez bieżącą fazę (lekcja albo przerwa). */
  progress: number;
  /** Długość bieżącej przerwy w minutach (przerwa). */
  breakMinutes: number | null;
  /** Powód dnia wolnego: 'weekend' | 'no-lessons' | nazwa święta. */
  dayOffReason: string | null;
  /** Krótka etykieta PL. */
  label: string;
}

export interface ScheduleInput {
  schedule: ScheduleMap;
  longBreakMinutes: number;
  lessonNames?: LessonNamesMap;
}

/** Rozbija "HH:MM" na liczby. Zwraca null dla niepoprawnego formatu. */
export function parseHM(hm: string): { h: number; m: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hm.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

/** Minuty od północy dla "HH:MM". */
export function hmToMinutes(hm: string): number {
  const parsed = parseHM(hm);
  if (!parsed) return NaN;
  return parsed.h * 60 + parsed.m;
}

/** Data lokalna jako "YYYY-MM-DD". */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Dzień tygodnia jako klucz planu: "1"=pon ... "7"=niedz. */
export function weekdayKey(date: Date): string {
  const js = date.getDay(); // 0=niedziela ... 6=sobota
  return js === 0 ? '7' : String(js);
}

/** Buduje Date z tej samej doby co `base`, ale o godzinie z "HH:MM". */
function atTime(base: Date, hm: string): Date {
  const parsed = parseHM(hm) ?? { h: 0, m: 0 };
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate(), parsed.h, parsed.m, 0, 0);
  return d;
}

/** Czy data jest świętem / dniem wolnym z listy. */
export function findHoliday(date: Date, holidays: Holiday[]): Holiday | null {
  const iso = toISODate(date);
  return holidays.find((h) => h.date === iso) ?? null;
}

/** Lekcje dla danego dnia, posortowane rosnąco po starcie. Tylko poprawne wpisy. */
export function getLessonsForDate(date: Date, schedule: ScheduleMap): Lesson[] {
  const key = weekdayKey(date);
  const raw = schedule[key] ?? [];
  return raw
    .filter((l) => parseHM(l.start) !== null && parseHM(l.koniec) !== null)
    .slice()
    .sort((a, b) => hmToMinutes(a.start) - hmToMinutes(b.start));
}

function nameFor(lessonNames: LessonNamesMap | undefined, key: string, nr: number): string | null {
  return lessonNames?.[key]?.[String(nr)] ?? null;
}

function toActive(lesson: Lesson, name: string | null): ActiveLesson {
  return { nr: lesson.nr, name, start: lesson.start, koniec: lesson.koniec };
}

function baseState(status: LessonStatus, nowMs: number, label: string): ScheduleState {
  return {
    status,
    now: nowMs,
    current: null,
    next: null,
    previous: null,
    msUntilEnd: null,
    msUntilNextStart: null,
    progress: 0,
    breakMinutes: null,
    dayOffReason: null,
    label,
  };
}

/**
 * Główna funkcja: wyznacza bieżący stan dnia szkolnego.
 *
 * @param now       bieżący czas (czas lokalny kiosku — zakładamy Europe/Warsaw)
 * @param input     plan dzwonków + długość progu długiej przerwy + nazwy lekcji
 * @param holidays  lista świąt / dni wolnych (data "YYYY-MM-DD")
 */
export function getCurrentState(now: Date, input: ScheduleInput, holidays: Holiday[]): ScheduleState {
  const nowMs = now.getTime();
  const key = weekdayKey(now);
  const isWeekend = key === '6' || key === '7';

  // 1) Święto / dzień wolny z konkretną datą ma priorytet (czytelniejszy komunikat).
  const holiday = findHoliday(now, holidays);
  if (holiday) {
    const state = baseState('dayOff', nowMs, holiday.name);
    state.dayOffReason = holiday.name;
    return state;
  }

  // 2) Lekcje danego dnia.
  const lessons = getLessonsForDate(now, input.schedule);
  if (lessons.length === 0) {
    const reason = isWeekend ? 'weekend' : 'no-lessons';
    const label = isWeekend ? 'Weekend' : 'Dzień bez lekcji';
    const state = baseState('dayOff', nowMs, label);
    state.dayOffReason = reason;
    return state;
  }

  const first = lessons[0];
  const last = lessons[lessons.length - 1];
  const firstStartMs = atTime(now, first.start).getTime();
  const lastEndMs = atTime(now, last.koniec).getTime();

  // 3) Przed pierwszą lekcją (także np. o północy w dzień roboczy).
  if (nowMs < firstStartMs) {
    const state = baseState('beforeSchool', nowMs, 'Dzień dobry!');
    state.next = toActive(first, nameFor(input.lessonNames, key, first.nr));
    state.msUntilNextStart = firstStartMs - nowMs;
    return state;
  }

  // 4) Po ostatniej lekcji.
  if (nowMs >= lastEndMs) {
    const state = baseState('afterSchool', nowMs, 'Koniec lekcji');
    state.previous = toActive(last, nameFor(input.lessonNames, key, last.nr));
    return state;
  }

  // 5) Gdzieś w trakcie dnia: lekcja albo przerwa (luka między lekcjami).
  for (let i = 0; i < lessons.length; i++) {
    const l = lessons[i];
    const startMs = atTime(now, l.start).getTime();
    const endMs = atTime(now, l.koniec).getTime();

    // LEKCJA TRWA — przedział [start, koniec).
    if (nowMs >= startMs && nowMs < endMs) {
      const state = baseState('lesson', nowMs, l.nr ? `Lekcja ${l.nr}` : 'Lekcja');
      state.current = toActive(l, nameFor(input.lessonNames, key, l.nr));
      state.msUntilEnd = endMs - nowMs;
      const span = endMs - startMs;
      state.progress = span > 0 ? (nowMs - startMs) / span : 0;
      // Wskaż też następną lekcję, jeśli istnieje.
      const nxt = lessons[i + 1];
      if (nxt) state.next = toActive(nxt, nameFor(input.lessonNames, key, nxt.nr));
      return state;
    }

    // PRZERWA — luka [koniec[i], start[i+1]).
    const nxt = lessons[i + 1];
    if (nxt) {
      const nextStartMs = atTime(now, nxt.start).getTime();
      if (nowMs >= endMs && nowMs < nextStartMs) {
        const breakMs = nextStartMs - endMs;
        const breakMinutes = breakMs / 60000;
        const isLong = breakMinutes >= input.longBreakMinutes;
        const label = isLong ? 'Długa przerwa' : 'Przerwa';
        const state = baseState(isLong ? 'longBreak' : 'break', nowMs, label);
        state.previous = toActive(l, nameFor(input.lessonNames, key, l.nr));
        state.next = toActive(nxt, nameFor(input.lessonNames, key, nxt.nr));
        state.msUntilNextStart = nextStartMs - nowMs;
        state.breakMinutes = breakMinutes;
        state.progress = breakMs > 0 ? (nowMs - endMs) / breakMs : 0;
        return state;
      }
    }
  }

  // Bezpieczny fallback (nie powinien wystąpić przy spójnym planie).
  const state = baseState('afterSchool', nowMs, 'Koniec lekcji');
  state.previous = toActive(last, nameFor(input.lessonNames, key, last.nr));
  return state;
}
