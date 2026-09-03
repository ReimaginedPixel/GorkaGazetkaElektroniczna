import type { WeatherNow } from '@lib/weather';
import { GGIcon, GGMeta, GGNum } from '../gg';

/** Kod WMO -> ikona liniowa z zestawu GórkaGuesser (grupa `nature`). */
export function weatherIconName(code: number): string {
  if (code === 0 || code === 1) return 'sun';
  if (code === 2 || code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'wind';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snowflake';
  if (code >= 95) return 'lightning';
  if (code >= 51) return 'water-drop';
  return 'cloud';
}

/** Pogoda w pasku. Atrybucja „Open-Meteo” wymagana licencją CC BY 4.0. */
export function Weather({ weather, locationLabel }: { weather: WeatherNow | null; locationLabel: string }) {
  if (!weather) {
    return <GGMeta className="text-[2vh]">Pogoda…</GGMeta>;
  }
  return (
    <div className="flex items-center gap-[1vw]">
      <GGIcon
        group="nature"
        name={weatherIconName(weather.code)}
        ink="light"
        alt={weather.label}
        className="w-[6.5vh] -rotate-6"
      />
      <div className="leading-tight">
        <GGNum className="block text-[5vh] text-white">{Math.round(weather.temperature)}°C</GGNum>
        <GGMeta className="mt-[0.5vh] text-[1.6vh]">
          {weather.label} · {locationLabel}
        </GGMeta>
        <span className="block font-mono text-[1.2vh] uppercase tracking-[0.2em] text-gg-meta opacity-70">
          Open-Meteo
        </span>
      </div>
    </div>
  );
}
