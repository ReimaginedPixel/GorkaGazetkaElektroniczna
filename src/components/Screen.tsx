import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { StatusTheme } from '../statusTheme';

interface ScreenProps {
  theme: StatusTheme;
  children: ReactNode;
  /** Tekst „chipa” statusu u góry. Domyślnie theme.name. */
  chip?: string;
  /** Wyśrodkuj treść w pionie (domyślnie tak). */
  center?: boolean;
}

/** Sylwetka Beskidów — subtelna dekoracja tła (biała, bardzo niska krycie). */
function MountainBackground() {
  return (
    <svg
      viewBox=”0 0 1920 480”
      className=”pointer-events-none absolute bottom-0 w-full select-none”
      preserveAspectRatio=”xMidYMax meet”
      aria-hidden
    >
      {/* Dalekie szczyty */}
      <path
        d=”M0,480 L0,270 L130,190 L260,235 L420,120 L550,185 L700,90 L840,155 L960,50
           L1100,135 L1220,75 L1370,145 L1510,70 L1660,135 L1800,95 L1920,120 L1920,480 Z”
        fill=”white”
        fillOpacity=”0.028”
      />
      {/* Środkowy grzbiet z lasem */}
      <path
        d=”M0,480 L0,315 L180,272 L360,295 L540,244 L720,274 L900,222 L1080,256
           L1260,212 L1440,248 L1620,216 L1760,238 L1920,228 L1920,480 Z”
        fill=”white”
        fillOpacity=”0.038”
      />
      {/* Pierwszy plan — łagodne zbocza */}
      <path
        d=”M0,480 L0,392 L320,364 L640,378 L960,350 L1280,372 L1600,355 L1920,370 L1920,480 Z”
        fill=”white”
        fillOpacity=”0.052”
      />
    </svg>
  );
}

/** Wspólna „scena” widoku: delikatna poświata w kolorze statusu + chip statusu. */
export function Screen({ theme, children, chip, center = true }: ScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className=”absolute inset-0 flex flex-col”
      style={{
        background: `radial-gradient(130vh 90vh at 50% 28%, ${theme.glow}, transparent 72%)`,
      }}
    >
      <MountainBackground />

      <div className=”flex items-center justify-between px-[4vw] pt-[3.5vh]”>
        <StatusChip theme={theme} label={chip ?? theme.name} />
      </div>
      <div className={`relative flex flex-1 flex-col px-[4vw] pb-[2vh] ${center ? 'justify-center' : 'justify-start'}`}>
        {children}
      </div>
    </motion.div>
  );
}

export function StatusChip({ theme, label }: { theme: StatusTheme; label: string }) {
  if (!label) return null;
  return (
    <div
      className="flex items-center gap-3 rounded-full px-5 py-2"
      style={{
        border: `1px solid ${theme.accent}30`,
        background: `${theme.accent}12`,
      }}
    >
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: theme.accent, boxShadow: `0 0 10px 2px ${theme.accent}80` }}
      />
      <span className="text-2xl font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
        {label}
      </span>
    </div>
  );
}
