import type { Birthday } from '@lib/types';
import { daysBetween, plDays } from '@lib/format';
import { GGChip, GGIcon, GGSticker, GGSurface, type GGTilt } from '../../gg';
import { TileFrame } from '../TileFrame';

interface Upcoming {
  name: string;
  date: Date;
  days: number;
}

const TILTS: GGTilt[] = ['l', 'r', 'l2', 'r2'];

/** Najbliższe urodziny (MM-DD). Dzisiejsze wyróżnione. */
export function BirthdaysTile({ birthdays, now }: { birthdays: Birthday[]; now: Date }) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming: Upcoming[] = birthdays
    .map((b) => {
      const m = /^(\d{2})-(\d{2})$/.exec(b.date.trim());
      if (!m) return null;
      const mo = Number(m[1]) - 1;
      const day = Number(m[2]);
      let d = new Date(today.getFullYear(), mo, day);
      if (d < today) d = new Date(today.getFullYear() + 1, mo, day);
      return { name: b.name, date: d, days: daysBetween(today, d) };
    })
    .filter((x): x is Upcoming => x !== null)
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  const anyToday = upcoming.some((u) => u.days === 0);

  return (
    <TileFrame label="Urodziny z klasy" icon={['fun', 'cake']} tone="pink">
      {anyToday && (
        <GGSticker art="blobCelebrate" rotate={-8} float={5} className="absolute right-[5vw] top-[10vh] w-[17vh]" />
      )}
      <div className="flex flex-col items-center gap-[1.8vh]">
        {upcoming.length === 0 && <div className="muted font-ui text-big">Brak nadchodzących urodzin</div>}
        {upcoming.map((u, i) => (
          <GGSurface
            key={`${u.name}-${u.date.getTime()}`}
            variant={u.days === 0 ? 'default' : 'flat'}
            tilt={TILTS[i % TILTS.length]}
            className="flex items-center gap-[1.4vw] px-[2.2vw] py-[1vh]"
          >
            <GGIcon group="fun" name={u.days === 0 ? 'gift' : 'cake'} className="w-[4.8vh]" />
            <span className="font-display text-[4.4vh] uppercase text-gg-ink">{u.name}</span>
            {u.days === 0 ? (
              <GGChip tone="yellow" tilt className="text-[2.2vh]">
                Dziś!
              </GGChip>
            ) : (
              <span className="muted font-ui text-big">za {plDays(u.days)}</span>
            )}
          </GGSurface>
        ))}
      </div>
    </TileFrame>
  );
}
