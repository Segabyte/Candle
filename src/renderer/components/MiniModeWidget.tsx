import { useEffect } from "react";
import { CandleScene } from "@/components/CandleScene";
import { useSessionStore } from "@/store/sessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { bridge } from "@/services/bridge";
import { formatClock } from "@shared/utils";

export function MiniModeWidget() {
  const timer = useSessionStore((s) => s.timer);
  const { settings } = useSettingsStore();

  const active = timer.status === "running" || timer.status === "paused";
  const progress =
    timer.totalSeconds > 0 ? timer.elapsedSeconds / timer.totalSeconds : 0;
  const remaining = Math.max(0, timer.totalSeconds - timer.elapsedSeconds);

  // When the session completes while in mini mode, return to the full
  // window so the gentle completion screen can be shown.
  useEffect(() => {
    if (timer.status === "completed") {
      const t = setTimeout(() => bridge.win.exitMini(), 3800);
      return () => clearTimeout(t);
    }
  }, [timer.status]);

  return (
    <div className="mini-widget">
      <div className="mini-drag">
        <CandleScene
          progress={active || timer.status === "completed" ? progress : 0}
          lit={active}
          size="small"
          mini
          className="candle-canvas-wrap"
        />
      </div>
      {settings.showRemainingTime && active && (
        <div className="mini-time">{formatClock(remaining)}</div>
      )}
      <div className="mini-controls">
        {timer.status === "running" && (
          <button className="mini-btn" onClick={() => bridge.timer.pause()}>
            Pause
          </button>
        )}
        {timer.status === "paused" && (
          <button className="mini-btn" onClick={() => bridge.timer.resume()}>
            Resume
          </button>
        )}
        {active && (
          <button className="mini-btn" onClick={() => bridge.timer.endGently()}>
            End
          </button>
        )}
        <button
          className="mini-btn"
          onClick={() => bridge.win.exitMini()}
          title="Back to the full window"
        >
          Expand
        </button>
      </div>
    </div>
  );
}
