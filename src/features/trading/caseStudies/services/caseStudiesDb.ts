import Dexie, { type Table } from "dexie";
import type { CaseStudy, CaseStudiesMeta, CaseBoard } from "../types";

class CaseStudiesDatabase extends Dexie {
  boards!: Table<CaseBoard, number>;
  cases!: Table<CaseStudy, number>;
  meta!: Table<CaseStudiesMeta, number>;

  constructor() {
    super("personal-os-case-studies");

    this.version(1).stores({
      cases:
        "++id, tradeNumber, pairId, openedAt, createdAt, updatedAt, status, session",
      meta: "++id, updatedAt",
    });

    this.version(2)
      .stores({
        boards: "++id, order, createdAt, updatedAt",
        cases:
          "++id, boardId, tradeNumber, pairId, openedAt, createdAt, updatedAt, status, session",
        meta: "++id, boardId, updatedAt",
      })
      .upgrade(async (tx) => {
        const boards = tx.table("boards");
        const cases = tx.table("cases");
        const meta = tx.table("meta");

        const existingBoards = await boards.count();
        if (existingBoards === 0) {
          const now = Date.now();
          const boardId = await boards.add({
            title: "موارد بررسی‌شده - ۱",
            order: 0,
            createdAt: now,
            updatedAt: now,
          });
          const allCases = await cases.toArray();
          for (const c of allCases) {
            if (c.id != null) {
              await cases.update(c.id, { boardId });
            }
          }
          const allMeta = await meta.toArray();
          for (const m of allMeta) {
            if (m.id != null) {
              await meta.update(m.id, { boardId });
            }
          }
        }
      });
  }
}

export const caseStudiesDb = new CaseStudiesDatabase();
  