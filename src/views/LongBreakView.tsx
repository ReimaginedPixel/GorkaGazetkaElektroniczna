import { CountdownCard } from '../components/CountdownCard';
import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import { GGIcon } from '../gg';
import { FeedCard } from './FeedCard';
import { FeedHeader } from './FeedHeader';
import type { ViewProps } from './types';

/**
 * Stan 3: DŁUGA PRZERWA - osobny, ciekawszy widok. Większa rotacja feedu
 * (wolniejsze, dłuższe kafle) i wyraźniejszy nagłówek.
 */
export function LongBreakView({ state, theme, config, now, adminBase }: ViewProps) {
  const ms = state.msUntilNextStart ?? 0;

  return (
    <Screen theme={theme} chip="Długa przerwa" brand={config.school.shortName} center={false}>
      <FeedHeader
        title={
          <span className="flex items-center gap-[1.2vw]">
            Czas na dłuższą przerwę
            <GGIcon group="object" name="pizza" className="w-[7vh] -rotate-6" />
          </span>
        }
        next={state.next}
      >
        <CountdownCard ms={ms} label="do dzwonka" theme={theme} />
      </FeedHeader>

      <FeedCard>
        {/* Wolniejsza rotacja niż w zwykłej przerwie. */}
        <StoryRotator
          config={config}
          now={now}
          adminBase={adminBase}
          intervalSeconds={Math.max(8, (config.story.intervalSeconds ?? 11) + 3)}
        />
      </FeedCard>
    </Screen>
  );
}
