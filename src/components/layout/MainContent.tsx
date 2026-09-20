import { Outlet } from "react-router-dom";

import { useSettingsStore } from "../../app/store/settingsStore";
import { useMusicPlayerStore } from "../../app/store/musicPlayerStore";

export function MainContent() {
  const displayMode = useSettingsStore((state) => state.displayMode);
  const language = useSettingsStore((state) => state.language);

  const currentTrack = useMusicPlayerStore((state) => state.currentTrack);

  const isCompact = displayMode === "compact";
  const hasPlayer = currentTrack !== null;
  const isRtl = language === "fa";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className={[
        "min-h-screen bg-[var(--color-bg)]",
        isRtl ? "lg:mr-[250px]" : "lg:ml-[250px]",
      ].join(" ")}
    >
      <div
        className={`
          mx-auto
          max-w-[1600px]
          pt-20
          transition-all
          duration-200
          ${
            isCompact
              ? "p-3 sm:p-4 sm:pt-20 lg:p-5 lg:pt-20"
              : "p-4 sm:p-6 sm:pt-20 lg:p-8 lg:pt-20"
          }
          ${hasPlayer ? "pb-56 sm:pb-52 lg:pb-44" : "pb-8"}
        `}
      >
        <Outlet />
      </div>
    </main>
  );
}
