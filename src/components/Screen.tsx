import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { GGChip, GGMeta, GGSplotch, GGSticker, GGTape } from '../gg';
import type { StatusTheme } from '../statusTheme';

interface ScreenProps {
  theme: StatusTheme;
  children: ReactNode;
  /** Tekst chipa statusu u góry. Domyślnie theme.name. */
  chip?: string;
  /** Mikro-podpis obok chipa (np. godziny lekcji). */
  sub?: string;
  /** Nazwa szkoły / brand na taśmie w prawym górnym rogu. */
  brand?: string;
  /** Wyśrodkuj treść w pionie (domyślnie tak). */
  center?: boolean;
  /**
   * Układ naklejek: `edges` - małe wlepki na rogach (widoki z feedem),
   * `hero` - duża maskotka po prawej (widok lekcji), `none` - bez.
   */
  stickers?: 'edges' | 'hero' | 'none';
}

/**
 * Wspólna „scena” widoku: ściana w kratkę, plamy sprayu w kolorze statusu,
 * chip statusu, taśma z brandem i naklejki na krawędziach.
 */
export function Screen({ theme, children, chip, sub, brand, center = true, stickers = 'edges' }: ScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col overflow-hidden"
    >
      {/* Spray w kolorze statusu - dwie plamy pod treścią. */}
      <GGSplotch
        art={theme.splotch}
        className="-left-[10vw] -top-[22vh] w-[46vw] opacity-60"
        style={{ transform: 'rotate(-8deg)' }}
      />
      <GGSplotch
        art={theme.splotch}
        className="-bottom-[26vh] -right-[12vw] w-[54vw] opacity-50"
        style={{ transform: 'rotate(12deg)' }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(120vh 80vh at 50% 30%, ${theme.glow}, transparent 70%)` }}
      />

      {/* Nagłówek: chip statusu + brand na taśmie. */}
      <div className="relative z-10 flex items-center justify-between px-[4vw] pt-[2.6vh]">
        <div className="flex items-center gap-[1.4vw]">
          <StatusChip theme={theme} label={chip ?? theme.name} />
          {sub && <GGMeta className="tnum text-[2vh]">{sub}</GGMeta>}
        </div>
        {brand && <GGTape className="rotate-[1.5deg]">{brand}</GGTape>}
      </div>

      <div
        className={`relative z-10 flex flex-1 flex-col px-[4vw] pb-[2.6vh] pt-[2vh] ${center ? 'justify-center' : 'justify-start'}`}
      >
        {children}
      </div>

      {stickers !== 'none' && <StatusStickers theme={theme} layout={stickers} />}
    </motion.div>
  );
}

export function StatusChip({ theme, label }: { theme: StatusTheme; label: string }) {
  if (!label) return null;
  return (
    <GGChip tone={theme.tone} tilt className="text-[2.3vh]">
      <span
        className="inline-block h-[1.6vh] w-[1.6vh] border-[length:var(--gg-bw-thin)] border-gg-edge bg-gg-halo"
        aria-hidden
      />
      {label}
    </GGChip>
  );
}

/** Wlepki stanu: maskotka + dwa drobiazgi. Nad treścią, jak naklejone na ramę. */
function StatusStickers({ theme, layout }: { theme: StatusTheme; layout: 'edges' | 'hero' }) {
  const [t1, t2] = theme.trinkets;
  if (layout === 'hero') {
    return (
      <>
        <GGSticker
          art={theme.blob}
          rotate={-6}
          float={7}
          className="absolute -bottom-[2vh] right-[5vw] z-20 w-[34vh]"
        />
        <GGSticker art={t1} rotate={12} float={5} delay={1} className="absolute left-[6vw] top-[16vh] z-20 w-[11vh]" />
        <GGSticker art={t2} rotate={-14} float={6} delay={2} className="absolute bottom-[8vh] left-[9vw] z-20 w-[9vh]" />
      </>
    );
  }
  return (
    <>
      <GGSticker
        art={theme.blob}
        rotate={-9}
        float={7}
        className="absolute -left-[1.2vw] bottom-[1.6vh] z-20 w-[17vh]"
      />
      <GGSticker art={t1} rotate={10} float={5} delay={1.2} className="absolute right-[3.2vw] top-[9.5vh] z-20 w-[8vh]" />
      <GGSticker art={t2} rotate={-12} float={6} delay={2.4} className="absolute -right-[0.6vw] bottom-[6vh] z-20 w-[9vh]" />
    </>
  );
}
