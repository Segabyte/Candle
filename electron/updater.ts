/**
 * Gentle auto-update. Consumes the GitHub release feed (latest.yml) that
 * electron-builder publishes. Updates download quietly in the background and
 * install the next time Candle is closed — never interrupting a session.
 */
import { app } from "electron";
import { autoUpdater } from "electron-updater";
import { notify } from "./notifications";

let started = false;

export function initAutoUpdate(): void {
  // Updates only apply to an installed (packaged) build, not `npm run dev`.
  if (!app.isPackaged || started) return;
  started = true;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("error", (err) =>
    console.error("[updater]", err?.message ?? err)
  );
  autoUpdater.on("update-available", (info) =>
    console.log("[updater] downloading", info.version)
  );
  autoUpdater.on("update-not-available", () =>
    console.log("[updater] up to date")
  );
  autoUpdater.on("update-downloaded", (info) => {
    // autoInstallOnAppQuit applies it silently on the next close; just let the
    // user know so the version change isn't a surprise.
    notify(
      "Candle",
      `Version ${info.version} is ready — it will be applied next time you open Candle.`
    );
  });

  const check = () => autoUpdater.checkForUpdates().catch(() => {});
  setTimeout(check, 8000); // shortly after launch, once the window is up
  setInterval(check, 6 * 60 * 60 * 1000); // and every 6 hours while running
}
