import { useEffect, useState } from 'react';
import type { AppConfig } from '@lib/types';

/**
 * Subskrybuje config z procesu main. Hot-reload: po zapisie w panelu admina
 * (fs.watch) main wysyła 'config:update', a ekran reaguje na żywo.
 */
export function useConfig(): AppConfig | null {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    let mounted = true;
    // window.gazetka może nie istnieć przy podglądzie poza Electronem.
    const api = window.gazetka;
    if (!api) return;

    api
      .getConfig()
      .then((c) => {
        if (mounted) setConfig(c);
      })
      .catch((err) => console.error('[useConfig] getConfig', err));

    const off = api.onConfigUpdate((c) => setConfig(c));
    return () => {
      mounted = false;
      off();
    };
  }, []);

  return config;
}
