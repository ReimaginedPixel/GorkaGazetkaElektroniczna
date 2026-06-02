import type { WordOfDay } from '@lib/types';
import { TileFrame } from '../TileFrame';

export function WordOfDayTile({ word }: { word: WordOfDay }) {
  return (
    <TileFrame label="Słowo dnia">
      <div className="text-mega font-black tracking-tight">{word.word}</div>
      {word.definition && (
        <p className="muted mt-[3vh] max-w-[70vw] text-4xl leading-snug">{word.definition}</p>
      )}
    </TileFrame>
  );
}
