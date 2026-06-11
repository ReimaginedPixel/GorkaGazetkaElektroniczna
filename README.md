# Gazetka Górka — elektroniczna gazetka / dashboard lekcyjny

Desktopowa aplikacja **Electron** w trybie **kiosk** na monitor przy szkolnej
gazetce / na korytarzu (Technikum Rabka — „Górka”). UI w stylu *Instagram
feed / story* + stały dashboard lekcyjny. Wszystkie teksty po polsku.

Projektowana do odczytu **z 5–10 m**: jedna najważniejsza informacja jest
największym elementem ekranu (gigantyczny timer do końca lekcji), wysoki
kontrast, ciemne tło, a **kolor oznacza status**, nie dekorację:

| Kolor | Status |
|------|--------|
| 🟢 zielony | lekcja trwa |
| 🟠 bursztyn | przerwa zwykła |
| 🟣 fiolet | długa przerwa |
| 🔴 czerwony | alarm / pilne ogłoszenie |
| 🔵 niebieski | dzień wolny / weekend / święto |

## Stack

- **Electron** (kiosk, frame:false, fullscreen, alwaysOnTop, autostart)
- **React + Vite + TypeScript**, **Tailwind**, **framer-motion**
- Lokalny serwer **Express** w procesie main — panel admina po LAN
- Dane w pliku **JSON** (`config.json` w `app.getPath('userData')`), sekrety w `.env`
- Pogoda: **Open-Meteo** (bez klucza API)
- Testy: **Vitest**

## Szybki start (dev)

```bash
npm install
cp .env.example .env            # uzupełnij sekrety (patrz niżej)
npm run hash-password           # wygeneruj ADMIN_PASSWORD_HASH do .env
npm run dev                     # uruchom aplikację (kiosk)
```

Przy pierwszym starcie, jeśli nie ma `config.json`, aplikacja tworzy go
automatycznie na podstawie `config.example.json` w katalogu `userData`.

## Konfiguracja sekretów (`.env`)

Skopiuj `.env.example` → `.env` (plik jest w `.gitignore`, **nigdy** nie trafia
do repo) i uzupełnij:

```env
ADMIN_PASSWORD_HASH=    # hash bcrypt — wygeneruj: npm run hash-password
SESSION_SECRET=         # losowy sekret do podpisu sesji
ADMIN_PORT=8137
ADMIN_HOST=0.0.0.0      # 127.0.0.1 = tylko ten komputer
```

Wygenerowanie sekretu sesji:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Wygenerowanie hasha hasła administratora (hasło **nie** jest zapisywane jawnie):

```bash
npm run hash-password
# wklej wypisaną linię ADMIN_PASSWORD_HASH=... do .env
```

## Panel administratora (dostęp po LAN)

Proces main uruchamia serwer Express. Wejdź z telefonu/laptopa w sieci szkolnej:

```
http://<IP-kiosku>:8137
```

Adresy LAN są też wypisywane w konsoli przy starcie i widoczne w panelu
(zakładka *Bezpieczeństwo*).

W panelu edytujesz na żywo (po zapisie ekran reaguje natychmiast — `fs.watch`):
dzwonki/plan per dzień, ogłoszenia (flaga **„pilne”** → czerwony alarm na cały
ekran), zdjęcia (z uploadem), urodziny, wydarzenia, ważne daty (koniec roku /
ferie / matura), szczęśliwy numerek, lokalizację pogody, hasło oraz **toggle
widoczności** każdego kafla i elementu paska.

### ⚠️ Bezpieczeństwo panelu — przeczytaj

- Logowanie hasłem (**bcrypt**), sesja w podpisanym cookie z wygasaniem,
  **rate-limit** na logowanie (ochrona przed brute-force).
- **Ruch po HTTP w LAN jest NIEszyfrowany.** Używaj **silnego hasła** i —
  jeśli to możliwe — postaw przed panelem reverse-proxy z **self-signed HTTPS**.
- **Nie wystawiaj panelu na publiczny internet.** Ma działać tylko w sieci
  szkolnej. Ogranicz dostęp ustawiając `ADMIN_HOST=127.0.0.1`, jeśli admin
  pracuje z tego samego komputera.
- Hasło można zmienić w panelu — nowy hash bcrypt zapisuje się do `.env`.

## Plan lekcji / dzwonki

Szkoła ma **nieregularny** plan dzwonków — logika **nie** generuje go sztywno
regułą. **Źródłem prawdy jest edytowalna lista dzwonków w panelu admina**
(per dzień tygodnia). Aplikacja czyta kolejne pary lekcja/przerwa z listy:

