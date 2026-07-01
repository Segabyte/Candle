/**
 * Authoritative session timer. Lives in the main process so full mode and
 * mini mode always agree, and so the session survives window switches.
 */
import { BrowserWindow } from "electron";
import { IPC } from "../src/shared/constants";
import type { TimerState } from "../src/shared/types";

type Listener = (state: TimerState) => void;

const state: TimerState = {
  status: "idle",
  totalSeconds: 0,
  elapsedSeconds: 0,
  plannedMinutes: 0,
  endedEarly: false,
};

let interval: NodeJS.Timeout | null = null;
const completionListeners: Listener[] = [];

function broadcast(): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(IPC.TIMER_STATE, state);
  }
}

function stopInterval(): void {
  if (interval) clearInterval(interval);
  interval = null;
}

function complete(endedEarly: boolean): void {
  stopInterval();
  state.status = "completed";
  state.endedEarly = endedEarly;
  if (!endedEarly) state.elapsedSeconds = state.totalSeconds;
  broadcast();
  for (const l of completionListeners) l({ ...state });
}

export const timer = {
  getState(): TimerState {
    return { ...state };
  },

  start(minutes: number): void {
    stopInterval();
    state.status = "running";
    state.plannedMinutes = minutes;
    state.totalSeconds = Math.max(60, Math.round(minutes * 60));
    state.elapsedSeconds = 0;
    state.startedAt = new Date().toISOString();
    state.endedEarly = false;
    interval = setInterval(() => {
      state.elapsedSeconds += 1;
      if (state.elapsedSeconds >= state.totalSeconds) {
        complete(false);
      } else {
        broadcast();
      }
    }, 1000);
    broadcast();
  },

  pause(): void {
    if (state.status !== "running") return;
    stopInterval();
    state.status = "paused";
    broadcast();
  },

  resume(): void {
    if (state.status !== "paused") return;
    state.status = "running";
    interval = setInterval(() => {
      state.elapsedSeconds += 1;
      if (state.elapsedSeconds >= state.totalSeconds) {
        complete(false);
      } else {
        broadcast();
      }
    }, 1000);
    broadcast();
  },

  /** "End gently" — close the session now, keeping what was done. */
  endGently(): void {
    if (state.status === "idle") return;
    complete(true);
  },

  reset(): void {
    stopInterval();
    state.status = "idle";
    state.totalSeconds = 0;
    state.elapsedSeconds = 0;
    state.plannedMinutes = 0;
    state.startedAt = undefined;
    state.endedEarly = false;
    broadcast();
  },

  onComplete(cb: Listener): void {
    completionListeners.push(cb);
  },
};
