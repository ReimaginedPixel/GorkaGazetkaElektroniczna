/**
 * Manifest grafik z design systemu GórkaGuesser (public/gg).
 *
 * Jedyny plik, który zna ścieżki do plików. Ścieżki są WZGLĘDNE (bez wiodącego
 * "/") - tak samo jak wbudowane zdjęcia okolicy - żeby działały i w dev
 * (http://localhost), i w wersji spakowanej (file://).
 *
 * Źródło: repo gorkaguesser-recoded, `public/gg/` (Claude Design project).
 * Dodanie grafiki = wrzucenie pliku do public/gg/assets + jedna linia niżej.
 */

const A = (file: string) => `gg/assets/${file}`;

export const GG_ART = {
  // ── Maskotki (bloby) ───────────────────────────────────────────────────
  blobIdle: A('blob-idle.png'),
  blobThinking: A('blob-thinking.png'),
  blobLaughing: A('blob-laughing.png'),
  blobCelebrate: A('blob-celebrate.png'),
  blobSleeping: A('blob-sleeping.png'),
  blobCool: A('blob-cool.png'),
  blobShocked: A('blob-shocked.png'),
  blobNervous: A('blob-nervous.png'),

  // ── Plamy sprayu (podkłady die-cut) ────────────────────────────────────
  splotchBlue: A('cut-splotch-blue.png'),
  splotchGold: A('cut-splotch-gold.png'),
  splotchLavender: A('cut-splotch-lavender.png'),
  splotchMagenta: A('cut-splotch-magenta.png'),
  splotchMint: A('cut-splotch-mint.png'),
  splotchPink: A('cut-splotch-pink.png'),

  // ── Wlepki / drobiazgi Y2K ─────────────────────────────────────────────
  star: A('star.png'),
  sparkleStar: A('sparkle-star.png'),
  sparkleWhite: A('sparkle-white.png'),
  sparkleBlack: A('sparkle-black.png'),
  pixelHeart: A('pixel-heart.png'),
  smileyRed: A('smiley-red.png'),
  balloon: A('balloon.png'),
  cd: A('cd.png'),
  butterfly: A('butterfly.png'),
  planetBlack: A('planet-black.png'),
  planetWhite: A('planet-white.png'),
  knot: A('knot.png'),
  confetti: A('confetti.png'),
  flowerSpray: A('cut-flower-spray.png'),
  gorkaChrome: A('gorka-chrome.png'),

  // ── Meble UI ───────────────────────────────────────────────────────────
  hourglass: A('hourglass.png'),
  stopwatch: A('stopwatch.png'),
  calendar: A('streak-calendar.png'),
  frameTape: A('frame-tape.png'),
  framePicture: A('frame-picture.png'),
  paperTeal: A('paper-teal.png'),
  graphBg: A('graph-bg.jpg'),
} as const;

export type GGArtKey = keyof typeof GG_ART;

/** Ścieżka grafiki po kluczu z manifestu. */
export function ggArt(key: GGArtKey): string {
  return GG_ART[key];
}

/* ── Ikony liniowe (public/gg/icons/<grupa>/<grupa>_<nazwa>.png) ───────────
   Rysowane czarnym tuszem - na ciemnej ścianie odwracamy (klasa .gg-inkart). */
export type GGIconGroup = 'emoji' | 'fun' | 'hexbtn' | 'nature' | 'object' | 'ui';

export function ggIcon(group: GGIconGroup, name: string): string {
  return `gg/icons/${group}/${group}_${name}.png`;
}
