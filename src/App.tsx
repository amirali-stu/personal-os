import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ScrollToTopPage from "./components/common/ScrollToTopPage";
import { AppRouter } from "./app/router";
import { ColorMoodProvider } from "./providers/ColorMoodProvider";
import { useSettingsStore } from "./app/store/settingsStore";

function AppLanguageSync() {
  const language = useSettingsStore((state) => state.language);
  const initialized = useSettingsStore((state) => state.initialized);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }

    document.documentElement.setAttribute(
      "dir",
      language === "fa" ? "rtl" : "ltr",
    );

    document.documentElement.setAttribute("lang", language);

    document.documentElement.style.fontVariantNumeric =
      language === "fa" ? "normal" : "tabular-nums";
  }, [initialized, language, i18n]);

  return null;
}

function App() {
  const initializeSettings = useSettingsStore((state) => state.initialize);

  useEffect(() => {
    void initializeSettings();
  }, [initializeSettings]);

  return (
    <BrowserRouter>
      <ScrollToTopPage />

      <ColorMoodProvider />

      <AppLanguageSync />

      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
