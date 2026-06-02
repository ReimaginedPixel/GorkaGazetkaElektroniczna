import type { GazetkaApi } from '../electron/preload';

declare global {
  interface Window {
    gazetka: GazetkaApi;
  }
}

export {};
