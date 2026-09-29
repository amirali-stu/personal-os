import { NavLink } from "react-router-dom";
import { BookOpen, ClipboardList, Rocket } from "lucide-react";
import { useSettingsStore } from "../../../app/store/settingsStore";

const tabs = [
  {
    path: "/trading",
    end: true,
    label: "ژورنال ترید",
    icon: BookOpen,
  },
  {
    path: "/trading/plan",
    end: false,
    label: "تریدینگ پلن",
    icon: ClipboardList,
  },
  {
    path: "/trading/setups",
    end: false,
    label: "ستاپ‌ها",
    icon: Rocket,
  },
];

export function TradingSubNav() {
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
            <span className="font-medium">{tab.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
