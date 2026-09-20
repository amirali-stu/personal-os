import { useCallback, useEffect, useRef, useState } from "react";

import type { MarketAsset } from "../types";
import { marketHistoryDb } from "../services/marketHistoryDb";

const MARKET_API_URL = "http://localhost:3001/api/markets";

const REFRESH_INTERVAL = 5 * 60_000;

type MarketResponse = {
  assets: MarketAsset[];
  updatedAt: number;
};

export function useMarketData() {
  const [markets, setMarkets] = useState<MarketAsset[]>([]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const loadCachedMarkets = useCallback(async () => {
    try {
      const cached = await marketHistoryDb.history
        .orderBy("timestamp")
        .reverse()
        .toArray();

      if (!cached.length) {
        return;
      }

      const latestByMarket = new Map<string, (typeof cached)[number]>();

      for (const point of cached) {
        if (!latestByMarket.has(point.marketId)) {
          latestByMarket.set(point.marketId, point);
        }
      }

      const cachedMarkets: MarketAsset[] = Array.from(
        latestByMarket.values(),
      ).map((point) => ({
        id: point.marketId,
        symbol:
          point.marketId === "eur-usd"
            ? "EUR/USD"
            : point.marketId === "gold-18"
              ? "GOLD 18K"
              : "USD/IRR",
        name:
          point.marketId === "eur-usd"
            ? "یورو / دلار"
            : point.marketId === "gold-18"
              ? "طلای ۱۸ عیار"
              : "دلار آزاد",
        type:
          point.marketId === "eur-usd"
            ? "forex"
            : point.marketId === "gold-18"
              ? "gold"
              : "currency",
        price: point.price,
        change24h: 0,
        high24h: point.price,
        low24h: point.price,
        unit:
          point.marketId === "eur-usd"
            ? "دلار"
            : point.marketId === "gold-18"
              ? "تومان / گرم"
              : "تومان",
        updatedAt: point.timestamp,
      }));

      if (isMountedRef.current && cachedMarkets.length) {
        setMarkets(cachedMarkets);
      }
    } catch (error) {
      console.error("Cached market data error:", error);
    }
  }, []);

  const saveMarketHistory = useCallback(async (assets: MarketAsset[]) => {
    try {
      const now = Date.now();

      await marketHistoryDb.history.bulkAdd(
        assets.map((asset) => ({
          marketId: asset.id,
          price: asset.price,
          timestamp: asset.updatedAt || now,
        })),
      );
    } catch (error) {
      console.error("Market history save error:", error);
    }
  }, []);

  const fetchMarkets = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      setError("اتصال اینترنت برقرار نیست.");
      setIsLoading(false);

      await loadCachedMarkets();

      return;
    }

    setIsOnline(true);

    try {
      setError(null);

      const response = await fetch(MARKET_API_URL, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Market API Error: ${response.status}`);
      }

      const data = (await response.json()) as MarketResponse;

      if (!Array.isArray(data.assets)) {
        throw new Error("داده دریافتی بازار معتبر نیست.");
      }

      if (!isMountedRef.current) {
        return;
      }

      setMarkets(data.assets);

      await saveMarketHistory(data.assets);
    } catch (error) {
      console.error("Market data error:", error);

      if (!isMountedRef.current) {
        return;
      }

      setError("دریافت اطلاعات بازار ناموفق بود.");

      await loadCachedMarkets();
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [loadCachedMarkets, saveMarketHistory]);

  useEffect(() => {
    isMountedRef.current = true;

    function handleOnline() {
      setIsOnline(true);
      fetchMarkets();
    }

    function handleOffline() {
      setIsOnline(false);
      loadCachedMarkets();
    }

    window.addEventListener("online", handleOnline);

    window.addEventListener("offline", handleOffline);

    /*
     * ابتدا Cache را می‌خوانیم.
     * بعد اگر آنلاین بودیم، داده واقعی را می‌گیریم.
     */
    loadCachedMarkets().finally(() => {
      fetchMarkets();
    });

    const intervalId = window.setInterval(() => {
      fetchMarkets();
    }, REFRESH_INTERVAL);

    return () => {
      isMountedRef.current = false;

      window.removeEventListener("online", handleOnline);

      window.removeEventListener("offline", handleOffline);

      window.clearInterval(intervalId);
    };
  }, [fetchMarkets, loadCachedMarkets]);

  return {
    markets,
    isOnline,
    isLoading,
    error,
    refresh: fetchMarkets,
  };
}
