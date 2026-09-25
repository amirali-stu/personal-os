import { useMemo, useState, useRef, useEffect } from "react";
import {
  Trash2,
  TriangleAlert,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Trade } from "../types";
import { formatResult } from "../utils";
import { useSettingsStore } from "../../../app/store/settingsStore";
import type { DateFormat, Timezone } from "../../../lib/dateUtils";

type Props = {
  trades: Trade[];
  loading: boolean;
  onDelete: (id: number) => Promise<void>;
};

type PeriodFilter = "all" | "today" | "week" | "month";
type LimitFilter = 25 | 50 | 100 | 0;

export function TradeTable({ trades, loading, onDelete }: Props) {
  const { t } = useTranslation();

  const language = useSettingsStore((state) => state.language);
  const dateFormat = useSettingsStore(
    (state) => state.dateFormat,
  ) as DateFormat;
  const timezone = useSettingsStore((state) => state.timezone) as Timezone;
  const isRtl = language === "fa";

  const text = (key: string, fa: string, en: string) =>
    t(key, { defaultValue: isRtl ? fa : en });

  const formatNumber = (value: number) =>
    value.toLocaleString(isRtl ? "fa-IR" : "en-US");

  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [limit, setLimit] = useState<LimitFilter>(25);
  const [page, setPage] = useState(1);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [openReasonId, setOpenReasonId] = useState<number | null>(null);
  const [deleteTrade, setDeleteTrade] = useState<Trade | null>(null);

  const periodRef = useRef<HTMLDivElement>(null);
  const limitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
        setPeriodOpen(false);
      }
      if (limitRef.current && !limitRef.current.contains(e.target as Node)) {
        setLimitOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [period, limit]);

  const filteredByPeriod = useMemo(() => {
    if (period === "all") return trades;

    const now = new Date();

    if (period === "today") {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      return trades.filter((t) => new Date(t.createdAt) >= todayStart);
    }

    if (period === "week") {
      // ۷ روز اخیر (از همین لحظه به عقب)
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);

      return trades.filter((t) => new Date(t.createdAt) >= weekAgo);
    }

    if (period === "month") {
      // ۳۰ روز اخیر
      const monthAgo = new Date(now);
      monthAgo.setDate(monthAgo.getDate() - 30);
      monthAgo.setHours(0, 0, 0, 0);

      return trades.filter((t) => new Date(t.createdAt) >= monthAgo);
    }

    return trades;
  }, [trades, period]);

  const pageSize = limit === 0 ? filteredByPeriod.length || 1 : limit;
  const totalPages = Math.max(1, Math.ceil(filteredByPeriod.length / pageSize));

  const displayedTrades = useMemo(() => {
    if (limit === 0) return filteredByPeriod;
    const start = (page - 1) * pageSize;
    return filteredByPeriod.slice(start, start + pageSize);
  }, [filteredByPeriod, limit, page, pageSize]);

  const periodLabels: Record<PeriodFilter, string> = {
    all: isRtl ? "همه" : "All",
    today: isRtl ? "امروز" : "Today",
    week: isRtl ? "این هفته" : "This Week",
    month: isRtl ? "این ماه" : "This Month",
  };

  const limitLabels: Record<LimitFilter, string> = {
    25: "25",
    50: "50",
    100: "100",
    0: isRtl ? "همه" : "All",
  };

  async function confirmDelete() {
    if (!deleteTrade?.id) return;
    await onDelete(deleteTrade.id);
    setDeleteTrade(null);
  }

  function formatTableDate(timestamp: number) {
    const date = new Date(timestamp);
    const locale = language === "fa" ? "fa-IR" : "en-US";
    const calendar =
      language === "en"
        ? "gregory"
        : dateFormat === "gregorian"
          ? "gregory"
          : "persian";

    return new Intl.DateTimeFormat(locale, {
      calendar,
      numberingSystem: language === "fa" ? "arabext" : "latn",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: timezone === "utc" ? "UTC" : undefined,
    }).format(date);
  }

  function formatTableTime(timestamp: number) {
    const date = new Date(timestamp);
    const locale = language === "fa" ? "fa-IR" : "en-US";

    return new Intl.DateTimeFormat(locale, {
      numberingSystem: language === "fa" ? "arabext" : "latn",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone === "utc" ? "UTC" : undefined,
    }).format(date);
  }

  const selectedTrade = trades.find((t) => t.id === openReasonId);

  const startIndex = limit === 0 ? 0 : (page - 1) * pageSize;

  return (
    <>
      <section
        dir={isRtl ? "rtl" : "ltr"}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        {/* هدر + دراپ‌داون‌ها */}
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-start">
            <h2 className="text-sm font-bold text-white">
              {text(
                "tasks.tradeTable.title",
                "معاملات ثبت‌شده",
                "Recorded Trades",
              )}
            </h2>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              {text(
                "tasks.tradeTable.subtitle",
                "فیلتر و مشاهده معاملات",
                "Filter and view your trades",
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* دراپ‌داون دوره */}
            <div className="relative" ref={periodRef}>
              <button
                type="button"
                onClick={() => {
                  setPeriodOpen((v) => !v);
                  setLimitOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[11px] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
              >
                <Filter size={13} />
                <span>{periodLabels[period]}</span>
                <ChevronDown size={13} />
              </button>

              {periodOpen && (
                <div className="absolute top-full z-20 mt-1 min-w-[120px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
                  {(Object.keys(periodLabels) as PeriodFilter[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setPeriod(key);
                        setPeriodOpen(false);
                      }}
                      className={[
                        "flex w-full px-3 py-2 text-[11px] transition-colors",
                        period === key
                          ? "bg-[var(--color-primary)] text-white"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
                      ].join(" ")}
                    >
                      {periodLabels[key]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* دراپ‌داون تعداد */}
            <div className="relative" ref={limitRef}>
              <button
                type="button"
                onClick={() => {
                  setLimitOpen((v) => !v);
                  setPeriodOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[11px] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
              >
                <span>{limitLabels[limit]}</span>
                <ChevronDown size={13} />
              </button>

              {limitOpen && (
                <div className="absolute top-full z-20 mt-1 min-w-[90px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
                  {([25, 50, 100, 0] as LimitFilter[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setLimit(value);
                        setLimitOpen(false);
                      }}
                      className={[
                        "flex w-full px-3 py-2 text-[11px] transition-colors",
                        limit === value
                          ? "bg-[var(--color-primary)] text-white"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
                      ].join(" ")}
                    >
                      {limitLabels[value]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg bg-[var(--color-surface-hover)] px-3 py-1.5 text-[11px] text-[var(--color-text-secondary)]">
              {formatNumber(filteredByPeriod.length)}{" "}
              {text("tasks.tradeTable.trade", "معامله", "trades")}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">
            {text(
              "tasks.tradeTable.loading",
              "در حال بارگذاری معاملات...",
              "Loading trades...",
            )}
          </div>
        ) : displayedTrades.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-sm font-semibold text-white">
              {text(
                "tasks.tradeTable.emptyTitle",
                "معامله‌ای یافت نشد",
                "No trades found",
              )}
            </div>
            <div className="mt-1 text-xs text-[var(--color-text-muted)]">
              {text(
                "tasks.tradeTable.emptyDescription",
                "با فیلترهای فعلی معامله‌ای وجود ندارد.",
                "No trades match the current filters.",
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] table-fixed text-start">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)]">
                    <th className="w-[50px] px-4 py-3 text-start font-medium">
                      #
                    </th>
                    <th className="w-[110px] px-5 py-3 text-start font-medium">
                      {text("tasks.tradeTable.symbol", "نماد", "Symbol")}
                    </th>
                    <th className="w-[260px] px-5 py-3 text-start font-medium">
                      {text(
                        "tasks.tradeTable.reason",
                        "علت ورود",
                        "Entry Reason",
                      )}
                    </th>
                    <th className="w-[90px] px-5 py-3 text-start font-medium">
                      {text("tasks.tradeTable.side", "نوع", "Side")}
                    </th>
                    <th className="w-[120px] px-5 py-3 text-start font-medium">
                      {text(
                        "tasks.tradeTable.result",
                        "نتیجه مالی",
                        "Financial Result",
                      )}
                    </th>
                    <th className="w-[80px] px-5 py-3 text-start font-medium">
                      {text("tasks.tradeTable.score", "امتیاز", "Score")}
                    </th>
                    <th className="w-[110px] px-5 py-3 text-start font-medium">
                      {text("tasks.tradeTable.date", "تاریخ", "Date")}
                    </th>
                    <th className="w-[60px] px-5 py-3 text-start font-medium">
                      {text("tasks.tradeTable.actions", "عملیات", "Actions")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedTrades.map((trade, index) => (
                    <tr
                      key={trade.id}
                      className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]"
                    >
                      {/* شمارنده */}
                      <td className="px-4 py-3.5 text-xs text-[var(--color-text-muted)]">
                        {formatNumber(startIndex + index + 1)}
                      </td>

                      <td className="px-5 py-3.5 text-sm font-medium text-white">
                        {trade.symbol}
                      </td>

                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setOpenReasonId(trade.id!)}
                          className="max-w-[240px] truncate text-start text-xs text-[var(--color-text-secondary)] hover:text-white"
                        >
                          {trade.reason}
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-xs">
                        <span
                          className={[
                            "rounded-md px-2 py-1 font-medium",
                            trade.side === "buy"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-rose-500/15 text-rose-400",
                          ].join(" ")}
                        >
                          {trade.side === "buy"
                            ? text("tasks.tradeTable.buy", "خرید", "Buy")
                            : text("tasks.tradeTable.sell", "فروش", "Sell")}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-sm font-medium">
                        <span
                          className={
                            trade.result > 0
                              ? "text-emerald-400"
                              : trade.result < 0
                                ? "text-rose-400"
                                : "text-[var(--color-text-muted)]"
                          }
                        >
                          {formatResult(trade.result)}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-[var(--color-text-secondary)]">
                        {trade.score}/5
                      </td>

                      <td className="px-5 py-3.5 text-xs text-[var(--color-text-muted)]">
                        <div>{formatTableDate(trade.createdAt)}</div>
                        <div className="mt-0.5">
                          {formatTableTime(trade.createdAt)}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setDeleteTrade(trade)}
                          className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* صفحه‌بندی */}
            {limit !== 0 && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3">
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  {isRtl
                    ? `صفحه ${formatNumber(page)} از ${formatNumber(totalPages)}`
                    : `Page ${page} of ${totalPages}`}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] disabled:opacity-30"
                  >
                    {isRtl ? (
                      <ChevronRight size={16} />
                    ) : (
                      <ChevronLeft size={16} />
                    )}
                  </button>

                  {/* شماره صفحات */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // فقط چند صفحه اطراف صفحه فعلی رو نشون بده
                      if (totalPages <= 5) return true;
                      return (
                        Math.abs(p - page) <= 1 || p === 1 || p === totalPages
                      );
                    })
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showDots = prev && p - prev > 1;

                      return (
                        <span key={p} className="flex items-center">
                          {showDots && (
                            <span className="px-1 text-[11px] text-[var(--color-text-muted)]">
                              ...
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setPage(p)}
                            className={[
                              "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-medium transition-colors",
                              page === p
                                ? "bg-[var(--color-primary)] text-white"
                                : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
                            ].join(" ")}
                          >
                            {formatNumber(p)}
                          </button>
                        </span>
                      );
                    })}

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] disabled:opacity-30"
                  >
                    {isRtl ? (
                      <ChevronLeft size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* مودال دلیل */}
      {openReasonId && selectedTrade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenReasonId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-sm font-bold text-white">
              {text("tasks.tradeTable.reason", "علت ورود", "Entry Reason")}
            </h3>
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              {selectedTrade.reason}
            </p>
            <button
              type="button"
              onClick={() => setOpenReasonId(null)}
              className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white"
            >
              {text("common.close", "بستن", "Close")}
            </button>
          </div>
        </div>
      )}

      {/* مودال حذف */}
      {deleteTrade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeleteTrade(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2 text-rose-400">
              <TriangleAlert size={18} />
              <h3 className="text-sm font-bold">
                {text(
                  "tasks.tradeTable.deleteTitle",
                  "حذف معامله",
                  "Delete Trade",
                )}
              </h3>
            </div>
            <p className="mb-5 text-xs leading-6 text-[var(--color-text-muted)]">
              {text(
                "tasks.tradeTable.deleteConfirm",
                "آیا از حذف این معامله مطمئن هستید؟ این عمل قابل بازگشت نیست.",
                "Are you sure you want to delete this trade? This action cannot be undone.",
              )}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteTrade(null)}
                className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm text-[var(--color-text-secondary)]"
              >
                {text("common.cancel", "لغو", "Cancel")}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-medium text-white"
              >
                {text("common.delete", "حذف", "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
