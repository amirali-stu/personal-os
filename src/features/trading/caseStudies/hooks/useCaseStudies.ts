import { useCallback, useEffect, useState } from "react";
import { caseStudiesDb } from "../services/caseStudiesDb";
import {
  createDefaultColumns,
  createDefaultOptionLists,
} from "../data/defaults";
import type {
  CaseStudy,
  CaseStudiesMeta,
  ColumnDef,
  OptionItem,
  OptionLists,
  CaseImage,
} from "../types";
import { computeSession, computeStatus } from "../types";

function emptyCase(boardId: number, tradeNumber: number): CaseStudy {
  const now = Date.now();
  return {
    boardId,
    tradeNumber,
    pairId: null,
    setupId: null,
    positionSize: null,
    rValue: null,
    status: null,
    positionId: null,
    openedAt: null,
    closedAt: null,
    session: null,
    confluenceIds: [],
    trendIds: [],
    minSlPips: null,
    notes: "",
    images: [],
    customFields: {},
    createdAt: now,
    updatedAt: now,
  };
}

export function useCaseStudies(boardId: number | null) {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [meta, setMeta] = useState<CaseStudiesMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (boardId == null) {
      setCases([]);
      setMeta(null);
      return;
    }
    const [allCases, allMeta] = await Promise.all([
      caseStudiesDb.cases
        .where("boardId")
        .equals(boardId)
        .sortBy("tradeNumber"),
      caseStudiesDb.meta.where("boardId").equals(boardId).toArray(),
    ]);
    setCases(allCases);
    setMeta(allMeta[0] ?? null);
  }, [boardId]);

  useEffect(() => {
    if (boardId == null) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        let metaRows = await caseStudiesDb.meta
          .where("boardId")
          .equals(boardId!)
          .toArray();

        if (metaRows.length === 0) {
          await caseStudiesDb.meta.add({
            boardId: boardId!,
            columns: createDefaultColumns(),
            optionLists: createDefaultOptionLists(),
            updatedAt: Date.now(),
          });
        } else {
          const defaults = createDefaultColumns();
          const current = metaRows[0];
          if (current?.id) {
            const byKey = new Map(defaults.map((c) => [c.key, c]));
            let changed = false;
            const cols = current.columns.map((c) => {
              const d = byKey.get(c.key);
              if (!d) return c;
              if (c.title !== d.title || c.titleEn !== d.titleEn) {
                changed = true;
                return { ...c, title: d.title, titleEn: d.titleEn };
              }
              return c;
            });
            if (changed) {
              await caseStudiesDb.meta.update(current.id, {
                columns: cols,
                updatedAt: Date.now(),
              });
            }
          }
        }

        const caseCount = await caseStudiesDb.cases
          .where("boardId")
          .equals(boardId!)
          .count();
        if (caseCount === 0) {
          await caseStudiesDb.cases.add(emptyCase(boardId!, 1));
        }

        if (cancelled) return;
        await reload();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    load();
    return () => {
      cancelled = true;
    };
  }, [boardId, reload]);

  const columns = meta?.columns ?? createDefaultColumns();
  const optionLists = meta?.optionLists ?? createDefaultOptionLists();

  const persistMeta = useCallback(
    async (patch: Partial<CaseStudiesMeta>) => {
      if (boardId == null) return;
      const current = (
        await caseStudiesDb.meta.where("boardId").equals(boardId).toArray()
      )[0];
      if (!current?.id) return;
      await caseStudiesDb.meta.update(current.id, {
        ...patch,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [boardId, reload],
  );

  const addCase = useCallback(async () => {
    if (boardId == null) return;
    const maxNum = cases.reduce((m, c) => Math.max(m, c.tradeNumber), 0);
    const id = await caseStudiesDb.cases.add(emptyCase(boardId, maxNum + 1));
    await reload();
    return id;
  }, [boardId, cases, reload]);

  const updateCase = useCallback(
    async (id: number, patch: Partial<CaseStudy>) => {
      const existing = await caseStudiesDb.cases.get(id);
      if (!existing) return;

      const next: Partial<CaseStudy> = { ...patch, updatedAt: Date.now() };
      if ("rValue" in patch) {
        next.status = computeStatus(patch.rValue ?? null);
      }
      if ("openedAt" in patch) {
        next.session = computeSession(patch.openedAt ?? null);
      }

      await caseStudiesDb.cases.update(id, next);
      await reload();
    },
    [reload],
  );

  const deleteCase = useCallback(
    async (id: number) => {
      if (boardId == null) return;

      await caseStudiesDb.cases.delete(id);

      // شماره‌گذاری دوباره از ۱
      const remaining = await caseStudiesDb.cases
        .where("boardId")
        .equals(boardId)
        .sortBy("tradeNumber");

      await Promise.all(
        remaining.map((row, index) => {
          const nextNum = index + 1;
          if (row.id == null || row.tradeNumber === nextNum) return;
          return caseStudiesDb.cases.update(row.id, {
            tradeNumber: nextNum,
            updatedAt: Date.now(),
          });
        }),
      );

      await reload();
    },
    [boardId, reload],
  );

  const updateOptionList = useCallback(
    async (listKey: keyof OptionLists, items: OptionItem[]) => {
      const lists = { ...optionLists, [listKey]: items };
      await persistMeta({ optionLists: lists });
    },
    [optionLists, persistMeta],
  );

  const updateColumns = useCallback(
    async (cols: ColumnDef[]) => {
      await persistMeta({ columns: cols });
    },
    [persistMeta],
  );

  const addCustomColumn = useCallback(
    async (title: string, type: ColumnDef["type"] = "text") => {
      const key = `custom_${Date.now()}`;
      const maxOrder = columns.reduce((m, c) => Math.max(m, c.order), 0);
      const col: ColumnDef = {
        id: `col-${key}`,
        key,
        title: title.trim() || "ستون جدید",
        titleEn: title.trim() || "New column",
        type,
        isDefault: false,
        order: maxOrder + 1,
        width: 150,
      };
      await updateColumns([...columns, col]);
    },
    [columns, updateColumns],
  );

  const setCaseImages = useCallback(
    async (id: number, images: CaseImage[]) => {
      await updateCase(id, { images });
    },
    [updateCase],
  );

  return {
    cases,
    columns,
    optionLists,
    loading,
    addCase,
    updateCase,
    deleteCase,
    updateOptionList,
    updateColumns,
    addCustomColumn,
    setCaseImages,
    reload,
  };
}
