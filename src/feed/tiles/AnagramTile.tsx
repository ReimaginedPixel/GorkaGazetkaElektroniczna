import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { GGMeta } from '../../gg';
import { TileFrame } from '../TileFrame';

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pasywna gra BEZ inputu (monitor bez klawiatury): anagram „odsłania się” sam,
 * litera po literze od lewej. Litery to die-cut klocki - rozwiązane robią
 * się żółte i lądują jak naklejka.
 */
export function AnagramTile({ answer, hint }: { answer: string; hint?: string }) {
  const letters = useMemo(() => answer.toUpperCase().replace(/\s+/g, '').split(''), [answer]);
  const scrambled = useMemo(() => shuffle(letters), [letters]);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
    const id = setInterval(() => {
      setRevealed((r) => (r >= letters.length ? r : r + 1));
    }, 850);
    return () => clearInterval(id);
  }, [letters.length]);

  return (
    <TileFrame label="Rozszyfruj słowo" icon={['fun', 'puzzle']} tone="purple">
      <div className="flex flex-wrap items-center justify-center gap-[1.6vh]">
        {letters.map((ch, i) => {
          const solved = i < revealed;
          const tilt = (i % 3) - 1; // -1, 0, 1 stopień - nic nie jest idealnie prosto
          return (
            <motion.div
              key={i}
              animate={solved ? { scale: [0.82, 1.08, 1], rotate: tilt * 2 } : { scale: 1, rotate: tilt }}
              transition={{ duration: 0.34, ease: [0.2, 1.4, 0.4, 1] }}
              className={`flex h-[16vh] w-[12vh] items-center justify-center font-display text-mega ${
                solved ? 'gg-surface !bg-gg-yellow text-[#141118]' : 'gg-surface-flat text-gg-meta'
              }`}
            >
              {solved ? ch : scrambled[i]}
            </motion.div>
          );
        })}
      </div>
      {hint && (
        <GGMeta className="mt-[4vh] text-[2.2vh]">
          Podpowiedź: <span className="font-ui normal-case tracking-normal text-gg-muted">{hint}</span>
        </GGMeta>
      )}
    </TileFrame>
  );
}
