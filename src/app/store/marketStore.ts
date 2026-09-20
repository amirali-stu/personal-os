import { create } from "zustand";

import type { MarketAsset } from "../../features/markets/types";

type MarketStore = {
  assets: MarketAsset[];
  isOnline: boolean;
  isLoading: boolean;
  lastSyncAt: number | null;

  setAssets: (assets: MarketAsset[]) => void;
  setOnline: (isOnline: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setLastSyncAt: (timestamp: number) => void;
};

export const useMarketStore = create<MarketStore>((set) => ({
  assets: [],
  isOnline: navigator.onLine,
  isLoading: false,
  lastSyncAt: null,

  setAssets: (assets) => {
    set({
      assets,
      lastSyncAt: Date.now(),
    });
  },

  setOnline: (isOnline) => {
    set({
      isOnline,
    });
  },

  setLoading: (isLoading) => {
    set({
      isLoading,
    });
  },

  setLastSyncAt: (timestamp) => {
    set({
      lastSyncAt: timestamp,
    });
  },
}));
