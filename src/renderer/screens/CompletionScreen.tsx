import { CompletionForm } from "@/components/CompletionForm";
import { useAppStore } from "@/store/appStore";
import { useSessionStore } from "@/store/sessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { bridge } from "@/services/bridge";
import { COMPLETION_MESSAGES } from "@shared/constants";

export function CompletionScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const pending = useSessionStore((s) => s.pendingCompletion);
  const setPending = useSessionStore((s) => s.setPendingCompletion);
  const { settings } = useSettingsStore();

  if (!pending) {
    navigate("home");
    return null;
  }

  const messages = settings.faithModeEnabled
    ? COMPLETION_MESSAGES.faith
    : COMPLETION_MESSAGES.neutral;

  function finish(toDashboard: boolean): void {
    setPending(null);
    bridge.timer.reset();
    navigate(toDashboard ? "dashboard" : "home");
  }

  return (
    <div>
      <div className="completion-heading fade-in">
        <div className="big">{messages[0]}</div>
        <div className="sub">{messages[1]}</div>
      </div>
      <CompletionForm completedTimer={pending} onDone={() => finish(true)} />
    </div>
  );
}
