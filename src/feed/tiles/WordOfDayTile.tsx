import type { WordOfDay } from '@lib/types';
import { GGHeading } from '../../gg';
import { TileFrame } from '../TileFrame';

export function WordOfDayTile({ word }: { word: WordOfDay }) {
  return (
    <TileFrame label="Słowo dnia" icon={['object', 'book']} tone="yellow">
      <GGHeading className="text-mega">{word.word}</GGHeading>
      {word.definition && (
        <p className="muted mt-[3vh] max-w-[70vw] font-ui text-big leading-snug">{word.definition}</p>
      )}
    </TileFrame>
  );
}
