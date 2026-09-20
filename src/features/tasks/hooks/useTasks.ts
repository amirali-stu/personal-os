import { useCallback, useEffect, useMemo, useState } from "react";

import {
  tasksDb,
  type TaskPriority,
  type TaskRecord,
} from "../services/tasksDb";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { getTodayDate } from "../../../lib/dateUtils";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  date: string;
  priority: TaskPriority;
  tags: string[];
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

export type TaskFilter = "all" | "active" | "completed";

function mapTask(task: TaskRecord): Task {
  return {
    id: task.id!,
    title: task.title,
    completed: task.completed,
    date: task.date,
    priority: task.priority ?? "medium",
    tags: task.tags ?? [],
    sortOrder: task.sortOrder ?? task.createdAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export function useTasks() {
  const timezone = useSettingsStore((state) => state.timezone);
  const today = getTodayDate(timezone);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>("all");

  const loadTasks = useCallback(async () => {
    try {
      const data = await tasksDb.tasks.orderBy("sortOrder").toArray();
      setTasks(data.map(mapTask));
    } catch (error) {
      console.error("Tasks loading error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();

    function handleTasksUpdated() {
      loadTasks();
    }

    window.addEventListener("tasks-updated", handleTasksUpdated);
    return () =>
      window.removeEventListener("tasks-updated", handleTasksUpdated);
  }, [loadTasks]);

  const todayTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.date === today)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [tasks, today],
  );

  const completedTasks = useMemo(
    () => todayTasks.filter((task) => task.completed),
    [todayTasks],
  );

  const activeTasks = useMemo(
    () => todayTasks.filter((task) => !task.completed),
    [todayTasks],
  );

  const completedCount = completedTasks.length;
  const activeCount = activeTasks.length;
  const totalCount = todayTasks.length;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    if (filter === "active") return activeTasks;
    if (filter === "completed") return completedTasks;
    return todayTasks;
  }, [todayTasks, activeTasks, completedTasks, filter]);

  async function addTask(
    title: string,
    options?: { priority?: TaskPriority; tags?: string[]; date?: string },
  ) {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const now = Date.now();
    const taskDate = options?.date ?? today;

    const id = await tasksDb.tasks.add({
      title: cleanTitle,
      completed: false,
      date: taskDate,
      priority: options?.priority ?? "medium",
      tags: options?.tags ?? [],
      sortOrder: now,
      createdAt: now,
      updatedAt: now,
    });

    const task: Task = {
      id,
      title: cleanTitle,
      completed: false,
      date: taskDate,
      priority: options?.priority ?? "medium",
      tags: options?.tags ?? [],
      sortOrder: now,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((current) => [...current, task]);
    window.dispatchEvent(new Event("tasks-updated"));
    return task;
  }

  async function toggleTask(id: number) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const completed = !task.completed;
    const updatedAt = Date.now();

    await tasksDb.tasks.update(id, { completed, updatedAt });

    setTasks((current) =>
      current.map((item) =>
        item.id === id ? { ...item, completed, updatedAt } : item,
      ),
    );

    window.dispatchEvent(new Event("tasks-updated"));
  }

  async function deleteTask(id: number) {
    await tasksDb.tasks.delete(id);
    setTasks((current) => current.filter((task) => task.id !== id));
    window.dispatchEvent(new Event("tasks-updated"));
  }

  async function updateTask(
    id: number,
    patch: Partial<Pick<Task, "title" | "priority" | "tags" | "date">>,
  ) {
    const updatedAt = Date.now();
    await tasksDb.tasks.update(id, { ...patch, updatedAt });

    setTasks((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...patch, updatedAt } : item,
      ),
    );

    window.dispatchEvent(new Event("tasks-updated"));
  }

  async function reorderTasks(orderedIds: number[]) {
    await Promise.all(
      orderedIds.map((id, index) =>
        tasksDb.tasks.update(id, {
          sortOrder: index + 1,
          updatedAt: Date.now(),
        }),
      ),
    );

    setTasks((current) => {
      const map = new Map(current.map((t) => [t.id, t]));
      const reordered = orderedIds
        .map((id, index) => {
          const t = map.get(id);
          if (!t) return null;
          return { ...t, sortOrder: index + 1 };
        })
        .filter(Boolean) as Task[];
      const remaining = current.filter((t) => !orderedIds.includes(t.id));
      return [...reordered, ...remaining];
    });

    window.dispatchEvent(new Event("tasks-updated"));
  }

  async function exportTasks(): Promise<string> {
    const data = await tasksDb.tasks.toArray();
    return JSON.stringify(
      { version: 1, exportedAt: new Date().toISOString(), tasks: data },
      null,
      2,
    );
  }

  async function importTasks(json: string): Promise<number> {
    const parsed = JSON.parse(json) as { tasks?: TaskRecord[] };
    if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
      throw new Error("Invalid tasks file");
    }

    const toAdd = parsed.tasks.map((t) => {
      const { id: _id, ...rest } = t;
      return {
        ...rest,
        priority: rest.priority ?? "medium",
        tags: rest.tags ?? [],
        sortOrder: rest.sortOrder ?? rest.createdAt ?? Date.now(),
      };
    });

    await tasksDb.tasks.bulkAdd(toAdd);
    await loadTasks();
    window.dispatchEvent(new Event("tasks-updated"));
    return toAdd.length;
  }

  return {
    tasks,
    todayTasks,
    recentTasks,
    visibleTasks,
    completedTasks,
    activeTasks,
    completedCount,
    activeCount,
    totalCount,
    progress,
    filter,
    setFilter,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    exportTasks,
    importTasks,
    reload: loadTasks,
  };
}
