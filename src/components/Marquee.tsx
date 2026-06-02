import type { CSSProperties } from 'react';

/** Płynnie przewijany pasek ogłoszeń (bez migotania, pętla bezszwowa). */
export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  const text = items.join('     •     ');
  // Czas trwania proporcjonalny do długości tekstu (stała prędkość).
  const duration = Math.max(24, text.length * 0.45);
  const style = { ['--marquee-duration' as string]: `${duration}s` } as CSSProperties;
  return (
    <div className="relative overflow-hidden whitespace-nowrap">
      <div className="inline-flex animate-marquee" style={style}>
        <span className="px-8">{text}</span>
        <span className="px-8" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  );
}
