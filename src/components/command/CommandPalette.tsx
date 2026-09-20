import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  CheckSquare,
  ChartCandlestick,
  TrendingUp,
  Music2,
  Bot,
  Settings,
  Plus,
  Download,
  Upload,
  Search,
} from "lucide-react";

export type CommandAction = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  keywords?: string[];
  action: () => void;
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  extraActions?: CommandAction[];
};

export function CommandPalette({
  open,
  onClose,
  extraActions = [],
}: CommandPaletteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const baseActions: CommandAction[] = useMemo(
    () => [
      {
        id: "nav-dashboard",
        label: t("navigation.dashboard"),
        icon: LayoutDashboard,
        keywords: ["dashboard", "داشبورد", "home"],
        action: () => navigate("/"),
      },
      {
        id: "nav-tasks",
        label: t("navigation.tasks"),
        icon: CheckSquare,
        keywords: ["tasks", "کار", "todo"],
        action: () => navigate("/tasks"),
      },
      {
        id: "nav-trading",
        label: t("navigation.trading"),
        icon: ChartCandlestick,
        keywords: ["trading", "ترید", "journal"],
        action: () => navigate("/trading"),
      },
      {
        id: "nav-markets",
        label: t("navigation.markets"),
        icon: TrendingUp,
        keywords: ["markets", "بازار"],
        action: () => navigate("/markets"),
      },
      {
        id: "nav-music",
        label: t("navigation.music"),
        icon: Music2,
        keywords: ["music", "موسیقی"],
        action: () => navigate("/music"),
      },
      {
        id: "nav-ai",
        label: t("navigation.ai"),
        icon: Bot,
        keywords: ["ai", "هوش", "assistant"],
        action: () => navigate("/ai"),
      },
      {
        id: "nav-settings",
        label: t("navigation.settings"),
        icon: Settings,
        keywords: ["settings", "تنظیمات"],
        action: () => navigate("/settings"),
      },
    ],
    [t, navigate],
  );

  const allActions = useMemo(
    () => [...extraActions, ...baseActions],
    [extraActions, baseActions],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allActions;

    return allActions.filter((a) => {
      const hay = [a.label, ...(a.keywords ?? [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [allActions, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) {
          item.action();
          onClose();
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIndex, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4">
          <Search size={18} className="text-[var(--color-text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("command.placeholder")}
            className="h-12 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--color-text-muted)]"
          />
          <kbd className="hidden rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)] sm:inline">
            Esc
          </kbd>
        </div>

        <div className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[var(--color-text-muted)]">
              {t("command.empty")}
            </p>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  <Icon size={18} />
                  <span className="flex-1 text-start">{item.label}</span>
                  {item.hint && (
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {item.hint}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-2 text-[10px] text-[var(--color-text-muted)]">
          <span>{t("command.hint")}</span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-[var(--color-border)] px-1">↑</kbd>
            <kbd className="rounded border border-[var(--color-border)] px-1">↓</kbd>
            <span>{t("command.navigate")}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export { Plus, Download, Upload };
