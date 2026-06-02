import type { Birthday } from '@lib/types';
import { daysBetween, plDays } from '@lib/format';
import { TileFrame } from '../TileFrame';

interface Upcoming {
  name: string;
  date: Date;
  days: number;
}

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
    .slice(0, 4);

  return (
    <TileFrame label="Urodziny z klasy">
      <div className="flex flex-col items-center gap-[2.5vh]">
        {upcoming.length === 0 && <div className="muted text-4xl">Brak nadchodzących urodzin</div>}
        {upcoming.map((u) => (
          <div key={`${u.name}-${u.date.getTime()}`} className="flex items-baseline gap-6">
            <span className="text-6xl font-bold">{u.name}</span>
            <span
              className="text-4xl"
              style={{ color: u.days === 0 ? '#F59E0B' : undefined }}
            >
              {u.days === 0 ? '🎉 dziś!' : `za ${plDays(u.days)}`}
            </span>
          </div>
        ))}
      </div>
    </TileFrame>
  );
}
