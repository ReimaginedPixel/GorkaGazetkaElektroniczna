// ─────────────────────────────────────────────────────────────────────────
// lib/librusScraper.ts — OPCJONALNY, DOMYŚLNIE WYŁĄCZONY moduł.
//
// ⚠️ NIEOFICJALNE API — NA WŁASNE RYZYKO.
// Librus nie udostępnia publicznego, oficjalnego API dla Synergii. Logowanie
// przez scraping może naruszać regulamin serwisu i bywa zawodne (zmiany strony,
// captcha, blokady). Używaj wyłącznie za zgodą i na własną odpowiedzialność.
//
// BEZPIECZEŃSTWO:
//  - Dane logowania WYŁĄCZNIE z .env (LIBRUS_USERNAME / LIBRUS_PASSWORD).
//  - NIGDY nie hardkoduj loginu/hasła w kodzie ani w config.json.
//  - Moduł jest domyślnie wyłączony. Aby włączyć, ustaw LIBRUS_ENABLED=true
//    oraz dane logowania w .env, i samodzielnie zaimplementuj fetch poniżej.
//
// Domyślnie szczęśliwy numerek wpisuje się RĘCZNIE w panelu admina.
// ─────────────────────────────────────────────────────────────────────────

export interface LibrusResult {
  luckyNumber: number | null;
  fetchedAt: number;
}

/** Czy moduł jest świadomie włączony przez operatora (zmienne środowiskowe). */
export function isLibrusEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.LIBRUS_ENABLED === 'true' && !!env.LIBRUS_USERNAME && !!env.LIBRUS_PASSWORD;
}

/**
 * Placeholder. Świadomie NIE implementuje logowania do Librusa.
 * Jeśli zdecydujesz się włączyć ten moduł, zaimplementuj tu pobieranie
 * szczęśliwego numerka, czytając dane logowania z `env` (NIGDY z repo).
 */
export async function fetchLuckyNumberFromLibrus(
  env: NodeJS.ProcessEnv = process.env,
): Promise<LibrusResult> {
  if (!isLibrusEnabled(env)) {
    throw new Error(
      'Scraper Librus jest wyłączony. Ustaw LIBRUS_ENABLED=true oraz dane logowania w .env, aby go użyć.',
    );
  }
  // TODO (opcjonalnie, na własne ryzyko): zaimplementuj logowanie i scraping.
  // const username = env.LIBRUS_USERNAME!;
  // const password = env.LIBRUS_PASSWORD!;
  // ...sesja, pobranie numerka...
  throw new Error('Scraper Librus nie jest zaimplementowany (placeholder).');
}
