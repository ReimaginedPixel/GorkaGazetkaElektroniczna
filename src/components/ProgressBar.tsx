import type { CSSProperties } from 'react';

/** Wpuszczony tor + ukośne cukierkowe wypełnienie w kolorze statusu. */
export function ProgressBar({
  value,
  accent,
  shadow,
  width = '60vw',
  height = '2.6vh',
}: {
  value: number;
  accent: string;
  /** Drugi kolor pasków (domyślnie ciemniejszy tusz). */
  shadow?: string;
  width?: string;
  height?: string;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const fill = {
    ['--fill-a' as string]: accent,
    ['--fill-b' as string]: shadow ?? 'var(--gg-edge)',
    width: `calc(${Math.max(pct, 2)}% - 0.7vh)`,
    transition: 'width 1s linear',
  } as CSSProperties;
  return (
    <div
      className="gg-track mt-[4vh] -rotate-[0.4deg]"
      style={{ width, height }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="gg-track-fill" style={fill} />
    </div>
  );
}
