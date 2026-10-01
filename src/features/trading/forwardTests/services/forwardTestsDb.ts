import Dexie, { type Table } from "dexie";
import type {
  Markup,
  KeyLesson,
  YearTemplate,
  Month,
  Week,
  Day,
  Section,
} from "../types";

class ForwardTestsDatabase extends Dexie {
  markups!: Table<Markup, number>;
  keyLessons!: Table<KeyLesson, number>;
  years!: Table<YearTemplate, number>;
  months!: Table<Month, number>;
  weeks!: Table<Week, number>;
  days!: Table<Day, number>;
  sections!: Table<Section, number>;

  constructor() {
    super("personal-os-forward-tests");

    this.version(1).stores({
      markups: "++id, order, createdAt, updatedAt",
      keyLessons: "++id, markupId, order, createdAt, updatedAt",
      years: "++id, markupId, order, createdAt, updatedAt",
      months: "++id, yearId, order, createdAt, updatedAt",
      weeks: "++id, monthId, order, createdAt, updatedAt",
      days: "++id, weekId, dayKey, order, createdAt, updatedAt",
      sections: "++id, dayId, order, sectionKey, createdAt, updatedAt",
    });
  }
}

export const forwardTestsDb = new ForwardTestsDatabase();
