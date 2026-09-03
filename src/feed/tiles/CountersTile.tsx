import type { ImportantDates } from '@lib/types';
import { daysBetween } from '@lib/format';
import { GGIcon, GGMeta, GGNum, GGSurface, type GGIconGroup, type GGTilt } from '../../gg';
import { parseISODateLocal } from '../../util/datetime';
import { TileFrame } from '../TileFrame';

interface Counter {
  label: string;
  days: number;
  icon: [GGIconGroup, string];
}

const TILTS: GGTilt[] = ['l', 'r2', 'r', 'l2'];

/** Liczniki: dni do ferii / wakacji / matury / końca roku - kafle statystyk. */
export function CountersTile({ dates, now }: { dates: ImportantDates; now: Date }) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const defs: { key: keyof ImportantDates | string; label: string; icon: [GGIconGroup, string] }[] = [
    { key: 'winterBreakStart', label: 'do ferii', icon: ['nature', 'snowflake'] },
    { key: 'summerBreakStart', label: 'do wakacji', icon: ['nature', 'sun'] },
    { key: 'maturaStart', label: 'do matury', icon: ['object', 'book'] },
    { key: 'schoolYearEnd', label: 'do końca roku', icon: ['fun', 'flag'] },
  ];

  const counters: Counter[] = defs
    .map((d) => {
      const iso = dates[d.key];
      const date = iso ? parseISODateLocal(iso) : null;
      if (!date) return null;
      const days = daysBetween(today, date);
      return days >= 0 ? { label: d.label, days, icon: d.icon } : null;
    })
    .filter((c): c is Counter => c !== null);

  return (
    <TileFrame label="Odliczamy" icon={['fun', 'hourglass']} tone="purple">
      <div className="grid grid-cols-2 gap-x-[3vw] gap-y-[1.6vh]">
        {counters.length === 0 && <div className="muted col-span-2 font-ui text-big">Brak ustawionych dat</div>}
        {counters.map((c, i) => (
          <GGSurface
            key={c.label}
            tilt={TILTS[i % TILTS.length]}
            className="flex items-center gap-[1.2vw] px-[1.8vw] py-[0.8vh] text-left"
          >
            <GGIcon group={c.icon[0]} name={c.icon[1]} className="w-[6vh] -rotate-6" />
            <div>
              <GGNum className="block text-[7vh] text-gg-ink" style={{ textShadow: '0.5vh 0.5vh 0 var(--gg-numshadow)' }}>
                {c.days}
              </GGNum>
              <GGMeta className="mt-[0.6vh] text-[1.8vh]">dni {c.label}</GGMeta>
            </div>
          </GGSurface>
        ))}
      </div>
    </TileFrame>
  );
}
