import Dexie, { type Table } from "dexie";

export type SetupRecord = {
  id?: number;
  title: string;
  order: number;
  conditions: string;
  diagram: string | null;
  exampleImages: (string | null)[];
  createdAt: number;
  updatedAt: number;
};

class SetupsDatabase extends Dexie {
  setups!: Table<SetupRecord, number>;

  constructor() {
    super("personal-os-setups");

    this.version(1).stores({
      setups: "++id, order, createdAt, updatedAt",
    });
  }
}

export const setupsDb = new SetupsDatabase();
