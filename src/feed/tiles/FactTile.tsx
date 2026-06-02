import { TileFrame } from '../TileFrame';

export function FactTile({ fact }: { fact: string }) {
  return (
    <TileFrame label="Czy wiesz, że…">
      <p className="max-w-[78vw] text-hero font-semibold leading-tight">{fact}</p>
    </TileFrame>
  );
}
