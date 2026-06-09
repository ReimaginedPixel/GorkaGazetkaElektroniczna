import { formatCountdown, minutesCeil, plMinutes } from '@lib/format';
import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import type { ViewProps } from './types';

/** Stan 4: PRZED 1. LEKCJĄ — ekran powitalny. */
export function WelcomeView({ state, theme, config, now, adminBase }: ViewProps) {
  const next = state.next;
  const ms = state.msUntilNextStart ?? 0;

  return (
    <Screen theme={theme} chip="Dzień dobry" center={false}>
      <div className="flex items-end justify-between gap-8">
        <div>
          <div className="text-hero font-black leading-none">Dzień dobry! 👋</div>
          <div className="muted mt-[1.5vh] text-4xl">{config.school.name}</div>
        </div>
        {next && (
          <div className="text-right shrink-0">
            <div className="tnum text-timer-sm font-black leading-none" style={{ color: theme.accent }}>
              {next.start}
            </div>
            <div className="muted mt-1 text-2xl uppercase tracking-wide">
              pierwsza lekcja · za {plMinutes(minutesCeil(ms))}
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-[3vh] flex-1">
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </div>
    </Screen>
  );
}
