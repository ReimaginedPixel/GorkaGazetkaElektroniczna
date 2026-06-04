import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Remove ELECTRON_RUN_AS_NODE so Electron starts as a proper GUI app
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const [,, command = 'dev'] = process.argv;
const evBin = path.join(root, 'node_modules', '.bin', 'electron-vite');

const ps = spawn(evBin, [command], {
  cwd: root,
  env,
  stdio: 'inherit',
  shell: true,
});

ps.on('close', (code) => process.exit(code ?? 0));
