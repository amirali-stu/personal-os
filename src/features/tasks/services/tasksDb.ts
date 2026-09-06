import Dexie, { type Table } from "dexie";

export type TaskRecord = {
  id?: number;
  title: string;
  completed: boolean;
  date: string;
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
  }
}

export const tasksDb = new TasksDatabase();
