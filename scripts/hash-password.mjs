#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// scripts/hash-password.mjs
// Generuje hash bcrypt hasła administratora do wpisania w .env
// (ADMIN_PASSWORD_HASH). Hasło NIGDY nie jest zapisywane w plaintext.
//
// Użycie:
//   npm run hash-password               (zapyta interaktywnie, bez echa)
//   npm run hash-password -- "twojeHaslo"   (argument; mniej bezpieczne — historia powłoki)
// ─────────────────────────────────────────────────────────────────────────

import bcrypt from 'bcryptjs';
import readline from 'node:readline';

const ROUNDS = 12;

function hashAndPrint(password) {
  if (!password || password.length < 8) {
    console.error('\n✖ Hasło musi mieć co najmniej 8 znaków. Użyj dłuższego, silnego hasła.');
    process.exit(1);
  }
  const hash = bcrypt.hashSync(password, ROUNDS);
  console.log('\n✔ Skopiuj poniższą linię do pliku .env:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
}

const argPassword = process.argv[2];
if (argPassword) {
  hashAndPrint(argPassword);
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  // Wyłącz echo, żeby hasło nie pojawiło się na ekranie.
  const stdin = process.stdin;
  const onData = (char) => {
    const s = char.toString();
    if (s === '\n' || s === '\r' || s === '') {
      stdin.removeListener('data', onData);
    } else {
      // Nadpisuj wpisywane znaki, aby nie było ich widać.
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write('Hasło administratora: ' + '*'.repeat(rl.line.length));
    }
  };
  process.stdout.write('Hasło administratora: ');
  stdin.on('data', onData);
  rl.question('', (password) => {
    rl.close();
    process.stdout.write('\n');
    hashAndPrint(password.trim());
  });
}
