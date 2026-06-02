import type { ImportantDates } from '@lib/types';
import { daysBetween } from '@lib/format';
import { parseISODateLocal } from '../../util/datetime';
import { TileFrame } from '../TileFrame';

interface Counter {
  label: string;
  days: number;
}

/** Liczniki: dni do ferii / wakacji / matury / końca roku. */
export function CountersTile({ dates, now }: { dates: ImportantDates; now: Date }) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const defs: { key: keyof ImportantDates | string; label: string }[] = [
    { key: 'winterBreakStart', label: 'do ferii' },
    { key: 'summerBreakStart', label: 'do wakacji' },
    { key: 'maturaStart', label: 'do matury' },
    { key: 'schoolYearEnd', label: 'do końca roku' },
  ];

  const counters: Counter[] = defs
    .map((d) => {
      const iso = dates[d.key];
      const date = iso ? parseISODateLocal(iso) : null;
      if (!date) return null;
      const days = daysBetween(today, date);
      return days >= 0 ? { label: d.label, days } : null;
    })
    .filter((c): c is Counter => c !== null);

  return (
    <TileFrame label="Odliczamy">
      <div className="grid grid-cols-2 gap-x-[8vw] gap-y-[5vh]">
        {counters.length === 0 && <div className="muted col-span-2 text-4xl">Brak ustawionych dat</div>}
        {counters.map((c) => (
          <div key={c.label} className="text-center">
            <div className="tnum text-timer-sm font-black leading-none">{c.days}</div>
            <div className="muted mt-2 text-3xl">{c.label}</div>
          </div>
        ))}
      </div>
    </TileFrame>
  );
}
