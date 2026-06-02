// Pomocnicze formatowanie czasu/liczb dla wyświetlacza (PL).

/** Rozbija ms na h/m/s (nieujemne). */
export function splitDuration(ms: number): { h: number; m: number; s: number; totalSeconds: number } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h, m, s, totalSeconds: total };
}

/**
 * Format odliczania do GIGANTYCZNEGO timera.
 * < 1h  -> "MM:SS"
 * >= 1h -> "H:MM:SS"
 * (tabular-nums ustawiamy w CSS, żeby cyfry nie skakały)
 */
export function formatCountdown(ms: number): string {
  const { h, m, s } = splitDuration(ms);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

/** Liczba pełnych minut (zaokrąglana w górę) — do tekstów "pozostało X min". */
export function minutesCeil(ms: number): number {
  return Math.max(0, Math.ceil(ms / 60000));
}

/** Polska odmiana "minuta/minuty/minut". */
export function plMinutes(n: number): string {
  return `${n} ${pluralPl(n, 'minuta', 'minuty', 'minut')}`;
}

/** Polska odmiana "dzień/dni". */
export function plDays(n: number): string {
  return `${n} ${pluralPl(n, 'dzień', 'dni', 'dni')}`;
}

/** Wybór formy mnogiej wg reguł polskich. */
export function pluralPl(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  if (abs === 1) return one;
  const lastTwo = abs % 100;
  const last = abs % 10;
  if (last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20)) return few;
  return many;
}

/** Pełne dni między dwiema datami (różnica kalendarzowa, lokalnie). */
export function daysBetween(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}
