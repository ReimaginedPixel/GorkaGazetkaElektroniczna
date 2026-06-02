// ─────────────────────────────────────────────────────────────────────────
// lib/config.ts — wczytywanie, walidacja i zapisywanie config.json (proces main).
// Zasada nadrzędna: kiosk NIGDY nie może się wywalić na lekko błędnym configu.
// Każde pole jest normalizowane do bezpiecznej wartości, brakujące -> default.
// ─────────────────────────────────────────────────────────────────────────

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { DEFAULT_SCHEDULE } from './schedule';
import type {
  Announcement,
  Anagram,
  AppConfig,
  Birthday,
  FreePeriod,
  Holiday,
  Lesson,
  LessonNamesMap,
  QrCode,
  ScheduleMap,
  SchoolEvent,
} from './types';

export const DEFAULT_CONFIG: AppConfig = {
  school: { name: 'Szkoła', shortName: 'Gazetka Górka' },
  location: { label: 'Rabka-Zdrój', latitude: 49.61, longitude: 19.96, timezone: 'Europe/Warsaw' },
  longBreakMinutes: 15,
  schedule: DEFAULT_SCHEDULE,
  lessonNames: {},
  holidays: [],
  daysOff: [],
  freePeriods: [],
  importantDates: {},
  luckyNumber: null,
  announcements: [],
  photos: [],
  birthdays: [],
  events: [],
  qrCodes: [],
  wordOfDay: null,
  facts: [],
  anagrams: [],
  theme: { auto: true, mode: 'dark', darkAfterHour: 19, lightAfterHour: 7 },
  story: { intervalSeconds: 11 },
  tiles: {
    photos: true,
    wordOfDay: true,
    fact: true,
    qr: true,
    birthdays: true,
    events: true,
    counters: true,
    anagram: true,
  },
  statusBar: {
    showWeather: true,
    showLuckyNumber: true,
    showDaysToYearEnd: true,
    showMarquee: true,
  },
};

// ── Drobne, defensywne konwertery ───────────────────────────────────────────
function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function notNull<T>(x: T | null): x is T {
  return x !== null;
}
function str(v: unknown, fallback: string): string {
  return typeof v === 'string' ? v : fallback;
}
function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}
function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function normLesson(v: unknown): Lesson | null {
  if (!isObj(v)) return null;
  const start = str(v.start, '');
  const koniec = str(v.koniec, '');
  if (!start || !koniec) return null;
  return { nr: num(v.nr, 0), start, koniec };
}

function normSchedule(v: unknown): ScheduleMap {
  if (!isObj(v)) return DEFAULT_SCHEDULE;
  const out: ScheduleMap = {};
  for (const key of Object.keys(v)) {
    if (key.startsWith('_')) continue; // pomijaj pola _comment
    const lessons = arr(v[key]).map(normLesson).filter((l): l is Lesson => l !== null);
    out[key] = lessons;
  }
  return out;
}

function normLessonNames(v: unknown): LessonNamesMap {
  if (!isObj(v)) return {};
  const out: LessonNamesMap = {};
  for (const day of Object.keys(v)) {
    if (day.startsWith('_')) continue;
    const inner = v[day];
    if (!isObj(inner)) continue;
    const map: Record<string, string> = {};
    for (const nr of Object.keys(inner)) {
      const name = inner[nr];
      if (typeof name === 'string') map[nr] = name;
    }
    out[day] = map;
  }
  return out;
}

function normHolidays(v: unknown): Holiday[] {
  return arr(v)
    .map((h) => (isObj(h) && typeof h.date === 'string' ? { date: h.date, name: str(h.name, h.date) } : null))
    .filter((h): h is Holiday => h !== null);
}

function normFreePeriods(v: unknown): FreePeriod[] {
  return arr(v)
    .map((p) =>
      isObj(p) && typeof p.from === 'string' && typeof p.to === 'string'
        ? { name: str(p.name, 'Wolne'), from: p.from, to: p.to }
        : null,
    )
    .filter((p): p is FreePeriod => p !== null);
}

function normBirthdays(v: unknown): Birthday[] {
  return arr(v)
    .map((b) => (isObj(b) && typeof b.date === 'string' ? { name: str(b.name, '?'), date: b.date } : null))
    .filter((b): b is Birthday => b !== null);
}

function normEvents(v: unknown): SchoolEvent[] {
  return arr(v)
    .map((e) =>
      isObj(e) && typeof e.date === 'string'
        ? { name: str(e.name, 'Wydarzenie'), date: e.date, time: typeof e.time === 'string' ? e.time : undefined }
        : null,
    )
    .filter(notNull);
}

function normAnnouncements(v: unknown): Announcement[] {
  return arr(v)
    .map((a, i) =>
      isObj(a) && typeof a.text === 'string'
        ? { id: str(a.id, `a${i}`), text: a.text, urgent: bool(a.urgent, false) }
        : null,
    )
    .filter(notNull);
}

