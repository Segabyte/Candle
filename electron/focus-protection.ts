/**
 * Focus Protection — gentle app blocking during a session.
 *
 * How it works (transparently, not like malware):
 * - Only active while a focus session is running AND the user enabled it.
 * - Polls the Windows process list (`tasklist`) every 5 seconds.
 * - Blocklist mode: if a listed executable is running, we show a gentle
 *   reminder and ask Windows to close it (`taskkill`, no /F force flag).
 * - Allowlist mode: the same check runs against a small, well-known list of
 *   distraction apps, minus anything the user explicitly allowed. We never
 *   touch system processes or unknown apps.
 * - Emergency exit: protection can be stopped at any time from the UI.
 * - Website blocking is Phase 2 (hosts file / local DNS / extension / WFP);
 *   the settings UI and data model are already in place.
 */
import { exec } from "node:child_process";
import { storage } from "./storage";
import { notify } from "./notifications";
import { GENTLE_REMINDERS, SUGGESTED_BLOCKED_APPS } from "../src/shared/constants";
import { pick } from "../src/shared/utils";

let pollTimer: NodeJS.Timeout | null = null;
let lastReminderAt = 0;

const NEVER_TOUCH = new Set(
  [
    "explorer.exe", "svchost.exe", "csrss.exe", "winlogon.exe", "dwm.exe",
    "system", "smss.exe", "services.exe", "lsass.exe", "wininit.exe",
    "electron.exe", "candle.exe",
  ].map((s) => s.toLowerCase())
);

function listProcesses(): Promise<string[]> {
  return new Promise((resolve) => {
    if (process.platform !== "win32") return resolve([]);
    exec("tasklist /fo csv /nh", { windowsHide: true }, (err, stdout) => {
      if (err || !stdout) return resolve([]);
      const names = new Set<string>();
      for (const line of stdout.split(/\r?\n/)) {
        const m = line.match(/^"([^"]+)"/);
        if (m) names.add(m[1]);
      }
      resolve([...names]);
    });
  });
}

function closeApp(exe: string): void {
  if (process.platform !== "win32") return;
  if (NEVER_TOUCH.has(exe.toLowerCase())) return;
  // Polite close (no /F): the app gets a chance to save and exit cleanly.
  exec(`taskkill /IM "${exe}"`, { windowsHide: true }, () => void 0);
}

async function poll(): Promise<void> {
  const cfg = storage.getFocusSettings();
  if (!cfg.enabled) return;

  const running = await listProcesses();
  const runningLower = new Map(running.map((r) => [r.toLowerCase(), r]));

  let targets: string[] = [];
  if (cfg.mode === "blocklist") {
    targets = cfg.blockedApps.filter((b) => runningLower.has(b.toLowerCase()));
  } else {
    // Allowlist mode: only act on the known-distraction list the user has
    // NOT allowed. We never close apps we don't recognize.
    const allowed = new Set(cfg.allowedApps.map((a) => a.toLowerCase()));
    const watch = [...new Set([...SUGGESTED_BLOCKED_APPS, ...cfg.blockedApps])];
    targets = watch.filter(
      (w) => runningLower.has(w.toLowerCase()) && !allowed.has(w.toLowerCase())
    );
  }

  if (targets.length > 0) {
    const now = Date.now();
    if (now - lastReminderAt > 30_000) {
      lastReminderAt = now;
      notify("Candle", pick(GENTLE_REMINDERS), true);
    }
    for (const t of targets) closeApp(runningLower.get(t.toLowerCase()) ?? t);
  }
}

export const focusProtection = {
  /** Called when a session starts (only engages if the user opted in). */
  startForSession(): void {
    const cfg = storage.getFocusSettings();
    if (!cfg.enabled || process.platform !== "win32") return;
    this.stop();
    pollTimer = setInterval(() => void poll(), 5000);
    void poll();
  },

  /** Emergency exit / session end — always available. */
  stop(): void {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  },

  isActive(): boolean {
    return pollTimer !== null;
  },

  listRunningApps: listProcesses,
};
