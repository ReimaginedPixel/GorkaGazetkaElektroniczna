import { formatCountdown } from '@lib/format';
import { GGHeading, GGIcon, GGMeta, GGNum, GGSurface } from '../gg';
import { Screen } from '../components/Screen';
import { ProgressBar } from '../components/ProgressBar';
import type { ViewProps } from './types';

/** Stan 1: LEKCJA TRWA - gigantyczny timer do końca lekcji. */
export function LessonView({ state, theme, config }: ViewProps) {
  const cur = state.current;
  if (!cur) return null;
  const title = cur.name ?? `Lekcja ${cur.nr}`;

  return (
    <Screen
      theme={theme}
      chip={`Lekcja ${cur.nr}`}
      sub={`${cur.start} – ${cur.koniec}`}
      brand={config.school.shortName}
      stickers="hero"
    >
      <div className="flex flex-col items-center text-center">
        <GGHeading className="flex items-center gap-[1.4vw] text-hero">
          <GGIcon group="object" name="book" className="w-[7vh] -rotate-6" />
          {title}
        </GGHeading>

        <GGNum
          className="mt-[2vh] block text-timer"
          style={{ color: theme.accent, textShadow: `0.9vh 0.9vh 0 ${theme.shadow}` }}
        >
          {formatCountdown(state.msUntilEnd ?? 0)}
        </GGNum>
        <GGMeta className="mt-[1vh] text-[2.4vh]">do końca lekcji</GGMeta>

        <ProgressBar value={state.progress} accent={theme.accent} shadow={theme.shadow} />

        {state.next && (
          <GGSurface variant="flat" tilt="l" className="mt-[4.5vh] flex items-center gap-[1.2vw] px-[2.2vw] py-[1.2vh]">
            <span className="border-r-[length:var(--gg-bw-thin)] border-dashed border-gg-rule pr-[1.2vw] font-mono text-chip font-bold uppercase text-gg-meta">
              Następnie
            </span>
            <span className="font-display text-big uppercase text-gg-ink">
              {state.next.name ?? `Lekcja ${state.next.nr}`}
            </span>
            <GGNum className="text-big text-gg-muted">· {state.next.start}</GGNum>
          </GGSurface>
        )}
      </div>
    </Screen>
  );
}
