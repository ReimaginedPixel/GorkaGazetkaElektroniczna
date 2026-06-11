import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { StatusTheme } from '../statusTheme';

interface ScreenProps {
  theme: StatusTheme;
  children: ReactNode;
  /** Tekst „chipa” statusu u góry. Domyślnie theme.name. */
  chip?: string;
  /** Nazwa szkoły / brand w prawym górnym rogu. */
  brand?: string;
  /** Wyśrodkuj treść w pionie (domyślnie tak). */
  center?: boolean;
}

/**
 * Wspólna „scena” widoku: poświata w kolorze statusu (statyczna u góry +
 * wolno dryfująca u dołu), chip statusu i brand szkoły.
 */
export function Screen({ theme, children, chip, brand, center = true }: ScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(130vh 90vh at 50% 24%, ${theme.glow}, transparent 72%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[28vh] -right-[8vw] h-[64vh] w-[56vw] animate-aurora rounded-full opacity-70 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${theme.glow}, transparent)` }}
      />

      <div className="relative flex items-center justify-between px-[4vw] pt-[3vh]">
        <StatusChip theme={theme} label={chip ?? theme.name} />
        {brand && (
          <div className="muted text-2xl font-bold uppercase tracking-[0.35em]">{brand}</div>
        )}
      </div>
      <div
        className={`relative flex flex-1 flex-col px-[4vw] pb-[2.5vh] pt-[2vh] ${center ? 'justify-center' : 'justify-start'}`}
      >
        {children}
      </div>
    </motion.div>
  );
}

export function StatusChip({ theme, label }: { theme: StatusTheme; label: string }) {
  if (!label) return null;
  return (
    <div className="glass flex items-center gap-3 rounded-full px-6 py-2.5">
      <span
        className="h-3.5 w-3.5 rounded-full"
        style={{ backgroundColor: theme.accent, boxShadow: `0 0 16px ${theme.accent}` }}
      />
      <span className="text-2xl font-bold uppercase tracking-wide" style={{ color: theme.accent }}>
        {label}
      </span>
    </div>
  );
}
