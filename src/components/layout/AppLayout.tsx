import { useCallback, useMemo, useState } from "react";
import { Menu, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../app/store/settingsStore";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";
import { MusicPlayer } from "../../features/music/components/MusicPlayer";
import { ToastContainer } from "../ui/Toast";
import { Loader2 } from "lucide-react";
import { CommandPalette, type CommandAction } from "../command/CommandPalette";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayMode = useSettingsStore((state) => state.displayMode);

  const isCompact = displayMode === "compact";

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";
  const isApplying = useSettingsStore((state) => state.isApplying);

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  const onNewTask = useCallback(() => {
    navigate("/tasks");
  }, [navigate]);

  useKeyboardShortcuts({
    onOpenCommand: openCommand,
    onNewTask,
  });

  const extraActions: CommandAction[] = useMemo(
    () => [
      {
        id: "action-new-task",
        label: t("command.newTask"),
        hint: "N",
        icon: Plus,
        keywords: ["new", "task", "کار جدید", "add"],
        action: () => navigate("/tasks"),
      },
    ],
    [t, navigate],
  );

  return (
    <div
      className={`min-h-screen bg-[var(--color-bg)] ${
        isCompact ? "app-compact" : "app-standard"
      }`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isRtl={isRtl}
      />

      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 backdrop-blur-md lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-white"
          aria-label="باز کردن منو"
        >
          <Menu size={20} />
        </button>

        <div className="mr-3 text-sm font-bold">سیستم شخصی</div>

        <button
          type="button"
          onClick={openCommand}
          className="ms-auto flex h-9 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-xs text-[var(--color-text-muted)]"
        >
          <span>⌘K</span>
        </button>
      </header>

      <MainContent />

      <MusicPlayer />

      <ToastContainer />

      <CommandPalette
        open={commandOpen}
        onClose={closeCommand}
        extraActions={extraActions}
      />

      {isApplying && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-10 py-8 shadow-2xl">
            <Loader2
              size={36}
              className="animate-spin text-[var(--color-primary)]"
            />
            <p className="text-sm font-medium text-[var(--color-text)]">
              در حال اعمال تغییرات...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
