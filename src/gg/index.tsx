/**
 * Prymitywy design systemu GórkaGuesser przeskalowane na kiosk.
 *
 * Wszystko tutaj to wariacje jednej reguły: czarna obwódka + kremowe halo +
 * twardy przesunięty cień, o stopień-dwa przekrzywione. Rozmiary w vh/vw,
 * bo ekran czyta się z 5–10 m.
 */
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { ggArt, ggIcon, type GGArtKey, type GGIconGroup } from './assets';

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* ── Kolory-akcenty ─────────────────────────────────────────────────────── */
export type GGTone = 'yellow' | 'pink' | 'lime' | 'purple' | 'cyan' | 'orange' | 'cream' | 'ink';

const TONE_BG: Record<GGTone, string> = {
  yellow: 'bg-gg-yellow text-[#141118]',
  pink: 'bg-gg-pink text-white',
  lime: 'bg-gg-lime text-[#141118]',
  purple: 'bg-gg-purple text-white',
  cyan: 'bg-gg-cyan text-[#141118]',
  orange: 'bg-gg-orange text-[#141118]',
  cream: 'bg-gg-halo text-[#141118]',
  ink: 'bg-gg-deep text-white',
};

/* ── Przekrzywienia ─────────────────────────────────────────────────────── */
export type GGTilt = 'none' | 'l' | 'r' | 'l2' | 'r2';
const TILT: Record<GGTilt, string> = {
  none: '',
  l: '-rotate-[0.7deg]',
  r: 'rotate-[0.5deg]',
  l2: '-rotate-[2deg]',
  r2: 'rotate-[1.5deg]',
};

/* ── Powierzchnie ───────────────────────────────────────────────────────── */
export interface GGSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** `flat` bez halo (gęste/zagnieżdżone), `deep` ciemna, `sketch` przerywana na kartce. */
  variant?: 'default' | 'flat' | 'deep' | 'sketch';
  tilt?: GGTilt;
}

