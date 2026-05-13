Logo ZET-BUD (PNG źródłowe + warianty rozmiaru)
-----------------------------------------------
- logo-zetbud-full.png — oryginał z importu (375×263 px).
- logo-zetbud-{160,240,320,480}w.png — skalowanie max szerokości (sips -Z), do srcset w nagłówku.
- favicon-32.png, favicon-48.png — skróty w przeglądarce (proporcje zachowane).
- apple-touch-icon.png — iOS / dodaj do ekranu głównego.
- icon-192.png, icon-512.png — manifest PWA (site.webmanifest).
- favicon.svg — uproszczony znak geometryczny (wektor), czytelny w bardzo małych rozmiarach.

Ponowne wygenerowanie z nowego pliku źródłowego (macOS):
  SRC=logo-zetbud-full.png
  for z in 160 240 320 480; do sips -Z $z "$SRC" --out "logo-zetbud-${z}w.png"; done
  sips -Z 32 "$SRC" --out favicon-32.png
  sips -Z 180 "$SRC" --out apple-touch-icon.png
  itd.
