import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import { GGIcon } from '../gg';
import { FeedCard } from './FeedCard';
import { FeedHeader } from './FeedHeader';
import type { ViewProps } from './types';

/** Stan 5: PO LEKCJACH - podsumowanie + feed. */
export function AfterSchoolView({ theme, config, now, adminBase }: ViewProps) {
  return (
    <Screen theme={theme} chip="Po lekcjach" brand={config.school.shortName} center={false}>
      <FeedHeader
        title={
          <span className="flex items-center gap-[1.2vw]">
            Na dziś to wszystko!
            <GGIcon group="nature" name="moon" className="w-[7vh] -rotate-12" />
          </span>
        }
        subtitle="Do zobaczenia jutro."
      />
      <FeedCard>
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </FeedCard>
    </Screen>
  );
}
