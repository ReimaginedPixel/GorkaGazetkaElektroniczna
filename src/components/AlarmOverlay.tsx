import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Announcement } from '@lib/types';
import { GGDotWash, GGIcon, GGSticker, GGSurface } from '../gg';

/**
 * Pilne ogłoszenia przejmują CAŁY ekran na różowo (alarm w palecie GórkaGuesser).
 * Jeśli jest ich kilka - rotują co kilka sekund.
 */
export function AlarmOverlay({ alarms }: { alarms: Announcement[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (alarms.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % alarms.length), 7000);
    return () => clearInterval(id);
  }, [alarms.length]);

  const current = alarms[index % alarms.length];
  if (!current) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-status-alarm text-white">
      <GGDotWash opacity={0.35} />
      <GGSticker art="blobShocked" rotate={8} float={4} className="absolute -bottom-[3vh] right-[4vw] w-[32vh]" />
      <GGSticker art="sparkleWhite" rotate={-10} float={5} delay={1} className="absolute left-[6vw] top-[10vh] w-[10vh]" />
      <GGSticker art="sparkleWhite" rotate={20} float={6} delay={2} className="absolute bottom-[12vh] left-[12vw] w-[7vh]" />

      <motion.div
        className="relative flex items-center gap-[2vw] font-display text-mega uppercase"
        style={{ textShadow: '0.8vh 0.8vh 0 var(--gg-pink-deep)' }}
        animate={{ opacity: [1, 0.55, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <GGIcon group="ui" name="bubble-alert" ink="light" className="w-[11vh] -rotate-6" />
        <span>Pilne</span>
        <GGIcon group="ui" name="bubble-alert" ink="light" className="w-[11vh] rotate-6" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 30, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="relative mt-[4vh] max-w-[80vw]"
        >
          <GGSurface className="px-[3vw] py-[3vh] text-center">
            <p className="font-ui text-hero font-bold leading-tight text-gg-ink">{current.text}</p>
          </GGSurface>
        </motion.div>
      </AnimatePresence>

      {alarms.length > 1 && (
        <div className="absolute bottom-[5vh] flex gap-[1vw]">
          {alarms.map((a, i) => (
            <span
              key={a.id}
              className="h-[2vh] w-[2vh] border-[length:var(--gg-bw-thin)] border-gg-edge bg-white"
              style={{ opacity: i === index % alarms.length ? 1 : 0.4 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
