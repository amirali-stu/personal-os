import { useEffect } from "react";

import { useSettingsStore } from "../app/store/settingsStore";
import { colorMoods } from "../theme/colorMoods";

export function ColorMoodProvider() {
  const accentColor = useSettingsStore((state) => state.accentColor);

  const darkMode = useSettingsStore((state) => state.darkMode);

  useEffect(() => {
    const mood = colorMoods[accentColor];

    if (!mood) {
      return;
    }

    const root = document.documentElement;

    root.style.setProperty("--color-primary", mood.primary);

    root.style.setProperty("--color-primary-hover", mood.primaryHover);

    root.style.setProperty("--color-primary-soft", mood.primarySoft);
  }, [accentColor]);

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.remove("light-mode");
    } else {
      root.classList.add("light-mode");
    }
  }, [darkMode]);

  return null;
}
