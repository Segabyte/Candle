/**
 * Access to the Electron preload bridge, with an in-browser fallback so the
 * renderer can also run in a plain browser tab during development.
 */
import type {
  AppSettings,
  CandleBridge,
  FocusProtectionSettings,
  StudySession,
  TimerState,
  UserProfile,
} from "@shared/types";
import { DEFAULT_SETTINGS, DEFAULT_FOCUS_SETTINGS } from "@shared/constants";
import { uid } from "@shared/utils";

function makeBrowserFallback(): CandleBridge {
  let state: TimerState = {
    status: "idle",
    totalSeconds: 0,
    elapsedSeconds: 0,
    plannedMinutes: 0,
    endedEarly: false,
  };
  let interval: number | null = null;
  const listeners = new Set<(s: TimerState) => void>();
  const emit = () => listeners.forEach((l) => l({ ...state }));
  const stop = () => {
    if (interval) window.clearInterval(interval);
    interval = null;
  };
  const tick = () => {
    state.elapsedSeconds += 1;
    if (state.elapsedSeconds >= state.totalSeconds) {
      stop();
      state.status = "completed";
    }
    emit();
  };
  const store = <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    platform: "browser",
    timer: {
      start: (m) => {
        stop();
        state = {
          status: "running",
          totalSeconds: Math.max(60, m * 60),
          elapsedSeconds: 0,
          plannedMinutes: m,
          startedAt: new Date().toISOString(),
          endedEarly: false,
        };
        interval = window.setInterval(tick, 1000);
        emit();
      },
      pause: () => {
        stop();
        state.status = "paused";
        emit();
      },
      resume: () => {
        state.status = "running";
        interval = window.setInterval(tick, 1000);
        emit();
      },
      endGently: () => {
        stop();
        state.status = "completed";
        state.endedEarly = true;
        emit();
      },
      reset: () => {
        stop();
        state = {
          status: "idle",
          totalSeconds: 0,
          elapsedSeconds: 0,
          plannedMinutes: 0,
          endedEarly: false,
        };
        emit();
      },
      getState: async () => ({ ...state }),
      onState: (cb) => {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
    },
    settings: {
      get: async () => store<AppSettings>("candle.settings", DEFAULT_SETTINGS),
      set: async (s) => localStorage.setItem("candle.settings", JSON.stringify(s)),
    },
    focus: {
      get: async () =>
        store<FocusProtectionSettings>("candle.focus", DEFAULT_FOCUS_SETTINGS),
      set: async (s) => localStorage.setItem("candle.focus", JSON.stringify(s)),
      stopNow: () => void 0,
      listRunningApps: async () => [],
    },
    sessions: {
      list: async () =>
        JSON.parse(localStorage.getItem("candle.sessions") ?? "[]") as StudySession[],
      add: async (s) => {
        const all = JSON.parse(
          localStorage.getItem("candle.sessions") ?? "[]"
        ) as StudySession[];
        all.push(s);
        localStorage.setItem("candle.sessions", JSON.stringify(all));
      },
      clearAll: async () => {
        localStorage.removeItem("candle.sessions");
        localStorage.removeItem("candle.profile");
      },
      exportAll: async () => ({ ok: false }),
    },
    profile: {
      get: async () => {
        const existing = localStorage.getItem("candle.profile");
        if (existing) return JSON.parse(existing) as UserProfile;
        const now = new Date().toISOString();
        const p: UserProfile = { id: uid(), mode: "guest", createdAt: now, updatedAt: now };
        localStorage.setItem("candle.profile", JSON.stringify(p));
        return p;
      },
    },
    win: {
      enterMini: () => void 0,
      exitMini: () => void 0,
      isMini: window.location.hash.includes("mini"),
    },
    notify: () => void 0,
  };
}

export const bridge: CandleBridge =
  typeof window !== "undefined" && window.candle
    ? window.candle
    : makeBrowserFallback();
