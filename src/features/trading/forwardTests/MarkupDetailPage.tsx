import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  LayoutTemplate,
  Sparkles,
  GripVertical,
} from "lucide-react";
import { TradingSubNav } from "../components/TradingSubNav";
import { useMarkupDetail } from "./hooks/useForwardTests";
import { useSettingsStore } from "../../../app/store/settingsStore";
import type { CalendarType } from "./types";

export function MarkupDetailPage() {
  const { markupId: markupIdParam } = useParams();
  const markupId = markupIdParam ? Number(markupIdParam) : null;
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const {
    markup,
    years,
    monthsByYear,
    weeksByMonth,
    loading,
    createYearTemplate,
    updateYear,
    deleteYear,
    updateMonth,
    deleteMonth,
    updateWeek,
    deleteWeek,
    addWeek,
    reorderWeeks,
  } = useMarkupDetail(markupId);

  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>(
    {},
  );
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>(
    {},
  );
  const [creatingYear, setCreatingYear] = useState(false);
  const [yearName, setYearName] = useState("");
  const [editingYearId, setEditingYearId] = useState<number | null>(null);
  const [editYearName, setEditYearName] = useState("");
  const [editingMonthId, setEditingMonthId] = useState<number | null>(null);
  const [editMonthName, setEditMonthName] = useState("");
  const [editingWeekId, setEditingWeekId] = useState<number | null>(null);
  const [editWeekName, setEditWeekName] = useState("");
  const [addingWeekMonthId, setAddingWeekMonthId] = useState<number | null>(
    null,
  );
  const [newWeekName, setNewWeekName] = useState("");
  const [dragWeek, setDragWeek] = useState<{
    monthId: number;
    weekId: number;
  } | null>(null);

  function detectCalendar(name: string): CalendarType {
    const n = name.trim();
    // Persian year typically 13xx or 14xx
    if (/^13\d{2}$/.test(n) || /^14\d{2}$/.test(n)) return "jalali";
    return "gregorian";
  }

  async function handleCreateYear() {
    const name = yearName.trim();
    if (!name) return;
    const cal = detectCalendar(name);
    const id = await createYearTemplate(name, cal);
    if (id != null) {
      setExpandedYears((prev) => ({ ...prev, [id]: true }));
    }
    setYearName("");
    setCreatingYear(false);
  }

  function toggleYear(id: number) {
    setExpandedYears((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleMonth(id: number) {
    setExpandedMonths((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (loading || !markup) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        {isRtl ? "در حال بارگذاری..." : "Loading..."}
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
        <Link
          to="/trading/forward-tests"
          className="hover:text-white"
        >
          {isRtl ? "فوروارد تست" : "Forward Tests"}
        </Link>
        <span>/</span>
        <span className="text-white">{markup.title}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-start">
          <div className="mb-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <LayoutTemplate size={14} />
            <span>{isRtl ? "مارک‌آپ‌ها" : "Markups"}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {markup.title}
          </h1>
        </div>
      </div>

      {/* Key Lessons entry */}
      <Link
        to={`/trading/forward-tests/${markupId}/key-lessons`}
        className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-hover)]"
      >
        <span className="text-lg">💡</span>
        <span className="text-sm font-medium text-white">
          {isRtl ? "نکات کلیدی (Key Lessons)" : "Key Lessons"}
        </span>
        <ChevronRight
          size={16}
          className={`ms-auto text-[var(--color-text-muted)] ${isRtl ? "rotate-180" : ""}`}
        />
      </Link>

      {/* TEMPLATE header */}
      <div className="flex items-center gap-2 pt-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        <Sparkles size={14} />
        <span>TEMPLATE</span>
      </div>

      {/* Years tree */}
      <div className="space-y-1">
        {years.map((year) => {
          const yid = year.id!;
          const isOpen = expandedYears[yid] ?? false;
          const months = monthsByYear[yid] ?? [];

          return (
            <div key={yid} className="rounded-xl">
              <div className="group flex items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-[var(--color-surface)]">
                <button
                  type="button"
                  onClick={() => toggleYear(yid)}
                  className="rounded p-0.5 text-[var(--color-text-muted)]"
                >
                  {isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight
                      size={16}
                      className={isRtl ? "rotate-180" : ""}
                    />
                  )}
                </button>

                {editingYearId === yid ? (
                  <input
                    autoFocus
                    value={editYearName}
                    onChange={(e) => setEditYearName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        void updateYear(yid, { name: editYearName.trim() });
                        setEditingYearId(null);
                      }
                      if (e.key === "Escape") setEditingYearId(null);
                    }}
                    onBlur={() => {
                      if (editYearName.trim()) {
                        void updateYear(yid, { name: editYearName.trim() });
                      }
                      setEditingYearId(null);
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleYear(yid)}
                    className="flex-1 text-start text-sm font-medium text-white"
                  >
                    {year.name}
                  </button>
                )}

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingYearId(yid);
                      setEditYearName(year.name);
                    }}
                    className="rounded p-1.5 text-[var(--color-text-muted)] hover:text-white"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          isRtl
                            ? "این سال و تمام ماه‌ها و هفته‌هایش حذف شود؟"
                            : "Delete this year and all its months/weeks?",
                        )
                      ) {
                        void deleteYear(yid);
                      }
                    }}
                    className="rounded p-1.5 text-[var(--color-text-muted)] hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="ms-4 space-y-0.5 border-s border-[var(--color-border)] ps-2">
                  {months.map((month) => {
                    const mid = month.id!;
                    const mOpen = expandedMonths[mid] ?? false;
                    const weeks = weeksByMonth[mid] ?? [];

                    return (
                      <div key={mid}>
                        <div className="group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-[var(--color-surface)]">
                          <button
                            type="button"
                            onClick={() => toggleMonth(mid)}
                            className="rounded p-0.5 text-[var(--color-text-muted)]"
                          >
                            {mOpen ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight
                                size={14}
                                className={isRtl ? "rotate-180" : ""}
                              />
                            )}
                          </button>

                          {editingMonthId === mid ? (
                            <input
                              autoFocus
                              value={editMonthName}
                              onChange={(e) => setEditMonthName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  void updateMonth(mid, {
                                    name: editMonthName.trim(),
                                  });
                                  setEditingMonthId(null);
                                }
                                if (e.key === "Escape")
                                  setEditingMonthId(null);
                              }}
                              onBlur={() => {
                                if (editMonthName.trim()) {
                                  void updateMonth(mid, {
                                    name: editMonthName.trim(),
                                  });
                                }
                                setEditingMonthId(null);
                              }}
                              className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white outline-none"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleMonth(mid)}
                              className="flex-1 rounded-md bg-[var(--color-surface)] px-2 py-1 text-start text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]"
                            >
                              {month.name}
                            </button>
                          )}

                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMonthId(mid);
                                setEditMonthName(month.name);
                              }}
                              className="rounded p-1.5 text-[var(--color-text-muted)] hover:text-white"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    isRtl
                                      ? "این ماه و هفته‌هایش حذف شود؟"
                                      : "Delete this month and its weeks?",
                                  )
                                ) {
                                  void deleteMonth(mid);
                                }
                              }}
                              className="rounded p-1.5 text-[var(--color-text-muted)] hover:text-red-400"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {mOpen && (
                          <div className="ms-4 space-y-0.5 border-s border-[var(--color-border)] ps-2">
                            {weeks.map((week) => {
                              const wid = week.id!;
                              return (
                                <div
                                  key={wid}
                                  draggable
                                  onDragStart={() =>
                                    setDragWeek({ monthId: mid, weekId: wid })
                                  }
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={() => {
                                    if (
                                      !dragWeek ||
                                      dragWeek.monthId !== mid ||
                                      dragWeek.weekId === wid
                                    ) {
                                      setDragWeek(null);
                                      return;
                                    }
                                    const ids = weeks.map((w) => w.id!);
                                    const from = ids.indexOf(dragWeek.weekId);
                                    const to = ids.indexOf(wid);
                                    if (from < 0 || to < 0) {
                                      setDragWeek(null);
                                      return;
                                    }
                                    ids.splice(from, 1);
                                    ids.splice(to, 0, dragWeek.weekId);
                                    void reorderWeeks(mid, ids);
                                    setDragWeek(null);
                                  }}
                                  className="group flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-[var(--color-surface)]"
                                >
                                  <span className="cursor-grab text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100">
                                    <GripVertical size={12} />
                                  </span>

                                  {editingWeekId === wid ? (
                                    <input
                                      autoFocus
                                      value={editWeekName}
                                      onChange={(e) =>
                                        setEditWeekName(e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          void updateWeek(wid, {
                                            name: editWeekName.trim(),
                                          });
                                          setEditingWeekId(null);
                                        }
                                        if (e.key === "Escape")
                                          setEditingWeekId(null);
                                      }}
                                      onBlur={() => {
                                        if (editWeekName.trim()) {
                                          void updateWeek(wid, {
                                            name: editWeekName.trim(),
                                          });
                                        }
                                        setEditingWeekId(null);
                                      }}
                                      className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white outline-none"
                                    />
                                  ) : (
                                    <Link
                                      to={`/trading/forward-tests/${markupId}/week/${wid}`}
                                      className="flex flex-1 items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white"
                                    >
                                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                                      {week.name}
                                    </Link>
                                  )}

                                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingWeekId(wid);
                                        setEditWeekName(week.name);
                                      }}
                                      className="rounded p-1.5 text-[var(--color-text-muted)] hover:text-white"
                                    >
                                      <Pencil size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          confirm(
                                            isRtl
                                              ? "این هفته حذف شود؟"
                                              : "Delete this week?",
                                          )
                                        ) {
                                          void deleteWeek(wid);
                                        }
                                      }}
                                      className="rounded p-1.5 text-[var(--color-text-muted)] hover:text-red-400"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            {addingWeekMonthId === mid ? (
                              <div className="flex items-center gap-2 px-2 py-1">
                                <input
                                  autoFocus
                                  value={newWeekName}
                                  onChange={(e) =>
                                    setNewWeekName(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      void addWeek(mid, newWeekName);
                                      setNewWeekName("");
                                      setAddingWeekMonthId(null);
                                    }
                                    if (e.key === "Escape") {
                                      setAddingWeekMonthId(null);
                                      setNewWeekName("");
                                    }
                                  }}
                                  placeholder={
                                    isRtl ? "نام هفته..." : "Week name..."
                                  }
                                  className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    void addWeek(mid, newWeekName);
                                    setNewWeekName("");
                                    setAddingWeekMonthId(null);
                                  }}
                                  className="rounded-lg bg-[var(--color-primary)] px-2 py-1 text-xs text-white"
                                >
                                  {isRtl ? "افزودن" : "Add"}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAddingWeekMonthId(mid)}
                                className="flex w-full items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-white"
                              >
                                <Plus size={12} />
                                {isRtl ? "هفته جدید" : "Add week"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create year template */}
      {creatingYear ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
          <input
            autoFocus
            value={yearName}
            onChange={(e) => setYearName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreateYear();
              if (e.key === "Escape") {
                setCreatingYear(false);
                setYearName("");
              }
            }}
            placeholder={
              isRtl
                ? "سال (مثلاً 2026 یا 1404)..."
                : "Year (e.g. 2026 or 1404)..."
            }
            className="min-w-160 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void handleCreateYear()}
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
            >
              {isRtl ? "ایجاد" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatingYear(false);
                setYearName("");
              }}
              className="rounded-xl px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
            >
              {isRtl ? "لغو" : "Cancel"}
            </button>
          </div>
          <p className="w-full text-xs text-[var(--color-text-muted)]">
            {isRtl
              ? "اگر عدد شمسی (۱۳xx/۱۴xx) وارد کنید ماه‌ها شمسی می‌شوند، در غیر این صورت میلادی."
              : "Persian years (13xx/14xx) get Jalali months; otherwise Gregorian months."}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreatingYear(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-4 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-white"
        >
          <Plus size={16} />
          {isRtl ? "ساخت تمپلیت جدید (سال)" : "Generate New Template"}
        </button>
      )}
    </div>
  );
}
