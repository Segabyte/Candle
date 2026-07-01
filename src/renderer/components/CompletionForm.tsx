import { useState } from "react";
import type { Mood, StudySession, TimerState } from "@shared/types";
import { uid } from "@shared/utils";
import { useSettingsStore } from "@/store/settingsStore";
import { useSessionStore } from "@/store/sessionStore";
import { authService } from "@/services/authService";

const MOODS: { id: Mood; label: string }[] = [
  { id: "peaceful", label: "Peaceful" },
  { id: "focused", label: "Focused" },
  { id: "grateful", label: "Grateful" },
  { id: "tired_proud", label: "Tired but proud" },
  { id: "need_more_practice", label: "Need more practice" },
];

type Props = {
  completedTimer: TimerState;
  onDone: () => void;
};

export function CompletionForm({ completedTimer, onDone }: Props) {
  const { settings, focus } = useSettingsStore();
  const saveSession = useSessionStore((s) => s.saveSession);

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [learned, setLearned] = useState("");
  const [reflection, setReflection] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [mood, setMood] = useState<Mood | undefined>();
  const [saving, setSaving] = useState(false);

  async function persist(withDetails: boolean): Promise<void> {
    setSaving(true);
    const profile = await authService.getProfile();
    const now = new Date().toISOString();
    const actualMinutes = Math.max(
      1,
      Math.round(completedTimer.elapsedSeconds / 60)
    );
    const session: StudySession = {
      id: uid(),
      userId: profile.id,
      startTime: completedTimer.startedAt ?? now,
      endTime: now,
      plannedDurationMinutes: completedTimer.plannedMinutes,
      actualDurationMinutes: actualMinutes,
      completed: true,
      candleSize: settings.candleSize,
      faithModeEnabled: settings.faithModeEnabled,
      verseDisplayed: settings.faithModeEnabled ? settings.selectedVerse : undefined,
      focusProtectionEnabled: focus.enabled,
      subject: withDetails && subject.trim() ? subject.trim() : undefined,
      topic: withDetails && topic.trim() ? topic.trim() : undefined,
      learned: withDetails && learned.trim() ? learned.trim() : undefined,
      reflection: withDetails && reflection.trim() ? reflection.trim() : undefined,
      gratitudeNote: withDetails && gratitude.trim() ? gratitude.trim() : undefined,
      moodAfterSession: withDetails ? mood : undefined,
      createdAt: now,
      updatedAt: now,
    };
    await saveSession(session);
    onDone();
  }

  return (
    <div className="completion fade-in">
      <div className="field">
        <label>What did you study?</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Mathematics, Coding, Reading…"
        />
      </div>
      <div className="field">
        <label>What topic did you practice?</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Integrals, React hooks…"
        />
      </div>
      <div className="field">
        <label>What did you learn?</label>
        <textarea
          value={learned}
          onChange={(e) => setLearned(e.target.value)}
          placeholder="A sentence or two is plenty."
        />
      </div>
      <div className="field">
        <label>A reflection</label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="How did this time feel?"
        />
      </div>
      <div className="field">
        <label>A gratitude note</label>
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="Something you're thankful for right now."
        />
      </div>
      <div className="field">
        <label>How do you feel now?</label>
        <div className="mood-row">
          {MOODS.map((m) => (
            <button
              key={m.id}
              className={`chip ${mood === m.id ? "selected" : ""}`}
              onClick={() => setMood(mood === m.id ? undefined : m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="controls-row">
        <button
          className="btn primary"
          disabled={saving}
          onClick={() => void persist(true)}
        >
          Save to My Journey
        </button>
        <button
          className="btn ghost"
          disabled={saving}
          onClick={() => void persist(false)}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
