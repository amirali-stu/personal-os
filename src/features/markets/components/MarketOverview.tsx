import type { MarketAsset } from "../types";
import { MarketCard } from "./MarketCard";

type Props = {
  markets: MarketAsset[];
  isLoading?: boolean;
};

function MarketCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-[var(--color-surface-hover)]" />
          <div className="h-3 w-20 rounded bg-[var(--color-surface-hover)]" />
        </div>

        <div className="h-6 w-14 rounded-lg bg-[var(--color-surface-hover)]" />
      </div>

      <div className="mt-6 h-8 w-36 rounded bg-[var(--color-surface-hover)]" />

      <div className="mt-2 h-3 w-24 rounded bg-[var(--color-surface-hover)]" />

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-4">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-[var(--color-surface-hover)]" />
          <div className="h-4 w-24 rounded bg-[var(--color-surface-hover)]" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-[var(--color-surface-hover)]" />
          <div className="h-4 w-24 rounded bg-[var(--color-surface-hover)]" />
        </div>
      </div>
    </div>
  );
}

export function MarketOverview({ markets, isLoading = false }: Props) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white">بازارهای اصلی</h2>

        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          مهم‌ترین قیمت‌های مورد استفاده شما
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading && markets.length === 0 ? (
          <>
            <MarketCardSkeleton />
            <MarketCardSkeleton />
            <MarketCardSkeleton />
          </>
        ) : (
          markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))
        )}
      </div>
    </section>
  );
}
