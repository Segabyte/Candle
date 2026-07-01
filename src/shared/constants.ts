import type { AppSettings, FocusProtectionSettings } from "./types";

export const APP_NAME = "Candle";

export const DURATION_PRESETS = [15, 30, 60] as const;

export const VERSES: string[] = [
  "Be still, and know that I am God.",
  "I can do all things through Christ who strengthens me.",
  "You are not alone.",
  "Study with peace.",
  "God is with you in this moment.",
  "The Lord is my light and my salvation.",
  "Come to me, all who are weary, and I will give you rest.",
  "Peace I leave with you; my peace I give to you.",
  "In quietness and trust shall be your strength.",
  "The Lord will keep your going out and your coming in.",
];

export const GENTLE_REMINDERS: string[] = [
  "Stay with your candle.",
  "Return gently to your study.",
  "This session is for focus.",
  "You are doing well. Come back.",
];

export const COMPLETION_MESSAGES = {
  faith: ["Well done.", "You stayed present.", "God was with you in this moment."],
  neutral: ["Well done.", "You stayed present."],
};

export const ENCOURAGEMENTS: string[] = [
  "You are growing one session at a time.",
  "Small faithful practice becomes strength.",
  "Return gently. You are not alone.",
];

export const DAILY_REMINDERS: string[] = [
  "Light your candle for today's study.",
  "A quiet moment is waiting for you.",
  "Start one small session today.",
];

/** Common distraction executables offered as quick-add suggestions. */
export const SUGGESTED_BLOCKED_APPS: string[] = [
  "Steam.exe",
  "EpicGamesLauncher.exe",
  "Discord.exe",
  "Telegram.exe",
  "WhatsApp.exe",
  "Spotify.exe",
  "TikTok.exe",
  "Netflix.exe",
];

export const DEFAULT_SETTINGS: AppSettings = {
  defaultDurationMinutes: 30,
  candleSize: "medium",
  faithModeEnabled: true,
  selectedVerse: VERSES[0],
  customVerses: [],
  chimeEnabled: true,
  showRemainingTime: true,
  notificationsEnabled: true,
  sessionCompleteNotificationEnabled: true,
  dailyReminderEnabled: false,
  dailyReminderTime: "09:00",
  streakRemindersEnabled: true,
  silentMode: false,
  faithWordingEnabled: true,
  alwaysOnTopEnabled: false,
  miniModeEnabled: false,
};

export const DEFAULT_FOCUS_SETTINGS: FocusProtectionSettings = {
  enabled: false,
  mode: "blocklist",
  blockedApps: [],
  allowedApps: [],
  blockedWebsites: [],
  emergencyExitEnabled: true,
};

export const MINI_WINDOW = { width: 210, height: 300 };

export const IPC = {
  TIMER_START: "timer:start",
  TIMER_PAUSE: "timer:pause",
  TIMER_RESUME: "timer:resume",
  TIMER_END: "timer:end",
  TIMER_RESET: "timer:reset",
  TIMER_GET: "timer:get",
  TIMER_STATE: "timer:state",
  SETTINGS_GET: "settings:get",
  SETTINGS_SET: "settings:set",
  FOCUS_GET: "focus:get",
  FOCUS_SET: "focus:set",
  FOCUS_STOP: "focus:stop",
  FOCUS_LIST_APPS: "focus:list-apps",
  SESSIONS_LIST: "sessions:list",
  SESSIONS_ADD: "sessions:add",
  SESSIONS_CLEAR: "sessions:clear",
  SESSIONS_EXPORT: "sessions:export",
  PROFILE_GET: "profile:get",
  MINI_ENTER: "mini:enter",
  MINI_EXIT: "mini:exit",
  NOTIFY: "notify",
} as const;
