import { useEffect, useState } from "react";
import {
  Bot,
  CheckSquare,
  ChartCandlestick,
  LayoutDashboard,
  Music2,
  Settings,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../app/store/settingsStore";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  isRtl: boolean;
};

const navigationItems = [
  {
    labelKey: "navigation.dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    labelKey: "navigation.tasks",
    icon: CheckSquare,
    path: "/tasks",
  },
  {
    labelKey: "navigation.trading",
    icon: ChartCandlestick,
    path: "/trading",
  },
  {
    labelKey: "navigation.markets",
    icon: TrendingUp,
    path: "/markets",
  },
  {
    labelKey: "navigation.music",
    icon: Music2,
    path: "/music",
  },
  {
    labelKey: "navigation.ai",
    icon: Bot,
    path: "/ai",
  },
];

function formatClock(date: Date, timezone: "local" | "utc") {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timezone === "utc" ? "UTC" : undefined,
  }).format(date);
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export function Sidebar({ isOpen, onClose, isRtl }: SidebarProps) {
  const { t } = useTranslation();

  const timezone = useSettingsStore((state) => state.timezone);

  const isOnline = useOnlineStatus();

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const clock = formatClock(currentTime, timezone);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          aria-label={t("common.close")}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        dir={isRtl ? "rtl" : "ltr"}
        className={[
          "fixed top-0 z-50 flex h-screen w-[250px] flex-col",
          isRtl ? "right-0 border-l" : "left-0 border-r",
          "border-[var(--color-border)] bg-[var(--color-sidebar)] p-4",
          "transition-transform duration-300",
          isOpen
            ? "translate-x-0"
            : isRtl
              ? "translate-x-full"
              : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[var(--color-primary)] text-white shadow-[0_0_25px_rgba(168,85,247,0.25)]">
            <Sparkles size={18} strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold tracking-tight">Personal OS</div>

            <div className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
              {t("sidebar.personalSpace")}
            </div>
          </div>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white lg:hidden"
            aria-label={t("common.close")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <div className="mb-2 px-3 text-[10px] font-bold text-[var(--color-text-muted)]">
            {t("navigation.workspace")}
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5",
                    "text-sm transition-all duration-200",
                    isActive
                      ? "bg-[var(--color-surface-hover)] text-white"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className={[
                          "absolute h-5 w-[3px] rounded-full bg-[var(--color-primary)]",
                          isRtl
                            ? "right-0 rounded-l-full"
                            : "left-0 rounded-r-full",
                          "shadow-[0_0_10px_rgba(168,85,247,0.5)]",
                        ].join(" ")}
                      />
                    )}

                    <span
                      className={[
                        "flex w-5 shrink-0 justify-center transition-colors",
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]",
                      ].join(" ")}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </span>

                    <span className="font-medium">{t(item.labelKey)}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto">
          {/* Settings */}
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              [
                "mb-3 flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm",
                "transition-all duration-200",
                isActive
                  ? "bg-[var(--color-surface-hover)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-white",
              ].join(" ")
            }
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>{t("navigation.settings")}</span>
          </NavLink>

          {/* User / Status / Clock */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[10px] font-bold">
                {t("sidebar.me")}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold">
                  {t("sidebar.personalSpace")}
                </div>

                <div className="mt-0.5 flex items-center gap-1.5 text-[10px]">
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      isOnline
                        ? "bg-[var(--color-success)]"
                        : "bg-[var(--color-danger)]",
                    ].join(" ")}
                  />

                  <span className="text-[var(--color-text-muted)]">
                    {isOnline ? t("sidebar.online") : t("sidebar.offline")}
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Clock */}
            <div className="mt-2 flex items-center justify-between border-t border-[var(--color-border)] pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {timezone === "utc" ? t("sidebar.utc") : t("sidebar.local")}
                </span>

                <span
                  dir="ltr"
                  className="text-xs font-semibold tracking-wide text-[var(--color-text-secondary)] tabular-nums"
                >
                  {clock}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
