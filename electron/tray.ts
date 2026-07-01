/** System tray: quick access without interrupting study. */
import { Tray, Menu, nativeImage, app } from "electron";
import { enterMiniMode, exitMiniMode } from "./window-manager";
import { timer } from "./timer";

let tray: Tray | null = null;

/** A tiny 16x16 warm-flame dot drawn in code, so no icon asset is required. */
function trayIcon(): Electron.NativeImage {
  const size = 16;
  const buf = Buffer.alloc(size * size * 4);
  const cx = 7.5;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - 8.5;
      const d = Math.sqrt(dx * dx + dy * dy * 0.6);
      if (d < 5.5) {
        const t = Math.max(0, 1 - d / 5.5);
        buf[i] = 255; // R
        buf[i + 1] = Math.round(140 + 100 * t); // G
        buf[i + 2] = Math.round(40 + 60 * t); // B
        buf[i + 3] = Math.round(255 * Math.min(1, t * 2)); // A
      }
    }
  }
  return nativeImage.createFromBuffer(buf, { width: size, height: size });
}

export function createTray(): void {
  if (tray) return;
  tray = new Tray(trayIcon());
  tray.setToolTip("Candle — a quiet focus companion");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Open Candle", click: () => exitMiniMode() },
      { label: "Mini candle", click: () => enterMiniMode() },
      { type: "separator" },
      { label: "End session gently", click: () => timer.endGently() },
      { type: "separator" },
      { label: "Quit", click: () => app.quit() },
    ])
  );
  tray.on("click", () => exitMiniMode());
}
