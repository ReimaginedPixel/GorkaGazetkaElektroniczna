import { CountdownCard } from '../components/CountdownCard';
import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import { GGIcon, GGNum } from '../gg';
import { FeedCard } from './FeedCard';
import { FeedHeader } from './FeedHeader';
import type { ViewProps } from './types';

/** Stan 4: PRZED 1. LEKCJĄ - ekran powitalny. */
export function WelcomeView({ state, theme, config, now, adminBase }: ViewProps) {
  const next = state.next;
  const ms = state.msUntilNextStart ?? 0;

  return (
    <Screen theme={theme} chip="Dzień dobry" brand={config.school.shortName} center={false}>
      <FeedHeader
        title={
          <span className="flex items-center gap-[1.2vw]">
            Dzień dobry!
            <GGIcon group="nature" name="sun" className="w-[7vh] rotate-12" />
          </span>
        }
        subtitle={
          <>
            {config.school.name}
            {next && (
              <>
                {' '}
                · pierwsza lekcja o{' '}
                <GGNum className="strong" style={{ color: theme.accent }}>
                  {next.start}
                </GGNum>
              </>
            )}
          </>
        }
      >
        <CountdownCard ms={ms} label="do pierwszej lekcji" theme={theme} />
      </FeedHeader>

      <FeedCard>
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </FeedCard>
    </Screen>
  );
}
