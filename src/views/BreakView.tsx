import { CountdownCard } from '../components/CountdownCard';
import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import { GGIcon } from '../gg';
import { FeedCard } from './FeedCard';
import { FeedHeader } from './FeedHeader';
import type { ViewProps } from './types';

/** Stan 2: PRZERWA ZWYKŁA - wyraźny licznik + feed w ramce. */
export function BreakView({ state, theme, config, now, adminBase }: ViewProps) {
  const ms = state.msUntilNextStart ?? 0;

  return (
    <Screen theme={theme} chip="Przerwa" brand={config.school.shortName} center={false}>
      <FeedHeader
        title={
          <span className="flex items-center gap-[1.2vw]">
            Przerwa
            <GGIcon group="object" name="coffee-mug" className="w-[7vh] rotate-6" />
          </span>
        }
        next={state.next}
      >
        <CountdownCard ms={ms} label="do dzwonka" theme={theme} />
      </FeedHeader>

      <FeedCard>
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </FeedCard>
    </Screen>
  );
}
