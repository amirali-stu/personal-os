import { useCallback, useEffect, useState } from "react";
import {
  tradingDb,
  type PlanSection,
  type PlanItem,
} from "../../services/tradingDb";
import { createDefaultPlanSections } from "../data/defaultPlan";

function uid() {
  return crypto.randomUUID();
}

export function useTradingPlan() {
  const [sections, setSections] = useState<PlanSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState<number | null>(null);

  // ذخیره تغییرات پلن در IndexedDB
  const persist = useCallback(
    async (next: PlanSection[]) => {
      setSections(next);

      if (recordId == null) {
        // اولین ذخیره → Dexie خودش id می‌سازد
        const id = await tradingDb.plan.add({
          sections: next,
          updatedAt: Date.now(),
        });

        setRecordId(id);
      } else {
        // ذخیره تغییرات رکورد موجود
        await tradingDb.plan.put({
          id: recordId,
          sections: next,
          updatedAt: Date.now(),
        });
      }
    },
    [recordId],
  );

  // دریافت پلن از IndexedDB
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const existing = await tradingDb.plan.toCollection().first();

        if (cancelled) return;

        if (existing) {
          setRecordId(existing.id ?? null);
          setSections(existing.sections);
        } else {
          const defaults = createDefaultPlanSections();

          const id = await tradingDb.plan.add({
            sections: defaults,
            updatedAt: Date.now(),
          });

          if (cancelled) return;

          setRecordId(id);
          setSections(defaults);
        }
      } catch (error) {
        console.error("خطا در بارگذاری پلن معاملاتی:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // تغییر وضعیت یک آیتم
  const toggleItem = useCallback(
    async (sectionId: string, itemId: string) => {
      const next = sections.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item,
          ),
        };
      });

      await persist(next);
    },
    [sections, persist],
  );

  // اضافه کردن آیتم
  const addItem = useCallback(
    async (sectionId: string, text: string) => {
      if (!text.trim()) return;

      const next = sections.map((section) => {
        if (section.id !== sectionId) return section;

        const newItem: PlanItem = {
          id: uid(),
          text: text.trim(),
          checked: false,
          type: "checkbox",
        };

        return {
          ...section,
          items: [...section.items, newItem],
        };
      });

      await persist(next);
    },
    [sections, persist],
  );

  // ویرایش متن آیتم
  const updateItem = useCallback(
    async (sectionId: string, itemId: string, text: string) => {
      const next = sections.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, text } : item,
          ),
        };
      });

      await persist(next);
    },
    [sections, persist],
  );

  // حذف آیتم
  const deleteItem = useCallback(
    async (sectionId: string, itemId: string) => {
      const next = sections.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          items: section.items.filter((item) => item.id !== itemId),
        };
      });

      await persist(next);
    },
    [sections, persist],
  );

  // اضافه کردن بخش
  const addSection = useCallback(
    async (title: string, type: PlanSection["type"] = "checklist") => {
      if (!title.trim()) return;

      const newSection: PlanSection = {
        id: uid(),
        title: title.trim(),
        type,
        items: [],
        images: type === "images" ? [null, null, null] : undefined,
        groups: type === "mapping" ? [] : undefined,
      };

      await persist([...sections, newSection]);
    },
    [sections, persist],
  );

  // ویرایش عنوان بخش
  const updateSectionTitle = useCallback(
    async (sectionId: string, title: string) => {
      const next = sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section,
      );

      await persist(next);
    },
    [sections, persist],
  );

  // حذف بخش
  const deleteSection = useCallback(
    async (sectionId: string) => {
      const next = sections.filter((section) => section.id !== sectionId);

      await persist(next);
    },
    [sections, persist],
  );

  // باز و بسته کردن بخش
  const toggleCollapse = useCallback(
    async (sectionId: string) => {
      const next = sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              collapsed: !section.collapsed,
            }
          : section,
      );

      await persist(next);
    },
    [sections, persist],
  );

  // تغییر تصویر
  const setImage = useCallback(
    async (sectionId: string, index: number, dataUrl: string | null) => {
      const next = sections.map((section) => {
        if (!section.images || section.id !== sectionId) {
          return section;
        }

        const images = [...section.images];
        images[index] = dataUrl;

        return {
          ...section,
          images,
        };
      });

      await persist(next);
    },
    [sections, persist],
  );

  // اضافه کردن جایگاه تصویر
  const addImageSlot = useCallback(
    async (sectionId: string) => {
      const next = sections.map((section) => {
        if (section.id !== sectionId) return section;

        const images = [...(section.images ?? []), null];

        return {
          ...section,
          images,
        };
      });

      await persist(next);
    },
    [sections, persist],
  );

  // حذف جایگاه تصویر
  const removeImageSlot = useCallback(
    async (sectionId: string, index: number) => {
      const next = sections.map((section) => {
        if (!section.images || section.id !== sectionId) {
          return section;
        }

        const images = section.images.filter(
          (_, imageIndex) => imageIndex !== index,
        );

        return {
          ...section,
          images,
        };
      });

      await persist(next);
    },
    [sections, persist],
  );

  // بازنشانی پلن به حالت پیش‌فرض
  const resetToDefault = useCallback(async () => {
    const defaults = createDefaultPlanSections();

    await persist(defaults);
  }, [persist]);

  // تعداد آیتم‌های تیک‌خورده
  const checkedCount = sections
    .filter((section) => section.type === "checklist")
    .reduce(
      (acc, section) =>
        acc + section.items.filter((item) => item.checked).length,
      0,
    );

  // تعداد کل آیتم‌های قابل تیک
  const totalCheckable = sections
    .filter((section) => section.type === "checklist")
    .reduce((acc, section) => acc + section.items.length, 0);

  return {
    sections,
    loading,
    toggleItem,
    addItem,
    updateItem,
    deleteItem,
    addSection,
    updateSectionTitle,
    deleteSection,
    toggleCollapse,
    setImage,
    addImageSlot,
    removeImageSlot,
    resetToDefault,
    checkedCount,
    totalCheckable,
  };
}
