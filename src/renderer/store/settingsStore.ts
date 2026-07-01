import { create } from "zustand";
import type { AppSettings, FocusProtectionSettings } from "@shared/types";
import { DEFAULT_SETTINGS, DEFAULT_FOCUS_SETTINGS } from "@shared/constants";
import { bridge } from "@/services/bridge";

type SettingsStore = {
  settings: AppSettings;
  focus: FocusProtectionSettings;
  loaded: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<AppSettings>) => void;
  updateFocus: (patch: Partial<FocusProtectionSettings>) => void;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  focus: DEFAULT_FOCUS_SETTINGS,
  loaded: false,

  load: async () => {
    const [settings, focus] = await Promise.all([
      bridge.settings.get(),
      bridge.focus.get(),
    ]);
    set({ settings, focus, loaded: true });
  },

  update: (patch) => {
    const settings = { ...get().settings, ...patch };
    set({ settings });
    void bridge.settings.set(settings);
  },

  updateFocus: (patch) => {
    const focus = { ...get().focus, ...patch };
    set({ focus });
    void bridge.focus.set(focus);
  },
}));
