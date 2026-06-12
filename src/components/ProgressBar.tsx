export function ProgressBar({
  value,
  accent,
  width = '60vw',
}: {
  value: number;
  accent: string;
  width?: string;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className="mt-[4vh] h-3.5 overflow-hidden rounded-full bg-white/15 shadow-inner"
      style={{ width }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-linear"
        style={{ width: `${pct}%`, backgroundColor: accent, boxShadow: `0 0 18px ${accent}88` }}
      />
    </div>
  );
}
