// components/MarketChart.tsx
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { useMarketHistory } from "../hooks/useMarketHistory";
import type { MarketAsset } from "../types";

type Props = {
  market: MarketAsset;
};

function formatPrice(value: number, market: MarketAsset) {
  if (market.type === "forex") {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }

  return value.toLocaleString("fa-IR");
}

function formatTime(timestamp: number, language: string) {
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function MarketChart({ market }: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);

  const isRtl = language === "fa";
  const { history, isLoading } = useMarketHistory(market.id);

  const chartData = history.map((point) => ({
    timestamp: point.timestamp,
    price: point.price,
    time: formatTime(point.timestamp, language),
  }));

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="text-start">
          <div dir="ltr" className="text-sm font-bold text-white">
            {market.symbol}
          </div>

          <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
            {t("markets.priceHistory", {
              defaultValue: isRtl ? "تاریخچه قیمت" : "Price history",
            })}
          </p>
        </div>

        <div
          dir="ltr"
          className="shrink-0 text-sm font-bold text-[var(--color-primary)]"
        >
          {formatPrice(market.price, market)}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-[var(--color-surface-hover)]" />
      ) : chartData.length < 2 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[var(--color-border)]">
          <div className="text-center">
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">
              {t("markets.insufficientHistory", {
                defaultValue: isRtl
                  ? "هنوز تاریخچه کافی نیست"
                  : "Not enough history yet",
              })}
            </p>

            <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
              {t("markets.historyHint", {
                defaultValue: isRtl
                  ? "با بروزرسانی‌های بعدی نمودار ساخته می‌شود."
                  : "The chart will build with future updates.",
              })}
            </p>
          </div>
        </div>
      ) : (
        <div dir="ltr" className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id={`market-gradient-${market.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                tick={{
                  fontSize: 9,
                  fill: "var(--color-text-muted)",
                }}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
              />

              <YAxis
                domain={["auto", "auto"]}
                tick={{
                  fontSize: 9,
                  fill: "var(--color-text-muted)",
                }}
                axisLine={false}
                tickLine={false}
                width={60}
                tickFormatter={(value) =>
                  market.type === "forex"
                    ? Number(value).toFixed(4)
                    : Number(value).toLocaleString("en-US")
                }
              />

              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "10px",
                }}
                labelStyle={{
                  color: "var(--color-text-secondary)",
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  formatPrice(Number(value), market),
                  t("markets.price", {
                    defaultValue: isRtl ? "قیمت" : "Price",
                  }),
                ]}
                labelFormatter={(label) =>
                  `${t("markets.hour", {
                    defaultValue: isRtl ? "ساعت" : "Time",
                  })} ${label}`
                }
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill={`url(#market-gradient-${market.id})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--color-primary)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
