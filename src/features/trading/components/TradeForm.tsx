// src/features/trading/components/TradeForm.tsx

import { useState } from "react";
import { CheckCircle2, ChevronDown, DollarSign, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { TradeSide } from "../types";
import { normalizeSymbol } from "../utils";

import { useSettingsStore } from "../../../app/store/settingsStore";

type Props = {
  onSubmit: (data: {
    symbol: string;
    reason: string;
    side: TradeSide;
    result: number;
    score: number;
  }) => Promise<void>;
};

export function TradeForm({ onSubmit }: Props) {
  const { t } = useTranslation();

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const text = (key: string, fa: string, en: string) =>
    t(key, {
      defaultValue: isRtl ? fa : en,
    });

  const [symbol, setSymbol] = useState("");
  const [reason, setReason] = useState("");
  const [side, setSide] = useState<TradeSide>("buy");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanSymbol = normalizeSymbol(symbol);

    if (!cleanSymbol) {
      setError(
        text(
          "tasks.tradeForm.symbolRequired",
          "لطفاً نماد معامله را وارد کنید.",
          "Please enter the trade symbol.",
        ),
      );
      return;
    }

    if (!reason.trim()) {
      setError(
        text(
          "tasks.tradeForm.reasonRequired",
          "لطفاً علت ورود را وارد کنید.",
          "Please enter the entry reason.",
        ),
      );
      return;
    }

    if (!result.trim()) {
      setError(
        text(
          "tasks.tradeForm.resultRequired",
          "لطفاً نتیجه مالی معامله را وارد کنید.",
          "Please enter the financial result.",
        ),
      );
      return;
    }

    const numericResult = Number(result);

    if (Number.isNaN(numericResult)) {
      setError(
        text(
          "tasks.tradeForm.resultNumber",
          "نتیجه مالی باید عددی باشد.",
          "Financial result must be a number.",
        ),
      );
      return;
    }

    try {
      await onSubmit({
        symbol: cleanSymbol,
        reason: reason.trim(),
        side,
        result: numericResult,
        score,
      });

      setSymbol("");
      setReason("");
      setSide("buy");
      setResult("");
      setScore(3);
    } catch {
      setError(
        text(
          "tasks.tradeForm.saveFailed",
          "ذخیره معامله انجام نشد.",
          "The trade could not be saved.",
        ),
      );
    }
  }

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Plus size={17} />
          </div>

          <div className="text-start">
            <h2 className="text-sm font-bold text-white">
              {text(
                "tasks.tradeForm.title",
                "ثبت معامله جدید",
                "Add New Trade",
              )}
            </h2>

            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
              {text(
                "tasks.tradeForm.subtitle",
                "معامله را طبق پلن خود ثبت کن",
                "Record the trade according to your plan.",
              )}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Field label={text("tasks.tradeForm.symbol", "نماد", "Symbol")}>
            <input
              value={symbol}
              onChange={(e) => setSymbol(normalizeSymbol(e.target.value))}
              placeholder="BTC/USDT"
              dir="ltr"
              spellCheck={false}
              autoComplete="off"
              className={inputClass}
            />
          </Field>

          <div className="relative">
            <label className="mb-2 block text-start text-xs font-medium text-[var(--color-text-secondary)]">
              {text("tasks.tradeForm.side", "نوع معامله", "Trade Side")}
            </label>

            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className={`${inputClass} flex items-center justify-between`}
            >
              <span>
                {side === "buy"
                  ? text("tasks.tradeForm.buy", "خرید", "Buy")
                  : text("tasks.tradeForm.sell", "فروش", "Sell")}
              </span>

              <ChevronDown size={17} />
            </button>

            {isOpen && (
              <div className="absolute start-0 top-[76px] z-20 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
                <SideOption
                  label={text("tasks.tradeForm.buy", "خرید", "Buy")}
                  active={side === "buy"}
                  onClick={() => {
                    setSide("buy");
                    setIsOpen(false);
                  }}
                />

                <SideOption
                  label={text("tasks.tradeForm.sell", "فروش", "Sell")}
                  active={side === "sell"}
                  onClick={() => {
                    setSide("sell");
                    setIsOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <Field
              label={text("tasks.tradeForm.reason", "علت ورود", "Entry Reason")}
            >
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={text(
                  "tasks.tradeForm.reasonPlaceholder",
                  "چرا وارد این معامله شدی؟",
                  "Why did you enter this trade?",
                )}
                rows={3}
                className={`${inputClass} resize-none leading-7`}
              />
            </Field>
          </div>

          <Field
            label={text(
              "tasks.tradeForm.result",
              "نتیجه مالی",
              "Financial Result",
            )}
          >
            <div className="relative">
              <DollarSign
                size={17}
                className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <input
                type="number"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder={text(
                  "tasks.tradeForm.resultPlaceholder",
                  "+150 یا -80",
                  "+150 or -80",
                )}
                dir="ltr"
                step="any"
                className={`${inputClass} ps-11`}
              />
            </div>
          </Field>

          <Field
            label={text(
              "tasks.tradeForm.score",
              "امتیاز اجرای پلن",
              "Plan Execution Score",
            )}
          >
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScore(value)}
                  className={[
                    "rounded-xl border py-3 text-sm font-semibold",
                    score === value
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:text-white",
                  ].join(" ")}
                >
                  {value}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)] px-4 py-3 text-start text-xs text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          >
            <Plus size={17} />

            {text("tasks.tradeForm.submit", "ثبت معامله", "Save Trade")}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-start text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>

      {children}
    </div>
  );
}

function SideOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between px-4 py-3 text-start text-sm",
        active
          ? "bg-[var(--color-primary-soft)] text-white"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
      ].join(" ")}
    >
      <span>{label}</span>

      {active && (
        <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
      )}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-start text-sm text-white outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]";
