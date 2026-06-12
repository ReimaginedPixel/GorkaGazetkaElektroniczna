import { CountdownCard } from '../components/CountdownCard';
import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import type { ViewProps } from './types';

/** Stan 4: PRZED 1. LEKCJĄ — ekran powitalny. */
export function WelcomeView({ state, theme, config, now, adminBase }: ViewProps) {
  const next = state.next;
  const ms = state.msUntilNextStart ?? 0;

  return (
    <Screen theme={theme} chip="Dzień dobry" brand={config.school.shortName} center={false}>
      <div className="flex items-center justify-between gap-8">
        <div>
          <div className="text-hero font-black tracking-tight">Dzień dobry! 👋</div>
          <div className="muted mt-2 text-4xl">{config.school.name}</div>
          {next && (
            <div className="mt-3 text-4xl font-semibold">
              Pierwsza lekcja o{' '}
              <span className="tnum" style={{ color: theme.accent }}>
                {next.start}
              </span>
            </div>
          )}
        </div>
        <CountdownCard ms={ms} label="do pierwszej lekcji" theme={theme} />
      </div>

      <div className="feed-card relative mt-[2.5vh] flex-1">
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </div>
    </Screen>
  );
}
