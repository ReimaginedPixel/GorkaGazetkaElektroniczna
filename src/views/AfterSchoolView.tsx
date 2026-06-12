import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import type { ViewProps } from './types';

/** Stan 5: PO LEKCJACH — podsumowanie + feed. */
export function AfterSchoolView({ theme, config, now, adminBase }: ViewProps) {
  return (
    <Screen theme={theme} chip="Po lekcjach" brand={config.school.shortName} center={false}>
      <div className="text-center">
        <div className="text-hero font-black tracking-tight">Na dziś to wszystko! 🎓</div>
        <div className="muted mt-2 text-3xl">Do zobaczenia jutro.</div>
      </div>
      <div className="feed-card relative mt-[2.5vh] flex-1">
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </div>
    </Screen>
  );
}
