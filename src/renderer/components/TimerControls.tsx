import { bridge } from "@/services/bridge";
import { useSessionStore } from "@/store/sessionStore";
import { useSettingsStore } from "@/store/settingsStore";

export function TimerControls({ durationMinutes }: { durationMinutes: number }) {
  const timer = useSessionStore((s) => s.timer);
  const { settings } = useSettingsStore();

  if (timer.status === "idle" || timer.status === "completed") {
    return (
      <div className="controls-row">
        <button
          className="btn primary"
          onClick={() => bridge.timer.start(durationMinutes)}
        >
          {settings.faithModeEnabled ? "Light the candle" : "Begin"}
        </button>
        <button
          className="btn ghost small"
          onClick={() => bridge.win.enterMini()}
          title="A small candle that floats above your other windows"
        >
          Mini mode
        </button>
      </div>
    );
  }

  return (
    <div className="controls-row">
      {timer.status === "running" ? (
        <button className="btn" onClick={() => bridge.timer.pause()}>
          Pause
        </button>
      ) : (
        <button className="btn primary" onClick={() => bridge.timer.resume()}>
          Resume
        </button>
      )}
      <button className="btn" onClick={() => bridge.timer.endGently()}>
        End gently
      </button>
      <button className="btn ghost" onClick={() => bridge.timer.reset()}>
        Reset
      </button>
      <button className="btn ghost small" onClick={() => bridge.win.enterMini()}>
        Mini mode
      </button>
    </div>
  );
}
