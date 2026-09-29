import Dexie, { type Table } from "dexie";
import type { Trade } from "../types";

export interface PlanItem {
  id: string;
  text: string;
  checked: boolean;
  type: "checkbox";
}

export interface PlanGroup {
  title: string;
  items: string[];
}

export interface PlanSection {
  id: string;
  title: string;
  type: "checklist" | "mapping" | "images";
  items: PlanItem[];
  collapsed?: boolean;
  images?: (string | null)[];
  groups?: PlanGroup[];
}

export interface TradingPlanRecord {
  id?: number;
  sections: PlanSection[];
  updatedAt: number;
}

class TradingDatabase extends Dexie {
  trades!: Table<Trade, number>;
  plan!: Table<TradingPlanRecord, number>;

  constructor() {
    super("personal-os");

    this.version(1).stores({
      trades: "++id, date, createdAt",
    });

    this.version(2).stores({
      trades: "++id, date, createdAt",
      plan: "++id, updatedAt",
    });
  }
}

export const tradingDb = new TradingDatabase();
  