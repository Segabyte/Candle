import { useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { computeSummary } from "@/services/dashboardService";
import { DashboardCards } from "@/components/DashboardCards";
import { formatMinutes } from "@shared/utils";

const MOOD_LABELS: Record<string, string> = {
  peaceful: "Peaceful",
  focused: "Focused",
  grateful: "Grateful",
  tired_proud: "Tired but proud",
  need_more_practice: "Need more practice",
};

export function DashboardScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const summary = useMemo(() => computeSummary(sessions), [sessions]);

  const recent = [...sessions]
    .filter((s) => s.completed)
    .sort((a, b) => b.startTime.localeCompare(a.startTime))
    .slice(0, 10);

  return (
    <div className="fade-in">
      <h1>Your Candle Journey</h1>
      <div className="subtitle">
        One session at a time. Growing gently.
      </div>

      <DashboardCards summary={summary} />

      {summary.subjectsPracticed.length > 0 && (
        <>
          <h2>Subjects practiced</h2>
          <div className="tag-row">
            {summary.subjectsPracticed.map((s) => (
              <span className="tag" key={s}>{s}</span>
            ))}
          </div>
        </>
      )}

      <h2>Recent sessions</h2>
      {recent.length === 0 ? (
        <div className="notice">
          Your journey begins with one small candle. Light your first session
          whenever you're ready.
        </div>
      ) : (
        <div className="session-list">
          {recent.map((s) => (
            <div className="session-item" key={s.id}>
              <span className="when">
                {new Date(s.startTime).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                {new Date(s.startTime).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="what">
                {s.subject || s.topic || "Quiet focus"}
                {s.moodAfterSession
                  ? ` · ${MOOD_LABELS[s.moodAfterSession]}`
                  : ""}
              </span>
              <span className="dur">{formatMinutes(s.actualDurationMinutes)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
