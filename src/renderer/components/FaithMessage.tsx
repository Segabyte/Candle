import { useSettingsStore } from "@/store/settingsStore";
import { VERSES } from "@shared/constants";

export function FaithMessage() {
  const { settings } = useSettingsStore();
  if (!settings.faithModeEnabled) return null;
  const verse = settings.selectedVerse ?? VERSES[0];
  return <div className="faith-message fade-in">“{verse}”</div>;
}
