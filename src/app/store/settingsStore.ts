import { create } from "zustand";

import {
  defaultSettings,
  settingsDb,
  type AppSettings,
} from "../../db/settingsDb";

type SettingsState = AppSettings & {
  initialized: boolean;

  initialize: () => Promise<void>;

  updateSetting: <K extends keyof Omit<AppSettings, "id">>(
    key: K,
    value: AppSettings[K],
  ) => Promise<void>;

  resetSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...defaultSettings,

  initialized: false,

  initialize: async () => {
    const saved = await settingsDb.settings.get("settings");

    if (saved) {
      set({
        ...saved,
        initialized: true,
      });

      return;
    }

    await settingsDb.settings.put(defaultSettings);

    set({
      ...defaultSettings,
      initialized: true,
    });
  },

  updateSetting: async (key, value) => {
    set({
      [key]: value,
    } as Partial<SettingsState>);

    await settingsDb.settings.update("settings", {
      [key]: value,
    });
  },

  resetSettings: async () => {
    await settingsDb.settings.put(defaultSettings);

    set({
      ...defaultSettings,
      initialized: true,
    });
  },
}));
