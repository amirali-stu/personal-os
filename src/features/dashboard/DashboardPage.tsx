import { CheckCircle2, Clock3, TrendingUp } from "lucide-react";

import { useTasks } from "../tasks/hooks/useTasks";
import { useTrades } from "../trading/hooks/useTrades";
import { useMarketData } from "../markets/hooks/useMarketData";

import { WelcomeHeader } from "./components/WelcomeHeader";
import { StatCard } from "./components/StatCard";
import {
  RecentActivity,
  type RecentActivityItem,
} from "./components/RecentActivity";

export function DashboardPage() {
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
      title: `ثبت معامله ${trade.symbol}`,
      description:
        trade.result > 0
          ? `سود ${formatResult(trade.result)}`
          : trade.result < 0
            ? `زیان ${formatResult(trade.result)}`
            : "معامله بدون سود یا زیان",
      time: formatActivityTime(trade.createdAt),
      icon: TrendingUp,
      timestamp: trade.createdAt,
    })),

    ...recentTasks.slice(0, 3).map((task) => ({
      id: `task-${task.id}`,
      title: task.completed ? "تکمیل کار روزانه" : "کار جدید",
      description: task.title,
      time: formatActivityTime(task.createdAt),
      icon: task.completed ? CheckCircle2 : Clock3,
      timestamp: task.createdAt,
    })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <WelcomeHeader isOnline={isOnline} />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="کارهای امروز"
          value={`${toPersianNumber(completedCount)} / ${toPersianNumber(
            totalCount,
          )}`}
          description={
            totalCount === 0
              ? "هنوز کاری ثبت نشده"
              : `${toPersianNumber(totalCount - completedCount)} کار باقی مانده`
          }
          icon={CheckCircle2}
        />

        <StatCard
          title="عملکرد ترید"
          value={formatResult(totalResult)}
          description={`${toPersianNumber(trades.length)} معامله ثبت شده`}
          icon={TrendingUp}
          type={
            totalResult > 0 ? "success" : totalResult < 0 ? "danger" : "default"
          }
        />

        <StatCard
          title="وضعیت معاملات"
          value={`${toPersianNumber(todayTrades.length)} معامله`}
          description={`${toPersianNumber(
            successfulTrades,
          )} موفق • ${toPersianNumber(failedTrades)} ناموفق`}
          icon={TrendingUp}
        />
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Markets */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">بازارهای منتخب</h2>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                نمای سریع بازار
              </p>
            </div>

            <span className="shrink-0 rounded-lg bg-[var(--color-surface-hover)] px-2.5 py-1 text-xs text-[var(--color-text-muted)]">
              {marketsLoading
                ? "در حال بروزرسانی..."
                : isOnline
                  ? "داده آنلاین"
                  : "داده ذخیره‌شده"}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {markets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  اطلاعات بازار در دسترس نیست
                </p>
              </div>
            ) : (
              markets.map((market) => (
                <MarketRow key={market.id} market={market} />
              ))
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div>
            <h2 className="font-bold">آخرین تسک‌ها</h2>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              ۵ تسک آخر ثبت‌شده
            </p>
          </div>

          {/* Today Progress */}
          <div className="mt-6">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">
                {toPersianNumber(progress)}٪
              </span>

              <span className="text-xs text-[var(--color-text-muted)]">
                {toPersianNumber(completedCount)} از{" "}
                {toPersianNumber(totalCount)} کار امروز
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

          {/* Last 5 Tasks */}
          <div className="mt-6 space-y-3">
            {recentTasks.length === 0 ? (
              <p className="py-4 text-center text-xs text-[var(--color-text-muted)]">
                هنوز کاری ثبت نشده
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

      {/* Recent Activity */}
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
};

function MarketRow({ market }: MarketRowProps) {
  const positive = market.change24h >= 0;

  const price =
    market.type === "forex"
      ? market.price.toLocaleString("en-US", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
      : market.price.toLocaleString("fa-IR");

  const change = `${positive ? "+" : ""}${market.change24h.toLocaleString(
    "en-US",
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
          <p className="truncate text-sm font-medium">{market.name}</p>

          <p className="mt-0.5 truncate text-[10px] text-[var(--color-text-muted)]">
            {market.unit}
          </p>
        </div>
      </div>

      <div className="text-left">
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
          "min-w-0 truncate text-sm",
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

function formatResult(value: number) {
  if (value > 0) {
    return `+${value.toLocaleString("fa-IR")}`;
  }

  return value.toLocaleString("fa-IR");
}

function toPersianNumber(value: number) {
  return value.toLocaleString("fa-IR");
}

function formatActivityTime(timestamp: number) {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
