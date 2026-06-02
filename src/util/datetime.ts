// Formatowanie daty/godziny po polsku.

const dateFmt = new Intl.DateTimeFormat('pl-PL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const dateShortFmt = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** np. "wtorek, 2 czerwca" */
export function formatPlDate(d: Date): string {
  return dateFmt.format(d);
}

/** np. "2 czerwca 2026" */
export function formatPlDateLong(d: Date): string {
  return dateShortFmt.format(d);
}

/** "HH:MM:SS" */
export function formatClock(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** "HH:MM" */
export function formatHM(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Parsuje "YYYY-MM-DD" do lokalnej daty (północ). Null gdy błędne. */
export function parseISODateLocal(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}
