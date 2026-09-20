import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  CheckCircle2,
  Plus,
  Trash2,
  GripVertical,
  Flag,
  Download,
  Upload,
} from "lucide-react";

import { useTasks, type Task } from "./hooks/useTasks";
import type { TaskPriority } from "./services/tasksDb";
import { TaskCalendar } from "./components/TaskCalendar";
import { getTodayDate } from "../../lib/dateUtils";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { Confetti } from "../../components/ui/Confetti";
import { DailyReview } from "../dashboard/components/DailyReview";
import { useToast } from "../../components/ui/Toast";

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: "text-red-400 border-red-500/40 bg-red-500/10",
  medium: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  low: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
};

export function TasksPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const {
    tasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    exportTasks,
    importTasks,
    loading,
    progress,
  } = useTasks();

  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newTags, setNewTags] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevProgress = useRef(0);

  const today = getTodayDate();
  const isTodaySelected = selectedDate === today;

  const selectedTasks = tasks
    .filter((task) => task.date === selectedDate)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const selectedCompletedCount = selectedTasks.filter(
    (task) => task.completed,
  ).length;

  const selectedTotalCount = selectedTasks.length;

  const selectedProgress =
    selectedTotalCount > 0
      ? Math.round((selectedCompletedCount / selectedTotalCount) * 100)
      : 0;

  const selectedVisibleTasks = selectedTasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  useEffect(() => {
    if (
      isTodaySelected &&
      selectedProgress === 100 &&
      selectedTotalCount > 0 &&
      prevProgress.current < 100
    ) {
      setShowConfetti(true);
      toast.success(t("tasks.allDone"));
    }
    prevProgress.current = selectedProgress;
  }, [selectedProgress, selectedTotalCount, isTodaySelected, t, toast]);

  async function handleAddTask() {
    const title = newTask.trim();
    if (!title) return;

    const tags = newTags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await addTask(title, {
      priority: newPriority,
      tags,
      date: selectedDate,
    });

    setNewTask("");
    setNewTags("");
    setNewPriority("medium");
    toast.success(t("tasks.added"));
  }

  function handleDragStart(id: number) {
    setDragId(id);
  }

  function handleDragOver(e: React.DragEvent, overId: number) {
    e.preventDefault();
    if (dragId == null || dragId === overId) return;

    const ids = selectedVisibleTasks.map((t) => t.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(overId);
    if (from < 0 || to < 0) return;

    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, dragId);

    // optimistic visual reorder via full list ids for the day
    const dayIds = selectedTasks.map((t) => t.id);
    const reorderedDay = [
      ...next,
      ...dayIds.filter((id) => !next.includes(id)),
    ];
    void reorderTasks(reorderedDay);
  }

  function handleDragEnd() {
    setDragId(null);
  }

  async function handleExport() {
    try {
      const json = await exportTasks();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `personal-os-tasks-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t("tasks.exportSuccess"));
    } catch {
      toast.error(t("tasks.exportError"));
    }
  }

  async function handleImport(file: File) {
    try {
      const text = await file.text();
      const count = await importTasks(text);
      toast.success(t("tasks.importSuccess", { count }));
    } catch {
      toast.error(t("tasks.importError"));
    }
  }

  return (
    <div className="relative mx-auto max-w-5xl space-y-8">
      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />

      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-[var(--color-primary)]">
            {t("tasks.dailyPlan")}
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isTodaySelected
              ? t("tasks.todayTitle")
              : t("tasks.selectedDayTitle")}
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t("tasks.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Download size={14} />
            {t("tasks.export")}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Upload size={14} />
            {t("tasks.import")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <TaskCalendar
        tasks={tasks}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {isTodaySelected && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                ref={inputRef}
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddTask();
                  }
                }}
                placeholder={t("tasks.newTaskPlaceholder")}
                className="h-11 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-white outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
              />

              <button
                type="button"
                onClick={handleAddTask}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                <Plus size={18} />
                {t("tasks.addTask")}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">
                {t("tasks.priority")}:
              </span>
              {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={`rounded-lg border px-2.5 py-1 text-xs transition ${
                    newPriority === p
                      ? PRIORITY_COLORS[p]
                      : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                  }`}
                >
                  {t(`tasks.priorities.${p}`)}
                </button>
              ))}

              <input
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder={t("tasks.tagsPlaceholder")}
                className="h-8 min-w-[140px] flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </section>
      )}

      {isTodaySelected && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t("tasks.todayProgress")}
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {selectedCompletedCount}
                </span>

                <span className="text-sm text-[var(--color-text-muted)]">
                  {t("tasks.ofTasks", {
                    count: selectedTotalCount,
                  })}
                </span>
              </div>
            </div>

            <ProgressRing
              progress={selectedProgress}
              size={72}
              strokeWidth={6}
            />
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-4">
          <h2 className="font-bold">
            {isTodaySelected
              ? t("tasks.todayList")
              : t("tasks.selectedDayList")}
          </h2>

          <div className="flex rounded-lg bg-[var(--color-bg)] p-1">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              {t("tasks.filters.all")}
            </FilterButton>

            <FilterButton
              active={filter === "active"}
              onClick={() => setFilter("active")}
            >
              {t("tasks.filters.active")}
            </FilterButton>

            <FilterButton
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              {t("tasks.filters.completed")}
            </FilterButton>
          </div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {loading ? (
            <TaskSkeleton />
          ) : selectedVisibleTasks.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <CheckCircle2
                size={32}
                className="mx-auto text-[var(--color-text-muted)]"
              />

              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                {t("tasks.empty")}
              </p>
            </div>
          ) : (
            selectedVisibleTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => {
                  void toggleTask(task.id);
                }}
                onDelete={() => {
                  void deleteTask(task.id);
                  toast.info(t("tasks.deleted"));
                }}
                onPriorityChange={(p) => {
                  void updateTask(task.id, { priority: p });
                }}
                draggable={isTodaySelected}
                onDragStart={() => handleDragStart(task.id)}
                onDragOver={(e) => handleDragOver(e, task.id)}
                onDragEnd={handleDragEnd}
                isDragging={dragId === task.id}
              />
            ))
          )}
        </div>
      </section>

      {/* Floating Action Button */}
      {isTodaySelected && (
        <button
          type="button"
          onClick={() => {
            inputRef.current?.focus();
            inputRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
          className="fixed bottom-24 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-purple-500/30 transition hover:scale-105 hover:bg-[var(--color-primary-hover)] lg:bottom-8"
          aria-label={t("tasks.addTask")}
        >
          <Plus size={24} />
        </button>
      )}

      <DailyReview date={selectedDate} />
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-5 py-4 animate-pulse"
        >
          <div className="h-5 w-5 rounded-md bg-[var(--color-surface-hover)]" />
          <div className="h-4 flex-1 rounded bg-[var(--color-surface-hover)]" />
          <div className="h-6 w-12 rounded bg-[var(--color-surface-hover)]" />
        </div>
      ))}
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onDelete,
  onPriorityChange,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPriorityChange: (p: TaskPriority) => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`group flex items-center gap-2 px-3 py-3 transition-colors hover:bg-[var(--color-surface-hover)] sm:gap-3 sm:px-5 sm:py-4 ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {draggable && (
        <button
          type="button"
          className="cursor-grab touch-none text-[var(--color-text-muted)] opacity-40 transition group-hover:opacity-100"
          aria-label="Drag"
        >
          <GripVertical size={16} />
        </button>
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          task.completed ? t("tasks.restoreTask") : t("tasks.completeTask")
        }
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
          task.completed
            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
            : "border-[var(--color-border-hover)] text-transparent hover:border-[var(--color-primary)]",
        ].join(" ")}
      >
        <Check size={13} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <span
          className={[
            "block text-sm transition-all",
            task.completed
              ? "text-[var(--color-text-muted)] line-through"
              : "text-[var(--color-text-secondary)]",
          ].join(" ")}
        >
          {task.title}
        </span>

        {task.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[10px] text-[var(--color-primary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <select
          value={task.priority}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
          className={`appearance-none rounded-lg border px-2 py-1 pe-6 text-[10px] outline-none ${PRIORITY_COLORS[task.priority]}`}
          aria-label={t("tasks.priority")}
        >
          <option value="low">{t("tasks.priorities.low")}</option>
          <option value="medium">{t("tasks.priorities.medium")}</option>
          <option value="high">{t("tasks.priorities.high")}</option>
        </select>
        <Flag
          size={10}
          className="pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 opacity-60"
        />
      </div>

      <button
        type="button"
        onClick={onDelete}
        aria-label={t("tasks.deleteTask")}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] opacity-0 transition-all hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--color-danger)] group-hover:opacity-100"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
        active
          ? "bg-[var(--color-surface-hover)] text-white"
          : "text-[var(--color-text-muted)] hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
