import { create } from "zustand";

export type Screen =
  | "home"
  | "dashboard"
  | "settings"
  | "focus-protection"
  | "completion";

type AppStore = {
  screen: Screen;
  navigate: (s: Screen) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  screen: "home",
  navigate: (screen) => set({ screen }),
}));
