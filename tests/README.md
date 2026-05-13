# Testy ZetBud

Uruchamiaj okresowo (lokalnie lub w CI), żeby łapać regresje — **najważniejszy jest formularz** (E2E).

## Wymagania

- **Node.js** 18+ (testy jednostkowe Node + Playwright)
- **PHP** 8.1+ z rozszerzeniem `openssl` (testy PHP + wbudowany serwer do E2E)
- Po pierwszej instalacji Playwright: `npx playwright install chromium`

### PHP na macOS (Homebrew)

1. Zainstaluj: `brew install php` (lub `brew install php@8.3` i postępuj według `brew info php@8.3`).
2. Upewnij się, że Homebrew jest w PATH (w nowym terminalu często wystarczy `eval "$(brew shellenv)"` w `~/.zprofile`).
3. Sprawdź: `php -v` oraz `php -m | grep openssl` (powinna być linia `openssl`).

**Uwaga:** terminal używany przez narzędzia IDE czasem **nie** dziedziczy tego samego PATH co Terminal.app — jeśli `php` działa u Ciebie lokalnie, a skrypt zgłasza „brak php”, uruchom testy z zwykłego terminala albo dodaj ścieżkę do `php` do PATH w profilu powłoki (np. `/opt/homebrew/bin` na Apple Silicon, `/usr/local/bin` na starszym Intelu z Homebrew w `/usr/local`).

Bez PHP w PATH możesz chociaż odpalić testy JS: `npm run test:node`.

## Szybki skrypt (wszystko)

Z katalogu głównego repozytorium:

```bash
npm ci
npm run build
npx playwright install chromium
php tests/php/phone_validator_test.php
npm run test:node
php -S 127.0.0.1:8765 -t dist >/tmp/zetbud-phpserver.log 2>&1 &
sleep 1
BASE_URL=http://127.0.0.1:8765 npx playwright test
kill %1
```

Albo jednym poleceniem: **`npm test`** — uruchamia testy PHP, testy Node, buduje `dist/` jeśli go brak, podnosi krótki serwer PHP i **Playwright** (E2E formularza).

## Pojedyncze pakiety

| Polecenie | Co sprawdza |
|-----------|----------------|
| `npm run test:php` | Składanie numeru (`lib/zetbud-contact-validators.php`) |
| `npm run test:node` | Ta sama logika po stronie JS (sync cyfr krajowych) |
| `npm run test:unit` | Alias do `test:node` |
| `npm run test:e2e` | Pełny formularz w przeglądarce — **wymaga** działającego serwera HTTP z katalogu `dist/` |
| `npm run test:quick` | PHP + Node (bez builda, bez serwera, bez Playwright) |
| `npm test` | PHP + Node + serwer + Playwright (pełna ścieżka) |

### E2E ręcznie

1. `npm run build`
2. W jednym terminalu: `php -S 127.0.0.1:8765 -t dist`
3. W drugim: `BASE_URL=http://127.0.0.1:8765 npx playwright test`

Na stagingu z prawdziwym SMTP możesz ustawić `BASE_URL=https://twoja-domena.pl` (upewnij się, że `index.html` i `contact.php` są pod tym samym originem).

## Uwagi

- E2E **nie wymaga** skonfigurowanego SMTP: przy błędzie wysyłki oczekiwane jest **ostrzeżenie** (żółty pas), nie „wiszący” formularz — test i tak przechodzi.
- Skrzynka testowa `e2e-zetbud@example.invalid` nie musi istnieć — chodzi o przejście walidacji i odpowiedź serwera.
