import { AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { getCurrentState, type ScheduleState } from '@lib/schedule';
import { AlarmOverlay } from './components/AlarmOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StatusBar } from './components/StatusBar';
import { GGHeading, GGMeta, GGSticker } from './gg';
import { useAdminBase } from './hooks/useAdminBase';
import { useConfig } from './hooks/useConfig';
import { useNow } from './hooks/useNow';
import { useTheme } from './hooks/useTheme';
import { useWeather } from './hooks/useWeather';
import { statusTheme } from './statusTheme';
import { AfterSchoolView } from './views/AfterSchoolView';
import { BreakView } from './views/BreakView';
import { DayOffView } from './views/DayOffView';
import { LessonView } from './views/LessonView';
import { LongBreakView } from './views/LongBreakView';
import type { ViewProps } from './views/types';
import { WelcomeView } from './views/WelcomeView';

function renderView(status: ScheduleState['status'], props: ViewProps) {
  switch (status) {
    case 'lesson':
      return <LessonView key="lesson" {...props} />;
    case 'break':
      return <BreakView key="break" {...props} />;
    case 'longBreak':
      return <LongBreakView key="longBreak" {...props} />;
    case 'beforeSchool':
      return <WelcomeView key="beforeSchool" {...props} />;
    case 'afterSchool':
      return <AfterSchoolView key="afterSchool" {...props} />;
    case 'dayOff':
      return <DayOffView key="dayOff" {...props} />;
    default:
      return null;
  }
}

function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[3vh]">
      <GGSticker art="blobThinking" rotate={-6} float={4} className="w-[28vh]" />
      <GGHeading className="text-hero">Gazetka Górka</GGHeading>
      <GGMeta className="animate-ggblink text-[2vh]">wczytywanie…</GGMeta>
    </div>
  );
}

export default function App() {
  const config = useConfig();
  const now = useNow(1000);
  const adminBase = useAdminBase();
  useTheme(config, now.getHours());
  const weather = useWeather(config?.location);

  const state = useMemo<ScheduleState | null>(() => {
    if (!config) return null;
    return getCurrentState(
      now,
      {
        schedule: config.schedule,
        longBreakMinutes: config.longBreakMinutes,
        lessonNames: config.lessonNames,
      },
      [...config.holidays, ...config.daysOff],
      config.freePeriods,
    );
  }, [config, now]);

  if (!config || !state) return <Loading />;

  const theme = statusTheme(state.status);
  const alarms = config.announcements.filter((a) => a.urgent);
  const viewProps: ViewProps = { state, config, now, adminBase, theme };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden text-gg-ink">
      <main className="relative flex-1">
        <ErrorBoundary
          label="view"
          fallback={
            <div className="flex h-full w-full flex-col items-center justify-center gap-[2vh]">
              <GGSticker art="blobNervous" rotate={6} className="w-[22vh]" />
              <div className="muted font-ui text-big">Wystąpił błąd widoku</div>
            </div>
          }
        >
          <AnimatePresence mode="wait">{renderView(state.status, viewProps)}</AnimatePresence>
        </ErrorBoundary>
      </main>

      <StatusBar now={now} config={config} weather={weather} />

      {alarms.length > 0 && <AlarmOverlay alarms={alarms} />}
    </div>
  );
}
