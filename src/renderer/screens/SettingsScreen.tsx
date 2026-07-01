import { useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useSessionStore } from "@/store/sessionStore";
import { Toggle } from "@/components/Toggle";
import { VERSES } from "@shared/constants";
import { bridge } from "@/services/bridge";
import { PROVIDERS, authService } from "@/services/authService";

export function SettingsScreen() {
  const { settings, update } = useSettingsStore();
  const loadSessions = useSessionStore((s) => s.loadSessions);
  const [customVerse, setCustomVerse] = useState("");
  const [status, setStatus] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const allVerses = [...VERSES, ...settings.customVerses];

  return (
    <div className="fade-in">
      <h1>Settings</h1>
      <div className="subtitle">Everything stays on this device, in your hands.</div>

      <h2>Faith Mode</h2>
      <div className="settings-section">
        <Toggle
          label="Faith Mode"
          hint="Shows a verse or gentle word above your candle."
          value={settings.faithModeEnabled}
          onChange={(v) => update({ faithModeEnabled: v })}
        />
        <div className="field">
          <label>Verse or message</label>
          <select
            value={settings.selectedVerse ?? allVerses[0]}
            onChange={(e) => update({ selectedVerse: e.target.value })}
          >
            {allVerses.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Add your own verse or message</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={customVerse}
              placeholder="Write something that steadies you…"
              onChange={(e) => setCustomVerse(e.target.value)}
            />
            <button
              className="btn small"
              onClick={() => {
                const v = customVerse.trim();
                if (!v) return;
                update({
                  customVerses: [...settings.customVerses, v],
                  selectedVerse: v,
                });
                setCustomVerse("");
              }}
            >
              Add
            </button>
          </div>
        </div>
        <Toggle
          label="Faith wording in notifications"
          hint="Choose whether notifications speak in faith language."
          value={settings.faithWordingEnabled}
          onChange={(v) => update({ faithWordingEnabled: v })}
        />
      </div>

      <h2>Candle</h2>
      <div className="settings-section">
        <div className="field">
          <label>Default candle size</label>
          <div className="chip-row">
            {(["small", "medium", "large"] as const).map((s) => (
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
          label="Show remaining time"
          hint="A quiet number under the candle. The melting wax is the real clock."
          value={settings.showRemainingTime}
          onChange={(v) => update({ showRemainingTime: v })}
        />
        <Toggle
          label="Keep window always on top"
          hint="The full window stays above others (mini mode always does)."
          value={settings.alwaysOnTopEnabled}
          onChange={(v) => update({ alwaysOnTopEnabled: v })}
        />
      </div>

      <h2>Sound & notifications</h2>
      <div className="settings-section">
        <Toggle
          label="End chime"
          hint="A soft bell, once, when the flame goes out."
          value={settings.chimeEnabled}
          onChange={(v) => update({ chimeEnabled: v })}
        />
        <Toggle
          label="Notifications"
          value={settings.notificationsEnabled}
          onChange={(v) => update({ notificationsEnabled: v })}
        />
        <Toggle
          label="Session complete notification"
          value={settings.sessionCompleteNotificationEnabled}
          onChange={(v) => update({ sessionCompleteNotificationEnabled: v })}
        />
        <Toggle
          label="Streak reminders"
          hint="A gentle nudge, never pressure."
          value={settings.streakRemindersEnabled}
          onChange={(v) => update({ streakRemindersEnabled: v })}
        />
        <Toggle
          label="Daily reminder"
          value={settings.dailyReminderEnabled}
          onChange={(v) => update({ dailyReminderEnabled: v })}
        />
        {settings.dailyReminderEnabled && (
          <div className="field">
            <label>Reminder time</label>
            <input
              type="time"
              value={settings.dailyReminderTime ?? "09:00"}
              onChange={(e) => update({ dailyReminderTime: e.target.value })}
            />
          </div>
        )}
        <Toggle
          label="Silent mode"
          hint="Pause all notifications without changing your other choices."
          value={settings.silentMode}
          onChange={(v) => update({ silentMode: v })}
        />
      </div>

      <h2>Privacy & your data</h2>
      <div className="settings-section">
        <div className="notice">
          Candle is local-first. Your sessions, reflections, and gratitude
          notes are stored only on this computer. Nothing is uploaded, shared,
          or shown to anyone. No account is ever required.
        </div>
        <div className="chip-row">
          <button
            className="btn small"
            onClick={async () => {
              const res = await bridge.sessions.exportAll();
              setStatus(res.ok ? `Exported to ${res.path}` : "Export cancelled.");
            }}
          >
            Export my history
          </button>
          {!confirmClear ? (
            <button className="btn small ghost" onClick={() => setConfirmClear(true)}>
              Clear all local data
            </button>
          ) : (
            <>
              <button
                className="btn small"
                style={{ borderColor: "#8a4a3a", color: "#d98b74" }}
                onClick={async () => {
                  await bridge.sessions.clearAll();
                  await loadSessions();
                  setConfirmClear(false);
                  setStatus("All local history cleared.");
                }}
              >
                Yes, clear everything
              </button>
              <button className="btn small ghost" onClick={() => setConfirmClear(false)}>
                Keep my data
              </button>
            </>
          )}
        </div>
        {status && <div className="subtitle">{status}</div>}
      </div>

      <h2>Account</h2>
      <div className="settings-section" style={{ paddingBottom: 40 }}>
        <div className="notice">
          You're using Candle as a guest — start right away, no login needed.
          Signing in will later let you keep your journey across devices, back
          it up, and sync with mobile.
        </div>
        <div className="chip-row">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              className="btn small ghost"
              onClick={async () => {
                const res = await authService.signIn(p.id);
                setStatus(res.message);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
