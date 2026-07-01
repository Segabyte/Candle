// ---------- Core data model (spec §9) ----------

export type CandleSize = "small" | "medium" | "large";
export type Mood =
  | "peaceful"
  | "focused"
  | "grateful"
  | "tired_proud"
  | "need_more_practice";

export type UserProfile = {
  id: string;
  mode: "guest" | "authenticated";
  displayName?: string;
  email?: string;
  authProvider?: "google" | "facebook" | "email" | "microsoft" | "apple";
  createdAt: string;
  updatedAt: string;
};

export type StudySession = {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  completed: boolean;
  candleSize: CandleSize;
  faithModeEnabled: boolean;
  verseDisplayed?: string;
  focusProtectionEnabled: boolean;
  subject?: string;
  topic?: string;
  learned?: string;
  reflection?: string;
  gratitudeNote?: string;
  moodAfterSession?: Mood;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  totalSessions: number;
  totalMinutes: number;
  faithFocusMinutes: number;
  currentStreakDays: number;
  longestStreakDays: number;
  weeklyMinutes: number;
  monthlyMinutes: number;
  subjectsPracticed: string[];
  reflectionsCount: number;
};

export type FocusProtectionSettings = {
  enabled: boolean;
  mode: "blocklist" | "allowlist";
  blockedApps: string[];
  allowedApps: string[];
  blockedWebsites: string[];
  emergencyExitEnabled: boolean;
};

export type AppSettings = {
  defaultDurationMinutes: number;
  candleSize: CandleSize;
  faithModeEnabled: boolean;
  selectedVerse?: string;
  customVerses: string[];
  chimeEnabled: boolean;
  showRemainingTime: boolean;
  notificationsEnabled: boolean;
  sessionCompleteNotificationEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime?: string; // "HH:MM"
  streakRemindersEnabled: boolean;
  silentMode: boolean;
  faithWordingEnabled: boolean;
  alwaysOnTopEnabled: boolean;
  miniModeEnabled: boolean;
  windowPosition?: { x: number; y: number; width: number; height: number };
  miniPosition?: { x: number; y: number };
};

// ---------- Timer (authoritative state lives in the main process) ----------

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export type TimerState = {
  status: TimerStatus;
  totalSeconds: number;
  elapsedSeconds: number;
  plannedMinutes: number;
  startedAt?: string;
  /** true when the session was ended early via "End gently" */
  endedEarly: boolean;
};

// ---------- Preload bridge ----------

export type CandleBridge = {
  platform: string;
  timer: {
    start: (minutes: number) => void;
    pause: () => void;
    resume: () => void;
    endGently: () => void;
    reset: () => void;
    getState: () => Promise<TimerState>;
    onState: (cb: (s: TimerState) => void) => () => void;
  };
  settings: {
    get: () => Promise<AppSettings>;
    set: (s: AppSettings) => Promise<void>;
  };
  focus: {
    get: () => Promise<FocusProtectionSettings>;
    set: (s: FocusProtectionSettings) => Promise<void>;
    stopNow: () => void;
    listRunningApps: () => Promise<string[]>;
  };
  sessions: {
    list: () => Promise<StudySession[]>;
    add: (s: StudySession) => Promise<void>;
    clearAll: () => Promise<void>;
    exportAll: () => Promise<{ ok: boolean; path?: string }>;
  };
  profile: {
    get: () => Promise<UserProfile>;
  };
  win: {
    enterMini: () => void;
    exitMini: () => void;
    isMini: boolean;
  };
  notify: (title: string, body: string) => void;
};

declare global {
  interface Window {
    candle: CandleBridge;
  }
}
