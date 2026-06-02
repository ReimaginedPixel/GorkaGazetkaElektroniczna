import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Announcement } from '@lib/types';

/**
 * Pilne ogłoszenia przejmują CAŁY ekran na czerwono.
 * Jeśli jest ich kilka — rotują co kilka sekund.
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
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-status-alarm text-white">
      <motion.div
        className="flex items-center gap-6 text-mega font-black uppercase"
        animate={{ opacity: [1, 0.55, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span aria-hidden>⚠</span>
        <span>Pilne</span>
        <span aria-hidden>⚠</span>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.p
          key={current.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="mt-[4vh] max-w-[80vw] text-center text-hero font-bold leading-tight"
        >
          {current.text}
        </motion.p>
      </AnimatePresence>

      {alarms.length > 1 && (
        <div className="absolute bottom-[5vh] flex gap-3">
          {alarms.map((a, i) => (
            <span
              key={a.id}
              className="h-3 w-3 rounded-full bg-white"
              style={{ opacity: i === index % alarms.length ? 1 : 0.4 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
