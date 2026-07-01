/**
 * Local-first JSON storage in the user's app-data folder.
 * Private by design: nothing leaves the device.
 */
import { app } from "electron";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_SETTINGS,
  DEFAULT_FOCUS_SETTINGS,
} from "../src/shared/constants";
import type {
  AppSettings,
  FocusProtectionSettings,
  StudySession,
  UserProfile,
} from "../src/shared/types";
import { uid } from "../src/shared/utils";

function dataDir(): string {
  const dir = path.join(app.getPath("userData"), "candle-data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function readJson<T>(file: string, fallback: T): T {
  try {
    const p = path.join(dataDir(), file);
    if (!fs.existsSync(p)) return fallback;
    return { ...fallback, ...JSON.parse(fs.readFileSync(p, "utf-8")) } as T;
  } catch {
    return fallback;
  }
}

function readJsonArray<T>(file: string): T[] {
  try {
    const p = path.join(dataDir(), file);
    if (!fs.existsSync(p)) return [];
    const parsed = JSON.parse(fs.readFileSync(p, "utf-8"));
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeJson(file: string, data: unknown): void {
  fs.writeFileSync(
    path.join(dataDir(), file),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

export const storage = {
  getSettings(): AppSettings {
    return readJson<AppSettings>("settings.json", DEFAULT_SETTINGS);
  },
  setSettings(s: AppSettings): void {
    writeJson("settings.json", s);
  },

  getFocusSettings(): FocusProtectionSettings {
    return readJson<FocusProtectionSettings>(
      "focus.json",
      DEFAULT_FOCUS_SETTINGS
    );
  },
  setFocusSettings(s: FocusProtectionSettings): void {
    writeJson("focus.json", s);
  },

  getSessions(): StudySession[] {
    return readJsonArray<StudySession>("sessions.json");
  },
  addSession(s: StudySession): void {
    const all = this.getSessions();
    all.push(s);
    writeJson("sessions.json", all);
  },

  getProfile(): UserProfile {
    const existing = readJson<UserProfile | null>("profile.json", null as never);
    if (existing && (existing as UserProfile).id) return existing as UserProfile;
    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: uid(),
      mode: "guest",
      createdAt: now,
      updatedAt: now,
    };
    writeJson("profile.json", profile);
    return profile;
  },

  clearAll(): void {
    for (const f of ["sessions.json", "profile.json"]) {
      const p = path.join(dataDir(), f);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  },

  exportAll(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        app: "Candle",
        profile: this.getProfile(),
        settings: this.getSettings(),
        focusProtection: this.getFocusSettings(),
        sessions: this.getSessions(),
      },
      null,
      2
    );
  },
};
