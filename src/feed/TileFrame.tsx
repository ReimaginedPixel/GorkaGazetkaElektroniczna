import type { ReactNode } from 'react';

/** Wspólna ramka kafla feedu — duża, wyśrodkowana treść z etykietą. */
export function TileFrame({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[3vh] px-[6vw] text-center">
      {label && (
        <div className="flex flex-col items-center gap-[1.4vh]">
          <div className="h-px w-[6vw] bg-white/20" />
          <div className="muted text-3xl font-semibold uppercase tracking-[0.22em]">{label}</div>
        </div>
      )}
      <div className="flex w-full flex-1 flex-col items-center justify-center">{children}</div>
    </div>
  );
}
