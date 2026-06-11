import type { WeatherNow } from '@lib/weather';

/** Pogoda w pasku. Atrybucja „Open-Meteo” wymagana licencją CC BY 4.0. */
export function Weather({ weather, locationLabel }: { weather: WeatherNow | null; locationLabel: string }) {
  if (!weather) {
    return <div className="muted text-2xl">Pogoda…</div>;
  }
  return (
    <div className="flex items-center gap-4">
      <span className="text-6xl leading-none" aria-hidden>
        {weather.icon}
      </span>
      <div className="leading-tight">
        <div className="tnum text-5xl font-black">{Math.round(weather.temperature)}°C</div>
        <div className="muted text-lg font-medium">
          {weather.label} · {locationLabel}
        </div>
        <div className="muted text-[0.7rem] opacity-70">Open-Meteo</div>
      </div>
    </div>
  );
}
