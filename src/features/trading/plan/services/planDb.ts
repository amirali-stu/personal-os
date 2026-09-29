import Dexie, { type Table } from "dexie";

export type PlanItemType = "checkbox" | "readonly";

export type PlanItem = {
  id: string;
  text: string;
  checked: boolean;
  type: PlanItemType;
};

export type PlanSection = {
  id: string;
  title: string;
  type: "checklist" | "mapping" | "images";
  items: PlanItem[];
  groups?: { title: string; items: string[] }[];
  images?: (string | null)[];
  collapsed?: boolean;
};

export type TradingPlanRecord = {
  id: number;
  sections: PlanSection[];
  updatedAt: number;
};

class PlanDatabase extends Dexie {
  plan!: Table<TradingPlanRecord, number>;

  constructor() {
    super("personal-os-trading-plan");

    this.version(1).stores({
      plan: "++id, updatedAt",
    });
  }
}

export const planDb = new PlanDatabase();
