import type { WeatherNow } from '@lib/weather';
import { daysBetween, plDays } from '@lib/format';
import type { AppConfig } from '@lib/types';
import { formatClock, formatPlDate, parseISODateLocal } from '../util/datetime';
import { Weather } from './Weather';
import { Marquee } from './Marquee';

interface Props {
  now: Date;
  config: AppConfig;
  weather: WeatherNow | null;
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="text-right leading-tight">
      <div className="tnum text-5xl font-extrabold" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      <div className="muted text-base uppercase tracking-wide">{label}</div>
    </div>
  );
}

/** Stały pasek na dole — zawsze widoczny (poza alarmem). */
export function StatusBar({ now, config, weather }: Props) {
  const sb = config.statusBar;

  const yearEnd = config.importantDates.schoolYearEnd
    ? parseISODateLocal(config.importantDates.schoolYearEnd)
    : null;
  const daysToEnd = yearEnd ? daysBetween(now, yearEnd) : null;

  const luckyVisible =
    sb.showLuckyNumber && config.luckyNumber !== null && String(config.luckyNumber).trim() !== '';

  const announcements = config.announcements.filter((a) => !a.urgent).map((a) => a.text);

  return (
    <footer className="shrink-0 border-t border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="flex items-end justify-between gap-6 px-[4vw] py-[1.6vh]">
        {/* Data + zegar */}
        <div className="leading-none">
          <div className="muted text-xl capitalize">{formatPlDate(now)}</div>
          <div className="tnum text-7xl font-extrabold tracking-tight">{formatClock(now)}</div>
        </div>

        {/* Statystyki + pogoda */}
        <div className="flex items-end gap-10">
          {sb.showDaysToYearEnd && daysToEnd !== null && daysToEnd >= 0 && (
            <Stat label="do końca roku" value={plDays(daysToEnd)} />
          )}
          {luckyVisible && (
            <Stat label="szczęśliwy numerek" value={String(config.luckyNumber)} accent="#F59E0B" />
          )}
          {sb.showWeather && <Weather weather={weather} locationLabel={config.location.label} />}
        </div>
      </div>

      {sb.showMarquee && announcements.length > 0 && (
        <div className="border-t border-white/10 py-[0.9vh] text-2xl font-medium">
          <Marquee items={announcements} />
        </div>
      )}
    </footer>
  );
}
