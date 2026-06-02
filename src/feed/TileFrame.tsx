import type { ReactNode } from 'react';

/** Wspólna ramka kafla feedu — duża, wyśrodkowana treść z etykietą. */
export function TileFrame({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[4vh] px-[6vw] text-center">
      {label && (
        <div className="muted text-3xl font-semibold uppercase tracking-[0.2em]">{label}</div>
      )}
      <div className="flex w-full flex-1 flex-col items-center justify-center">{children}</div>
    </div>
  );
}
