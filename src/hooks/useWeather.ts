import { useEffect, useState } from 'react';
import { fetchWeather, type WeatherNow } from '@lib/weather';
import type { LocationConfig } from '@lib/types';

const CACHE_KEY = 'gazetka.weather';
// Pogoda: co 15 min (NIE co 1s).
const REFRESH_MS = 15 * 60 * 1000;

function readCache(): WeatherNow | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as WeatherNow) : null;
  } catch {
    return null;
  }
}

/**
 * Pogoda z Open-Meteo (bez klucza). Cache do localStorage; brak sieci ->
 * ostatnia znana wartość (nie crash).
 */
export function useWeather(location: LocationConfig | undefined): WeatherNow | null {
  const [weather, setWeather] = useState<WeatherNow | null>(() => readCache());

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    const controller = new AbortController();

    async function tick() {
      try {
        const data = await fetchWeather(
          location!.latitude,
          location!.longitude,
          location!.timezone,
          controller.signal,
        );
        if (cancelled) return;
        setWeather(data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {
          /* ignoruj limity localStorage */
        }
      } catch {
        // Brak sieci/błąd — zostaw ostatnią znaną wartość.
      }
    }

    tick();
    const id = setInterval(tick, REFRESH_MS);
    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(id);
    };
  }, [location?.latitude, location?.longitude, location?.timezone]);

  return weather;
}
