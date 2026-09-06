import { useState } from "react";
import { CheckCircle2, ChevronDown, DollarSign, Plus } from "lucide-react";
import type { TradeSide } from "../types";
import { normalizeSymbol } from "../utils";

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
      setError("لطفاً نماد معامله را وارد کنید.");
      return;
    }

    if (!reason.trim()) {
      setError("لطفاً علت ورود را وارد کنید.");
      return;
    }

    if (!result.trim()) {
      setError("لطفاً نتیجه مالی معامله را وارد کنید.");
      return;
    }

    const numericResult = Number(result);

    if (Number.isNaN(numericResult)) {
      setError("نتیجه مالی باید عددی باشد.");
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
      setError("ذخیره معامله انجام نشد.");
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Plus size={17} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">ثبت معامله جدید</h2>

            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
              معامله را طبق پلن خود ثبت کن
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Field label="نماد">
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
            <label className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
              نوع معامله
            </label>

            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className={inputClass + " flex items-center justify-between"}
            >
              <span>{side === "buy" ? "خرید" : "فروش"}</span>
              <ChevronDown size={17} />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-[76px] z-20 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
                <SideOption
                  label="خرید"
                  active={side === "buy"}
                  onClick={() => {
                    setSide("buy");
                    setIsOpen(false);
                  }}
                />

                <SideOption
                  label="فروش"
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
            <Field label="علت ورود">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="چرا وارد این معامله شدی؟"
                rows={3}
                className={inputClass + " resize-none leading-7"}
              />
            </Field>
          </div>

          <Field label="نتیجه مالی">
            <div className="relative">
              <DollarSign
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <input
                type="number"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="+150 یا -80"
                dir="ltr"
                step="any"
                className={inputClass + " pl-11"}
              />
            </div>
          </Field>

          <Field label="امتیاز اجرای پلن">
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
          <div className="mt-5 rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)] px-4 py-3 text-xs text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          >
            <Plus size={17} />
            ثبت معامله
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
      <label className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
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
        "flex w-full items-center justify-between px-4 py-3 text-right text-sm",
        active
          ? "bg-[var(--color-primary-soft)] text-white"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
      ].join(" ")}
    >
      {label}
      {active && (
        <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
      )}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]";
