import { AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { getCurrentState, type ScheduleState } from '@lib/schedule';
import { AlarmOverlay } from './components/AlarmOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StatusBar } from './components/StatusBar';
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
    <div className="surface relative flex h-full w-full flex-col items-center justify-center gap-[3vh] overflow-hidden">
      <svg
        viewBox="0 0 1920 480"
        className="pointer-events-none absolute bottom-0 w-full select-none"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <path
          d="M0,480 L0,270 L130,190 L260,235 L420,120 L550,185 L700,90 L840,155 L960,50
             L1100,135 L1220,75 L1370,145 L1510,70 L1660,135 L1800,95 L1920,120 L1920,480 Z"
          fill="white" fillOpacity="0.028"
        />
        <path
          d="M0,480 L0,315 L180,272 L360,295 L540,244 L720,274 L900,222 L1080,256
             L1260,212 L1440,248 L1620,216 L1920,228 L1920,480 Z"
          fill="white" fillOpacity="0.038"
        />
        <path
          d="M0,480 L0,392 L320,364 L640,378 L960,350 L1280,372 L1600,355 L1920,370 L1920,480 Z"
          fill="white" fillOpacity="0.052"
        />
      </svg>
      <div className="text-hero font-black">Gazetka Górka</div>
      <div className="muted text-3xl animate-pulse">Ładowanie…</div>
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
    );
  }, [config, now]);

  if (!config || !state) return <Loading />;

  const theme = statusTheme(state.status);
  const alarms = config.announcements.filter((a) => a.urgent);
  const viewProps: ViewProps = { state, config, now, adminBase, theme };

  return (
    <div className="surface relative flex h-full w-full flex-col overflow-hidden">
      <main className="relative flex-1">
        <ErrorBoundary
          label="view"
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <div className="muted text-4xl">Wystąpił błąd widoku</div>
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
