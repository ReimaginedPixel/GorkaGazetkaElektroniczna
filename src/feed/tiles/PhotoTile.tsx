import { useState } from 'react';
import { GGDotWash, GGSurface } from '../../gg';
import { TileFrame } from '../TileFrame';

/** Pełnoekranowe zdjęcie z efektem Ken Burns, rastrem i podpisem na die-cut karcie. */
export function PhotoTile({ src, caption, credit }: { src: string; caption?: string; credit?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <TileFrame label="Z życia szkoły" icon={['fun', 'flag']}>
        <div className="muted font-ui text-big">Nie udało się wczytać zdjęcia</div>
      </TileFrame>
    );
  }
  return (
    <div className="relative h-full w-full overflow-hidden bg-gg-deep">
      <img
        src={src}
        alt={caption ?? 'Zdjęcie ze szkoły'}
        onError={() => setFailed(true)}
        className="h-full w-full animate-kenburns object-cover"
      />
      <GGDotWash opacity={0.4} />
      {(caption || credit) && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32vh] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-[4vh] left-[8vw] max-w-[66vw]">
            {caption && (
              <GGSurface variant="deep" tilt="l" className="inline-block px-[2vw] py-[1.4vh]">
                <div
                  className="font-display text-h2 uppercase leading-tight text-white"
                  style={{ textShadow: '0.4vh 0.4vh 0 var(--gg-pink)' }}
                >
                  {caption}
                </div>
              </GGSurface>
            )}
            {credit && (
              <div className="photo-shadow mt-[1.6vh] font-mono text-[1.6vh] uppercase tracking-[0.15em] text-white/80">
                {credit}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
