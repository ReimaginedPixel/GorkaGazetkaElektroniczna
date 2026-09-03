import type { ReactNode } from 'react';
import { GGTape } from '../gg';

/** Rama feedu (story): die-cut karta z taśmą w rogu - wyraźnie oddziela feed od nagłówka. */
export function FeedCard({ children, label = 'Tablica' }: { children: ReactNode; label?: string }) {
  return (
    <div className="gg-surface relative mt-[3vh] flex-1 rotate-[0.4deg] overflow-visible">
      <GGTape className="absolute -top-[2vh] left-[2.4vw] z-20">{label}</GGTape>
      <div className="absolute inset-0 overflow-hidden rounded-[0.3vh]">{children}</div>
    </div>
  );
}
