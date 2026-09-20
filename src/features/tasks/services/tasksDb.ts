import Dexie, { type Table } from "dexie";

export type TaskPriority = "low" | "medium" | "high";

export type TaskRecord = {
  id?: number;
  title: string;
  completed: boolean;
  date: string;
  priority: TaskPriority;
  tags: string[];
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

class TasksDatabase extends Dexie {
  tasks!: Table<TaskRecord, number>;

  constructor() {
    super("personal-os-tasks");

    this.version(1).stores({
      tasks: "++id, completed, createdAt, updatedAt",
    });

    this.version(2).stores({
      tasks: "++id, date, completed, createdAt, updatedAt",
    });

    // v3: priority, tags, sortOrder
    this.version(3)
      .stores({
        tasks: "++id, date, completed, priority, sortOrder, createdAt, updatedAt",
      })
      .upgrade(async (tx) => {
        await tx
          .table("tasks")
          .toCollection()
          .modify((task: TaskRecord) => {
            if (task.priority == null) task.priority = "medium";
            if (task.tags == null) task.tags = [];
            if (task.sortOrder == null) task.sortOrder = task.createdAt ?? Date.now();
          });
      });
  }
}

export const tasksDb = new TasksDatabase();
