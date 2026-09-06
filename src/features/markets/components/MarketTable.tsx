import type { MarketAsset } from "../types";
import { formatPercent, formatPrice, formatToman } from "../utils";

type Props = {
  markets: MarketAsset[];
};

export function MarketTable({ markets }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-sm font-bold text-white">جزئیات بازار</h2>

        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          قیمت و محدوده نوسان ۲۴ ساعت
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-right">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)]">
              <th className="px-5 py-3 font-medium">بازار</th>
              <th className="px-5 py-3 font-medium">قیمت</th>
              <th className="px-5 py-3 font-medium">تغییر</th>
              <th className="px-5 py-3 font-medium">بالاترین</th>
              <th className="px-5 py-3 font-medium">پایین‌ترین</th>
              <th className="px-5 py-3 font-medium">واحد</th>
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
                  <td className="px-5 py-4">
                    <div dir="ltr" className=" text-xs font-bold text-white">
                      {market.symbol}
                    </div>

                    <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                      {market.name}
                    </div>
                  </td>

                  <td
                    dir="ltr"
                    className="px-5 py-4  text-xs font-bold text-white"
                  >
                    {price}
                  </td>

                  <td
                    dir="ltr"
                    className={[
                      "px-5 py-4  text-xs font-bold",
                      positive
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-danger)]",
                    ].join(" ")}
                  >
                    {formatPercent(market.change24h)}
                  </td>

                  <td
                    dir="ltr"
                    className="px-5 py-4  text-xs text-[var(--color-text-secondary)]"
                  >
                    {high}
                  </td>

                  <td
                    dir="ltr"
                    className="px-5 py-4  text-xs text-[var(--color-text-secondary)]"
                  >
                    {low}
                  </td>

                  <td className="px-5 py-4 text-xs text-[var(--color-text-muted)]">
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
