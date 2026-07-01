/** Creates and swaps between the full window and the always-on-top mini candle. */
import { BrowserWindow, screen, app } from "electron";
import path from "node:path";
import { storage } from "./storage";
import { MINI_WINDOW } from "../src/shared/constants";

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

let fullWin: BrowserWindow | null = null;
let miniWin: BrowserWindow | null = null;

function load(win: BrowserWindow, hash: string): void {
  if (VITE_DEV_SERVER_URL) {
    void win.loadURL(VITE_DEV_SERVER_URL + "#" + hash);
  } else {
    void win.loadFile(path.join(__dirname, "../dist/index.html"), { hash });
  }
}

export function createFullWindow(): BrowserWindow {
  if (fullWin && !fullWin.isDestroyed()) {
    fullWin.show();
    fullWin.focus();
    return fullWin;
  }
  const s = storage.getSettings();
  const pos = s.windowPosition;
  fullWin = new BrowserWindow({
    width: pos?.width ?? 1080,
    height: pos?.height ?? 760,
    x: pos?.x,
    y: pos?.y,
    minWidth: 860,
    minHeight: 620,
    backgroundColor: "#171310",
    title: "Candle",
    alwaysOnTop: s.alwaysOnTopEnabled,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  load(fullWin, "/");

  fullWin.on("close", () => {
    if (!fullWin) return;
    const b = fullWin.getBounds();
    const cur = storage.getSettings();
    storage.setSettings({
      ...cur,
      windowPosition: { x: b.x, y: b.y, width: b.width, height: b.height },
    });
  });
  fullWin.on("closed", () => {
    fullWin = null;
    if (miniWin && !miniWin.isDestroyed()) miniWin.close();
    app.quit();
  });
  return fullWin;
}

export function enterMiniMode(): void {
  const s = storage.getSettings();
  const display = screen.getPrimaryDisplay();
  const wa = display.workArea; // excludes the taskbar → we sit just above it
  const defaultX = wa.x + wa.width - MINI_WINDOW.width - 24;
  const defaultY = wa.y + wa.height - MINI_WINDOW.height - 12;

  if (!miniWin || miniWin.isDestroyed()) {
    miniWin = new BrowserWindow({
      width: MINI_WINDOW.width,
      height: MINI_WINDOW.height,
      x: s.miniPosition?.x ?? defaultX,
      y: s.miniPosition?.y ?? defaultY,
      frame: false,
      transparent: true,
      resizable: false,
      skipTaskbar: true,
      hasShadow: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        additionalArguments: ["--candle-mini"],
      },
    });
    // 'screen-saver' level floats above normal always-on-top windows,
    // keeping the little candle visible above the taskbar area.
    miniWin.setAlwaysOnTop(true, "screen-saver");
    miniWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    load(miniWin, "/mini");

    miniWin.on("moved", () => {
      if (!miniWin) return;
      const [x, y] = miniWin.getPosition();
      const cur = storage.getSettings();
      storage.setSettings({ ...cur, miniPosition: { x, y } });
    });
    miniWin.on("closed", () => {
      miniWin = null;
    });
  } else {
    miniWin.show();
  }
  fullWin?.hide();

  const cur = storage.getSettings();
  storage.setSettings({ ...cur, miniModeEnabled: true });
}

export function exitMiniMode(): void {
  if (miniWin && !miniWin.isDestroyed()) miniWin.hide();
  const win = createFullWindow();
  win.show();
  win.focus();
  const cur = storage.getSettings();
  storage.setSettings({ ...cur, miniModeEnabled: false });
}

export function getFullWindow(): BrowserWindow | null {
  return fullWin;
}
