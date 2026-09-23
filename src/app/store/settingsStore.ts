import { create } from "zustand";

import {
  defaultSettings,
  settingsDb,
  type AppSettings,
} from "../../db/settingsDb";
import { useToastStore } from "./toastStore";

type SettingsState = AppSettings & {
  initialized: boolean;
  isApplying: boolean;

  initialize: () => Promise<void>;

  updateSetting: <K extends keyof Omit<AppSettings, "id">>(
    key: K,
    value: AppSettings[K],
  ) => Promise<void>;

  resetSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,

  initialized: false,
  isApplying: false,

  initialize: async () => {
    const saved = await settingsDb.settings.get("settings");

    if (saved) {
      set({
        ...saved,
        initialized: true,
        isApplying: false,
      });

      return;
    }

    await settingsDb.settings.put(defaultSettings);

    set({
      ...defaultSettings,
      initialized: true,
      isApplying: false,
    });
  },

  updateSetting: async (key, value) => {
    const state = get();

    // اگر الان داره اعمال می‌شه، یا مقدار عوض نشده، کاری نکن
    if (state.isApplying) return;
    if (state[key] === value) return;

    set({ isApplying: true });

   
    await new Promise((resolve) => setTimeout(resolve, 500));

    set({
      [key]: value,
      isApplying: false,
    } as Partial<SettingsState>);

    await settingsDb.settings.update("settings", {
      [key]: value,
    });

    useToastStore.getState().addToast("تغییرات با موفقیت اعمال شد", "success");
  },

  resetSettings: async () => {
    const state = get();
    if (state.isApplying) return;

    set({ isApplying: true });

    await new Promise((resolve) => setTimeout(resolve, 500));

    await settingsDb.settings.put(defaultSettings);

    set({
      ...defaultSettings,
      initialized: true,
      isApplying: false,
    });

    useToastStore
      .getState()
      .addToast("تنظیمات به حالت پیش‌فرض برگشت", "success");
  },
}));
