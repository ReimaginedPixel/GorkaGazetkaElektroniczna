import { useState } from 'react';
import { TileFrame } from '../TileFrame';

/** Pełnoekranowe zdjęcie z efektem Ken Burns, podpisem i atrybucją autora. */
export function PhotoTile({ src, caption, credit }: { src: string; caption?: string; credit?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <TileFrame label="Z życia szkoły">
        <div className="muted text-4xl">Nie udało się wczytać zdjęcia</div>
      </TileFrame>
    );
  }
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={src}
        alt={caption ?? 'Zdjęcie ze szkoły'}
        onError={() => setFailed(true)}
        className="h-full w-full animate-kenburns object-cover"
      />
      {(caption || credit) && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-[3.5vh] text-center">
            {caption && (
              <div className="photo-shadow text-hero font-black text-white">{caption}</div>
            )}
            {credit && (
              <div className="photo-shadow mt-[1vh] text-xl font-medium text-white/75">{credit}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
