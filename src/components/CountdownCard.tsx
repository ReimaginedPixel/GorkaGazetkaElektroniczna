import { formatCountdown } from '@lib/format';
import type { StatusTheme } from '../statusTheme';

/** Duży licznik w „szklanej” karcie z akcentem statusu — kotwica nagłówka widoku. */
export function CountdownCard({
  ms,
  label,
  theme,
}: {
  ms: number;
  label: string;
  theme: StatusTheme;
}) {
  return (
    <div
      className="glass shrink-0 px-[2.5vw] py-[1.6vh] text-center"
      style={{ borderColor: `${theme.accent}55`, boxShadow: `0 0 60px ${theme.glow}` }}
    >
      <div className="tnum text-timer-sm font-black leading-none" style={{ color: theme.accent }}>
        {formatCountdown(ms)}
      </div>
      <div className="muted mt-[1vh] text-2xl font-semibold uppercase tracking-[0.25em]">
        {label}
      </div>
    </div>
  );
}
