import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, Image as ImageIcon, GripVertical } from "lucide-react";
import { TradingSubNav } from "../components/TradingSubNav";
import { useWeekDetail, computeNetPercent } from "./hooks/useForwardTests";
import { SectionEditorModal } from "./components/SectionEditorModal";
import { useSettingsStore } from "../../../app/store/settingsStore";
import type { Section } from "./types";
import { TRADING_DAYS } from "./types";

export function WeekDetailPage() {
  const { weekId: weekIdParam } = useParams();
  const weekId = weekIdParam ? Number(weekIdParam) : null;
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const {
    week,
    days,
    sectionsByDay,
    breadcrumb,
    loading,
    addSection,
    updateSection,
    deleteSection,
    addImageToSection,
    removeImageFromSection,
    reorderSections,
  } = useWeekDetail(weekId);

  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [addingForDayId, setAddingForDayId] = useState<number | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  /** Live drag like music tracks */
  const [dragSectionId, setDragSectionId] = useState<number | null>(null);
  const [dragDayId, setDragDayId] = useState<number | null>(null);
  /** Optimistic order per day while dragging (music-style live reorder) */
  const [liveOrderByDay, setLiveOrderByDay] = useState<Record<
    number,
    number[]
  > | null>(null);

  const editingSection: Section | null = (() => {
    if (editingSectionId == null) return null;
    for (const secs of Object.values(sectionsByDay)) {
      const found = secs.find((s) => s.id === editingSectionId);
      if (found) return found;
    }
    return null;
  })();

  function sectionsForDay(dayId: number): Section[] {
    const base = sectionsByDay[dayId] ?? [];
    const liveIds = liveOrderByDay?.[dayId];
    if (!liveIds) return base;
    const map = new Map(base.map((s) => [s.id!, s]));
    return liveIds
      .map((id) => map.get(id))
      .filter((s): s is Section => s != null);
  }

  async function handleCreateSection(dayId: number) {
    const title = newSectionTitle.trim();
    if (!title) return;
    const id = await addSection(dayId, title);
    setNewSectionTitle("");
    setAddingForDayId(null);
    if (id != null) setEditingSectionId(id);
  }

  function dayLabel(dayKey: string, fallback: string) {
    const found = TRADING_DAYS.find((d) => d.dayKey === dayKey);
    if (!found) return fallback;
    return isRtl ? found.labelFa : found.labelEn;
  }

  function handleSectionDragStart(dayId: number, sectionId: number) {
    setDragSectionId(sectionId);
    setDragDayId(dayId);
    const ids = (sectionsByDay[dayId] ?? []).map((s) => s.id!);
    setLiveOrderByDay({ [dayId]: ids });
  }

  function handleSectionDragOver(
    e: React.DragEvent,
    dayId: number,
    overId: number,
  ) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (
      dragSectionId == null ||
      dragDayId !== dayId ||
      dragSectionId === overId
    )
      return;

    setLiveOrderByDay((prev) => {
      const ids =
        prev?.[dayId] ??
        (sectionsByDay[dayId] ?? []).map((s) => s.id!).filter(Boolean);
      const from = ids.indexOf(dragSectionId);
      const to = ids.indexOf(overId);
      if (from < 0 || to < 0 || from === to) return prev;
      const next = [...ids];
      next.splice(from, 1);
      next.splice(to, 0, dragSectionId);
      return { ...(prev ?? {}), [dayId]: next };
    });
  }

  function handleSectionDragEnd() {
    if (dragDayId != null && liveOrderByDay?.[dragDayId]) {
      void reorderSections(dragDayId, liveOrderByDay[dragDayId]);
    }
    setDragSectionId(null);
    setDragDayId(null);
    setLiveOrderByDay(null);
  }

  if (loading || !week) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        {isRtl ? "در حال بارگذاری..." : "Loading..."}
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
        <Link to="/trading/forward-tests" className="hover:text-white">
          {isRtl ? "فوروارد تست" : "Forward Tests"}
        </Link>
        {breadcrumb.markupId != null && (
          <>
            <span>/</span>
            <Link
              to={`/trading/forward-tests/${breadcrumb.markupId}`}
              className="hover:text-white"
            >
              {breadcrumb.markupTitle}
            </Link>
          </>
        )}
        {breadcrumb.yearName && (
          <>
            <span>/</span>
            <span>{breadcrumb.yearName}</span>
          </>
        )}
        {breadcrumb.monthName && (
          <>
            <span>/</span>
            <span>{breadcrumb.monthName}</span>
          </>
        )}
        <span>/</span>
        <span className="text-white">{week.name}</span>
      </div>

      <div className="text-start">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {breadcrumb.yearName && breadcrumb.monthName
            ? `${breadcrumb.yearName} · ${breadcrumb.monthName} · ${week.name}`
            : week.name}
        </h1>
      </div>

      <div className="space-y-8">
        {days.map((day) => {
          const did = day.id!;
          const sections = sectionsForDay(did);

          return (
            <div key={did}>
              <div className="mb-3 rounded-xl bg-[var(--color-surface)] px-4 py-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {dayLabel(day.dayKey, day.label)}
                </div>
                <div className="text-sm font-medium text-white">
                  {dayLabel(day.dayKey, day.label)} {isRtl ? "خلاصه" : "Recap"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {sections.map((sec) => {
                  const thumb = sec.images?.[0]?.dataUrl;
                  const netPct = computeNetPercent(
                    sec.totalR,
                    sec.accountSize,
                    sec.riskPercent,
                  );
                  const isDragging = dragSectionId === sec.id;
                  const isDragActive = dragSectionId != null;

                  return (
                    <div
                      key={sec.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(sec.id));
                        handleSectionDragStart(did, sec.id!);
                      }}
                      onDragOver={(e) => handleSectionDragOver(e, did, sec.id!)}
                      onDragEnd={handleSectionDragEnd}
                      className={`transition-all duration-300 ease-out ${
                        isDragging
                          ? "scale-[0.97] opacity-50 shadow-lg shadow-purple-500/20"
                          : isDragActive
                            ? "scale-[1.01]"
                            : ""
                      }`}
                    >
                      <div
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-start transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]"
                        style={{
                          cursor: isDragging ? "grabbing" : "grab",
                        }}
                      >
                        <span
                          className={`absolute start-2 top-2 z-10 cursor-grab text-[var(--color-text-muted)] opacity-40 transition hover:opacity-100 active:cursor-grabbing ${
                            isDragging
                              ? "opacity-100"
                              : "group-hover:opacity-100"
                          }`}
                        >
                          <GripVertical size={16} />
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (dragSectionId) return;
                            setEditingSectionId(sec.id ?? null);
                          }}
                          className="flex w-full flex-col text-start"
                          style={{ cursor: "inherit" }}
                        >
                          <div className="relative flex h-28 items-center justify-center bg-[var(--color-bg)]">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt=""
                                className="pointer-events-none h-full w-full object-cover"
                                draggable={false}
                              />
                            ) : (
                              <ImageIcon
                                size={28}
                                className="text-[var(--color-text-muted)] opacity-40"
                              />
                            )}
                          </div>

                          <div className="space-y-0.5 p-3">
                            <div className="truncate text-sm font-medium text-white">
                              {sec.title}
                            </div>
                            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                              <span>
                                {sec.totalR
                                  ? `${sec.totalR} R`
                                  : isRtl
                                    ? "خالی"
                                    : "Empty"}
                              </span>
                              <span>
                                {netPct !== 0 ? `${netPct.toFixed(1)}%` : "0%"}
                              </span>
                            </div>
                            <div className="text-xs text-[var(--color-text-muted)]">
                              $
                              {(
                                (netPct / 100) *
                                (sec.accountSize || 0)
                              ).toFixed(2)}
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {addingForDayId === did ? (
                  <div className="flex min-h-[160px] flex-col justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                    <input
                      autoFocus
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleCreateSection(did);
                        if (e.key === "Escape") {
                          setAddingForDayId(null);
                          setNewSectionTitle("");
                        }
                      }}
                      placeholder={isRtl ? "نام سکشن..." : "Section name..."}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleCreateSection(did)}
                        className="flex-1 rounded-lg bg-[var(--color-primary)] px-2 py-1.5 text-xs text-white"
                      >
                        {isRtl ? "ایجاد" : "Create"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingForDayId(null);
                          setNewSectionTitle("");
                        }}
                        className="rounded-lg px-2 py-1.5 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                      >
                        {isRtl ? "لغو" : "Cancel"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAddingForDayId(did);
                      setNewSectionTitle("");
                    }}
                    className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-white hover:shadow-md"
                  >
                    <Plus size={22} />
                    <span className="text-sm">{isRtl ? "جدید" : "New"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SectionEditorModal
        open={editingSection != null}
        section={editingSection}
        onClose={() => setEditingSectionId(null)}
        onSave={async (patch) => {
          if (editingSectionId != null) {
            await updateSection(editingSectionId, patch);
          }
        }}
        onAddImage={async (dataUrl) => {
          if (editingSectionId != null) {
            await addImageToSection(editingSectionId, dataUrl);
          }
        }}
        onRemoveImage={async (imageId) => {
          if (editingSectionId != null) {
            await removeImageFromSection(editingSectionId, imageId);
          }
        }}
        onDelete={
          editingSectionId != null
            ? async () => {
                await deleteSection(editingSectionId);
                setEditingSectionId(null);
              }
            : undefined
        }
      />
    </div>
  );
}
