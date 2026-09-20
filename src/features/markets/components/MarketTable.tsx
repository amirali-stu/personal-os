// components/MarketTable.tsx
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";
import type { MarketAsset } from "../types";
import { formatPercent, formatPrice, formatToman } from "../utils";

type Props = {
  markets: MarketAsset[];
};

export function MarketTable({ markets }: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);

  const isRtl = language === "fa";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4 text-start">
        <h2 className="text-sm font-bold text-white">
          {t("markets.details", {
            defaultValue: isRtl ? "جزئیات بازار" : "Market details",
          })}
        </h2>

        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          {t("markets.detailsDescription", {
            defaultValue: isRtl
              ? "قیمت و محدوده نوسان ۲۴ ساعت"
              : "Price and 24-hour range",
          })}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-start">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)]">
              <th className="px-5 py-3 text-start font-medium">
                {t("markets.market", {
                  defaultValue: isRtl ? "بازار" : "Market",
                })}
              </th>

              <th className="px-5 py-3 text-start font-medium">
                {t("markets.price", {
                  defaultValue: isRtl ? "قیمت" : "Price",
                })}
              </th>

              <th className="px-5 py-3 text-start font-medium">
                {t("markets.change", {
                  defaultValue: isRtl ? "تغییر" : "Change",
                })}
              </th>

              <th className="px-5 py-3 text-start font-medium">
                {t("markets.high", {
                  defaultValue: isRtl ? "بالاترین" : "High",
                })}
              </th>

              <th className="px-5 py-3 text-start font-medium">
                {t("markets.low", {
                  defaultValue: isRtl ? "پایین‌ترین" : "Low",
                })}
              </th>

              <th className="px-5 py-3 text-start font-medium">
                {t("markets.unit", {
                  defaultValue: isRtl ? "واحد" : "Unit",
                })}
              </th>
            </tr>
          </thead>

          <tbody>
            {markets.map((market) => {
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
                <tr
                  key={market.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)]"
                >
                  <td className="px-5 py-4 text-start">
                    <div className="text-xs font-bold text-white" dir="ltr">
                      {market.symbol}
                    </div>

                    <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                      {market.name}
                    </div>
                  </td>

                  <td
                    dir="ltr"
                    className="px-5 py-4 text-start text-xs font-bold text-white"
                  >
                    {price}
                  </td>

                  <td
                    dir="ltr"
                    className={[
                      "px-5 py-4 text-start text-xs font-bold",
                      positive
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-danger)]",
                    ].join(" ")}
                  >
                    {formatPercent(market.change24h)}
                  </td>

                  <td
                    dir="ltr"
                    className="px-5 py-4 text-start text-xs text-[var(--color-text-secondary)]"
                  >
                    {high}
                  </td>

                  <td
                    dir="ltr"
                    className="px-5 py-4 text-start text-xs text-[var(--color-text-secondary)]"
                  >
                    {low}
                  </td>

                  <td className="px-5 py-4 text-start text-xs text-[var(--color-text-muted)]">
                    {market.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
