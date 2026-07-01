import { useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { Toggle } from "@/components/Toggle";
import { SUGGESTED_BLOCKED_APPS } from "@shared/constants";
import { bridge } from "@/services/bridge";

export function FocusProtectionScreen() {
  const { focus, updateFocus } = useSettingsStore();
  const [newApp, setNewApp] = useState("");
  const [newSite, setNewSite] = useState("");
  const [confirming, setConfirming] = useState(false);

  const listKey = focus.mode === "blocklist" ? "blockedApps" : "allowedApps";
  const list = focus.mode === "blocklist" ? focus.blockedApps : focus.allowedApps;

  function addApp(name: string): void {
    const v = name.trim();
    if (!v) return;
    const withExe = v.toLowerCase().endsWith(".exe") ? v : `${v}.exe`;
    if (list.some((a) => a.toLowerCase() === withExe.toLowerCase())) return;
    updateFocus({ [listKey]: [...list, withExe] });
    setNewApp("");
  }

  function removeApp(name: string): void {
    updateFocus({ [listKey]: list.filter((a) => a !== name) });
  }

  function requestEnable(v: boolean): void {
    if (v && !focus.enabled) {
      setConfirming(true); // ask permission first — never silently
    } else {
      updateFocus({ enabled: v });
      if (!v) bridge.focus.stopNow();
    }
  }

  return (
    <div className="fade-in">
      <h1>Focus Protection</h1>
      <div className="subtitle">
        A gentle boundary around your study time. Always in your control.
      </div>

      <div className="settings-section">
        <div className="notice">
          <strong>How this works:</strong> while a session is running and Focus
          Protection is on, Candle checks every few seconds whether a listed
          app is open. If one is, you'll see a gentle reminder and Candle asks
          Windows to close that app politely (it can save its work first).
          Nothing runs outside your sessions, nothing is hidden from you, and
          you can turn it off at any moment — the emergency exit below is
          always available. Website blocking is coming in a future update; you
          can prepare your list now.
        </div>

        {confirming ? (
          <div className="notice">
            <p style={{ marginBottom: 10 }}>
              Turn on Focus Protection? During sessions, Candle will close the
              apps on your list and show a gentle reminder.
            </p>
            <div className="chip-row">
              <button
                className="btn small primary"
                onClick={() => {
                  updateFocus({ enabled: true });
                  setConfirming(false);
                }}
              >
                Yes, protect my focus
              </button>
              <button className="btn small ghost" onClick={() => setConfirming(false)}>
                Not now
              </button>
            </div>
          </div>
        ) : (
          <Toggle
            label="Focus Protection"
            hint="Only active while a candle is burning."
            value={focus.enabled}
            onChange={requestEnable}
          />
        )}

        <div className="field">
          <label>Mode</label>
          <div className="chip-row">
            <button
              className={`chip ${focus.mode === "blocklist" ? "selected" : ""}`}
              onClick={() => updateFocus({ mode: "blocklist" })}
            >
              Block list — close these apps
            </button>
            <button
              className={`chip ${focus.mode === "allowlist" ? "selected" : ""}`}
              onClick={() => updateFocus({ mode: "allowlist" })}
            >
              Allow list — only these may stay
            </button>
          </div>
          {focus.mode === "allowlist" && (
            <div className="hint" style={{ marginTop: 8, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.6 }}>
              In allow-list mode, Candle only watches well-known distraction
              apps (games, chat, streaming) and leaves everything else alone.
              Apps you add here are always allowed to stay open.
            </div>
          )}
        </div>

        <div className="field">
          <label>
            {focus.mode === "blocklist" ? "Apps to close during focus" : "Apps allowed during focus"}
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Executable name, e.g. Discord.exe"
              value={newApp}
              onChange={(e) => setNewApp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addApp(newApp)}
            />
            <button className="btn small" onClick={() => addApp(newApp)}>
              Add
            </button>
          </div>
          <div className="chip-row" style={{ marginTop: 10 }}>
            {SUGGESTED_BLOCKED_APPS.filter(
              (s) => !list.some((a) => a.toLowerCase() === s.toLowerCase())
            ).map((s) => (
              <button key={s} className="chip" onClick={() => addApp(s)}>
                + {s.replace(".exe", "")}
              </button>
            ))}
          </div>
          <div className="session-list" style={{ marginTop: 12 }}>
            {list.map((a) => (
              <div className="list-row" key={a}>
                <span>{a}</span>
                <button onClick={() => removeApp(a)} title="Remove">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Websites to avoid (coming soon)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="e.g. youtube.com"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newSite.trim()) {
                  updateFocus({
                    blockedWebsites: [...focus.blockedWebsites, newSite.trim()],
                  });
                  setNewSite("");
                }
              }}
            />
            <button
              className="btn small"
              onClick={() => {
                if (!newSite.trim()) return;
                updateFocus({
                  blockedWebsites: [...focus.blockedWebsites, newSite.trim()],
                });
                setNewSite("");
              }}
            >
              Add
            </button>
          </div>
          <div className="session-list" style={{ marginTop: 12 }}>
            {focus.blockedWebsites.map((w) => (
              <div className="list-row" key={w}>
                <span>{w}</span>
                <button
                  onClick={() =>
                    updateFocus({
                      blockedWebsites: focus.blockedWebsites.filter((x) => x !== w),
                    })
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <Toggle
          label="Emergency exit"
          hint="Keep a one-click way to stop protection mid-session. We recommend leaving this on."
          value={focus.emergencyExitEnabled}
          onChange={(v) => updateFocus({ emergencyExitEnabled: v })}
        />

        {focus.enabled && focus.emergencyExitEnabled && (
          <button
            className="btn"
            onClick={() => {
              updateFocus({ enabled: false });
              bridge.focus.stopNow();
            }}
          >
            Emergency exit — stop protection now
          </button>
        )}
      </div>
    </div>
  );
}
