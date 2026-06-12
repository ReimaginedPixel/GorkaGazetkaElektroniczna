import type { ReactNode } from 'react';
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
      <div className="tnum text-6xl font-black" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      <div className="muted mt-1 text-lg font-semibold uppercase tracking-wider">{label}</div>
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

  const stats: ReactNode[] = [];
  if (sb.showDaysToYearEnd && daysToEnd !== null && daysToEnd >= 0) {
    stats.push(<Stat key="yearEnd" label="do końca roku" value={plDays(daysToEnd)} />);
  }
  if (luckyVisible) {
    stats.push(
      <Stat
        key="lucky"
        label="szczęśliwy numerek"
        value={String(config.luckyNumber)}
        accent="#F59E0B"
      />,
    );
  }
  if (sb.showWeather) {
    stats.push(<Weather key="weather" weather={weather} locationLabel={config.location.label} />);
  }

  return (
    <footer className="statusbar shrink-0">
      <div className="flex items-center justify-between gap-6 px-[4vw] py-[1.6vh]">
        {/* Data + zegar */}
        <div className="leading-none">
          <div className="muted text-xl font-medium capitalize">{formatPlDate(now)}</div>
          <div className="tnum mt-1 text-7xl font-black tracking-tight">{formatClock(now)}</div>
        </div>

        {/* Statystyki + pogoda — rozdzielone pionowymi separatorami */}
        <div className="flex items-center gap-8">
          {stats.flatMap((node, i) =>
            i === 0 ? [node] : [<span key={`div-${i}`} className="vdiv" aria-hidden />, node],
          )}
        </div>
      </div>

      {sb.showMarquee && announcements.length > 0 && (
        <div className="flex items-center gap-5 border-t border-white/10 py-[0.9vh] pl-[4vw]">
          <span className="label-pill shrink-0 !px-4 !py-1 !text-lg !tracking-widest">
            📣 Ogłoszenia
          </span>
          <div className="min-w-0 flex-1 text-2xl font-medium">
            <Marquee items={announcements} />
          </div>
        </div>
      )}
    </footer>
  );
}
