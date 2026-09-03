import type { ReactNode } from 'react';
import { GGChip, GGIcon, type GGIconGroup, type GGTone } from '../gg';

/** Wspólna ramka kafla feedu - duża, wyśrodkowana treść z chipem-etykietą. */
export function TileFrame({
  label,
  icon,
  tone = 'yellow',
  children,
}: {
  label?: string;
  /** Ikona liniowa w chipie: [grupa, nazwa]. */
  icon?: [GGIconGroup, string];
  tone?: GGTone;
  children: ReactNode;
}) {
  return (
    <div className="gg-graph flex h-full w-full flex-col items-center justify-start gap-[2vh] px-[6vw] pb-[3vh] pt-[5.5vh] text-center">
      {label && (
        <GGChip tone={tone} tilt className="shrink-0 text-[2.2vh]">
          {icon && <GGIcon group={icon[0]} name={icon[1]} ink="dark" className="w-[3.2vh]" />}
          {label}
        </GGChip>
      )}
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden">{children}</div>
    </div>
  );
}
