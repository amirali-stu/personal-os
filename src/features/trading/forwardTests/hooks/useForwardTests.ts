import { useCallback, useEffect, useState } from "react";
import { forwardTestsDb } from "../services/forwardTestsDb";
import type {
  Markup,
  KeyLesson,
  YearTemplate,
  Month,
  Week,
  Day,
  Section,
  CalendarType,
  SectionImage,
} from "../types";
import {
  GREGORIAN_MONTHS,
  JALALI_MONTHS,
  DEFAULT_SECTION_DEFS,
  TRADING_DAYS,
} from "../types";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useMarkups() {
  const [markups, setMarkups] = useState<Markup[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const all = await forwardTestsDb.markups.orderBy("order").toArray();
    setMarkups(all);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const addMarkup = useCallback(
    async (title?: string) => {
      const maxOrder = markups.reduce((m, x) => Math.max(m, x.order), -1);
      const now = Date.now();
      const id = await forwardTestsDb.markups.add({
        title: title?.trim() || `Markup ${maxOrder + 2}`,
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now,
      });
      await reload();
      return id;
    },
    [markups, reload],
  );

  const updateMarkup = useCallback(
    async (id: number, patch: Partial<Markup>) => {
      await forwardTestsDb.markups.update(id, {
        ...patch,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const deleteMarkup = useCallback(
    async (id: number) => {
      const years = await forwardTestsDb.years
        .where("markupId")
        .equals(id)
        .toArray();
      for (const y of years) {
        if (y.id == null) continue;
        const months = await forwardTestsDb.months
          .where("yearId")
          .equals(y.id)
          .toArray();
        for (const mo of months) {
          if (mo.id == null) continue;
          const weeks = await forwardTestsDb.weeks
            .where("monthId")
            .equals(mo.id)
            .toArray();
          for (const w of weeks) {
            if (w.id == null) continue;
            const days = await forwardTestsDb.days
              .where("weekId")
              .equals(w.id)
              .toArray();
            for (const d of days) {
              if (d.id == null) continue;
              await forwardTestsDb.sections
                .where("dayId")
                .equals(d.id)
                .delete();
            }
            await forwardTestsDb.days.where("weekId").equals(w.id).delete();
          }
          await forwardTestsDb.weeks.where("monthId").equals(mo.id).delete();
        }
        await forwardTestsDb.months.where("yearId").equals(y.id).delete();
      }
      await forwardTestsDb.years.where("markupId").equals(id).delete();
      await forwardTestsDb.keyLessons.where("markupId").equals(id).delete();
      await forwardTestsDb.markups.delete(id);
      await reload();
    },
    [reload],
  );

  const reorderMarkups = useCallback(
    async (orderedIds: number[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          forwardTestsDb.markups.update(id, { order: index }),
        ),
      );
      await reload();
    },
    [reload],
  );

  return {
    markups,
    loading,
    addMarkup,
    updateMarkup,
    deleteMarkup,
    reorderMarkups,
    reload,
  };
}

export function useMarkupDetail(markupId: number | null) {
  const [markup, setMarkup] = useState<Markup | null>(null);
  const [years, setYears] = useState<YearTemplate[]>([]);
  const [monthsByYear, setMonthsByYear] = useState<Record<number, Month[]>>({});
  const [weeksByMonth, setWeeksByMonth] = useState<Record<number, Week[]>>({});
  const [keyLessons, setKeyLessons] = useState<KeyLesson[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (markupId == null) return;
    const m = (await forwardTestsDb.markups.get(markupId)) ?? null;
    setMarkup(m);
    const ys = await forwardTestsDb.years
      .where("markupId")
      .equals(markupId)
      .sortBy("order");
    setYears(ys);

    const monthsMap: Record<number, Month[]> = {};
    const weeksMap: Record<number, Week[]> = {};
    for (const y of ys) {
      if (y.id == null) continue;
      const months = await forwardTestsDb.months
        .where("yearId")
        .equals(y.id)
        .sortBy("order");
      monthsMap[y.id] = months;
      for (const mo of months) {
        if (mo.id == null) continue;
        weeksMap[mo.id] = await forwardTestsDb.weeks
          .where("monthId")
          .equals(mo.id)
          .sortBy("order");
      }
    }
    setMonthsByYear(monthsMap);
    setWeeksByMonth(weeksMap);

    const lessons = await forwardTestsDb.keyLessons
      .where("markupId")
      .equals(markupId)
      .sortBy("order");
    setKeyLessons(lessons);
  }, [markupId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const createYearTemplate = useCallback(
    async (name: string, calendarType: CalendarType) => {
      if (markupId == null) return;
      const maxOrder = years.reduce((m, x) => Math.max(m, x.order), -1);
      const now = Date.now();
      const yearId = await forwardTestsDb.years.add({
        markupId,
        name: name.trim(),
        calendarType,
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now,
      });

      const monthNames =
        calendarType === "jalali" ? [...JALALI_MONTHS] : [...GREGORIAN_MONTHS];

      for (let i = 0; i < monthNames.length; i++) {
        const monthId = await forwardTestsDb.months.add({
          yearId,
          name: monthNames[i],
          order: i,
          createdAt: now,
          updatedAt: now,
        });
        for (let w = 0; w < 4; w++) {
          await forwardTestsDb.weeks.add({
            monthId,
            name: calendarType === "jalali" ? `هفته ${w + 1}` : `Week ${w + 1}`,
            order: w,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
      await reload();
      return yearId;
    },
    [markupId, years, reload],
  );

  const updateYear = useCallback(
    async (id: number, patch: Partial<YearTemplate>) => {
      await forwardTestsDb.years.update(id, {
        ...patch,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const deleteYear = useCallback(
    async (id: number) => {
      const months = await forwardTestsDb.months
        .where("yearId")
        .equals(id)
        .toArray();
      for (const mo of months) {
        if (mo.id == null) continue;
        const weeks = await forwardTestsDb.weeks
          .where("monthId")
          .equals(mo.id)
          .toArray();
        for (const w of weeks) {
          if (w.id == null) continue;
          const days = await forwardTestsDb.days
            .where("weekId")
            .equals(w.id)
            .toArray();
          for (const d of days) {
            if (d.id == null) continue;
            await forwardTestsDb.sections.where("dayId").equals(d.id).delete();
          }
          await forwardTestsDb.days.where("weekId").equals(w.id).delete();
        }
        await forwardTestsDb.weeks.where("monthId").equals(mo.id).delete();
      }
      await forwardTestsDb.months.where("yearId").equals(id).delete();
      await forwardTestsDb.years.delete(id);
      await reload();
    },
    [reload],
  );

  const updateMonth = useCallback(
    async (id: number, patch: Partial<Month>) => {
      await forwardTestsDb.months.update(id, {
        ...patch,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const deleteMonth = useCallback(
    async (id: number) => {
      const weeks = await forwardTestsDb.weeks
        .where("monthId")
        .equals(id)
        .toArray();
      for (const w of weeks) {
        if (w.id == null) continue;
        const days = await forwardTestsDb.days
          .where("weekId")
          .equals(w.id)
          .toArray();
        for (const d of days) {
          if (d.id == null) continue;
          await forwardTestsDb.sections.where("dayId").equals(d.id).delete();
        }
        await forwardTestsDb.days.where("weekId").equals(w.id).delete();
      }
      await forwardTestsDb.weeks.where("monthId").equals(id).delete();
      await forwardTestsDb.months.delete(id);
      await reload();
    },
    [reload],
  );

  const updateWeek = useCallback(
    async (id: number, patch: Partial<Week>) => {
      await forwardTestsDb.weeks.update(id, {
        ...patch,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const deleteWeek = useCallback(
    async (id: number) => {
      const days = await forwardTestsDb.days
        .where("weekId")
        .equals(id)
        .toArray();
      for (const d of days) {
        if (d.id == null) continue;
        await forwardTestsDb.sections.where("dayId").equals(d.id).delete();
      }
      await forwardTestsDb.days.where("weekId").equals(id).delete();
      await forwardTestsDb.weeks.delete(id);
      await reload();
    },
    [reload],
  );

  const addWeek = useCallback(
    async (monthId: number, name: string) => {
      const existing = weeksByMonth[monthId] ?? [];
      const maxOrder = existing.reduce((m, x) => Math.max(m, x.order), -1);
      const now = Date.now();
      const id = await forwardTestsDb.weeks.add({
        monthId,
        name: name.trim() || `Week ${maxOrder + 2}`,
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now,
      });
      await reload();
      return id;
    },
    [weeksByMonth, reload],
  );

  const reorderWeeks = useCallback(
    async (_monthId: number, orderedIds: number[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          forwardTestsDb.weeks.update(id, { order: index }),
        ),
      );
      await reload();
    },
    [reload],
  );

  const addKeyLesson = useCallback(
    async (text: string) => {
      if (markupId == null) return;
      const maxOrder = keyLessons.reduce((m, x) => Math.max(m, x.order), -1);
      const now = Date.now();
      await forwardTestsDb.keyLessons.add({
        markupId,
        text: text.trim(),
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now,
      });
      await reload();
    },
    [markupId, keyLessons, reload],
  );

  const updateKeyLesson = useCallback(
    async (id: number, text: string) => {
      await forwardTestsDb.keyLessons.update(id, {
        text: text.trim(),
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const deleteKeyLesson = useCallback(
    async (id: number) => {
      await forwardTestsDb.keyLessons.delete(id);
      await reload();
    },
    [reload],
  );

  return {
    markup,
    years,
    monthsByYear,
    weeksByMonth,
    keyLessons,
    loading,
    reload,
    createYearTemplate,
    updateYear,
    deleteYear,
    updateMonth,
    deleteMonth,
    updateWeek,
    deleteWeek,
    addWeek,
    reorderWeeks,
    addKeyLesson,
    updateKeyLesson,
    deleteKeyLesson,
  };
}

/** Prevent concurrent seed for the same week (Strict Mode double-mount). */
const weekSeedLocks = new Map<number, Promise<void>>();

async function ensureWeekDefaults(weekId: number): Promise<void> {
  const existing = weekSeedLocks.get(weekId);
  if (existing) {
    await existing;
    return;
  }

  const task = (async () => {
    await forwardTestsDb.transaction(
      "rw",
      forwardTestsDb.days,
      forwardTestsDb.sections,
      async () => {
        let dayList = await forwardTestsDb.days
          .where("weekId")
          .equals(weekId)
          .sortBy("order");

        // --- Deduplicate days by dayKey (keep first / lowest id) ---
        const seenDayKeys = new Set<string>();
        const dayIdsToDelete: number[] = [];
        for (const d of dayList) {
          if (d.id == null) continue;
          if (seenDayKeys.has(d.dayKey)) {
            dayIdsToDelete.push(d.id);
          } else {
            seenDayKeys.add(d.dayKey);
          }
        }
        for (const id of dayIdsToDelete) {
          await forwardTestsDb.sections.where("dayId").equals(id).delete();
          await forwardTestsDb.days.delete(id);
        }
        if (dayIdsToDelete.length > 0) {
          dayList = await forwardTestsDb.days
            .where("weekId")
            .equals(weekId)
            .sortBy("order");
        }

        // --- Seed missing trading days ---
        if (dayList.length === 0) {
          const now = Date.now();
          for (const td of TRADING_DAYS) {
            await forwardTestsDb.days.add({
              weekId,
              dayKey: td.dayKey,
              label: td.labelEn,
              order: td.order,
              createdAt: now,
              updatedAt: now,
            });
          }
          dayList = await forwardTestsDb.days
            .where("weekId")
            .equals(weekId)
            .sortBy("order");
        } else {
          const present = new Set(dayList.map((d) => d.dayKey));
          const now = Date.now();
          for (const td of TRADING_DAYS) {
            if (!present.has(td.dayKey)) {
              await forwardTestsDb.days.add({
                weekId,
                dayKey: td.dayKey,
                label: td.labelEn,
                order: td.order,
                createdAt: now,
                updatedAt: now,
              });
            }
          }
          dayList = await forwardTestsDb.days
            .where("weekId")
            .equals(weekId)
            .sortBy("order");
        }

        // --- Sections: dedupe + seed per day ---
        for (const d of dayList) {
          if (d.id == null) continue;
          let secs = await forwardTestsDb.sections
            .where("dayId")
            .equals(d.id)
            .sortBy("order");

          const seenKeys = new Set<string>();
          const secIdsToDelete: number[] = [];
          for (const s of secs) {
            if (s.id == null) continue;
            const key = s.sectionKey ?? `custom-${s.id}`;
            if (s.sectionKey && s.sectionKey !== "custom") {
              if (seenKeys.has(key)) {
                secIdsToDelete.push(s.id);
              } else {
                seenKeys.add(key);
              }
            }
          }
          for (const id of secIdsToDelete) {
            await forwardTestsDb.sections.delete(id);
          }
          if (secIdsToDelete.length > 0) {
            secs = await forwardTestsDb.sections
              .where("dayId")
              .equals(d.id)
              .sortBy("order");
          }

          const presentKeys = new Set(
            secs
              .map((s) => s.sectionKey)
              .filter((k): k is NonNullable<typeof k> => !!k && k !== "custom"),
          );

          if (
            secs.length === 0 ||
            presentKeys.size < DEFAULT_SECTION_DEFS.length
          ) {
            const now = Date.now();
            let orderBase = secs.reduce((m, s) => Math.max(m, s.order), -1);
            for (let i = 0; i < DEFAULT_SECTION_DEFS.length; i++) {
              const def = DEFAULT_SECTION_DEFS[i];
              if (def.sectionKey && presentKeys.has(def.sectionKey)) continue;
              orderBase += 1;
              await forwardTestsDb.sections.add({
                dayId: d.id,
                title: def.title,
                sectionKey: def.sectionKey,
                order: orderBase,
                totalR: "",
                accountSize: 1000,
                riskPercent: 0.4,
                content: "",
                images: [],
                createdAt: now,
                updatedAt: now,
              });
            }
          }
        }
      },
    );
  })();

  weekSeedLocks.set(weekId, task);
  try {
    await task;
  } finally {
    weekSeedLocks.delete(weekId);
  }
}

export function useWeekDetail(weekId: number | null) {
  const [week, setWeek] = useState<Week | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [sectionsByDay, setSectionsByDay] = useState<Record<number, Section[]>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [breadcrumb, setBreadcrumb] = useState<{
    markupId?: number;
    markupTitle?: string;
    yearName?: string;
    monthName?: string;
    weekName?: string;
  }>({});

  const reload = useCallback(async () => {
    if (weekId == null) return;
    const w = (await forwardTestsDb.weeks.get(weekId)) ?? null;
    setWeek(w);
    if (!w || w.id == null) return;

    const mo = await forwardTestsDb.months.get(w.monthId);
    const yr = mo ? await forwardTestsDb.years.get(mo.yearId) : null;
    const mk = yr ? await forwardTestsDb.markups.get(yr.markupId) : null;
    setBreadcrumb({
      markupId: mk?.id,
      markupTitle: mk?.title,
      yearName: yr?.name,
      monthName: mo?.name,
      weekName: w.name,
    });

    await ensureWeekDefaults(w.id);

    const dayList = await forwardTestsDb.days
      .where("weekId")
      .equals(w.id)
      .sortBy("order");

    const secMap: Record<number, Section[]> = {};
    for (const d of dayList) {
      if (d.id == null) continue;
      secMap[d.id] = await forwardTestsDb.sections
        .where("dayId")
        .equals(d.id)
        .sortBy("order");
    }
    setDays(dayList);
    setSectionsByDay(secMap);
  }, [weekId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const addSection = useCallback(
    async (dayId: number, title?: string) => {
      const existing = sectionsByDay[dayId] ?? [];
      const maxOrder = existing.reduce((m, x) => Math.max(m, x.order), -1);
      const now = Date.now();
      const id = await forwardTestsDb.sections.add({
        dayId,
        title: title?.trim() || "New",
        sectionKey: "custom",
        order: maxOrder + 1,
        totalR: "",
        accountSize: 1000,
        riskPercent: 0.4,
        content: "",
        images: [],
        createdAt: now,
        updatedAt: now,
      });
      await reload();
      return id;
    },
    [sectionsByDay, reload],
  );

  const updateSection = useCallback(
    async (id: number, patch: Partial<Section>) => {
      await forwardTestsDb.sections.update(id, {
        ...patch,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const deleteSection = useCallback(
    async (id: number) => {
      await forwardTestsDb.sections.delete(id);
      await reload();
    },
    [reload],
  );

  const addImageToSection = useCallback(
    async (sectionId: number, dataUrl: string) => {
      const sec = await forwardTestsDb.sections.get(sectionId);
      if (!sec) return;
      const images: SectionImage[] = [
        ...(sec.images ?? []),
        { id: uid(), dataUrl },
      ];
      await forwardTestsDb.sections.update(sectionId, {
        images,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const removeImageFromSection = useCallback(
    async (sectionId: number, imageId: string) => {
      const sec = await forwardTestsDb.sections.get(sectionId);
      if (!sec) return;
      const images = (sec.images ?? []).filter((img) => img.id !== imageId);
      await forwardTestsDb.sections.update(sectionId, {
        images,
        updatedAt: Date.now(),
      });
      await reload();
    },
    [reload],
  );

  const reorderSections = useCallback(
    async (_dayId: number, orderedIds: number[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          forwardTestsDb.sections.update(id, {
            order: index,
            updatedAt: Date.now(),
          }),
        ),
      );
      await reload();
    },
    [reload],
  );

  return {
    week,
    days,
    sectionsByDay,
    breadcrumb,
    loading,
    reload,
    addSection,
    updateSection,
    deleteSection,
    addImageToSection,
    removeImageFromSection,
    reorderSections,
  };
}

/** Compute net % gain from totalR, accountSize, riskPercent */
export function computeNetPercent(
  totalR: string,
  accountSize: number,
  riskPercent: number,
): number {
  const r = parseFloat(totalR);
  if (Number.isNaN(r) || !accountSize || !riskPercent) return 0;
  return r * riskPercent;
}

export function computeNetProfit(
  totalR: string,
  accountSize: number,
  riskPercent: number,
): number {
  const pct = computeNetPercent(totalR, accountSize, riskPercent);
  return (pct / 100) * accountSize;
}
