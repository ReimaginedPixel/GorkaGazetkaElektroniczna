import type { SchoolEvent } from '@lib/types';
import { daysBetween, plDays } from '@lib/format';
import { parseISODateLocal } from '../../util/datetime';
import { TileFrame } from '../TileFrame';

/** Najbliższe wydarzenia szkolne (od dziś). */
export function EventsTile({ events, now }: { events: SchoolEvent[]; now: Date }) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = events
    .map((e) => ({ ev: e, date: parseISODateLocal(e.date) }))
    .filter((x): x is { ev: SchoolEvent; date: Date } => x.date !== null && x.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);

  return (
    <TileFrame label="Najbliższe wydarzenia">
      <div className="flex flex-col items-center gap-[2.5vh]">
        {upcoming.length === 0 && <div className="muted text-4xl">Brak zaplanowanych wydarzeń</div>}
        {upcoming.map(({ ev, date }) => {
          const days = daysBetween(today, date);
          const when = days === 0 ? 'dziś' : days === 1 ? 'jutro' : `za ${plDays(days)}`;
          return (
            <div key={`${ev.name}-${ev.date}`} className="text-center">
              <div className="text-5xl font-bold">{ev.name}</div>
              <div className="muted text-3xl">
                {when}
                {ev.time ? ` · ${ev.time}` : ''}
              </div>
            </div>
          );
        })}
      </div>
    </TileFrame>
  );
}