- przerwy są **liczone z luk** między końcem jednej a startem kolejnej lekcji,
- przerwa o długości `>= longBreakMinutes` (domyślnie 15 min) jest traktowana
  jako **długa przerwa** (osobny, ciekawszy widok),
- nazwy przedmiotów to osobny, opcjonalny plan (`lessonNames`); bez nich
  pokazywane jest „Lekcja N”.

Domyślny plan placeholder Górki (poniedziałek–piątek; L9 14:55–15:40 domyślnie
wyłączona) jest w `config.example.json` i w `lib/schedule.ts`
(`// TODO: zweryfikuj realne dzwonki Górki`).

Obsługiwane stany (z testami jednostkowymi na każdy + edge cases): lekcja trwa,
przerwa zwykła, długa przerwa, przed 1. lekcją, po lekcjach, weekend / święto /
dzień wolny. Stan liczony jest z czasu lokalnego — nie wymaga odświeżania.

## Szczęśliwy numerek

Domyślnie wpisywany **ręcznie** w panelu admina. Opcjonalny moduł scrapera
Librus (`lib/librusScraper.ts`) jest **domyślnie wyłączony** — to nieoficjalne
API, na własne ryzyko; dane logowania wyłącznie z `.env`, nigdy w repo.

## Wbudowane zdjęcia okolicy (`public/photos`)

Aplikacja ma wbudowany zestaw zdjęć Rabki-Zdroju i Gorców (pokazywane w feedzie
obok zdjęć wgranych w panelu admina; lista w `src/feed/gorkaPhotos.ts`).
Wszystkie pochodzą z **Wikimedia Commons** na wolnych licencjach **CC BY /
CC BY-SA** — atrybucja autora jest wyświetlana na kaflu (wymóg licencji),
a pełne źródła są w `public/photos/CREDITS.json`:

| Plik | Autor | Licencja |
|------|-------|----------|
| `panorama-rabki.jpg` | Mach240390 | CC BY-SA 3.0 |
| `park-zdrojowy.jpg` | Mach240390 | CC BY 4.0 |
| `fontanna-park.jpg` | Zalasem1 | CC BY 4.0 |
| `dworzec-rabka.jpg` | Mach240390 | CC BY 4.0 |
| `hala-turbacz.jpg` | Jakub Hałun | CC BY 4.0 |
| `turbacz-zima.jpg` | Jakub Hałun | CC BY-SA 4.0 |

## Pogoda

Open-Meteo (bez klucza), domyślnie Rabka-Zdrój (lat/lon w configu). Odświeżanie
co 15 min, cache w `localStorage`, przy braku sieci pokazywana jest ostatnia
znana wartość. Atrybucja „Open-Meteo” jest wymagana licencją CC BY 4.0 i jest
pokazywana w pasku.

## Kiosk / niezawodność

- `kiosk: true`, bez ramki, fullscreen, alwaysOnTop, autostart z systemem
  (`setLoginItemSettings`, tylko w wersji spakowanej).
- **Wyjście z kiosku:** `Ctrl/Cmd + Shift + Q`.
- Global error boundary — błąd jednego kafla nie wywala całego ekranu.
- Aplikacja nie crashuje przy błędach sieci (pogoda ma fallback offline).

## Budowanie wersji produkcyjnej

```bash
npm run build            # bundling (out/)
npm run dist:linux       # AppImage
npm run dist:win         # NSIS
npm run dist:mac         # dmg
```

## Testy i jakość

```bash
npm test                 # testy jednostkowe (schedule, format, serwer admina)
npm run typecheck        # TypeScript (node + web)
```

## Bezpieczeństwo repozytorium

`.gitignore` blokuje: `node_modules`, `dist`/`out`/`release`, **`.env`**,
`*.local`, **`config.json`** (dane realne!), **`/uploads`**, `*.log`, `.DS_Store`.

- **Realny `config.json` i `.env` NIGDY nie trafiają do repo.** W repo są tylko
  `config.example.json` i `.env.example` z pustymi/przykładowymi wartościami.
- Żadnych sekretów, adresów IP ani danych uczniów w kodzie.

## Struktura projektu

```
/electron      main.ts (kiosk) · preload.ts · server.ts (Express admin) · adminPage.ts
/src           App.tsx · /views (Lesson/Break/LongBreak/Welcome/AfterSchool/DayOff)
               /feed (StoryRotator + kafle) · /components · /hooks · /util
/lib           schedule.ts (+testy) · weather.ts · config.ts · format.ts · librusScraper.ts · types.ts
/scripts       hash-password.mjs
config.example.json · .env.example · .gitignore
```
