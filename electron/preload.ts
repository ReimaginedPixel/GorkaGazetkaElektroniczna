// electron/preload.ts — bezpieczny most do renderera (contextIsolation).
import { contextBridge, ipcRenderer } from 'electron';
import type { AppConfig } from '../lib/types';

const api = {
  /** Pobierz aktualny config (po starcie). */
  getConfig: (): Promise<AppConfig> => ipcRenderer.invoke('config:get'),

  /** Subskrybuj zmiany configu (hot-reload). Zwraca funkcję odpinającą. */
  onConfigUpdate: (cb: (cfg: AppConfig) => void): (() => void) => {
    const listener = (_e: unknown, cfg: AppConfig) => cb(cfg);
    ipcRenderer.on('config:update', listener);
    return () => ipcRenderer.removeListener('config:update', listener);
  },

  /** Adresy panelu admina (do wyświetlenia na ekranie). */
  getAdminInfo: (): Promise<{ port: number; urls: string[] }> => ipcRenderer.invoke('admin:info'),
};

contextBridge.exposeInMainWorld('gazetka', api);

export type GazetkaApi = typeof api;
