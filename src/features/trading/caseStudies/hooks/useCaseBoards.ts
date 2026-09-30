import { useCallback, useEffect, useState } from "react";
import { caseStudiesDb } from "../services/caseStudiesDb";
import {
  createDefaultColumns,
  createDefaultOptionLists,
} from "../data/defaults";
import type { CaseBoard } from "../types";

export function useCaseBoards() {
  const [boards, setBoards] = useState<CaseBoard[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const all = await caseStudiesDb.boards.orderBy("order").toArray();
    setBoards(all);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const count = await caseStudiesDb.boards.count();
        if (count === 0) {
          const now = Date.now();
          const boardId = await caseStudiesDb.boards.add({
            title: "موارد بررسی‌شده - ۱",
            order: 0,
            createdAt: now,
            updatedAt: now,
          });
          await caseStudiesDb.meta.add({
            boardId: boardId as number,
            columns: createDefaultColumns(),
            optionLists: createDefaultOptionLists(),
            updatedAt: now,
          });
        }
        if (cancelled) return;
        await reload();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const addBoard = useCallback(
    async (title?: string) => {
      const maxOrder = boards.reduce((m, b) => Math.max(m, b.order), -1);
      const n = maxOrder + 2;
      const now = Date.now();
      const id = await caseStudiesDb.boards.add({
        title: (title ?? "").trim() || `موارد بررسی‌شده - ${n}`,
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now,
      });
      await caseStudiesDb.meta.add({
        boardId: id as number,
        columns: createDefaultColumns(),
        optionLists: createDefaultOptionLists(),
        updatedAt: now,
      });
      await reload();
      return id;
    },
    [boards, reload],
  );

  const updateBoard = useCallback(
    async (id: number, patch: Partial<CaseBoard>) => {
      await caseStudiesDb.boards.update(id, {
        ...patch,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const deleteBoard = useCallback(
    async (id: number) => {
      await caseStudiesDb.cases.where("boardId").equals(id).delete();
      await caseStudiesDb.meta.where("boardId").equals(id).delete();
      await caseStudiesDb.boards.delete(id);
      await reload();
    },
    [reload],
  );

  return {
    boards,
    loading,
    addBoard,
    updateBoard,
    deleteBoard,
    reload,
  };
}
