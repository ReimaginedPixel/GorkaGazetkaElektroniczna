import type { ReactNode } from 'react';
import type { ActiveLesson } from '@lib/schedule';
import { GGHeading, GGNum } from '../gg';

/**
 * Wspólny nagłówek widoków z feedem: tytuł Zupiter + linia „Następnie: …”.
 * Licznik (CountdownCard) wstawiany jest przez widok obok.
 */
export function FeedHeader({
  title,
  next,
  subtitle,
  children,
}: {
  title: ReactNode;
  next?: ActiveLesson | null;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  const nextLabel = next ? (next.name ?? `Lekcja ${next.nr}`) : 'następna lekcja';
  return (
    <div className="flex items-center justify-between gap-[2vw]">
      <div className="min-w-0">
        <GGHeading className="text-hero">{title}</GGHeading>
        {subtitle !== undefined ? (
          <div className="muted mt-[1vh] font-ui text-big">{subtitle}</div>
        ) : (
          <div className="muted mt-[1vh] font-ui text-big">
            Następnie: <span className="strong">{nextLabel}</span>
            {next && (
              <>
                {' '}
                · start <GGNum className="strong">{next.start}</GGNum>
              </>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
