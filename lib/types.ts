// Wspólne typy konfiguracji Gazetki Górki.
// Używane zarówno w procesie main (Electron) jak i w rendererze (React).

/** Pojedynczy dzwonek/lekcja. Nazwa przedmiotu jest OSOBNO (lessonNames). */
export interface Lesson {
  nr: number;
  /** Godzina rozpoczęcia "HH:MM" (24h). */
  start: string;
  /** Godzina zakończenia "HH:MM" (24h). */
  koniec: string;
}

/** Dzień tygodnia jako klucz: "1"=poniedziałek ... "7"=niedziela. */
export type ScheduleMap = Record<string, Lesson[]>;

/** Plan przedmiotów: dzień tygodnia -> numer lekcji -> nazwa przedmiotu. */
export type LessonNamesMap = Record<string, Record<string, string>>;

/** Święto / dzień wolny (konkretna data). */
export interface Holiday {
  /** "YYYY-MM-DD". */
  date: string;
  name: string;
}

/** Dłuższy okres wolny (ferie, wakacje). */
export interface FreePeriod {
  name: string;
  /** "YYYY-MM-DD". */
  from: string;
  /** "YYYY-MM-DD". */
  to: string;
}

export interface Birthday {
  name: string;
  /** "MM-DD". */
  date: string;
}

export interface SchoolEvent {
  name: string;
  /** "YYYY-MM-DD". */
  date: string;
  /** "HH:MM" opcjonalnie. */
  time?: string;
}

export interface Announcement {
  id: string;
  text: string;
  /** Pilne ogłoszenie przejmuje cały ekran na czerwono. */
  urgent?: boolean;
}

export interface QrCode {
  label: string;
  url: string;
  enabled?: boolean;
}

export interface ImportantDates {
  schoolYearEnd?: string;
  summerBreakStart?: string;
  winterBreakStart?: string;
  maturaStart?: string;
  [key: string]: string | undefined;
}

export interface ThemeConfig {
  /** Automatyczny dark/light wg pory dnia. */
  auto: boolean;
  /** Tryb ustawiany ręcznie, gdy auto=false. */
  mode: 'dark' | 'light';
  /** Od tej godziny (włącznie) tryb ciemny. */
  darkAfterHour: number;
  /** Od tej godziny (włącznie) tryb jasny. */
  lightAfterHour: number;
}

export interface TilesConfig {
  photos: boolean;
  wordOfDay: boolean;
  fact: boolean;
  qr: boolean;
  birthdays: boolean;
  events: boolean;
  counters: boolean;
  anagram: boolean;
}

export interface StatusBarConfig {
  showWeather: boolean;
  showLuckyNumber: boolean;
  showDaysToYearEnd: boolean;
  showMarquee: boolean;
}

export interface Anagram {
  answer: string;
  hint?: string;
}

export interface WordOfDay {
  word: string;
  definition: string;
}

export interface LocationConfig {
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface AppConfig {
  school: { name: string; shortName: string };
  location: LocationConfig;
  longBreakMinutes: number;
  schedule: ScheduleMap;
  lessonNames?: LessonNamesMap;
  holidays: Holiday[];
  daysOff: Holiday[];
  freePeriods: FreePeriod[];
  importantDates: ImportantDates;
  luckyNumber: number | string | null;
  announcements: Announcement[];
  photos: string[];
  birthdays: Birthday[];
  events: SchoolEvent[];
  qrCodes: QrCode[];
  wordOfDay: WordOfDay | null;
  facts: string[];
  anagrams: Anagram[];
  theme: ThemeConfig;
  story: { intervalSeconds: number };
  tiles: TilesConfig;
  statusBar: StatusBarConfig;
}
