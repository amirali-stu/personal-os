import { NavLink } from "react-router-dom";
import {
  BookOpen,
  BookMarked,
  ClipboardList,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../../../app/store/settingsStore";

const tabs = [
  {
    path: "/trading",
    end: true,
    key: "trading.subnav.journal" as const,
    icon: BookOpen,
  },
  {
    path: "/trading/plan",
    end: false,
    key: "trading.subnav.plan" as const,
    icon: ClipboardList,
  },
  {
    path: "/trading/setups",
    end: false,
    key: "trading.subnav.setups" as const,
    icon: Rocket,
  },
  {
    path: "/trading/case-studies",
    end: false,
    key: "trading.subnav.caseStudies" as const,
    icon: BookMarked,
  },
  {
    path: "/trading/forward-tests",
    end: false,
    key: "trading.subnav.forwardTests" as const,
    icon: Sparkles,
  },
];

export function TradingSubNav() {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-wrap gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              [
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all",
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-white",
              ].join(" ")
            }
          >
            <Icon size={16} strokeWidth={1.8} />
            <span className="font-medium">{t(tab.key)}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
