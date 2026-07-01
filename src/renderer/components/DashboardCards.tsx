import type { DashboardSummary } from "@shared/types";
import { formatMinutes } from "@shared/utils";

export function DashboardCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    { label: "Study Sessions Completed", value: String(summary.totalSessions) },
    { label: "Time Spent with God", value: formatMinutes(summary.faithFocusMinutes) },
    { label: "Total Study Time", value: formatMinutes(summary.totalMinutes) },
    { label: "Current Streak", value: `${summary.currentStreakDays} day${summary.currentStreakDays === 1 ? "" : "s"}` },
    { label: "Longest Streak", value: `${summary.longestStreakDays} day${summary.longestStreakDays === 1 ? "" : "s"}` },
    { label: "This Week", value: formatMinutes(summary.weeklyMinutes) },
    { label: "This Month", value: formatMinutes(summary.monthlyMinutes) },
    { label: "Reflections Written", value: String(summary.reflectionsCount) },
  ];
  return (
    <div className="cards">
      {cards.map((c) => (
        <div className="card" key={c.label}>
          <div className="value">{c.value}</div>
          <div className="label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
