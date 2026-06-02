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

/** Wspólna „scena” widoku: delikatna poświata w kolorze statusu + chip statusu. */
export function Screen({ theme, children, chip, center = true }: ScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col"
      style={{
        background: `radial-gradient(130vh 90vh at 50% 28%, ${theme.glow}, transparent 72%)`,
      }}
    >
      <div className="flex items-center justify-between px-[4vw] pt-[3.5vh]">
        <StatusChip theme={theme} label={chip ?? theme.name} />
      </div>
      <div className={`flex flex-1 flex-col px-[4vw] pb-[2vh] ${center ? 'justify-center' : 'justify-start'}`}>
        {children}
      </div>
    </motion.div>
  );
}

export function StatusChip({ theme, label }: { theme: StatusTheme; label: string }) {
  if (!label) return null;
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2">
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: theme.accent, boxShadow: `0 0 14px ${theme.accent}` }}
      />
      <span className="text-2xl font-semibold uppercase tracking-wide" style={{ color: theme.accent }}>
        {label}
      </span>
    </div>
  );
}
