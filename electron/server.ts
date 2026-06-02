// ─────────────────────────────────────────────────────────────────────────
// electron/server.ts — serwer panelu administratora (Express), dostęp po LAN.
//
// Bezpieczeństwo:
//  - Logowanie hasłem: porównanie z hashem bcrypt (ADMIN_PASSWORD_HASH z .env).
//  - Sesja: podpisany token (HMAC, SESSION_SECRET z .env) w cookie httpOnly, z wygasaniem.
//  - Rate-limit na /api/login (ochrona przed brute-force, nawet w LAN).
//  - Hasło NIGDY nie jest przechowywane w plaintext; zmiana hasła zapisuje
//    nowy hash bcrypt do .env (ADMIN_PASSWORD_HASH).
// ─────────────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { saveConfigFile } from '../lib/config';
import type { AppConfig } from '../lib/types';
import { adminHtml } from './adminPage';

const COOKIE = 'gg_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 godzin

export interface AdminServerOptions {
  port: number;
  host: string;
  configPath: string;
  envPath: string;
  uploadsDir: string;
  sessionSecret: string;
  getPasswordHash: () => string;
  setPasswordHash: (hash: string) => void;
  getConfig: () => AppConfig;
  onConfigSaved: (config: AppConfig) => void;
}

// ── Podpisany token sesji (HMAC) ────────────────────────────────────────────
function signToken(secret: string, expMs: number): string {
  const body = Buffer.from(JSON.stringify({ exp: expMs })).toString('base64url');
  const mac = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${mac}`;
}

function verifyToken(secret: string, token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot < 0) return false;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as { exp?: number };
    return typeof payload.exp === 'number' && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

/** Adresy panelu w sieci LAN (IPv4, nie-wewnętrzne). */
export function getLanUrls(port: number): string[] {
  const urls: string[] = [];
  const ifaces = networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const ni of ifaces[name] ?? []) {
      if (ni.family === 'IPv4' && !ni.internal) urls.push(`http://${ni.address}:${port}`);
    }
  }
  urls.push(`http://localhost:${port}`);
  return urls;
}

/** Wstawia/aktualizuje klucz w pliku .env, zachowując pozostałe linie. */
function upsertEnv(envPath: string, key: string, value: string): void {
  let lines: string[] = [];
  if (existsSync(envPath)) {
    lines = readFileSync(envPath, 'utf-8').split(/\r?\n/);
  }
  const prefix = `${key}=`;
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(prefix)) {
      lines[i] = `${prefix}${value}`;
      found = true;
      break;
    }
  }
  if (!found) lines.push(`${prefix}${value}`);
  writeFileSync(envPath, lines.join('\n'), 'utf-8');
}

export function createAdminServer(opts: AdminServerOptions): {
  app: express.Express;
  start: () => Promise<Server>;
} {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '4mb' }));
  app.use(cookieParser());

  // Upload zdjęć (multer) -> userData/uploads.
  if (!existsSync(opts.uploadsDir)) mkdirSync(opts.uploadsDir, { recursive: true });
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, opts.uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.jpg';
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 12,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Zbyt wiele prób logowania. Spróbuj ponownie później.' },
  });

  function isAuthed(req: Request): boolean {
    return verifyToken(opts.sessionSecret, req.cookies?.[COOKIE]);
  }
  function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (isAuthed(req)) return next();
    res.status(401).json({ error: 'Wymagane logowanie' });
  }

  // Strona panelu (publiczny shell; dane chronione przez /api/*).
  app.get('/', (_req, res) => {
    res.type('html').send(adminHtml());
  });

  // Statyczne zdjęcia (czytelne dla kiosku po LAN — to nie są sekrety).
  app.use('/uploads', express.static(opts.uploadsDir));

  app.get('/api/me', (req, res) => {
    res.json({
      authenticated: isAuthed(req),
      school: opts.getConfig().school,
      adminUrls: getLanUrls(opts.port),
    });
  });

  app.post('/api/login', loginLimiter, async (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const hash = opts.getPasswordHash();
    if (!hash) {
      res.status(503).json({
        error: 'Brak skonfigurowanego hasła. Ustaw ADMIN_PASSWORD_HASH w .env (npm run hash-password).',
      });
      return;
    }
    const ok = await bcrypt.compare(password, hash).catch(() => false);
    if (!ok) {
      res.status(401).json({ error: 'Błędne hasło' });
      return;
    }
    const token = signToken(opts.sessionSecret, Date.now() + SESSION_TTL_MS);
    res.cookie(COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: SESSION_TTL_MS,
    });
    res.json({ ok: true });
  });

  app.post('/api/logout', (_req, res) => {
    res.clearCookie(COOKIE);
    res.json({ ok: true });
  });

  app.get('/api/config', requireAuth, (_req, res) => {
    res.json({ config: opts.getConfig() });
  });

  app.post('/api/config', requireAuth, (req, res) => {
    try {
      const normalized = saveConfigFile(opts.configPath, req.body);
      opts.onConfigSaved(normalized);
      res.json({ ok: true, config: normalized });
    } catch (err) {
      res.status(400).json({ error: `Nie udało się zapisać: ${(err as Error).message}` });
    }
  });

  app.post('/api/password', requireAuth, async (req, res) => {
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'Hasło musi mieć co najmniej 8 znaków.' });
      return;
    }
    try {
      const hash = await bcrypt.hash(newPassword, 12);
      upsertEnv(opts.envPath, 'ADMIN_PASSWORD_HASH', hash);
      opts.setPasswordHash(hash);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: `Nie udało się zmienić hasła: ${(err as Error).message}` });
    }
  });

  app.post('/api/upload', requireAuth, upload.single('photo'), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'Brak pliku obrazu.' });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  function start(): Promise<Server> {
    return new Promise((resolve, reject) => {
      const server = app.listen(opts.port, opts.host, () => resolve(server));
      server.on('error', reject);
    });
  }

  return { app, start };
}
