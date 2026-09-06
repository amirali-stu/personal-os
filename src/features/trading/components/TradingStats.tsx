import {
  CalendarDays,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
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
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        title="معاملات امروز"
        value={`${todayCount} / ${tradeLimit}`}
        icon={<CalendarDays size={18} />}
        description={
          todayCount >= tradeLimit
            ? "سقف روزانه تکمیل شده"
            : "امکان ثبت معامله وجود دارد"
        }
      />

      <Stat
        title="نتیجه کل"
        value={formatResult(totalResult)}
        icon={
          totalResult >= 0 ? (
            <TrendingUp size={18} />
          ) : (
            <TrendingDown size={18} />
          )
        }
        description="جمع نتیجه معاملات"
        valueClass={
          totalResult > 0
            ? "text-[var(--color-success)]"
            : totalResult < 0
              ? "text-[var(--color-danger)]"
              : "text-white"
        }
      />

      <Stat
        title="معاملات موفق"
        value={successfulTrades.toLocaleString("fa-IR")}
        icon={<CheckCircle2 size={18} />}
        description="معامله با نتیجه مثبت"
        valueClass="text-[var(--color-success)]"
      />

      <Stat
        title="معاملات ناموفق"
        value={failedTrades.toLocaleString("fa-IR")}
        icon={<XCircle size={18} />}
        description="معامله با نتیجه منفی"
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

        <span className="text-[10px] text-[var(--color-text-muted)]">
          {title}
        </span>
      </div>

      <div dir="ltr" className={`mt-4 text-xl font-bold ${valueClass}`}>
        {value}
      </div>

      <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">
        {description}
      </div>
    </div>
  );
}
