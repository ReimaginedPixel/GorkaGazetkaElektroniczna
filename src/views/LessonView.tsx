import { formatCountdown } from '@lib/format';
import { Screen } from '../components/Screen';
import { ProgressBar } from '../components/ProgressBar';
import type { ViewProps } from './types';

/** Stan 1: LEKCJA TRWA — gigantyczny timer do końca lekcji. */
export function LessonView({ state, theme, config }: ViewProps) {
  const cur = state.current;
  if (!cur) return null;
  const title = cur.name ?? `Lekcja ${cur.nr}`;

  return (
    <Screen theme={theme} chip={`Lekcja ${cur.nr}`} brand={config.school.shortName}>
      <div className="flex flex-col items-center text-center">
        <div className="text-hero font-black tracking-tight">{title}</div>
        <div className="glass tnum mt-[1.5vh] rounded-full px-8 py-2 text-3xl font-semibold">
          {cur.start} – {cur.koniec}
        </div>

        <div
          className="tnum mt-[2.5vh] text-timer font-black leading-none"
          style={{ color: theme.accent, textShadow: `0 0 90px ${theme.glow}` }}
        >
          {formatCountdown(state.msUntilEnd ?? 0)}
        </div>
        <div className="muted mt-2 text-3xl font-semibold uppercase tracking-[0.3em]">
          do końca lekcji
        </div>

        <ProgressBar value={state.progress} accent={theme.accent} />

        {state.next && (
          <div className="glass mt-[4vh] flex items-center gap-4 rounded-full px-9 py-3 text-3xl">
            <span className="muted">Następnie:</span>
            <span className="font-bold">{state.next.name ?? `Lekcja ${state.next.nr}`}</span>
            <span className="tnum muted">· {state.next.start}</span>
          </div>
        )}
      </div>
    </Screen>
  );
}
