// src/features/trading/components/TradingStats.tsx

import {
  CalendarDays,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { formatResult } from "../utils";

type Props = {
  todayCount: number;
  totalResult: number;
  successfulTrades: number;
  failedTrades: number;
  tradeLimit: number;
};

export function TradingStats({
  todayCount,
  totalResult,
  successfulTrades,
  failedTrades,
  tradeLimit,
}: Props) {
  const { t } = useTranslation();

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const text = (key: string, fa: string, en: string) =>
    t(key, {
      defaultValue: isRtl ? fa : en,
    });

  const formatNumber = (value: number) =>
    value.toLocaleString(isRtl ? "fa-IR" : "en-US");

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      <Stat
        title={text("tasks.stats.today", "معاملات امروز", "Today's Trades")}
        value={`${formatNumber(todayCount)} / ${formatNumber(tradeLimit)}`}
        icon={<CalendarDays size={18} />}
        description={
          todayCount >= tradeLimit
            ? text(
                "tasks.stats.limitReached",
                "سقف روزانه تکمیل شده",
                "Daily limit reached",
              )
            : text(
                "tasks.stats.limitAvailable",
                "امکان ثبت معامله وجود دارد",
                "More trades can be recorded",
              )
        }
      />

      <Stat
        title={text("tasks.stats.totalResult", "نتیجه کل", "Total Result")}
        value={formatResult(totalResult)}
        icon={
          totalResult >= 0 ? (
            <TrendingUp size={18} />
          ) : (
            <TrendingDown size={18} />
          )
        }
        description={text(
          "tasks.stats.totalDescription",
          "جمع نتیجه معاملات",
          "Combined result of all trades",
        )}
        valueClass={
          totalResult > 0
            ? "text-[var(--color-success)]"
            : totalResult < 0
              ? "text-[var(--color-danger)]"
              : "text-white"
        }
      />

      <Stat
        title={text("tasks.stats.successful", "معاملات موفق", "Winning Trades")}
        value={formatNumber(successfulTrades)}
        icon={<CheckCircle2 size={18} />}
        description={text(
          "tasks.stats.successfulDescription",
          "معامله با نتیجه مثبت",
          "Trades with positive results",
        )}
        valueClass="text-[var(--color-success)]"
      />

      <Stat
        title={text("tasks.stats.failed", "معاملات ناموفق", "Losing Trades")}
        value={formatNumber(failedTrades)}
        icon={<XCircle size={18} />}
        description={text(
          "tasks.stats.failedDescription",
          "معامله با نتیجه منفی",
          "Trades with negative results",
        )}
        valueClass="text-[var(--color-danger)]"
      />
    </div>
  );
}

function Stat({
  title,
  value,
  description,
  icon,
  valueClass = "text-white",
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface-hover)] text-[var(--color-primary)]">
          {icon}
        </div>

        <span className="text-end text-[10px] text-[var(--color-text-muted)]">
          {title}
        </span>
      </div>

      <div dir="ltr" className={`mt-4 text-xl font-bold ${valueClass}`}>
        {value}
      </div>

      <div className="mt-1 text-start text-[10px] text-[var(--color-text-muted)]">
        {description}
      </div>
    </div>
  );
}