function normQrCodes(v: unknown): QrCode[] {
  return arr(v)
    .map((q) =>
      isObj(q) && typeof q.url === 'string'
        ? { label: str(q.label, q.url), url: q.url, enabled: bool(q.enabled, true) }
        : null,
    )
    .filter(notNull);
}

function normAnagrams(v: unknown): Anagram[] {
  return arr(v)
    .map((a) =>
      isObj(a) && typeof a.answer === 'string'
        ? { answer: a.answer, hint: typeof a.hint === 'string' ? a.hint : undefined }
        : null,
    )
    .filter(notNull);
}

function normStrings(v: unknown): string[] {
  return arr(v).filter((x): x is string => typeof x === 'string');
}

/** Główna normalizacja: cokolwiek -> kompletny, bezpieczny AppConfig. */
export function normalizeConfig(raw: unknown): AppConfig {
  const d = DEFAULT_CONFIG;
  if (!isObj(raw)) return structuredClone(d);

  const school = isObj(raw.school) ? raw.school : {};
  const location = isObj(raw.location) ? raw.location : {};
  const theme = isObj(raw.theme) ? raw.theme : {};
  const story = isObj(raw.story) ? raw.story : {};
  const tiles = isObj(raw.tiles) ? raw.tiles : {};
  const statusBar = isObj(raw.statusBar) ? raw.statusBar : {};
  const importantDatesRaw = isObj(raw.importantDates) ? raw.importantDates : {};
  const wordOfDayRaw = raw.wordOfDay;

  const importantDates: Record<string, string> = {};
  for (const k of Object.keys(importantDatesRaw)) {
    if (typeof importantDatesRaw[k] === 'string') importantDates[k] = importantDatesRaw[k] as string;
  }

  return {
    school: {
      name: str(school.name, d.school.name),
      shortName: str(school.shortName, d.school.shortName),
    },
    location: {
      label: str(location.label, d.location.label),
      latitude: num(location.latitude, d.location.latitude),
      longitude: num(location.longitude, d.location.longitude),
      timezone: str(location.timezone, d.location.timezone),
    },
    longBreakMinutes: num(raw.longBreakMinutes, d.longBreakMinutes),
    schedule: normSchedule(raw.schedule),
    lessonNames: normLessonNames(raw.lessonNames),
    holidays: normHolidays(raw.holidays),
    daysOff: normHolidays(raw.daysOff),
    freePeriods: normFreePeriods(raw.freePeriods),
    importantDates,
    luckyNumber:
      typeof raw.luckyNumber === 'number' || typeof raw.luckyNumber === 'string' ? raw.luckyNumber : null,
    announcements: normAnnouncements(raw.announcements),
    photos: normStrings(raw.photos),
    birthdays: normBirthdays(raw.birthdays),
    events: normEvents(raw.events),
    qrCodes: normQrCodes(raw.qrCodes),
    wordOfDay:
      isObj(wordOfDayRaw) && typeof wordOfDayRaw.word === 'string'
        ? { word: wordOfDayRaw.word, definition: str(wordOfDayRaw.definition, '') }
        : null,
    facts: normStrings(raw.facts),
    anagrams: normAnagrams(raw.anagrams),
    theme: {
      auto: bool(theme.auto, d.theme.auto),
      mode: theme.mode === 'light' ? 'light' : 'dark',
      darkAfterHour: num(theme.darkAfterHour, d.theme.darkAfterHour),
      lightAfterHour: num(theme.lightAfterHour, d.theme.lightAfterHour),
    },
    story: { intervalSeconds: num(story.intervalSeconds, d.story.intervalSeconds) },
    tiles: {
      photos: bool(tiles.photos, true),
      wordOfDay: bool(tiles.wordOfDay, true),
      fact: bool(tiles.fact, true),
      qr: bool(tiles.qr, true),
      birthdays: bool(tiles.birthdays, true),
      events: bool(tiles.events, true),
      counters: bool(tiles.counters, true),
      anagram: bool(tiles.anagram, true),
    },
    statusBar: {
      showWeather: bool(statusBar.showWeather, true),
      showLuckyNumber: bool(statusBar.showLuckyNumber, true),
      showDaysToYearEnd: bool(statusBar.showDaysToYearEnd, true),
      showMarquee: bool(statusBar.showMarquee, true),
    },
  };
}

/** Wczytuje config z pliku (z normalizacją). Brak pliku -> defaulty. */
export function loadConfigFile(filePath: string): AppConfig {
  try {
    if (!existsSync(filePath)) return structuredClone(DEFAULT_CONFIG);
    const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
    return normalizeConfig(raw);
  } catch (err) {
    console.error('[config] Błąd wczytywania, używam domyślnych:', err);
    return structuredClone(DEFAULT_CONFIG);
  }
}

/** Zapisuje config do pliku (ładny JSON). Zwraca znormalizowaną wersję. */
export function saveConfigFile(filePath: string, raw: unknown): AppConfig {
  const normalized = normalizeConfig(raw);
  writeFileSync(filePath, JSON.stringify(normalized, null, 2), 'utf-8');
  return normalized;
}
