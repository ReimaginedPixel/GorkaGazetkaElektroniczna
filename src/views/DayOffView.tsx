import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import { formatPlDateLong } from '../util/datetime';
import type { ViewProps } from './types';

function headline(reason: string | null): { title: string; subtitle: string } {
  if (reason === 'weekend') return { title: 'Miłego weekendu! 🌿', subtitle: 'Dziś nie ma lekcji' };
  if (reason === 'no-lessons') return { title: 'Dziś nie ma lekcji', subtitle: 'Dzień bez zajęć' };
  // Konkretne święto / dzień wolny — pokaż jego nazwę.
  return { title: reason ?? 'Dzień wolny', subtitle: 'Dzień wolny od zajęć' };
}

/** Stan 6: WEEKEND / ŚWIĘTO / DZIEŃ WOLNY — jasny komunikat (niebieski). */
export function DayOffView({ state, theme, config, now, adminBase }: ViewProps) {
  const { title, subtitle } = headline(state.dayOffReason);

  return (
    <Screen theme={theme} chip="Dzień wolny" center={false}>
      <div className="text-center">
        <div className="text-timer-sm font-black leading-none" style={{ color: theme.accent }}>
          {title}
        </div>
        <div className="muted mt-[2vh] text-4xl">{subtitle}</div>
        <div className="muted mt-1 text-2xl capitalize">{formatPlDateLong(now)}</div>
      </div>
      <div className="relative mt-[3vh] flex-1">
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </div>
    </Screen>
  );
}
