import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartColumn } from "lucide-react";

import type { Trade } from "../types";
import { useSettingsStore } from "../../../app/store/settingsStore";

type Range = "week" | "month" | "year";
// done
type Props = {
  trades: Trade[];
};

function localDateKey(d: Date, timezone: "local" | "utc"): string {
  return new Intl.DateTimeFormat("en-CA", {
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone === "utc" ? "UTC" : undefined,
  }).format(d);
}

function formatDayLabel(dateStr: string, locale: string) {
  const d = new Date(dateStr + "T12:00:00");
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(d);
}

function formatMonthLabel(key: string, locale: string) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "2-digit",
  }).format(d);
}

export function TradeCharts({ trades }: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const timezone = useSettingsStore((s) => s.timezone);
  const isRtl = language === "fa";
  const locale = isRtl ? "fa-IR" : "en-US";

  const [range, setRange] = useState<Range>("week");

  const chartData = useMemo(() => {
    const now = new Date();
    const buckets = new Map<
      string,
      { profit: number; loss: number; net: number; count: number }
    >();

    if (range === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        buckets.set(localDateKey(d, timezone), {
          profit: 0,
          loss: 0,
          net: 0,
          count: 0,
        });
      }
    } else if (range === "month") {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        buckets.set(localDateKey(d, timezone), {
          profit: 0,
          loss: 0,
          net: 0,
          count: 0,
        });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        buckets.set(key, { profit: 0, loss: 0, net: 0, count: 0 });
      }
    }

    for (const trade of trades) {
      const key = range === "year" ? trade.date.slice(0, 7) : trade.date;
      const b = buckets.get(key);
      if (!b) continue;
      b.count += 1;
      b.net += trade.result;
      if (trade.result >= 0) b.profit += trade.result;
      else b.loss += Math.abs(trade.result);
    }

    return Array.from(buckets.entries()).map(([key, v]) => ({
      key,
      label:
        range === "year"
          ? formatMonthLabel(key, locale)
          : formatDayLabel(key, locale),
      ...v,
    }));
  }, [trades, range, locale, timezone]);

  const totalNet = chartData.reduce((s, d) => s + d.net, 0);
  const totalCount = chartData.reduce((s, d) => s + d.count, 0);

  const ranges: { id: Range; label: string }[] = [
    {
      id: "week",
      label: t("trading.charts.week", {
        defaultValue: isRtl ? "هفته" : "Week",
      }),
    },
    {
      id: "month",
      label: t("trading.charts.month", {
        defaultValue: isRtl ? "ماه" : "Month",
      }),
    },
    {
      id: "year",
      label: t("trading.charts.year", {
        defaultValue: isRtl ? "سال" : "Year",
      }),
    },
  ];

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <ChartColumn size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold">
              {t("trading.charts.title", {
                defaultValue: isRtl ? "نمودار عملکرد" : "Performance chart",
              })}
            </h2>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {t("trading.charts.subtitle", {
                defaultValue: isRtl
                  ? "نتیجه معاملات در بازه زمانی"
                  : "Trade results over time",
              })}
            </p>
          </div>
        </div>

        <div className="flex rounded-lg bg-[var(--color-bg)] p-1">
          {ranges.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                range === r.id
                  ? "bg-[var(--color-surface-hover)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MiniStat
          label={t("trading.charts.net", {
            defaultValue: isRtl ? "نتیجه خالص" : "Net result",
          })}
          value={totalNet.toLocaleString(locale)}
          positive={totalNet >= 0}
        />
        <MiniStat
          label={t("trading.charts.trades", {
            defaultValue: isRtl ? "تعداد معاملات" : "Trades",
          })}
          value={String(totalCount)}
        />
        <MiniStat
          label={t("trading.charts.avg", {
            defaultValue: isRtl ? "میانگین" : "Average",
          })}
          value={
            totalCount
              ? (totalNet / totalCount).toLocaleString(locale, {
                  maximumFractionDigits: 0,
                })
              : "—"
          }
          positive={totalCount ? totalNet / totalCount >= 0 : true}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="h-56 w-full sm:h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {range === "year" ? (
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="net"
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={range === "month" ? 4 : 0}
              />
              <YAxis
                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="net"
                stroke="var(--color-primary)"
                fill="url(#netGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  positive,
  className = "",
}: {
  label: string;
  value: string;
  positive?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 ${className}`}
    >
      <p className="text-[11px] text-[var(--color-text-muted)]">{label}</p>
      <p
        className={`mt-1 text-sm font-bold tabular-nums ${
          positive === undefined
            ? "text-white"
            : positive
              ? "text-emerald-400"
              : "text-red-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
