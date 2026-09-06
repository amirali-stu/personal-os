import { useEffect, useRef, useState } from "react";
import { Trash2, TriangleAlert } from "lucide-react";
import type { Trade } from "../types";
import { formatDate, formatResult, formatTime } from "../utils";

type Props = {
  trades: Trade[];
  loading: boolean;
  onDelete: (id: number) => Promise<void>;
};

export function TradeTable({ trades, loading, onDelete }: Props) {
  const [openReasonId, setOpenReasonId] = useState<number | null>(null);

  const [deleteTrade, setDeleteTrade] = useState<Trade | null>(null);

  const [tooltip, setTooltip] = useState<{
    top: number;
    right: number;
  } | null>(null);

  function openReason(id: number, element: HTMLButtonElement) {
    const rect = element.getBoundingClientRect();

    setTooltip({
      top: rect.top - 10,
      right: window.innerWidth - rect.right,
    });

    setOpenReasonId(id);
  }

  function closeReason() {
    setOpenReasonId(null);
    setTooltip(null);
  }

  async function confirmDelete() {
    if (!deleteTrade?.id) {
      return;
    }

    await onDelete(deleteTrade.id);
    setDeleteTrade(null);
  }

  const selectedTrade = trades.find((trade) => trade.id === openReasonId);

  return (
    <>
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">معاملات ثبت‌شده</h2>

            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              تمام معاملات قبلی شما
            </p>
          </div>

          <div className="rounded-lg bg-[var(--color-surface-hover)] px-3 py-1.5 text-[11px] text-[var(--color-text-secondary)]">
            {trades.length.toLocaleString("fa-IR")} معامله
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">
            در حال بارگذاری معاملات...
          </div>
        ) : trades.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-sm font-semibold text-white">
              هنوز معامله‌ای ثبت نشده
            </div>

            <div className="mt-1 text-xs text-[var(--color-text-muted)]">
              اولین معامله خودت را ثبت کن.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] table-fixed text-right">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)]">
                  <th className="w-[110px] px-5 py-3 font-medium">نماد</th>

                  <th className="w-[280px] px-5 py-3 font-medium">علت ورود</th>

                  <th className="w-[90px] px-5 py-3 font-medium">نوع</th>

                  <th className="w-[120px] px-5 py-3 font-medium">
                    نتیجه مالی
                  </th>

                  <th className="w-[100px] px-5 py-3 font-medium">امتیاز</th>

                  <th className="w-[110px] px-5 py-3 font-medium">تاریخ</th>

                  <th className="w-[80px] px-5 py-3 font-medium">ساعت</th>

                  <th className="w-[70px] px-5 py-3 font-medium">حذف</th>
                </tr>
              </thead>

              <tbody>
                {trades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)]"
                  >
                    {/* Symbol */}
                    <td className="px-5 py-4">
                      <span
                        dir="ltr"
                        className="font-mono text-sm font-bold text-white"
                      >
                        {trade.symbol}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-5 py-4">
                      <ReasonCell
                        trade={trade}
                        isOpen={openReasonId === trade.id}
                        onOpen={openReason}
                        onClose={closeReason}
                      />
                    </td>

                    {/* Side */}
                    <td className="px-5 py-4">
                      <span
                        className={[
                          "inline-flex rounded-lg px-2.5 py-1 text-[10px] font-semibold",
                          trade.side === "buy"
                            ? "bg-[rgba(34,197,94,0.1)] text-[var(--color-success)]"
                            : "bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)]",
                        ].join(" ")}
                      >
                        {trade.side === "buy" ? "خرید" : "فروش"}
                      </span>
                    </td>

                    {/* Result */}
                    <td className="px-5 py-4">
                      <span
                        dir="ltr"
                        className={[
                          "font-mono text-sm font-bold",
                          trade.result > 0
                            ? "text-[var(--color-success)]"
                            : trade.result < 0
                              ? "text-[var(--color-danger)]"
                              : "text-[var(--color-text-secondary)]",
                        ].join(" ")}
                      >
                        {formatResult(trade.result)}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <span
                            key={value}
                            className={[
                              "h-1.5 w-1.5 rounded-full",
                              value <= trade.score
                                ? "bg-[var(--color-primary)]"
                                : "bg-[var(--color-border-hover)]",
                            ].join(" ")}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 font-mono text-xs text-[var(--color-text-secondary)]">
                      {formatDate(trade.date)}
                    </td>

                    {/* Time */}
                    <td className="px-5 py-4 text-xs text-[var(--color-text-muted)]">
                      {formatTime(trade.createdAt)}
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          closeReason();
                          setDeleteTrade(trade);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--color-danger)]"
                        aria-label="حذف معامله"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Reason */}
      {selectedTrade && openReasonId !== null && (
        <ReasonTooltip
          trade={selectedTrade}
          top={0}
          right={0}
          onClose={closeReason}
        />
      )}

      {/* Delete */}
      {deleteTrade && (
        <DeleteModal
          trade={deleteTrade}
          onCancel={() => setDeleteTrade(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

/* =========================================================
   Reason Cell
========================================================= */

function ReasonCell({
  trade,
  isOpen,
  onOpen,
  onClose,
}: {
  trade: Trade;
  isOpen: boolean;
  onOpen: (id: number, element: HTMLButtonElement) => void;
  onClose: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    if (!buttonRef.current || !trade.id) {
      return;
    }

    if (isOpen) {
      onClose();
    } else {
      onOpen(trade.id, buttonRef.current);
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className="group block w-full cursor-pointer text-right"
    >
      <span className="block truncate text-xs leading-6 text-[var(--color-text-secondary)] transition-colors group-hover:text-white">
        {trade.reason}
      </span>
    </button>
  );
}

/* =========================================================
   Reason Tooltip / Mobile Modal
========================================================= */

function ReasonTooltip({
  trade,
  onClose,
}: {
  trade: Trade;
  top: number;
  right: number;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="بستن توضیحات"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-[440px] animate-[reasonModalIn_180ms_ease-out] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-sidebar)] shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
        {/* Purple glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[rgba(168,85,247,0.12)] blur-3xl" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold text-[var(--color-primary)]">
                علت ورود
              </div>

              <h3 className="mt-1 text-sm font-bold text-white">
                توضیحات معامله
              </h3>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white"
              aria-label="بستن"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

          {/* Trade info */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
            <div>
              <div className="text-[10px] text-[var(--color-text-muted)]">
                نماد
              </div>

              <div
                dir="ltr"
                className="mt-1 font-mono text-sm font-bold text-white"
              >
                {trade.symbol}
              </div>
            </div>

            <div className="text-left">
              <div className="text-[10px] text-[var(--color-text-muted)]">
                نوع
              </div>

              <div
                className={[
                  "mt-1 text-xs font-bold",
                  trade.side === "buy"
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-danger)]",
                ].join(" ")}
              >
                {trade.side === "buy" ? "خرید" : "فروش"}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="mt-4 max-h-[50vh] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="whitespace-pre-wrap break-words text-xs leading-7 text-[var(--color-text-secondary)]">
              {trade.reason}
            </p>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[var(--color-primary-hover)]"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
/* =========================================================
   Delete Modal
========================================================= */

function DeleteModal({
  trade,
  onCancel,
  onConfirm,
}: {
  trade: Trade;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);

    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !deleting) {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleting, onCancel]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="بستن"
        onClick={() => {
          if (!deleting) {
            onCancel();
          }
        }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-sidebar)] shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
        {/* Purple glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[rgba(168,85,247,0.12)] blur-3xl" />

        <div className="relative p-6">
          {/* Icon */}
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)]">
            <TriangleAlert size={21} strokeWidth={1.8} />
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white">حذف معامله؟</h3>

          <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
            این معامله برای همیشه از ژورنال حذف می‌شود و امکان بازگردانی آن وجود
            ندارد.
          </p>

          {/* Trade preview */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
            <div>
              <div className="text-[10px] text-[var(--color-text-muted)]">
                نماد
              </div>

              <div
                dir="ltr"
                className="mt-1 font-mono text-sm font-bold text-white"
              >
                {trade.symbol}
              </div>
            </div>

            <div className="text-left">
              <div className="text-[10px] text-[var(--color-text-muted)]">
                نتیجه
              </div>

              <div
                dir="ltr"
                className={[
                  "mt-1 font-mono text-sm font-bold",
                  trade.result > 0
                    ? "text-[var(--color-success)]"
                    : trade.result < 0
                      ? "text-[var(--color-danger)]"
                      : "text-[var(--color-text-secondary)]",
                ].join(" ")}
              >
                {formatResult(trade.result)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              انصراف
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={deleting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-xs font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={15} />

              {deleting ? "در حال حذف..." : "حذف معامله"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
