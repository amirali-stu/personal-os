import { TradingHeader } from "./components/TradingHeader";
import { TradingStats } from "./components/TradingStats";
import { DailyLimit } from "./components/DailyLimit";
import { TradeForm } from "./components/TradeForm";
import { TradeTable } from "./components/TradeTable";
import { WeekendState } from "./components/WeekendState";
import { useTrades } from "./hooks/useTrades";

import { useSettingsStore } from "../../app/store/settingsStore";
import { formatFullDate } from "../../lib/dateUtils";

export function TradingPage() {
  const {
    trades,
    todayTrades,
    addTrade,
    deleteTrade,
    totalResult,
    successfulTrades,
    failedTrades,
    loading,
  } = useTrades();

  const tradeLimit = useSettingsStore((state) => state.tradeLimit);

  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const timezone = useSettingsStore((state) => state.timezone);

  const limitReached = todayTrades.length >= tradeLimit;

  const currentDate = new Date();

  const dayName = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: timezone === "utc" ? "UTC" : undefined,
  }).format(currentDate);

  const isWeekend = dayName === "Sat" || dayName === "Sun";

  const formattedDate = formatFullDate(currentDate, dateFormat, timezone);

  return (
    <div className="space-y-6">
      <TradingHeader />

      <div className="text-xs text-[var(--color-text-muted)]">
        {formattedDate}
      </div>

      <TradingStats
        todayCount={todayTrades.length}
        totalResult={totalResult}
        successfulTrades={successfulTrades}
        failedTrades={failedTrades}
        tradeLimit={tradeLimit}
      />

      <DailyLimit count={todayTrades.length} limit={tradeLimit} />

      {isWeekend ? (
        <WeekendState />
      ) : limitReached ? (
        <DailyLimit count={tradeLimit} limit={tradeLimit} />
      ) : (
        <TradeForm onSubmit={addTrade} />
      )}

      <TradeTable trades={trades} loading={loading} onDelete={deleteTrade} />
    </div>
  );
}
