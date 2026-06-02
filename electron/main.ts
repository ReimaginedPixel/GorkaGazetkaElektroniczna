// ─────────────────────────────────────────────────────────────────────────
// electron/main.ts — proces główny: okno kiosk + serwer admina + hot-reload.
// ─────────────────────────────────────────────────────────────────────────

import { app, BrowserWindow, globalShortcut, ipcMain, Menu, session } from 'electron';
import { config as loadDotenv } from 'dotenv';
import {
  copyFileSync,
  existsSync,
  type FSWatcher,
  mkdirSync,
  watch,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DEFAULT_CONFIG, loadConfigFile } from '../lib/config';
import type { AppConfig } from '../lib/types';
import { createAdminServer, getLanUrls } from './server';

// ── Ścieżki i .env ──────────────────────────────────────────────────────────
const userData = app.getPath('userData');
const configPath = path.join(userData, 'config.json');
const uploadsDir = path.join(userData, 'uploads');
const userEnvPath = path.join(userData, '.env');

// Wczytaj .env: najpierw z katalogu roboczego (dev), potem z userData (kiosk).
loadDotenv();
loadDotenv({ path: userEnvPath });
const envPath = existsSync(path.join(process.cwd(), '.env')) ? path.join(process.cwd(), '.env') : userEnvPath;

const ADMIN_PORT = Number(process.env.ADMIN_PORT) || 8137;
const ADMIN_HOST = process.env.ADMIN_HOST || '0.0.0.0';

let passwordHash = process.env.ADMIN_PASSWORD_HASH || '';
let sessionSecret = process.env.SESSION_SECRET || '';
if (!sessionSecret) {
  // Ephemeryczny sekret — sesje przeżyją w trakcie działania, ale nie po restarcie.
  sessionSecret = crypto.randomBytes(48).toString('hex');
  console.warn('[main] Brak SESSION_SECRET w .env — używam tymczasowego (sesje wygasną po restarcie).');
}

let currentConfig: AppConfig = DEFAULT_CONFIG;
let mainWindow: BrowserWindow | null = null;
let watcher: FSWatcher | null = null;

// ── Pojedyncza instancja ────────────────────────────────────────────────────
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

// Nie wywalaj kiosku na błędach (np. brak sieci).
process.on('uncaughtException', (err) => console.error('[uncaughtException]', err));
process.on('unhandledRejection', (err) => console.error('[unhandledRejection]', err));

function ensureConfigExists(): void {
  if (existsSync(configPath)) return;
  const candidates = [
    process.resourcesPath ? path.join(process.resourcesPath, 'config.example.json') : '',
    path.join(process.cwd(), 'config.example.json'),
    path.join(__dirname, '../../config.example.json'),
  ].filter(Boolean);
  const source = candidates.find((c) => existsSync(c));
  try {
    if (source) {
      copyFileSync(source, configPath);
      console.log('[main] Utworzono config.json z przykładu:', source);
    } else {
      writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
      console.log('[main] Utworzono domyślny config.json');
    }
  } catch (err) {
    console.error('[main] Nie udało się utworzyć config.json:', err);
  }
}

function broadcastConfig(): void {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('config:update', currentConfig);
  }
}

function reloadConfig(): void {
  currentConfig = loadConfigFile(configPath);
  broadcastConfig();
}

function watchConfig(): void {
  let timer: NodeJS.Timeout | null = null;
  const debounced = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(reloadConfig, 150);
  };
  try {
    watcher = watch(configPath, { persistent: false }, debounced);
  } catch (err) {
    console.error('[main] fs.watch nie wystartował:', err);
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    backgroundColor: '#0A0A0A',
    kiosk: true,
    frame: false,
    fullscreen: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());

  // Fallback loader: ponów ładowanie, jeśli np. dev-server jeszcze nie wstał.
  mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error('[main] did-fail-load', code, desc, url);
    setTimeout(() => {
      if (process.env.ELECTRON_RENDERER_URL) mainWindow?.loadURL(process.env.ELECTRON_RENDERER_URL);
      else mainWindow?.loadFile(path.join(__dirname, '../renderer/index.html'));
    }, 1500);
  });

  // Blokada nawigacji i nowych okien (kiosk).
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (e) => e.preventDefault());

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

function setupSecurity(): void {
  // Odmawiaj wszystkich uprawnień (kamera, mikrofon itp.) — to tylko wyświetlacz.
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(false));
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  setupSecurity();

  ensureConfigExists();
  currentConfig = loadConfigFile(configPath);
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
  watchConfig();

  // IPC dla renderera.
  ipcMain.handle('config:get', () => currentConfig);
  ipcMain.handle('admin:info', () => ({ port: ADMIN_PORT, urls: getLanUrls(ADMIN_PORT) }));

  // Serwer panelu admina (LAN).
  const admin = createAdminServer({
    port: ADMIN_PORT,
    host: ADMIN_HOST,
    configPath,
    envPath,
    uploadsDir,
    sessionSecret,
    getPasswordHash: () => passwordHash,
    setPasswordHash: (h) => {
      passwordHash = h;
      process.env.ADMIN_PASSWORD_HASH = h;
    },
    getConfig: () => currentConfig,
    onConfigSaved: (cfg) => {
      currentConfig = cfg;
      broadcastConfig();
    },
  });
  admin
    .start()
    .then(() => console.log(`[main] Panel admina: ${getLanUrls(ADMIN_PORT).join('  ')}`))
    .catch((err) => console.error('[main] Serwer admina nie wystartował:', err));

  // Autostart z systemem (tylko w wersji spakowanej).
  if (app.isPackaged) {
    app.setLoginItemSettings({ openAtLogin: true, openAsHidden: false });
  }

  // Wyjście z kiosku.
  globalShortcut.register('CommandOrControl+Shift+Q', () => app.quit());

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  watcher?.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
