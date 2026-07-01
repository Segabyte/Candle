# Candle × jesus-lovesyou.ca — integration plan

Candle will be distributed and later integrated with
**https://jesus-lovesyou.ca/#candles**.

## Phase A — downloadable app (now)

1. Run `npm run package` on Windows → `release/Candle-Setup-<version>.exe`.
2. Upload the installer to the site's hosting and link it from the
   `#candles` section, e.g. "Download Candle for Windows".
3. Optional: publish updates by replacing the file; electron-builder's
   auto-update (electron-updater + a `latest.yml` feed on the same host) can
   be enabled later with ~20 lines of config.

## Phase B — website API integration (future)

Planned surface, designed to fit the existing local-first data model:

- **Auth**: the site becomes the identity provider (or fronts Google SSO).
  `authService.signIn()` in the app is already structured to accept a real
  OAuth flow; profile type has `authProvider` field.
- **Sync API** (site backend):
  - `POST /api/candle/sessions` — upload completed `StudySession` records
  - `GET  /api/candle/sessions?since=` — restore history after reinstall
  - `GET  /api/candle/verses` — serve the site's curated verse list into
    Faith Mode (the app falls back to its built-in verses offline)
  - `GET  /api/candle/latest` — version check / download link for updates
- **Web candle**: the renderer is plain React + Three.js and runs in a
  browser (`src/renderer/services/bridge.ts` already includes a browser
  fallback using localStorage), so an embedded "light a candle on the site"
  experience can reuse the same candle scene code.

## Notes

- All sync must stay opt-in; guest mode and offline use remain first-class.
- Reflections and gratitude notes are sensitive: sync them encrypted, never
  expose them publicly.
