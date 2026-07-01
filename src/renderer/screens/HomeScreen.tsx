import { useState } from "react";
import { CandleScene } from "@/components/CandleScene";
import { FaithMessage } from "@/components/FaithMessage";
import { TimerControls } from "@/components/TimerControls";
import { Toggle } from "@/components/Toggle";
import { useSessionStore } from "@/store/sessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { DURATION_PRESETS } from "@shared/constants";
import { formatClock } from "@shared/utils";
import type { CandleSize } from "@shared/types";

const SIZES: CandleSize[] = ["small", "medium", "large"];

export function HomeScreen() {
  const timer = useSessionStore((s) => s.timer);
  const { settings, focus, update, updateFocus } = useSettingsStore();
  const [customMinutes, setCustomMinutes] = useState<string>("");

  const active = timer.status === "running" || timer.status === "paused";
  const progress =
    timer.totalSeconds > 0 ? timer.elapsedSeconds / timer.totalSeconds : 0;
  const remaining = Math.max(0, timer.totalSeconds - timer.elapsedSeconds);

  const chosenMinutes = customMinutes
    ? Math.max(1, Math.min(600, parseInt(customMinutes, 10) || settings.defaultDurationMinutes))
    : settings.defaultDurationMinutes;

  return (
    <div className="home">
      <div className="candle-stage">
        <FaithMessage />
        <CandleScene
          progress={active || timer.status === "completed" ? progress : 0}
          lit={active}
          size={settings.candleSize}
        />
        {settings.showRemainingTime && active && (
          <div
            className="remaining"
            title="Click to hide. The candle itself keeps the time."
            onClick={() => update({ showRemainingTime: false })}
          >
            {formatClock(remaining)}
          </div>
        )}
        {!settings.showRemainingTime && active && (
          <div
            className="remaining"
            title="Show remaining time"
            onClick={() => update({ showRemainingTime: true })}
          >
            · · ·
          </div>
        )}
        <TimerControls durationMinutes={chosenMinutes} />
      </div>

      <div className="panel">
        <div className="field">
          <label>Session length</label>
          <div className="chip-row">
            {DURATION_PRESETS.map((m) => (
              <button
                key={m}
                className={`chip ${
                  !customMinutes && settings.defaultDurationMinutes === m
                    ? "selected"
                    : ""
                }`}
                disabled={active}
                onClick={() => {
                  setCustomMinutes("");
                  update({ defaultDurationMinutes: m });
                }}
              >
                {m === 60 ? "1 hour" : `${m} min`}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <input
              type="number"
              min={1}
              max={600}
              placeholder="Custom minutes…"
              value={customMinutes}
              disabled={active}
              onChange={(e) => setCustomMinutes(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>Candle size</label>
          <div className="chip-row">
            {SIZES.map((s) => (
              <button
                key={s}
                className={`chip ${settings.candleSize === s ? "selected" : ""}`}
                onClick={() => update({ candleSize: s })}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Toggle
          label="Faith Mode"
          hint="A verse or gentle word stays with you above the candle."
          value={settings.faithModeEnabled}
          onChange={(v) => update({ faithModeEnabled: v })}
        />
        <Toggle
          label="End chime"
          hint="A soft bell when your session completes."
          value={settings.chimeEnabled}
          onChange={(v) => update({ chimeEnabled: v })}
        />
        <Toggle
          label="Focus Protection"
          hint="Gently closes distracting apps while your candle burns."
          value={focus.enabled}
          onChange={(v) => updateFocus({ enabled: v })}
        />

        {active && (
          <div className="notice">
            {settings.faithModeEnabled
              ? "Your candle is lit. You are not studying alone."
              : "Your candle is lit. Stay gently with your work."}
          </div>
        )}
      </div>
    </div>
  );
}
