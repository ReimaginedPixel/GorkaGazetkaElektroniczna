import type { ScheduleState } from '@lib/schedule';
import type { AppConfig } from '@lib/types';
import type { StatusTheme } from '../statusTheme';

export interface ViewProps {
  state: ScheduleState;
  config: AppConfig;
  now: Date;
  adminBase: string;
  theme: StatusTheme;
}
