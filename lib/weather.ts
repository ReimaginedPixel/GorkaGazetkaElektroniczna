// ─────────────────────────────────────────────────────────────────────────
// lib/weather.ts — Open-Meteo (BEZ klucza API).
// Atrybucja "Open-Meteo" wymagana licencją CC BY 4.0 (pokazujemy w UI).
// ─────────────────────────────────────────────────────────────────────────

export interface WeatherNow {
  temperature: number;
  code: number;
  label: string;
  icon: string;
  /** Czas pomiaru (ISO) jeśli dostępny. */
  time?: string;
  /** Znacznik pobrania (epoch ms) — do cache. */
  fetchedAt: number;
}

interface WmoEntry {
  label: string;
  icon: string;
}

// Mapowanie kodów pogody WMO -> ikona (emoji, wysoki kontrast) + opis PL.
const WMO: Record<number, WmoEntry> = {
  0: { label: 'Bezchmurnie', icon: '☀️' },
  1: { label: 'Przeważnie słonecznie', icon: '🌤️' },
  2: { label: 'Częściowe zachmurzenie', icon: '⛅' },
  3: { label: 'Pochmurno', icon: '☁️' },
  45: { label: 'Mgła', icon: '🌫️' },
  48: { label: 'Mgła osadzająca szron', icon: '🌫️' },
  51: { label: 'Lekka mżawka', icon: '🌦️' },
  53: { label: 'Mżawka', icon: '🌦️' },
  55: { label: 'Gęsta mżawka', icon: '🌧️' },
  56: { label: 'Marznąca mżawka', icon: '🌧️' },
  57: { label: 'Gęsta marznąca mżawka', icon: '🌧️' },
  61: { label: 'Słaby deszcz', icon: '🌦️' },
  63: { label: 'Deszcz', icon: '🌧️' },
  65: { label: 'Silny deszcz', icon: '🌧️' },
  66: { label: 'Marznący deszcz', icon: '🌧️' },
  67: { label: 'Silny marznący deszcz', icon: '🌧️' },
  71: { label: 'Słaby śnieg', icon: '🌨️' },
  73: { label: 'Śnieg', icon: '🌨️' },
  75: { label: 'Intensywny śnieg', icon: '❄️' },
  77: { label: 'Ziarna śnieżne', icon: '🌨️' },
  80: { label: 'Przelotny deszcz', icon: '🌦️' },
  81: { label: 'Przelotny deszcz', icon: '🌧️' },
  82: { label: 'Ulewa', icon: '⛈️' },
  85: { label: 'Przelotny śnieg', icon: '🌨️' },
  86: { label: 'Intensywny przelotny śnieg', icon: '❄️' },
  95: { label: 'Burza', icon: '⛈️' },
  96: { label: 'Burza z gradem', icon: '⛈️' },
  99: { label: 'Silna burza z gradem', icon: '⛈️' },
};

/** Opis + ikona dla kodu WMO (z fallbackiem). */
export function describeWeather(code: number): WmoEntry {
  return WMO[code] ?? { label: 'Pogoda', icon: '🌡️' };
}

/** Buduje URL do Open-Meteo dla bieżącej pogody. */
export function buildWeatherUrl(latitude: number, longitude: number, timezone: string): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,weather_code',
    timezone,
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

/** Parsuje odpowiedź Open-Meteo do WeatherNow. Zwraca null przy złych danych. */
export function parseWeatherResponse(json: unknown): WeatherNow | null {
  if (!json || typeof json !== 'object') return null;
  const current = (json as { current?: unknown }).current;
  if (!current || typeof current !== 'object') return null;
  const temp = (current as { temperature_2m?: unknown }).temperature_2m;
  const code = (current as { weather_code?: unknown }).weather_code;
  const time = (current as { time?: unknown }).time;
  if (typeof temp !== 'number' || typeof code !== 'number') return null;
  const desc = describeWeather(code);
  return {
    temperature: temp,
    code,
    label: desc.label,
    icon: desc.icon,
    time: typeof time === 'string' ? time : undefined,
    fetchedAt: Date.now(),
  };
}

/**
 * Pobiera bieżącą pogodę. Rzuca przy błędzie sieci — wywołujący ma użyć
 * ostatniej znanej wartości z cache (nie crashować ekranu).
 */
export async function fetchWeather(
  latitude: number,
  longitude: number,
  timezone: string,
  signal?: AbortSignal,
): Promise<WeatherNow> {
  const res = await fetch(buildWeatherUrl(latitude, longitude, timezone), { signal });
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const json = await res.json();
  const parsed = parseWeatherResponse(json);
  if (!parsed) throw new Error('Nieprawidłowa odpowiedź Open-Meteo');
  return parsed;
}
