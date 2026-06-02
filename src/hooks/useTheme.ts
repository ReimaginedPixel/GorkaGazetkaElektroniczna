import { useEffect } from 'react';
import type { AppConfig } from '@lib/types';

/**
 * Auto dark/light: ciemny po zmierzchu (próg godzinowy z config).
 * Domyślnie ciemno od darkAfterHour do lightAfterHour.
 */
export function useTheme(config: AppConfig | null, hour: number): void {
  useEffect(() => {
    if (!config) return;
    const { theme } = config;
    let light: boolean;
    if (theme.auto) {
      const isDark = hour >= theme.darkAfterHour || hour < theme.lightAfterHour;
      light = !isDark;
    } else {
      light = theme.mode === 'light';
    }
    document.documentElement.classList.toggle('light', light);
  }, [config, hour]);
}
