// src/features/trading/components/TradingHeader.tsx

import { CalendarDays, Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { formatPersianDate } from "../../../lib/dateUtils";

export function TradingHeader() {
  const { t } = useTranslation();

  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const timezone = useSettingsStore((state) => state.timezone);
  const language = useSettingsStore((state) => state.language);

  const isRtl = language === "fa";

  const text = (key: string, fa: string, en: string) =>
    t(key, {
      defaultValue: isRtl ? fa : en,
    });

  const today = new Date();

  const formattedDate = formatPersianDate(today, dateFormat, timezone);

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 text-start text-xs text-[var(--color-text-muted)]">
        <CalendarDays size={15} />

        <span>
          {text(
            "tasks.tradingHeader.personalJournal",
            "ژورنال شخصی",
            "Personal Journal",
          )}
        </span>
      </div>

      <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="text-start">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {text(
              "tasks.tradingHeader.title",
              "ژورنال ترید",
              "Trading Journal",
            )}
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {text(
              "tasks.tradingHeader.subtitle",
              "ثبت معاملات و بررسی کیفیت اجرای پلن",
              "Record trades and review your plan execution quality.",
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <Clock3 size={16} className="text-[var(--color-primary)]" />

          <span className="text-xs text-[var(--color-text-secondary)]">
            {text("tasks.tradingHeader.today", "امروز", "Today")}
          </span>

          <span className="text-sm font-semibold text-white">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
