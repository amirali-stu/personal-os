import Dexie, { type Table } from "dexie";

export type MarketHistoryPoint = {
  id?: number;
  marketId: string;
  price: number;
  timestamp: number;
};

class MarketHistoryDatabase extends Dexie {
  history!: Table<MarketHistoryPoint, number>;

  constructor() {
    super("personal-os-market-history");

    this.version(1).stores({
      history: "++id, marketId, timestamp",
    });
  }
}

export const marketHistoryDb = new MarketHistoryDatabase();
