import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import bcrypt from 'bcryptjs';
import { createAdminServer } from './server';
import { DEFAULT_CONFIG } from '../lib/config';
import type { AppConfig } from '../lib/types';

const PASSWORD = 'tajne-haslo-123';
const tmp = mkdtempSync(path.join(tmpdir(), 'gazetka-'));
const configPath = path.join(tmp, 'config.json');
const envPath = path.join(tmp, '.env');

let currentHash = bcrypt.hashSync(PASSWORD, 8);
let savedConfig: AppConfig | null = null;
let server: Server;
let base: string;

beforeAll(async () => {
  const admin = createAdminServer({
    port: 0,
    host: '127.0.0.1',
    configPath,
    envPath,
    uploadsDir: tmp,
    sessionSecret: 'sekret-testowy',
    getPasswordHash: () => currentHash,
    setPasswordHash: (h) => {
      currentHash = h;
    },
    getConfig: () => DEFAULT_CONFIG,
    onConfigSaved: (c) => {
      savedConfig = c;
    },
  });
  server = await admin.start();
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  base = `http://127.0.0.1:${port}`;
});

afterAll(() => {
  server?.close();
});

function cookieFrom(res: Response): string {
  const all = res.headers.getSetCookie?.() ?? [];
  const sess = all.find((c) => c.startsWith('gg_session='));
  return sess ? sess.split(';')[0] : '';
}

describe('serwer admina — autoryzacja', () => {
  it('odrzuca błędne hasło (401)', async () => {
    const res = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'zle' }),
    });
    expect(res.status).toBe(401);
  });

  it('chroni /api/config bez sesji (401)', async () => {
    const res = await fetch(`${base}/api/config`);
    expect(res.status).toBe(401);
  });

  it('loguje poprawnym hasłem i ustawia cookie sesji', async () => {
    const res = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: PASSWORD }),
    });
    expect(res.status).toBe(200);
    expect(cookieFrom(res)).toMatch(/^gg_session=/);
  });

  it('z ważną sesją zwraca config i pozwala zapisać', async () => {
    const login = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: PASSWORD }),
    });
    const cookie = cookieFrom(login);

    const get = await fetch(`${base}/api/config`, { headers: { Cookie: cookie } });
    expect(get.status).toBe(200);
    const body = await get.json();
    expect(body.config.school).toBeDefined();

    const newConfig = { ...DEFAULT_CONFIG, luckyNumber: 17 };
    const post = await fetch(`${base}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify(newConfig),
    });
    expect(post.status).toBe(200);
    expect(savedConfig?.luckyNumber).toBe(17);
    // Zapis trafił też do pliku.
    const onDisk = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(onDisk.luckyNumber).toBe(17);
  });

  it('odrzuca fałszywy token sesji', async () => {
    const res = await fetch(`${base}/api/config`, {
      headers: { Cookie: 'gg_session=podrobiony.token' },
    });
    expect(res.status).toBe(401);
  });
});
