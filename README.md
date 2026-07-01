# Candle 🕯

[![Build](https://github.com/Segabyte/Candle/actions/workflows/build.yml/badge.svg)](https://github.com/Segabyte/Candle/actions/workflows/build.yml)
![Version](https://img.shields.io/badge/version-0.1.1-6b4fbb)
![Platform](https://img.shields.io/badge/platform-Windows%20x64-0078d6?logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-33-47848f?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r169-000000?logo=three.js&logoColor=white)
![License](https://img.shields.io/badge/license-proprietary-lightgrey)

**A faith-centered focus companion for Windows — light a candle, study in peace.**

A faith-centered focus companion for Windows. Light a candle for a study
session; instead of a stressful countdown, a realistic 3D candle slowly melts
as your time passes. When the session ends, the flame goes out gently, smoke
rises, and a soft chime plays.

> You are not studying alone. You are studying in the presence of God.

## Tech stack

- Electron 33 + electron-builder (Windows `.exe` installer)
- React 18 + TypeScript + Vite
- Three.js (procedural candle — no 3D asset files needed)
- Zustand for state; local JSON storage (private, local-first)

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev        # launches Electron with hot reload
```

## Build & package a Windows .exe

```bash
npm run build      # typecheck + build renderer and main process
npm run package    # build + create the Windows installer
```

The installer lands in `release/Candle-Setup-<version>.exe` (NSIS, x64).
Run `npm run package` on a Windows machine.

## Project layout

```
electron/            main process
  main.ts            app entry, IPC wiring
  window-manager.ts  full window + always-on-top mini window
  timer.ts           authoritative session timer (shared by both windows)
  storage.ts         local-first JSON storage
  notifications.ts   gentle notifications, daily/streak reminders
  focus-protection.ts  process monitoring (blocklist / allowlist)
  tray.ts            system tray
  preload.ts         typed contextBridge ("window.candle")
src/shared/          types, constants, utils shared by both processes
src/renderer/
  components/        CandleScene, TimerControls, FaithMessage, ...
  screens/           Home, Dashboard, Settings, FocusProtection, Completion
  services/          bridge, dashboard, chime (WebAudio), auth (stub)
  store/             Zustand stores
  three/             candleModel, flameShader, smokeParticles, waxMeltAnimation, scene
```

## How to test features

**Timer & candle** — pick 15/30/60 min or a custom duration and press
"Light the candle". The candle melts with `progress = elapsed / total`;
pause, resume, "End gently", and reset are on the home screen. For a quick
end-to-end test, enter `1` as a custom duration.

**Mini mode** — click "Mini mode". A small frameless candle floats
always-on-top just above the taskbar (bottom-right by default). Drag it
anywhere; its position is remembered. Pause/End/Expand are under the candle.
The session keeps running — the timer lives in the main process, so full and
mini windows always agree.

**Notifications** — Settings → enable notifications, set a daily reminder
one minute ahead, and wait. Session-complete notifications fire when a
candle finishes. Windows: make sure notifications are allowed for Candle in
Windows Settings → System → Notifications.

**Focus protection** — Focus Protection screen → add an app (e.g.
`notepad.exe`), confirm the permission prompt, then start a session and open
Notepad. Within ~5 seconds you'll get a gentle reminder and Notepad is asked
to close (politely — no force kill). The emergency exit button stops
protection instantly. Blocking only runs during sessions. Website blocking
is Phase 2 (hosts file / local DNS / browser extension / Windows Filtering
Platform are the candidate mechanisms); the UI and data model already exist.

**Data & privacy** — everything is stored locally in
`%APPDATA%/candle/candle-data/*.json`. Settings → export history (JSON) or
clear all local data. No login is required, ever; the account section is a
stub for future cloud sync (Google / Facebook / email / Microsoft / Apple).

## Distribution via jesus-lovesyou.ca

The packaged installer (`release/Candle-Setup-<version>.exe`) can be uploaded
to https://jesus-lovesyou.ca/#candles as a direct download. See
`docs/INTEGRATION.md` for the planned website/API integration.

## Auto-update

Installed builds check for updates via [`electron-updater`](https://www.electron.build/auto-update)
against the project's GitHub Releases (`publish` in `electron-builder.yml`).
A new version downloads quietly in the background and installs the next time
Candle is closed — sessions are never interrupted. To ship an update, bump the
`version` in `package.json` and push a `v*` tag; CI builds and publishes the
release (with `latest.yml`) that clients pick up.

> **Note:** while this repository is **private**, `electron-updater` cannot read
> the release feed without an embedded token, so end-user auto-update is
> effectively disabled. Make the repo public, or switch `publish` to a
> `generic` provider pointing at a web host (e.g. jesus-lovesyou.ca) that serves
> `latest.yml` + the installer, to enable updates in the wild.

## Roadmap

- Website blocking (Phase 2)
- More candle types: beeswax, prayer, glass, wall candle
- Ambient sounds: rain, soft piano, church ambience
- Cloud sync + accounts, mobile companion
- macOS / Linux builds (the codebase is already cross-platform; focus
  protection is Windows-only and safely disabled elsewhere)
