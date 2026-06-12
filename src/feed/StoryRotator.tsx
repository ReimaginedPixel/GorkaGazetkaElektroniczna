import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import type { AppConfig } from '@lib/types';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { resolveAsset } from './assets';
import { GORKA_PHOTOS } from './gorkaPhotos';
import { TileFrame } from './TileFrame';
import { PhotoTile } from './tiles/PhotoTile';
import { WordOfDayTile } from './tiles/WordOfDayTile';
import { FactTile } from './tiles/FactTile';
import { QrTile } from './tiles/QrTile';
import { BirthdaysTile } from './tiles/BirthdaysTile';
import { EventsTile } from './tiles/EventsTile';
import { CountersTile } from './tiles/CountersTile';
import { AnagramTile } from './tiles/AnagramTile';

interface Slide {
  key: string;
  node: ReactNode;
}

interface Props {
  config: AppConfig;
  now: Date;
  adminBase: string;
  /** Nadpisanie czasu kafla (np. dłuższa rotacja w długiej przerwie). */
  intervalSeconds?: number;
}

function buildSlides(config: AppConfig, now: Date, adminBase: string): Slide[] {
  const t = config.tiles;
  const photoSlides: Slide[] = [];
  const infoSlides: Slide[] = [];

  if (t.photos) {
    // Wbudowane zdjęcia okolic Górki + zdjęcia wgrane w panelu admina.
    GORKA_PHOTOS.forEach((p, i) =>
      photoSlides.push({
        key: `gorka-${i}`,
        node: <PhotoTile src={p.src} caption={p.caption} credit={p.credit} />,
      }),
    );
    config.photos.forEach((p, i) =>
      photoSlides.push({ key: `photo-${i}`, node: <PhotoTile src={resolveAsset(p, adminBase)} /> }),
    );
  }
  if (t.wordOfDay && config.wordOfDay) {
    infoSlides.push({ key: 'wod', node: <WordOfDayTile word={config.wordOfDay} /> });
  }
  if (t.fact) {
    config.facts.forEach((f, i) => infoSlides.push({ key: `fact-${i}`, node: <FactTile fact={f} /> }));
  }
  if (t.qr) {
    config.qrCodes
      .filter((q) => q.enabled !== false && q.url)
      .forEach((q, i) => infoSlides.push({ key: `qr-${i}`, node: <QrTile label={q.label} url={q.url} /> }));
  }
  if (t.birthdays && config.birthdays.length > 0) {
    infoSlides.push({ key: 'bday', node: <BirthdaysTile birthdays={config.birthdays} now={now} /> });
  }
  if (t.events && config.events.length > 0) {
    infoSlides.push({ key: 'events', node: <EventsTile events={config.events} now={now} /> });
  }
  if (t.counters && Object.values(config.importantDates).some(Boolean)) {
    infoSlides.push({ key: 'counters', node: <CountersTile dates={config.importantDates} now={now} /> });
  }
  if (t.anagram) {
    config.anagrams.forEach((a, i) =>
      infoSlides.push({ key: `ana-${i}`, node: <AnagramTile answer={a.answer} hint={a.hint} /> }),
    );
  }

  // Przeplot zdjęć z kaflami informacyjnymi — rotacja jest bardziej różnorodna
  // niż długi blok samych zdjęć albo samego tekstu.
  const slides: Slide[] = [];
  const rounds = Math.max(photoSlides.length, infoSlides.length);
  for (let i = 0; i < rounds; i++) {
    if (photoSlides[i]) slides.push(photoSlides[i]);
    if (infoSlides[i]) slides.push(infoSlides[i]);
  }

  if (slides.length === 0) {
    slides.push({
      key: 'placeholder',
      node: (
        <TileFrame label={config.school.shortName}>
          <div className="text-hero font-bold">{config.school.name}</div>
        </TileFrame>
      ),
    });
  }
  return slides;
}

/** Pełnoekranowa rotacja kafli (jak InstaStory) z animowanym paskiem postępu. */
export function StoryRotator({ config, now, adminBase, intervalSeconds }: Props) {
  const dayKey = now.toDateString();
  // Struktura slajdów odświeża się raz na dobę / przy zmianie configu (nie co 1s).
  const slides = useMemo(
    () => buildSlides(config, now, adminBase),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, adminBase, dayKey],
  );

  const intervalMs = Math.max(4, intervalSeconds ?? config.story.intervalSeconds ?? 11) * 1000;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearTimeout(id);
  }, [index, slides.length, intervalMs]);

  const current = slides[index] ?? slides[0];

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Delikatny scrim u góry — segmenty postępu czytelne także na zdjęciach. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[9vh] bg-gradient-to-b from-black/55 to-transparent" />

      {/* Pasek postępu (segmenty jak w InstaStory) */}
      <div className="absolute inset-x-[2.5vw] top-[2.2vh] z-10 flex gap-2">
        {slides.map((s, i) => (
          <div
            key={s.key}
            className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/25 shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
          >
            {i < index && <div className="absolute inset-0 bg-white" />}
            {i === index && (
              <motion.div
                key={`fill-${index}-${s.key}`}
                className="absolute inset-y-0 left-0 bg-white"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: intervalMs / 1000, ease: 'linear' }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <ErrorBoundary
            label={current.key}
            fallback={
              <TileFrame label="">
                <div className="muted text-4xl">Nie udało się wczytać kafla</div>
              </TileFrame>
            }
          >
            {current.node}
          </ErrorBoundary>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
