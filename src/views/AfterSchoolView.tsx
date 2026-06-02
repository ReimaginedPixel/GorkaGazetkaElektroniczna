import { Screen } from '../components/Screen';
import { StoryRotator } from '../feed/StoryRotator';
import type { ViewProps } from './types';

/** Stan 5: PO LEKCJACH — podsumowanie + feed. */
export function AfterSchoolView({ theme, config, now, adminBase }: ViewProps) {
  return (
    <Screen theme={theme} chip="Po lekcjach" center={false}>
      <div className="text-center">
        <div className="text-hero font-bold">Na dziś to wszystko! 🎓</div>
        <div className="muted mt-2 text-3xl">Do zobaczenia jutro.</div>
      </div>
      <div className="relative mt-[2vh] flex-1">
        <StoryRotator config={config} now={now} adminBase={adminBase} />
      </div>
    </Screen>
  );
}
