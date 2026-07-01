import { contextBridge, ipcRenderer } from "electron";
import type {
  AppSettings,
  CandleBridge,
  FocusProtectionSettings,
  StudySession,
  TimerState,
} from "../src/shared/types";
import { IPC } from "../src/shared/constants";

const isMini = process.argv.includes("--candle-mini");

const bridge: CandleBridge = {
  platform: process.platform,
  timer: {
    start: (minutes) => ipcRenderer.send(IPC.TIMER_START, minutes),
    pause: () => ipcRenderer.send(IPC.TIMER_PAUSE),
    resume: () => ipcRenderer.send(IPC.TIMER_RESUME),
    endGently: () => ipcRenderer.send(IPC.TIMER_END),
    reset: () => ipcRenderer.send(IPC.TIMER_RESET),
    getState: () => ipcRenderer.invoke(IPC.TIMER_GET) as Promise<TimerState>,
    onState: (cb) => {
      const handler = (_e: unknown, s: TimerState) => cb(s);
      ipcRenderer.on(IPC.TIMER_STATE, handler);
      return () => ipcRenderer.removeListener(IPC.TIMER_STATE, handler);
    },
  },
  settings: {
    get: () => ipcRenderer.invoke(IPC.SETTINGS_GET) as Promise<AppSettings>,
    set: (s) => ipcRenderer.invoke(IPC.SETTINGS_SET, s) as Promise<void>,
  },
  focus: {
    get: () =>
      ipcRenderer.invoke(IPC.FOCUS_GET) as Promise<FocusProtectionSettings>,
    set: (s) => ipcRenderer.invoke(IPC.FOCUS_SET, s) as Promise<void>,
    stopNow: () => ipcRenderer.send(IPC.FOCUS_STOP),
    listRunningApps: () =>
      ipcRenderer.invoke(IPC.FOCUS_LIST_APPS) as Promise<string[]>,
  },
  sessions: {
    list: () => ipcRenderer.invoke(IPC.SESSIONS_LIST) as Promise<StudySession[]>,
    add: (s) => ipcRenderer.invoke(IPC.SESSIONS_ADD, s) as Promise<void>,
    clearAll: () => ipcRenderer.invoke(IPC.SESSIONS_CLEAR) as Promise<void>,
    exportAll: () =>
      ipcRenderer.invoke(IPC.SESSIONS_EXPORT) as Promise<{
        ok: boolean;
        path?: string;
      }>,
  },
  profile: {
    get: () => ipcRenderer.invoke(IPC.PROFILE_GET),
  },
  win: {
    enterMini: () => ipcRenderer.send(IPC.MINI_ENTER),
    exitMini: () => ipcRenderer.send(IPC.MINI_EXIT),
    isMini,
  },
  notify: (title, body) => ipcRenderer.send(IPC.NOTIFY, title, body),
};

contextBridge.exposeInMainWorld("candle", bridge);
