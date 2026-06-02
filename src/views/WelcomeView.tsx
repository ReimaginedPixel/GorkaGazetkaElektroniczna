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
      <div className="flex flex-col items-center text-center">
        <div className="text-timer-sm font-black leading-none">Dzień dobry! 👋</div>
        <div className="muted mt-[2vh] text-4xl">{config.school.name}</div>
        {next && (
          <div className="mt-[3vh] text-5xl font-semibold">
            Pierwsza lekcja o <span className="tnum" style={{ color: theme.accent }}>{next.start}</span>
          </div>
        )}
        <div className="muted mt-2 text-3xl">
          Start za {plMinutes(minutesCeil(ms))} ·{' '}
          <span className="tnum">{formatCountdown(ms)}</span>
        </div>
      </div>

      <div className="relative mt-[3vh] flex-1">
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </div>
    </Screen>
  );
}
