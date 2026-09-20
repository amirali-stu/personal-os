import Dexie, { type Table } from "dexie";

export type AppSettings = {
  id: "settings";

  darkMode: boolean;
  accentColor: "violet" | "blue" | "emerald" | "amber" | "rose";
  displayMode: "desktop" | "compact";

  language: "fa" | "en";
  dateFormat: "jalali" | "gregorian";
  timezone: "local" | "utc";

  autoPlay: boolean;
  defaultSpeed: number;

  marketUpdates: boolean;
  currency: "toman" | "irr";

  tradeLimit: number;

  aiLocalOnly: boolean;
  aiModel: "local" | "cloud";
};

class SettingsDatabase extends Dexie {
  settings!: Table<AppSettings, string>;

  constructor() {
    super("personal-os-settings");

    this.version(1).stores({
      settings: "id",
    });
  }
}

export const settingsDb = new SettingsDatabase();

export const defaultSettings: AppSettings = {
  id: "settings",

  darkMode: true,
  accentColor: "violet",
  displayMode: "desktop",

  language: "fa",
  dateFormat: "jalali",
  timezone: "local",

  autoPlay: true,
  defaultSpeed: 1,

  marketUpdates: true,
  currency: "toman",

  tradeLimit: 2,

  aiLocalOnly: true,
  aiModel: "local",
};
