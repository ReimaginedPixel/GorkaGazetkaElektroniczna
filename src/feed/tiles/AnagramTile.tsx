import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
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
 * litera po literze od lewej. Czysto wizualne.
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
    <TileFrame label="Rozszyfruj słowo">
      <div className="flex flex-wrap items-center justify-center gap-[1.4vh]">
        {letters.map((ch, i) => {
          const solved = i < revealed;
          return (
            <motion.div
              key={i}
              animate={solved ? { rotateX: 0, scale: 1 } : { rotateX: 0 }}
              className="flex h-[16vh] w-[12vh] items-center justify-center rounded-2xl border-2 text-mega font-black"
              style={{
                borderColor: solved ? '#A855F7' : 'rgba(255,255,255,0.18)',
                color: solved ? '#fff' : 'rgba(255,255,255,0.5)',
                background: solved ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.04)',
              }}
            >
              {solved ? ch : scrambled[i]}
            </motion.div>
          );
        })}
      </div>
      {hint && <div className="muted mt-[4vh] text-4xl">Podpowiedź: {hint}</div>}
    </TileFrame>
  );
}
