import { CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../app/store/settingsStore";
import { useTasks } from "../tasks/hooks/useTasks";
import { useTrades } from "../trading/hooks/useTrades";
import { useMarketData } from "../markets/hooks/useMarketData";

import { WelcomeHeader } from "./components/WelcomeHeader";
import { StatCard } from "./components/StatCard";
import {
  RecentActivity,
  type RecentActivityItem,
} from "./components/RecentActivity";
import { DailyReview } from "./components/DailyReview";
import { PomodoroPanel } from "../focus/Pomodoro";

export function DashboardPage() {
  const { t } = useTranslation();

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";
  const locale = isRtl ? "fa-IR" : "en-US";

  const { recentTasks, completedCount, totalCount, progress } = useTasks();

  const { trades, todayTrades, totalResult, successfulTrades, failedTrades } =
    useTrades();

  const { markets, isOnline, isLoading: marketsLoading } = useMarketData();

  const recentTrades = [...trades]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const recentActivities: RecentActivityItem[] = [
    ...recentTrades.map((trade) => ({
      id: `trade-${trade.id}`,
      title: t("dashboard.activity.tradeRecorded", {
        symbol: trade.symbol,
      }),
      description:
        trade.result > 0
          ? t("dashboard.activity.profit", {
              value: formatResult(trade.result, locale),
            })
          : trade.result < 0
            ? t("dashboard.activity.loss", {
                value: formatResult(trade.result, locale),
              })
            : t("dashboard.activity.noProfitLoss"),
      time: formatActivityTime(trade.createdAt, locale),
      icon: TrendingUp,
      timestamp: trade.createdAt,
    })),

    ...recentTasks.slice(0, 3).map((task) => ({
      id: `task-${task.id}`,
      title: task.completed
        ? t("dashboard.activity.taskCompleted")
        : t("dashboard.activity.newTask"),
      description: task.title,
      time: formatActivityTime(task.createdAt, locale),
      icon: task.completed ? CheckCircle2 : Clock3,
      timestamp: task.createdAt,
    })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-8">
      <WelcomeHeader isOnline={isOnline} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title={t("dashboard.stats.todayTasks")}
          value={`${formatNumber(completedCount, locale)} / ${formatNumber(
            totalCount,
            locale,
          )}`}
          description={
            totalCount === 0
              ? t("dashboard.stats.noTasks")
              : t("dashboard.stats.remainingTasks", {
                  count: totalCount - completedCount,
                })
          }
          icon={CheckCircle2}
        />

        <StatCard
          title={t("dashboard.stats.tradingPerformance")}
          value={formatResult(totalResult, locale)}
          description={t("dashboard.stats.tradesRecorded", {
            count: formatNumber(trades.length, locale),
          })}
          icon={TrendingUp}
          type={
            totalResult > 0 ? "success" : totalResult < 0 ? "danger" : "default"
          }
        />

        <StatCard
          title={t("dashboard.stats.tradeStatus")}
          value={t("dashboard.stats.tradeCount", {
            count: formatNumber(todayTrades.length, locale),
          })}
          description={t("dashboard.stats.successFailure", {
            success: formatNumber(successfulTrades, locale),
            failed: formatNumber(failedTrades, locale),
          })}
          icon={TrendingUp}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-start font-bold">
                {t("dashboard.markets.title")}
              </h2>

              <p className="mt-1 text-start text-xs text-[var(--color-text-muted)]">
                {t("dashboard.markets.subtitle")}
              </p>
            </div>

            <span className="shrink-0 rounded-lg bg-[var(--color-surface-hover)] px-2.5 py-1 text-xs text-[var(--color-text-muted)]">
              {marketsLoading
                ? t("dashboard.markets.updating")
                : isOnline
                  ? t("dashboard.markets.online")
                  : t("dashboard.markets.cached")}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {markets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {t("dashboard.markets.unavailable")}
                </p>
              </div>
            ) : (
              markets.map((market) => (
                <MarketRow key={market.id} market={market} locale={locale} />
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div>
            <h2 className="text-start font-bold">
              {t("dashboard.tasks.title")}
            </h2>

            <p className="mt-1 text-start text-xs text-[var(--color-text-muted)]">
              {t("dashboard.tasks.subtitle")}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">
                {formatNumber(progress, locale)}٪
              </span>

              <span className="text-xs text-[var(--color-text-muted)]">
                {t("dashboard.tasks.progress", {
                  completed: formatNumber(completedCount, locale),
                  total: formatNumber(totalCount, locale),
                })}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {recentTasks.length === 0 ? (
              <p className="py-4 text-center text-xs text-[var(--color-text-muted)]">
                {t("dashboard.tasks.empty")}
              </p>
            ) : (
              recentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  title={task.title}
                  completed={task.completed}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DailyReview />
        <PomodoroPanel />
      </div>

      <RecentActivity activities={recentActivities} />
    </div>
  );
}

type MarketRowProps = {
  market: {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    type: string;
    unit: string;
  };
  locale: string;
};

function MarketRow({ market, locale }: MarketRowProps) {
  const positive = market.change24h >= 0;

  const price = market.price.toLocaleString(locale, {
    minimumFractionDigits: market.type === "forex" ? 4 : 0,
    maximumFractionDigits: market.type === "forex" ? 4 : 2,
  });

  const change = `${positive ? "+" : ""}${market.change24h.toLocaleString(
    locale,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}%`;

  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          dir="ltr"
          className="flex h-9 w-20 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-hover)] text-[10px] font-bold"
        >
          {market.symbol}
        </div>

        <div className="min-w-0">
          <p className="truncate text-start text-sm font-medium">
            {market.name}
          </p>

          <p className="mt-0.5 truncate text-start text-[10px] text-[var(--color-text-muted)]">
            {market.unit}
          </p>
        </div>
      </div>

      <div className="text-end">
        <p dir="ltr" className="text-sm font-semibold">
          {market.type === "forex" ? `$${price}` : price}
        </p>

        <p
          dir="ltr"
          className={[
            "mt-0.5 text-xs",
            positive
              ? "text-[var(--color-success)]"
              : "text-[var(--color-danger)]",
          ].join(" ")}
        >
          {change}
        </p>
      </div>
    </div>
  );
}

function TaskItem({ title, completed }: { title: string; completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
          completed
            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
            : "border-[var(--color-border-hover)]",
        ].join(" ")}
      >
        {completed && <CheckCircle2 size={13} />}
      </div>

      <span
        className={[
          "min-w-0 truncate text-start text-sm",
          completed
            ? "text-[var(--color-text-muted)] line-through"
            : "text-[var(--color-text-secondary)]",
        ].join(" ")}
      >
        {title}
      </span>
    </div>
  );
}

function formatResult(value: number, locale: string) {
  const formatted = Math.abs(value).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (value > 0) {
    return `+${formatted}`;
  }

  if (value < 0) {
    return `-${formatted}`;
  }

  return formatted;
}

function formatNumber(value: number, locale: string) {
  return value.toLocaleString(locale, {
    maximumFractionDigits: 2,
  });
}

function formatActivityTime(timestamp: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
