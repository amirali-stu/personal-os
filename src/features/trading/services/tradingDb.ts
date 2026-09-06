import Dexie, { type Table } from "dexie";
import type { Trade } from "../types";

class TradingDatabase extends Dexie {
  trades!: Table<Trade, number>;

  constructor() {
    super("personal-os");

    this.version(1).stores({
      trades: "++id, date, createdAt",
    });
  }
}

export const tradingDb = new TradingDatabase();
