import { useState } from 'react';
import { TileFrame } from '../TileFrame';

export function PhotoTile({ src, caption }: { src: string; caption?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <TileFrame label="Z życia szkoły">
        <div className="muted text-4xl">Nie udało się wczytać zdjęcia</div>
      </TileFrame>
    );
  }
  return (
    <div className="relative h-full w-full">
      <img
        src={src}
        alt={caption ?? 'Zdjęcie ze szkoły'}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-[4vh] text-center">
          <span className="text-hero font-bold text-white">{caption}</span>
        </div>
      )}
    </div>
  );
}
