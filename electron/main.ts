import { app, ipcMain, dialog } from "electron";
import fs from "node:fs";
import { IPC } from "../src/shared/constants";
import type {
  AppSettings,
  FocusProtectionSettings,
  StudySession,
} from "../src/shared/types";
import { storage } from "./storage";
import { timer } from "./timer";
import {
  createFullWindow,
  enterMiniMode,
  exitMiniMode,
  getFullWindow,
} from "./window-manager";
import { createTray } from "./tray";
import { focusProtection } from "./focus-protection";
import {
  notify,
  notifySessionComplete,
  startDailyReminderLoop,
  maybeStreakReminder,
} from "./notifications";

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => exitMiniMode());

  app.whenReady().then(() => {
    app.setAppUserModelId("com.candle.app"); // Windows notifications

    createFullWindow();
    createTray();
    startDailyReminderLoop();
    setTimeout(maybeStreakReminder, 4000);

    registerIpc();

    timer.onComplete((state) => {
      focusProtection.stop();
      if (!state.endedEarly) notifySessionComplete();
    });
  });

  app.on("window-all-closed", () => {
    app.quit();
  });
}

function registerIpc(): void {
  // Timer
  ipcMain.on(IPC.TIMER_START, (_e, minutes: number) => {
    timer.start(minutes);
    focusProtection.startForSession();
  });
  ipcMain.on(IPC.TIMER_PAUSE, () => timer.pause());
  ipcMain.on(IPC.TIMER_RESUME, () => timer.resume());
  ipcMain.on(IPC.TIMER_END, () => timer.endGently());
  ipcMain.on(IPC.TIMER_RESET, () => {
    timer.reset();
    focusProtection.stop();
  });
  ipcMain.handle(IPC.TIMER_GET, () => timer.getState());

  // Settings
  ipcMain.handle(IPC.SETTINGS_GET, () => storage.getSettings());
  ipcMain.handle(IPC.SETTINGS_SET, (_e, s: AppSettings) => {
    storage.setSettings(s);
    const win = getFullWindow();
    if (win && !win.isDestroyed()) win.setAlwaysOnTop(s.alwaysOnTopEnabled);
  });

  // Focus protection
  ipcMain.handle(IPC.FOCUS_GET, () => storage.getFocusSettings());
  ipcMain.handle(IPC.FOCUS_SET, (_e, s: FocusProtectionSettings) => {
    storage.setFocusSettings(s);
    if (!s.enabled) focusProtection.stop();
  });
  ipcMain.on(IPC.FOCUS_STOP, () => focusProtection.stop());
  ipcMain.handle(IPC.FOCUS_LIST_APPS, () => focusProtection.listRunningApps());

  // Sessions
  ipcMain.handle(IPC.SESSIONS_LIST, () => storage.getSessions());
  ipcMain.handle(IPC.SESSIONS_ADD, (_e, s: StudySession) =>
    storage.addSession(s)
  );
  ipcMain.handle(IPC.SESSIONS_CLEAR, () => storage.clearAll());
  ipcMain.handle(IPC.SESSIONS_EXPORT, async () => {
    const win = getFullWindow();
    if (!win) return { ok: false };
    const res = await dialog.showSaveDialog(win, {
      title: "Export your Candle journey",
      defaultPath: "candle-journey.json",
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
    if (res.canceled || !res.filePath) return { ok: false };
    fs.writeFileSync(res.filePath, storage.exportAll(), "utf-8");
    return { ok: true, path: res.filePath };
  });

  // Profile (guest-first; SSO providers plug in here later)
  ipcMain.handle(IPC.PROFILE_GET, () => storage.getProfile());

  // Windows / mini mode
  ipcMain.on(IPC.MINI_ENTER, () => enterMiniMode());
  ipcMain.on(IPC.MINI_EXIT, () => exitMiniMode());

  // Notifications
  ipcMain.on(IPC.NOTIFY, (_e, title: string, body: string) =>
    notify(title, body)
  );
}
