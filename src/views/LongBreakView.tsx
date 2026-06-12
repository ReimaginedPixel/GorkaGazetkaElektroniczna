import { CountdownCard } from '../components/CountdownCard';
import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import type { ViewProps } from './types';

/**
 * Stan 3: DŁUGA PRZERWA — osobny, ciekawszy widok. Większa rotacja feedu
 * (wolniejsze, dłuższe kafle) i wyraźniejszy nagłówek.
 */
export function LongBreakView({ state, theme, config, now, adminBase }: ViewProps) {
  const next = state.next;
  const ms = state.msUntilNextStart ?? 0;
  const nextLabel = next ? (next.name ?? `Lekcja ${next.nr}`) : 'następna lekcja';

  return (
    <Screen theme={theme} chip="Długa przerwa" brand={config.school.shortName} center={false}>
      <div className="flex items-center justify-between gap-8">
        <div>
          <div className="text-hero font-black tracking-tight">Czas na dłuższą przerwę 🎒</div>
          <div className="muted mt-2 text-4xl">
            Następnie: <span className="strong">{nextLabel}</span>
            {next && (
              <>
                {' '}· start <span className="tnum strong">{next.start}</span>
              </>
            )}
          </div>
        </div>
        <CountdownCard ms={ms} label="do dzwonka" theme={theme} />
      </div>

      <div className="feed-card relative mt-[2.5vh] flex-1">
        {/* Wolniejsza rotacja niż w zwykłej przerwie. */}
        <StoryRotator
          config={config}
          now={now}
          adminBase={adminBase}
          intervalSeconds={Math.max(8, (config.story.intervalSeconds ?? 11) + 3)}
        />
      </div>
    </Screen>
  );
}
