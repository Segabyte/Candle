import { useEffect, useRef } from "react";
import { useAppStore, type Screen } from "@/store/appStore";
import { useSessionStore } from "@/store/sessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { HomeScreen } from "@/screens/HomeScreen";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { FocusProtectionScreen } from "@/screens/FocusProtectionScreen";
import { CompletionScreen } from "@/screens/CompletionScreen";
import { MiniModeWidget } from "@/components/MiniModeWidget";
import { bridge } from "@/services/bridge";
import { playChime } from "@/services/chime";

const NAV: { id: Screen; label: string }[] = [
  { id: "home", label: "Candle" },
  { id: "dashboard", label: "Your Journey" },
  { id: "focus-protection", label: "Focus Protection" },
  { id: "settings", label: "Settings" },
];

const isMiniWindow =
  bridge.win.isMini || window.location.hash.includes("mini");

export default function App() {
  const { screen, navigate } = useAppStore();
  const init = useSessionStore((s) => s.init);
  const timer = useSessionStore((s) => s.timer);
  const load = useSettingsStore((s) => s.load);
  const loaded = useSettingsStore((s) => s.loaded);
  const handledCompletion = useRef(false);

  useEffect(() => {
    void load();
    init();
    if (isMiniWindow) document.body.classList.add("mini");
  }, [init, load]);

  // Session completion: let the flame go out and the smoke rise on the home
  // screen, play the soft chime, then open the completion screen.
  useEffect(() => {
    if (isMiniWindow) return;
    if (timer.status === "completed" && !handledCompletion.current) {
      handledCompletion.current = true;
      const { settings } = useSettingsStore.getState();
      if (
        settings.chimeEnabled &&
        !settings.silentMode &&
        document.visibilityState === "visible"
      ) {
        playChime();
      }
      navigate("home"); // watch the flame go out where the candle lives
      const t = setTimeout(() => navigate("completion"), 4200);
      return () => clearTimeout(t);
    }
    if (timer.status !== "completed") handledCompletion.current = false;
  }, [timer.status, navigate]);

  if (!loaded) return null;
  if (isMiniWindow) return <MiniModeWidget />;

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="brand">
          <span className="dot" />
          Candle
        </div>
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`nav-btn ${screen === n.id ? "active" : ""}`}
            onClick={() => navigate(n.id)}
          >
            {n.label}
          </button>
        ))}
        <div className="sidebar-footer">
          Start right away.
          <br />
          No login needed.
        </div>
      </nav>
      <main className="main">
        {screen === "home" && <HomeScreen />}
        {screen === "dashboard" && <DashboardScreen />}
        {screen === "settings" && <SettingsScreen />}
        {screen === "focus-protection" && <FocusProtectionScreen />}
        {screen === "completion" && <CompletionScreen />}
      </main>
    </div>
  );
}
