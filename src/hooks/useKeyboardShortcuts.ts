import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ShortcutHandlers = {
  onOpenCommand?: () => void;
  onNewTask?: () => void;
};

export function useKeyboardShortcuts({
  onOpenCommand,
  onNewTask,
}: ShortcutHandlers = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Ctrl/Cmd + K → Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenCommand?.();
        return;
      }

      if (isTyping) return;

      // N → focus new task (on tasks page mainly)
      if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onNewTask?.();
        return;
      }

      // G then letter for navigation (vim-like light)
      // Simple single-key nav with Alt
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "d":
            e.preventDefault();
            navigate("/");
            break;
          case "t":
            e.preventDefault();
            navigate("/tasks");
            break;
          case "j":
            e.preventDefault();
            navigate("/trading");
            break;
          case "m":
            e.preventDefault();
            navigate("/markets");
            break;
          case "s":
            e.preventDefault();
            navigate("/settings");
            break;
        }
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, onOpenCommand, onNewTask]);
}
