/** Gentle desktop notifications, always respectful of user settings. */
import { Notification } from "electron";
import { storage } from "./storage";
import {
  DAILY_REMINDERS,
  ENCOURAGEMENTS,
} from "../src/shared/constants";
import { pick, dayKey } from "../src/shared/utils";

export function notify(title: string, body: string, force = false): void {
  const s = storage.getSettings();
  if (!force && (!s.notificationsEnabled || s.silentMode)) return;
  if (!Notification.isSupported()) return;
  new Notification({ title, body, silent: true }).show();
}

export function notifySessionComplete(): void {
  const s = storage.getSettings();
  if (!s.sessionCompleteNotificationEnabled) return;
  const body = s.faithWordingEnabled
    ? pick([
        "Your Faith Focus session is complete.",
        "Well done. You stayed present.",
      ])
    : pick(["Your candle session is complete.", "Well done. You stayed present."]);
  notify("Candle", body);
}

let reminderTimer: NodeJS.Timeout | null = null;
let lastReminderDay = "";

/** Checks once a minute whether the daily reminder time has arrived. */
export function startDailyReminderLoop(): void {
  if (reminderTimer) clearInterval(reminderTimer);
  reminderTimer = setInterval(() => {
    const s = storage.getSettings();
    if (!s.dailyReminderEnabled || !s.dailyReminderTime) return;
    const now = new Date();
    const [h, m] = s.dailyReminderTime.split(":").map(Number);
    const today = dayKey(now);
    if (
      now.getHours() === h &&
      now.getMinutes() === m &&
      lastReminderDay !== today
    ) {
      lastReminderDay = today;
      notify("Candle", pick(DAILY_REMINDERS));
    }
  }, 60_000);
}

/** On launch: a soft streak nudge if the user has one going. */
export function maybeStreakReminder(): void {
  const s = storage.getSettings();
  if (!s.streakRemindersEnabled) return;
  const sessions = storage.getSessions().filter((x) => x.completed);
  if (sessions.length === 0) return;

  const days = new Set(sessions.map((x) => dayKey(new Date(x.startTime))));
  let streak = 0;
  const cursor = new Date();
  // Streak counts up to yesterday; today is still open.
  cursor.setDate(cursor.getDate() - 1);
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  const today = dayKey(new Date());
  if (streak >= 2 && !days.has(today)) {
    notify("Candle", `You are on a ${streak}-day study streak. One candle today keeps your journey going.`);
  } else if (streak === 0 && Math.random() < 0.3) {
    notify("Candle", pick(ENCOURAGEMENTS));
  }
}
