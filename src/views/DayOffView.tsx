import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import { GGHeading, GGIcon } from '../gg';
import { formatPlDateLong } from '../util/datetime';
import { FeedCard } from './FeedCard';
import type { ViewProps } from './types';

function headline(reason: string | null): { title: string; subtitle: string; icon: string } {
  if (reason === 'weekend') return { title: 'Miłego weekendu!', subtitle: 'Dziś nie ma lekcji', icon: 'sunglasses' };
  if (reason === 'no-lessons') return { title: 'Dziś nie ma lekcji', subtitle: 'Dzień bez zajęć', icon: 'backpack' };
  // Konkretne święto / dzień wolny - pokaż jego nazwę.
  return { title: reason ?? 'Dzień wolny', subtitle: 'Dzień wolny od zajęć', icon: 'sunglasses' };
}

/** Stan 6: WEEKEND / ŚWIĘTO / DZIEŃ WOLNY - jasny komunikat (cyjan). */
export function DayOffView({ state, theme, config, now, adminBase }: ViewProps) {
  const { title, subtitle, icon } = headline(state.dayOffReason);

  return (
    <Screen theme={theme} chip="Dzień wolny" brand={config.school.shortName} center={false}>
      <div className="flex items-center justify-center gap-[2vw] text-center">
        <GGIcon group="object" name={icon} className="w-[10vh] -rotate-12" />
        <div>
          <GGHeading
            className="text-mega"
            shadow={false}
            style={{ color: theme.accent, textShadow: `0.8vh 0.8vh 0 ${theme.shadow}` }}
          >
            {title}
          </GGHeading>
          <div className="muted mt-[1.5vh] font-ui text-big">
            {subtitle} · <span className="capitalize">{formatPlDateLong(now)}</span>
          </div>
        </div>
      </div>
      <FeedCard>
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </FeedCard>
    </Screen>
  );
}
