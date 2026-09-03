import { formatCountdown } from '@lib/format';
import { GGIcon, GGNum, GGPanel } from '../gg';
import type { StatusTheme } from '../statusTheme';

/** Duży licznik w die-cut panelu z ciemną belką - kotwica nagłówka widoku. */
export function CountdownCard({ ms, label, theme }: { ms: number; label: string; theme: StatusTheme }) {
  return (
    <GGPanel
      tilt="r2"
      className="shrink-0 animate-ggtick"
      title={
        <span className="flex items-center gap-[0.8vw]">
          <GGIcon group="fun" name="hourglass" ink="light" className="w-[2.6vh]" />
          {label}
        </span>
      }
      bodyClassName="px-[2.4vw] py-[1.2vh] text-center"
    >
      <GGNum
        className="block text-[11.5vh]"
        style={{ color: theme.accent, textShadow: `0.6vh 0.6vh 0 ${theme.shadow}` }}
      >
        {formatCountdown(ms)}
      </GGNum>
    </GGPanel>
  );
}
