import { create } from "zustand";
import type { StudySession, TimerState } from "@shared/types";
import { bridge } from "@/services/bridge";

type SessionStore = {
  timer: TimerState;
  sessions: StudySession[];
  /** Snapshot of the session being completed (for the completion form). */
  pendingCompletion: TimerState | null;
  init: () => void;
  loadSessions: () => Promise<void>;
  setPendingCompletion: (t: TimerState | null) => void;
  saveSession: (s: StudySession) => Promise<void>;
};

let initialized = false;

export const useSessionStore = create<SessionStore>((set, get) => ({
  timer: {
    status: "idle",
    totalSeconds: 0,
    elapsedSeconds: 0,
    plannedMinutes: 0,
    endedEarly: false,
  },
  sessions: [],
  pendingCompletion: null,

  init: () => {
    if (initialized) return;
    initialized = true;
    void bridge.timer.getState().then((t) => set({ timer: t }));
    bridge.timer.onState((t) => {
      const prev = get().timer;
      set({ timer: t });
      if (t.status === "completed" && prev.status !== "completed") {
        set({ pendingCompletion: t });
      }
    });
    void get().loadSessions();
  },

  loadSessions: async () => {
    const sessions = await bridge.sessions.list();
    set({ sessions });
  },

  setPendingCompletion: (t) => set({ pendingCompletion: t }),

  saveSession: async (s) => {
    await bridge.sessions.add(s);
    await get().loadSessions();
  },
}));
