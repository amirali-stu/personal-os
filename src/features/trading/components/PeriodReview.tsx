import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CalendarRange,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";

import type { Trade } from "../types";
import { computePeriodReview, type ReviewPeriod } from "../utils/periodReview";
import { useSettingsStore } from "../../../app/store/settingsStore";

type Props = {
  trades: Trade[];
};

function formatNum(value: number, locale: string, digits = 2) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
  }).format(value);
}

function formatSigned(value: number, locale: string) {
  const abs = formatNum(Math.abs(value), locale);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `-${abs}`;
  return "0";
}

const toneStyles = {
  strong: {
    border: "border-emerald-500/30",
    soft: "bg-emerald-500/10",
    text: "text-emerald-400",
    icon: Trophy,
  },
  caution: {
    border: "border-amber-500/30",
    soft: "bg-amber-500/10",
    text: "text-amber-400",
    icon: AlertTriangle,
  },
  critical: {
    border: "border-red-500/30",
    soft: "bg-red-500/10",
    text: "text-red-400",
    icon: AlertTriangle,
  },
  neutral: {
    border: "border-[var(--color-border)]",
    soft: "bg-[var(--color-primary-soft)]",
    text: "text-[var(--color-primary)]",
    icon: Brain,
  },
};

export function PeriodReview({ trades }: Props) {
  const [period, setPeriod] = useState<ReviewPeriod>("week");
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";
  const locale = isRtl ? "fa-IR" : "en-US";

  const stats = useMemo(
    () => computePeriodReview(trades, period, locale),
    [trades, period, locale],
  );

  const tone = toneStyles[stats.insight.tone];
  const InsightIcon = tone.icon;

  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* هدر */}
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <CalendarRange size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold sm:text-lg">
              {isRtl ? "ریویو عملکرد" : "Performance Review"}
            </h2>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {stats.fromLabel} — {stats.toLabel}
            </p>
          </div>
        </div>

        {/* سوییچ هفته / ماه */}
        <div className="flex rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
          {(
            [
              { id: "week", label: isRtl ? "هفتگی" : "Weekly" },
              { id: "month", label: isRtl ? "ماهانه" : "Monthly" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPeriod(opt.id)}
              className={[
                "rounded-lg px-4 py-2 text-xs font-semibold transition",
                period === opt.id
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* کارت بینش اصلی */}
        <div
          className={`relative overflow-hidden rounded-2xl border ${tone.border} ${tone.soft} p-5`}
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/20 ${tone.text}`}
            >
              <InsightIcon size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className={tone.text} />
                <p className={`text-xs font-semibold ${tone.text}`}>
                  {isRtl ? "جمع‌بندی مربی" : "Coach summary"}
                </p>
              </div>
              <h3 className="mt-2 text-base font-bold leading-7 text-[var(--color-text)] sm:text-lg">
                {stats.insight.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                {stats.insight.text}
              </p>
            </div>
          </div>
        </div>

        {/* متریک‌های اصلی */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric
            label={isRtl ? "تعداد معاملات" : "Trades"}
            value={formatNum(stats.tradeCount, locale, 0)}
            icon={BarChart3}
          />
          <Metric
            label={isRtl ? "نرخ موفقیت" : "Win rate"}
            value={`${formatNum(stats.winRate, locale, 0)}٪`}
            icon={Target}
            accent={
              stats.winRate >= 50
                ? "positive"
                : stats.tradeCount > 0
                  ? "negative"
                  : undefined
            }
          />
          <Metric
            label={isRtl ? "نتیجه دوره" : "Net result"}
            value={formatSigned(stats.totalResult, locale)}
            icon={stats.totalResult >= 0 ? TrendingUp : TrendingDown}
            accent={
              stats.totalResult > 0
                ? "positive"
                : stats.totalResult < 0
                  ? "negative"
                  : undefined
            }
          />
          <Metric
            label={isRtl ? "میانگین نمره" : "Avg score"}
            value={
              stats.avgScore != null
                ? formatNum(stats.avgScore, locale, 1)
                : "—"
            }
            icon={Sparkles}
          />
        </div>

        {/* جزئیات عمیق‌تر */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <p className="text-[11px] font-medium text-[var(--color-text-muted)]">
              {isRtl ? "ساختار برد / باخت" : "Win / Loss structure"}
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <Row
                label={isRtl ? "برد" : "Wins"}
                value={formatNum(stats.wins, locale, 0)}
                valueClass="text-[var(--color-success)]"
              />
              <Row
                label={isRtl ? "باخت" : "Losses"}
                value={formatNum(stats.losses, locale, 0)}
                valueClass="text-[var(--color-danger)]"
              />
              <Row
                label={isRtl ? "میانگین سود" : "Avg win"}
                value={formatSigned(stats.avgWin, locale)}
              />
              <Row
                label={isRtl ? "میانگین ضرر" : "Avg loss"}
                value={formatSigned(stats.avgLoss, locale)}
              />
              <Row
                label="Profit Factor"
                value={
                  stats.profitFactor == null
                    ? "—"
                    : !isFinite(stats.profitFactor)
                      ? "∞"
                      : formatNum(stats.profitFactor, locale, 2)
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <p className="text-[11px] font-medium text-[var(--color-text-muted)]">
              {isRtl ? "بهترین و بدترین معامله" : "Best & worst trade"}
            </p>
            <div className="mt-4 space-y-4">
              <TradeMini
                label={isRtl ? "بهترین" : "Best"}
                trade={stats.bestTrade}
                locale={locale}
                positive
              />
              <TradeMini
                label={isRtl ? "بدترین" : "Worst"}
                trade={stats.worstTrade}
                locale={locale}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <p className="text-[11px] font-medium text-[var(--color-text-muted)]">
              {isRtl ? "الگوهای قابل‌توجه" : "Notable patterns"}
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  {isRtl ? "نمادهای پرتکرار" : "Top symbols"}
                </p>
                {stats.topSymbols.length === 0 ? (
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    —
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {stats.topSymbols.map((s) => (
                      <li
                        key={s.symbol}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold">{s.symbol}</span>
                        <span className="text-[var(--color-text-muted)]">
                          {s.count}× · {formatSigned(s.result, locale)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-[var(--color-border)] pt-3">
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  {isRtl ? "دلایل تکراری ضرر" : "Recurring loss reasons"}
                </p>
                {stats.topLossReasons.length === 0 ? (
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    {isRtl ? "الگوی واضحی ثبت نشده" : "No clear pattern"}
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {stats.topLossReasons.map((r) => (
                      <li key={r.reason} className="text-xs leading-5">
                        <span className="font-medium text-red-400/90">
                          {r.count}×
                        </span>{" "}
                        <span className="text-[var(--color-text-secondary)]">
                          {r.reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: "positive" | "negative";
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[var(--color-text-muted)]">{label}</p>
        <Icon size={14} className="text-[var(--color-text-muted)]" />
      </div>
      <p
        className={[
          "mt-3 text-xl font-bold tabular-nums",
          accent === "positive"
            ? "text-[var(--color-success)]"
            : accent === "negative"
              ? "text-[var(--color-danger)]"
              : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      <span className={`text-xs font-semibold tabular-nums ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

function TradeMini({
  label,
  trade,
  locale,
  positive,
}: {
  label: string;
  trade: Trade | null;
  locale: string;
  positive?: boolean;
}) {
  if (!trade) {
    return (
      <div>
        <p className="text-[10px] text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">—</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{trade.symbol}</p>
      <p
        className={`mt-0.5 text-xs font-medium tabular-nums ${
          positive
            ? "text-[var(--color-success)]"
            : "text-[var(--color-danger)]"
        }`}
      >
        {formatSigned(trade.result, locale)}
      </p>
      {trade.reason && (
        <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[var(--color-text-muted)]">
          {trade.reason}
        </p>
      )}
    </div>
  );
}
