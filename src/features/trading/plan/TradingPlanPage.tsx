import { useState } from "react";
import { ClipboardList, Plus, RotateCcw } from "lucide-react";
import { useSettingsStore } from "../../../app/store/settingsStore";
import { TradingSubNav } from "../components/TradingSubNav";
import { useTradingPlan } from "./hooks/useTradingPlan";
import { PlanSection } from "./components/PlanSection";
import type { PlanSection as PlanSectionType } from "./services/planDb";

export function TradingPlanPage() {
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const {
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
  } = useTradingPlan();

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionType, setNewSectionType] =
    useState<PlanSectionType["type"]>("checklist");
  const [showAddSection, setShowAddSection] = useState(false);

  function handleAddSection() {
    if (!newSectionTitle.trim()) return;
    addSection(newSectionTitle, newSectionType);
    setNewSectionTitle("");
    setShowAddSection(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        در حال بارگذاری...
      </div>
    );
  }

  const progress =
    totalCheckable > 0 ? Math.round((checkedCount / totalCheckable) * 100) : 0;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-start">
          <div className="mb-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <ClipboardList size={14} />
            <span>پلن معاملاتی</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            تریدینگ پلن
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            چک‌لیست روزانه قبل از ورود به معامله — تیک بزن و عکس اضافه کن
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {totalCheckable > 0 && (
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
              <span className="font-semibold text-white">{checkedCount}</span>
              {" / "}
              {totalCheckable}
              <span className="ms-2 text-[var(--color-primary)]">
                ({progress}٪)
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "آیا مطمئنی می‌خوای پلن رو به حالت پیش‌فرض برگردونی؟ تیک‌ها و عکس‌ها پاک می‌شن.",
                )
              ) {
                resetToDefault();
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white"
          >
            <RotateCcw size={14} />
            بازنشانی
          </button>
        </div>
      </div>

      {totalCheckable > 0 && (
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <PlanSection
            key={section.id}
            section={section}
            onToggleItem={(itemId) => toggleItem(section.id, itemId)}
            onAddItem={(text) => addItem(section.id, text)}
            onUpdateItem={(itemId, text) =>
              updateItem(section.id, itemId, text)
            }
            onDeleteItem={(itemId) => deleteItem(section.id, itemId)}
            onUpdateTitle={(title) => updateSectionTitle(section.id, title)}
            onDeleteSection={() => {
              if (window.confirm("این بخش حذف شود؟")) {
                deleteSection(section.id);
              }
            }}
            onToggleCollapse={() => toggleCollapse(section.id)}
            onSetImage={(index, dataUrl) =>
              setImage(section.id, index, dataUrl)
            }
            onAddImageSlot={() => addImageSlot(section.id)}
            onRemoveImageSlot={(index) => removeImageSlot(section.id, index)}
          />
        ))}
      </div>

      {showAddSection ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
          <input
            autoFocus
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSection();
            }}
            placeholder="عنوان بخش جدید..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
          />
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["checklist", "چک‌لیست"],
                ["mapping", "لیست خواندنی"],
                ["images", "گالری عکس"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setNewSectionType(value)}
                className={[
                  "rounded-lg px-3 py-1.5 text-xs transition-colors",
                  newSectionType === value
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddSection}
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90"
            >
              افزودن
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddSection(false);
                setNewSectionTitle("");
              }}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
            >
              لغو
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddSection(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-white"
        >
          <Plus size={18} />
          افزودن بخش جدید
        </button>
      )}
    </div>
  );
}
