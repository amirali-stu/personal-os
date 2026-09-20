// MarketsPage.tsx
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../app/store/settingsStore";
import { MarketsHeader } from "./components/MarketsHeader";
import { MarketOverview } from "./components/MarketOverview";
import { MarketTable } from "./components/MarketTable";
import { MarketChart } from "./components/MarketChart";
import { useMarketData } from "./hooks/useMarketData";

export function MarketsPage() {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);

  const { markets, isOnline, isLoading, error, refresh } = useMarketData();

  const isRtl = language === "fa";

  const marketError = error
    ? t("markets.error", {
        defaultValue: isRtl
          ? "خطا در دریافت اطلاعات بازار."
          : "Failed to load market data.",
      })
    : null;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <MarketsHeader isOnline={isOnline} />

        <button
          type="button"
          onClick={() => refresh()}
          disabled={isLoading}
          className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[10px] font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />

          {t("markets.refresh", {
            defaultValue: isRtl ? "بروزرسانی" : "Refresh",
          })}
        </button>
      </div>

      {marketError && (
        <div className="rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.06)] px-4 py-3 text-start text-[11px] text-[var(--color-danger)]">
          {marketError}
        </div>
      )}

      {isLoading && markets.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          ))}
        </div>
      ) : markets.length > 0 ? (
        <>
          <MarketOverview markets={markets} />

          <div className="grid gap-4 xl:grid-cols-2">
            {markets.map((market, index) => (
              <div
                key={market.id}
                className={index === markets.length - 1 ? "xl:col-span-2" : ""}
              >
                <MarketChart market={market} />
              </div>
            ))}
          </div>

          <MarketTable markets={markets} />
        </>
      ) : (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-center">
            <p className="text-sm font-bold text-white">
              {t("markets.unavailableTitle", {
                defaultValue: isRtl
                  ? "اطلاعات بازار در دسترس نیست"
                  : "Market data is unavailable",
              })}
            </p>

            <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
              {t("markets.unavailableDescription", {
                defaultValue: isRtl
                  ? "اتصال به سرویس بازار را بررسی کن و دوباره تلاش کن."
                  : "Check the market service connection and try again.",
              })}
            </p>

            <button
              type="button"
              onClick={() => refresh()}
              className="mt-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-[10px] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              {t("markets.retry", {
                defaultValue: isRtl ? "تلاش مجدد" : "Retry",
              })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
