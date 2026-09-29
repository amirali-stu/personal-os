import { useCallback, useEffect, useState } from "react";
import { setupsDb, type SetupRecord } from "../services/setupsDb";
import { createDefaultSetups } from "../data/defaultSetups";

export function useSetups() {
  const [setups, setSetups] = useState<SetupRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const all = await setupsDb.setups.orderBy("order").toArray();
    setSetups(all);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const count = await setupsDb.setups.count();
        if (count === 0) {
          await setupsDb.setups.bulkAdd(createDefaultSetups());
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

  const getSetup = useCallback(async (id: number) => {
    return setupsDb.setups.get(id);
  }, []);

  const addSetup = useCallback(
    async (title: string) => {
      const maxOrder = setups.reduce((m, s) => Math.max(m, s.order), 0);
      const now = Date.now();
      const id = await setupsDb.setups.add({
        title: title.trim() || `مدل ورود ${maxOrder + 1}`,
        order: maxOrder + 1,
        conditions:
          "از قسمت تریدینگ پلن اینجا کپی کنید.\n\nشرایط استراتژی این مدل ورود را اینجا بنویسید.",
        diagram: null,
        exampleImages: [null, null, null, null, null, null],
        createdAt: now,
        updatedAt: now,
      });
      await reload();
      return id;
    },
    [setups, reload],
  );

  const updateSetup = useCallback(
    async (id: number, patch: Partial<SetupRecord>) => {
      await setupsDb.setups.update(id, {
        ...patch,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const deleteSetup = useCallback(
    async (id: number) => {
      await setupsDb.setups.delete(id);
      await reload();
    },
    [reload],
  );

  return {
    setups,
    loading,
    getSetup,
    addSetup,
    updateSetup,
    deleteSetup,
    reload,
  };
}
