import type { DashboardSummary, StudySession } from "@shared/types";
import { dayKey } from "@shared/utils";

export function computeSummary(sessions: StudySession[]): DashboardSummary {
  const completed = sessions.filter((s) => s.completed);
  const now = new Date();

  const totalMinutes = completed.reduce(
    (acc, s) => acc + s.actualDurationMinutes,
    0
  );
  const faithFocusMinutes = completed
    .filter((s) => s.faithModeEnabled)
    .reduce((acc, s) => acc + s.actualDurationMinutes, 0);

  const weekAgo = new Date(now.getTime() - 7 * 86400_000);
  const monthAgo = new Date(now.getTime() - 30 * 86400_000);
  const weeklyMinutes = completed
    .filter((s) => new Date(s.startTime) >= weekAgo)
    .reduce((acc, s) => acc + s.actualDurationMinutes, 0);
  const monthlyMinutes = completed
    .filter((s) => new Date(s.startTime) >= monthAgo)
    .reduce((acc, s) => acc + s.actualDurationMinutes, 0);

  // Streaks: consecutive days with at least one completed session.
  const days = new Set(completed.map((s) => dayKey(new Date(s.startTime))));
  let currentStreakDays = 0;
  const cursor = new Date(now);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1); // today still open
  while (days.has(dayKey(cursor))) {
    currentStreakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let longestStreakDays = 0;
  const sorted = [...days].sort();
  let run = 0;
  let prev: Date | null = null;
  for (const key of sorted) {
    const d = new Date(key + "T00:00:00");
    run = prev && d.getTime() - prev.getTime() === 86400_000 ? run + 1 : 1;
    longestStreakDays = Math.max(longestStreakDays, run);
    prev = d;
  }

  const subjectsPracticed = [
    ...new Set(
      completed
        .map((s) => s.subject?.trim())
        .filter((s): s is string => !!s && s.length > 0)
    ),
  ];

  const reflectionsCount = completed.filter(
    (s) => (s.reflection && s.reflection.trim()) || (s.gratitudeNote && s.gratitudeNote.trim())
  ).length;

  return {
    totalSessions: completed.length,
    totalMinutes,
    faithFocusMinutes,
    currentStreakDays,
    longestStreakDays,
    weeklyMinutes,
    monthlyMinutes,
    subjectsPracticed,
    reflectionsCount,
  };
}
