import { formatCountdown } from '@lib/format';
import { Screen } from '../components/Screen';
import { ProgressBar } from '../components/ProgressBar';
import type { ViewProps } from './types';

/** Stan 1: LEKCJA TRWA — gigantyczny timer do końca lekcji. */
export function LessonView({ state, theme }: ViewProps) {
  const cur = state.current;
  if (!cur) return null;
  const title = cur.name ?? `Lekcja ${cur.nr}`;

  return (
    <Screen theme={theme} chip={`Lekcja ${cur.nr}`}>
      <div className="flex flex-col items-center text-center">
        <div className="text-hero font-bold">{title}</div>
        <div className="muted tnum mt-2 text-4xl">
          {cur.start}–{cur.koniec}
        </div>

        <div className="tnum mt-[3vh] text-timer font-black leading-none" style={{ color: theme.accent }}>
          {formatCountdown(state.msUntilEnd ?? 0)}
        </div>
        <div className="muted mt-1 text-4xl uppercase tracking-wider">do końca lekcji</div>

        <ProgressBar value={state.progress} accent={theme.accent} />

        {state.next && (
          <div className="muted mt-[3.5vh] text-3xl">
            Następnie: {state.next.name ?? `Lekcja ${state.next.nr}`} o {state.next.start}
          </div>
        )}
      </div>
    </Screen>
  );
}
