import { ArrowDown, ArrowUp, Circle } from "lucide-react";
import type { MarketAsset } from "../types";
import { formatPercent, formatPrice, formatToman } from "../utils";

type Props = {
  market: MarketAsset;
};

function formatUpdatedAt(timestamp: number) {
  if (!timestamp) {
    return "--";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

export function MarketCard({ market }: Props) {
  const positive = market.change24h >= 0;

  const price =
    market.type === "forex"
      ? formatPrice(market.price, 4)
      : formatToman(market.price);

  const high =
    market.type === "forex"
      ? formatPrice(market.high24h, 4)
      : formatToman(market.high24h);

  const low =
    market.type === "forex"
      ? formatPrice(market.low24h, 4)
      : formatToman(market.low24h);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-border-hover)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div dir="ltr" className="text-sm font-bold text-[var(--color-text)]">
            {market.symbol}
          </div>

          <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">
            {market.name}
          </div>
        </div>

        <div
          className={[
            "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold",
            positive
              ? "bg-[rgba(34,197,94,0.1)] text-[var(--color-success)]"
              : "bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)]",
          ].join(" ")}
        >
          {positive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}

          {formatPercent(market.change24h)}
        </div>
      </div>

      {/* Price */}
      <div dir="ltr" className="mt-6 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          {market.type === "forex" ? "$" : "تومان "}
          {price}
        </span>

        <span className="flex items-center gap-1 text-[9px] text-[var(--color-success)]">
          <Circle size={6} fill="currentColor" />
          Live
        </span>
      </div>

      <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">
        {market.unit}
      </div>

      {/* High / Low */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-4">
        <div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            بالاترین ۲۴ ساعت
          </div>

          <div
            dir="ltr"
            className="mt-1 text-xs text-[var(--color-text-secondary)]"
          >
            {high}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            پایین‌ترین ۲۴ ساعت
          </div>

          <div
            dir="ltr"
            className="mt-1 text-xs text-[var(--color-text-secondary)]"
          >
            {low}
          </div>
        </div>
      </div>

      {/* Update time */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
        <span className="text-[9px] text-[var(--color-text-muted)]">
          آخرین بروزرسانی
        </span>

        <span
          dir="ltr"
          className="text-[9px] text-[var(--color-text-muted)]"
        >
          {formatUpdatedAt(market.updatedAt)}
        </span>
      </div>
    </div>
  );
}
