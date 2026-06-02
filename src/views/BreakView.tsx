import { formatCountdown, minutesCeil, plMinutes } from '@lib/format';
import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import type { ViewProps } from './types';

/** Stan 2: PRZERWA ZWYKŁA — komunikat + feed w pozostałej przestrzeni. */
export function BreakView({ state, theme, config, now, adminBase }: ViewProps) {
  const next = state.next;
  const ms = state.msUntilNextStart ?? 0;
  const nextLabel = next ? (next.name ?? `lekcji ${next.nr}`) : 'następnej lekcji';

  return (
    <Screen theme={theme} chip="Przerwa" center={false}>
      <div className="flex items-end justify-between gap-8">
        <div>
          <div className="text-hero font-bold">Trwa przerwa</div>
          <div className="muted mt-2 text-4xl">
            Do {nextLabel}: pozostało {plMinutes(minutesCeil(ms))}
          </div>
        </div>
        <div className="text-right">
          <div className="tnum text-timer-sm font-black leading-none" style={{ color: theme.accent }}>
            {formatCountdown(ms)}
          </div>
          <div className="muted text-2xl uppercase tracking-wide">do dzwonka</div>
        </div>
      </div>

      <div className="relative mt-[2vh] flex-1">
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </div>
    </Screen>
  );
}
