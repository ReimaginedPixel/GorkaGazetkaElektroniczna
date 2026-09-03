import type { ReactNode } from 'react';
import type { WeatherNow } from '@lib/weather';
import { daysBetween, plDays } from '@lib/format';
import type { AppConfig } from '@lib/types';
import { GGIcon, GGMeta, GGNum, GGStat, GGSticker } from '../gg';
import { formatClock, formatPlDate, parseISODateLocal } from '../util/datetime';
import { Weather } from './Weather';
import { Marquee } from './Marquee';

interface Props {
  now: Date;
  config: AppConfig;
  weather: WeatherNow | null;
}

/** Stały pasek na dole - zawsze widoczny (poza alarmem). Ciemna belka z twardą krawędzią. */
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
    stats.push(
      <GGStat
        key="yearEnd"
        icon={<GGSticker art="hourglass" rotate={-8} className="w-[5.5vh]" />}
        value={plDays(daysToEnd)}
        label="do końca roku"
        valueClassName="text-white"
      />,
    );
  }
  if (luckyVisible) {
    stats.push(
      <GGStat
        key="lucky"
        icon={<GGSticker art="star" rotate={-12} float={5} className="w-[6vh]" />}
        value={String(config.luckyNumber)}
        label="szczęśliwy numerek"
        valueClassName="text-gg-yellow"
      />,
    );
  }
  if (sb.showWeather) {
    stats.push(<Weather key="weather" weather={weather} locationLabel={config.location.label} />);
  }

  return (
    <footer className="relative z-30 shrink-0 border-t-[length:var(--gg-bw)] border-gg-edge bg-gg-deep text-white shadow-[0_calc(var(--gg-bw)*-1)_0_var(--gg-halo)]">
      <div className="flex items-center justify-between gap-[2vw] px-[4vw] py-[1.5vh]">
        {/* Data + zegar */}
        <div className="leading-none">
          <GGMeta className="capitalize">{formatPlDate(now)}</GGMeta>
          <GGNum
            className="mt-[0.6vh] block text-[7.5vh] text-white"
            style={{ textShadow: '0.45vh 0.45vh 0 var(--gg-pink)' }}
          >
            {formatClock(now)}
          </GGNum>
        </div>

        {/* Statystyki + pogoda - rozdzielone przerywaną taśmą */}
        <div className="flex items-center gap-[2.4vw]">
          {stats.flatMap((node, i) =>
            i === 0
              ? [node]
              : [
                  <span
                    key={`div-${i}`}
                    className="h-[7vh] w-0 self-center border-l-[length:var(--gg-bw-thin)] border-dashed border-gg-rule"
                    aria-hidden
                  />,
                  node,
                ],
          )}
        </div>
      </div>

      {sb.showMarquee && announcements.length > 0 && (
        <div className="flex items-stretch border-t-[length:var(--gg-bw)] border-gg-edge bg-gg-lime text-[#141118]">
          <span className="flex shrink-0 items-center gap-[0.8vw] border-r-[length:var(--gg-bw)] border-gg-edge bg-gg-yellow px-[1.6vw] font-mono text-chip font-bold uppercase">
            <GGIcon group="ui" name="bubble-alert" ink="dark" className="w-[3vh]" />
            Ogłoszenia
          </span>
          <div className="min-w-0 flex-1 py-[0.8vh] font-ui text-[2.7vh] font-bold uppercase tracking-[0.04em]">
            <Marquee items={announcements} />
          </div>
        </div>
      )}
    </footer>
  );
}
