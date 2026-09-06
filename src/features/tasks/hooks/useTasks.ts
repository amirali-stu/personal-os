import { useCallback, useEffect, useMemo, useState } from "react";

import { tasksDb, type TaskRecord } from "../services/tasksDb";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { getTodayDate } from "../../../lib/dateUtils";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  date: string;
  createdAt: number;
  updatedAt: number;
};

export type TaskFilter = "all" | "active" | "completed";

const initialTasks: Omit<TaskRecord, "id">[] = [
  {
    title: "بررسی بازار",
    completed: true,
    date: getTodayDate(),
    createdAt: Date.now() - 7000,
    updatedAt: Date.now() - 7000,
  },
  {
    title: "ثبت ژورنال ترید",
    completed: true,
    date: getTodayDate(),
    createdAt: Date.now() - 6000,
    updatedAt: Date.now() - 6000,
  },
  {
    title: "مطالعه روزانه",
    completed: true,
    date: getTodayDate(),
    createdAt: Date.now() - 5000,
    updatedAt: Date.now() - 5000,
  },
  {
    title: "تمرین",
    completed: false,
    date: getTodayDate(),
    createdAt: Date.now() - 4000,
    updatedAt: Date.now() - 4000,
  },
  {
    title: "بررسی معاملات هفته",
    completed: false,
    date: getTodayDate(),
    createdAt: Date.now() - 3000,
    updatedAt: Date.now() - 3000,
  },
  {
    title: "مرور برنامه فردا",
    completed: false,
    date: getTodayDate(),
    createdAt: Date.now() - 2000,
    updatedAt: Date.now() - 2000,
  },
  {
    title: "مطالعه یک مقاله",
    completed: false,
    date: getTodayDate(),
    createdAt: Date.now() - 1000,
    updatedAt: Date.now() - 1000,
  },
];

let seedPromise: Promise<void> | null = null;

async function seedTasksIfNeeded(today: string) {
  if (seedPromise) {
    return seedPromise;
  }

  seedPromise = (async () => {
    const count = await tasksDb.tasks.count();

    if (count > 0) {
      return;
    }

    await tasksDb.tasks.bulkAdd(
      initialTasks.map((task) => ({
        ...task,
        date: today,
      })),
    );
  })();

  try {
    await seedPromise;
  } finally {
    seedPromise = null;
  }
}

function mapTask(task: TaskRecord): Task {
  return {
    id: task.id!,
    title: task.title,
    completed: task.completed,
    date: task.date,
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
      await seedTasksIfNeeded(today);

      const data = await tasksDb.tasks.orderBy("createdAt").reverse().toArray();

      setTasks(data.map(mapTask));
    } catch (error) {
      console.error("Tasks loading error:", error);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    loadTasks();

    function handleTasksUpdated() {
      loadTasks();
    }

    window.addEventListener("tasks-updated", handleTasksUpdated);

    return () => {
      window.removeEventListener("tasks-updated", handleTasksUpdated);
    };
  }, [loadTasks]);

  /*
   * فقط Taskهای امروز
   */
  const todayTasks = useMemo(
    () => tasks.filter((task) => task.date === today),
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

  /*
   * ۵ Task آخر از کل Taskها،
   * نه فقط Taskهای امروز.
   */
  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    if (filter === "active") {
      return activeTasks;
    }

    if (filter === "completed") {
      return completedTasks;
    }

    return todayTasks;
  }, [todayTasks, activeTasks, completedTasks, filter]);

  async function addTask(title: string) {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const now = Date.now();

    const id = await tasksDb.tasks.add({
      title: cleanTitle,
      completed: false,
      date: today,
      createdAt: now,
      updatedAt: now,
    });

    const task: Task = {
      id,
      title: cleanTitle,
      completed: false,
      date: today,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((current) => [task, ...current]);

    window.dispatchEvent(new Event("tasks-updated"));
  }

  async function toggleTask(id: number) {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
      return;
    }

    const completed = !task.completed;

    const updatedAt = Date.now();

    await tasksDb.tasks.update(id, {
      completed,
      updatedAt,
    });

    setTasks((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              completed,
              updatedAt,
            }
          : item,
      ),
    );

    window.dispatchEvent(new Event("tasks-updated"));
  }

  async function deleteTask(id: number) {
    await tasksDb.tasks.delete(id);

    setTasks((current) => current.filter((task) => task.id !== id));

    window.dispatchEvent(new Event("tasks-updated"));
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

    reload: loadTasks,
  };
}
