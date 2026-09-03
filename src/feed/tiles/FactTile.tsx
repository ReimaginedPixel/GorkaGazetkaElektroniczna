import { GGSticker } from '../../gg';
import { TileFrame } from '../TileFrame';

export function FactTile({ fact }: { fact: string }) {
  return (
    <TileFrame label="Czy wiesz, że…" icon={['ui', 'bubble-dots']} tone="cyan">
      <GGSticker art="sparkleStar" rotate={14} float={5} className="absolute left-[4vw] top-[16vh] w-[9vh]" />
      <p className="max-w-[76vw] font-ui text-hero font-bold leading-tight text-gg-ink">
        <span className="font-display text-gg-cyan" aria-hidden>
          „
        </span>
        {fact}
        <span className="font-display text-gg-cyan" aria-hidden>
          ”
        </span>
      </p>
    </TileFrame>
  );
}
