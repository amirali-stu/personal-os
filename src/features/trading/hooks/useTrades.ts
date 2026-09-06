import { useEffect, useMemo, useState } from "react";
import { tradingDb } from "../services/tradingDb";
import type { Trade, TradeSide } from "../types";
import { useSettingsStore } from "../../../app/store/settingsStore";
import { getTodayDate } from "../../../lib/dateUtils";

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const timezone = useSettingsStore((state) => state.timezone);

  const today = getTodayDate(timezone);

  const todayTrades = useMemo(
    () => trades.filter((trade) => trade.date === today),
    [trades, today],
  );

  const totalResult = useMemo(
    () => trades.reduce((sum, trade) => sum + trade.result, 0),
    [trades],
  );

  const successfulTrades = useMemo(
    () => trades.filter((trade) => trade.result > 0).length,
    [trades],
  );

  const failedTrades = useMemo(
    () => trades.filter((trade) => trade.result < 0).length,
    [trades],
  );

  useEffect(() => {
    async function load() {
      try {
        const data = await tradingDb.trades
          .orderBy("createdAt")
          .reverse()
          .toArray();

        setTrades(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function addTrade(data: {
    symbol: string;
    reason: string;
    side: TradeSide;
    result: number;
    score: number;
  }) {
    const trade: Trade = {
      ...data,
      date: today,
      createdAt: Date.now(),
    };

    const id = await tradingDb.trades.add(trade);

    setTrades((current) => [
      {
        ...trade,
        id,
      },
      ...current,
    ]);
  }

  async function deleteTrade(id: number) {
    await tradingDb.trades.delete(id);

    setTrades((current) => current.filter((trade) => trade.id !== id));
  }

  return {
    trades,
    todayTrades,
    totalResult,
    successfulTrades,
    failedTrades,
    loading,
    addTrade,
    deleteTrade,
  };
}