/** Sygnaturowa karta: czarna obwódka, kremowe halo, twardy cień, lekko przekrzywiona. */
export function GGSurface({ variant = 'default', tilt = 'none', className, children, ...rest }: GGSurfaceProps) {
  return (
    <div
      className={cx(
        'relative',
        variant === 'default' && 'gg-surface',
        variant === 'flat' && 'gg-surface-flat',
        variant === 'deep' && 'gg-surface-deep',
        variant === 'sketch' && 'gg-sketch gg-graph',
        TILT[tilt],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Panel z ciemną belką tytułową przykręconą do góry. */
export function GGPanel({
  title,
  action,
  tilt = 'none',
  variant = 'default',
  className,
  bodyClassName,
  style,
  children,
}: {
  title?: ReactNode;
  action?: ReactNode;
  tilt?: GGTilt;
  variant?: 'default' | 'flat' | 'deep';
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <GGSurface variant={variant} tilt={tilt} className={cx('overflow-hidden', className)} style={style}>
      {title && (
        <div className="gg-panel-head">
          <span className="font-num text-chip uppercase tracking-[0.2em] text-white">{title}</span>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </GGSurface>
  );
}

/* ── Typografia ─────────────────────────────────────────────────────────── */

/** Nagłówek Zupiter z twardym cieniem (fiolet w ciemnym, żółty w jasnym). */
export function GGHeading({
  className,
  shadow = true,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { shadow?: boolean }) {
  return (
    <div
      className={cx('font-display uppercase leading-[1.04] tracking-[0.02em] text-gg-ink', shadow && 'gg-text-shadow', className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Liczba w Palamecii - każdy wynik, licznik i godzina. */
export function GGNum({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx('tnum font-num leading-none', className)} {...rest}>
      {children}
    </span>
  );
}

/** Mikro-etykieta mono - podpis pod każdą statystyką i sekcją. */
export function GGMeta({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx('gg-meta block', className)} {...rest}>
      {children}
    </span>
  );
}

/** Mono-chip na twardo obramowanym bloku koloru. */
export function GGChip({
  tone = 'yellow',
  tilt = false,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: GGTone; tilt?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-[0.8vw] border-[length:var(--gg-bw-thin)] border-gg-edge px-[1.4vw] py-[0.7vh]',
        'font-mono text-chip font-bold uppercase',
        'shadow-[var(--gg-off-sm)_var(--gg-off-sm)_0_var(--gg-shadow)]',
        TONE_BG[tone],
        tilt && '-rotate-[1.5deg]',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

/** Oderwany pasek taśmy malarskiej. */
export function GGTape({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx('gg-tape', className)} {...rest}>
      {children}
    </span>
  );
}

/** Numerowany nagłówek sekcji z przerywaną linijką taśmy biegnącą w prawo. */
export function GGSectionHeading({
  title,
  index,
  tone = 'yellow',
  className,
}: {
  title: ReactNode;
  index?: ReactNode;
  tone?: GGTone;
  className?: string;
}) {
  return (
    <div className={cx('flex items-center gap-[1.4vw]', className)}>
      {index !== undefined && (
        <span
          className={cx(
            'flex h-[5.2vh] min-w-[5.2vh] flex-none -rotate-2 items-center justify-center border-[length:var(--gg-bw-thin)] border-gg-edge px-[0.6vw] font-num text-big',
            'shadow-[var(--gg-off-sm)_var(--gg-off-sm)_0_var(--gg-shadow)]',
            TONE_BG[tone],
          )}
        >
          {index}
        </span>
      )}
      <GGHeading className="text-h2">{title}</GGHeading>
      <span className="gg-rule min-w-[4vw] flex-1" />
    </div>
  );
}

/* ── Grafika ────────────────────────────────────────────────────────────── */

export interface GGStickerProps {
  art: GGArtKey;
  /** Obrót bazowy (stopnie). */
  rotate?: number;
  /** Sekundy jednego cyklu unoszenia. Pomiń = nieruchoma. */
  float?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

/** Unosząca się naklejka die-cut - bloby, iskierki i drobiazgi Y2K na krawędziach ekranu. */
export function GGSticker({ art, rotate = 0, float, delay = 0, className, style, alt = '' }: GGStickerProps) {
  return (
    <img
      src={ggArt(art)}
      alt={alt}
      draggable={false}
      aria-hidden={alt === '' ? true : undefined}
      className={cx('gg-sticker-shadow pointer-events-none select-none', className)}
      style={{
        ['--r' as string]: `${rotate}deg`,
        transform: `rotate(${rotate}deg)`,
        ...(float ? { animation: `ggfloat ${float}s ease-in-out ${delay}s infinite` } : null),
        ...style,
      }}
    />
  );
}

/** Plama sprayu pod rogiem karty albo jako podkład koloru. */
export function GGSplotch({
  art = 'splotchMagenta',
  className,
  style,
}: {
  art?: Extract<GGArtKey, `splotch${string}`>;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={ggArt(art)}
      alt=""
      aria-hidden
      draggable={false}
      className={cx('pointer-events-none absolute select-none', className)}
      style={style}
    />
  );
}

/**
 * Ikona liniowa (105-elementowy zestaw z GórkaGuesser). `ink` mówi, na jakim
 * tle stoi: `auto` - odwracana wraz ze schematem, `light` - zawsze biała
 * (ciemne belki), `dark` - zawsze czarna (jasne bloki koloru).
 */
export function GGIcon({
  group,
  name,
  ink = 'auto',
  className,
  style,
  alt = '',
}: {
  group: GGIconGroup;
  name: string;
  ink?: 'auto' | 'light' | 'dark';
  className?: string;
  style?: CSSProperties;
  alt?: string;
}) {
  return (
    <img
      src={ggIcon(group, name)}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      draggable={false}
      className={cx(
        'inline-block flex-none select-none',
        ink === 'auto' && 'gg-inkart',
        ink === 'light' && 'gg-inkart-light',
        className,
      )}
      style={style}
    />
  );
}

/** Rastrowa siateczka na powierzchni fotograficznej. */
export function GGDotWash({ className, opacity = 0.5 }: { className?: string; opacity?: number }) {
  return (
    <span
      aria-hidden
      className={cx('gg-dots pointer-events-none absolute inset-0 mix-blend-overlay', className)}
      style={{ opacity }}
    />
  );
}

/** Ikona + liczba w Palamecii + mikro-podpis. Kafel statystyki. */
export function GGStat({
  icon,
  value,
  label,
  valueClassName,
  className,
}: {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <span className={cx('flex items-center gap-[1vw]', className)}>
      {icon}
      <span className="min-w-0">
        <GGNum className={cx('block text-[5vh]', valueClassName)}>{value}</GGNum>
        <GGMeta className="mt-[0.5vh]">{label}</GGMeta>
      </span>
    </span>
  );
}

export { ggArt, ggIcon, type GGArtKey, type GGIconGroup } from './assets';
