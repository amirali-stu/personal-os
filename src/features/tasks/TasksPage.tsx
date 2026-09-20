// TasksPage.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, CheckCircle2, Plus, Trash2 } from "lucide-react";

import { useTasks, type Task } from "./hooks/useTasks";
import { TaskCalendar } from "./components/TaskCalendar";
import { getTodayDate } from "../../lib/dateUtils";

export function TasksPage() {
  const { t } = useTranslation();

  const { tasks, filter, setFilter, addTask, toggleTask, deleteTask } =
    useTasks();

  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const today = getTodayDate();
  const isTodaySelected = selectedDate === today;

  const selectedTasks = tasks.filter((task) => task.date === selectedDate);

  const selectedCompletedCount = selectedTasks.filter(
    (task) => task.completed,
  ).length;

  const selectedTotalCount = selectedTasks.length;

  const selectedProgress =
    selectedTotalCount > 0
      ? Math.round((selectedCompletedCount / selectedTotalCount) * 100)
      : 0;

  const selectedVisibleTasks = selectedTasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  function handleAddTask() {
    const title = newTask.trim();

    if (!title) {
      return;
    }

    addTask(title);
    setNewTask("");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
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
      </section>

      <TaskCalendar
        tasks={tasks}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {isTodaySelected && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddTask();
                }
              }}
              placeholder={t("tasks.newTaskPlaceholder")}
              className="h-11 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-white outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] max-md:py-3"
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
        </section>
      )}

      {isTodaySelected && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-end justify-between gap-4">
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

            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {selectedProgress}٪
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
              style={{
                width: `${selectedProgress}%`,
              }}
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
          {selectedVisibleTasks.length === 0 ? (
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
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[var(--color-surface-hover)]">
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

      <span
        className={[
          "flex-1 text-sm transition-all",
          task.completed
            ? "text-[var(--color-text-muted)] line-through"
            : "text-[var(--color-text-secondary)]",
        ].join(" ")}
      >
        {task.title}
      </span>

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
