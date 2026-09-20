import { useState } from "react";
import { Menu } from "lucide-react";

import { useSettingsStore } from "../../app/store/settingsStore";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";
import { MusicPlayer } from "../../features/music/components/MusicPlayer";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const displayMode = useSettingsStore((state) => state.displayMode);

  const isCompact = displayMode === "compact";

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

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
      </header>

      <MainContent />

      <MusicPlayer />
    </div>
  );
}
