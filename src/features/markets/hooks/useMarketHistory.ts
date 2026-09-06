import { useCallback, useEffect, useState } from "react";

import {
  marketHistoryDb,
  type MarketHistoryPoint,
} from "../services/marketHistoryDb";

const MAX_POINTS = 500;

export function useMarketHistory(marketId: string | null) {
  const [history, setHistory] = useState<MarketHistoryPoint[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!marketId) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await marketHistoryDb.history
        .where("marketId")
        .equals(marketId)
        .sortBy("timestamp");

      setHistory(data.slice(-MAX_POINTS));
    } finally {
      setIsLoading(false);
    }
  }, [marketId]);

  const savePoint = useCallback(
    async (point: Omit<MarketHistoryPoint, "id">) => {
      await marketHistoryDb.history.add(point);

      await loadHistory();
    },
    [loadHistory],
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    savePoint,
    reload: loadHistory,
  };
}
