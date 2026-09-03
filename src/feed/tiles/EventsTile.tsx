import type { SchoolEvent } from '@lib/types';
import { daysBetween, plDays } from '@lib/format';
import { GGChip, GGMeta, GGNum, GGSurface, type GGTilt } from '../../gg';
import { parseISODateLocal } from '../../util/datetime';
import { TileFrame } from '../TileFrame';

const TILTS: GGTilt[] = ['r', 'l', 'r2', 'l2'];

function shortDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}`;
}

/** Najbliższe wydarzenia szkolne (od dziś). */
export function EventsTile({ events, now }: { events: SchoolEvent[]; now: Date }) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = events
    .map((e) => ({ ev: e, date: parseISODateLocal(e.date) }))
    .filter((x): x is { ev: SchoolEvent; date: Date } => x.date !== null && x.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <TileFrame label="Najbliższe wydarzenia" icon={['fun', 'rocket']} tone="lime">
      <div className="flex w-full max-w-[80vw] flex-col items-stretch gap-[1.8vh]">
        {upcoming.length === 0 && <div className="muted text-center font-ui text-big">Brak zaplanowanych wydarzeń</div>}
        {upcoming.map(({ ev, date }, i) => {
          const days = daysBetween(today, date);
          const when = days === 0 ? 'dziś' : days === 1 ? 'jutro' : `za ${plDays(days)}`;
          return (
            <GGSurface
              key={`${ev.name}-${ev.date}`}
              variant="flat"
              tilt={TILTS[i % TILTS.length]}
              className="flex items-center gap-[2vw] px-[2.2vw] py-[1vh] text-left"
            >
              <GGChip tone={days === 0 ? 'pink' : 'yellow'} className="text-[2.4vh]">
                <GGNum>{shortDate(date)}</GGNum>
              </GGChip>
              <span className="min-w-0 flex-1 truncate font-display text-[4.4vh] uppercase text-gg-ink">{ev.name}</span>
              <GGMeta className="shrink-0 text-[2vh]">
                {when}
                {ev.time ? ` · ${ev.time}` : ''}
              </GGMeta>
            </GGSurface>
          );
        })}
      </div>
    </TileFrame>
  );
}
