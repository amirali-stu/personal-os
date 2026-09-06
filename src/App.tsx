import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AppRouter } from "./app/router";
import { ColorMoodProvider } from "./providers/ColorMoodProvider";
import { useSettingsStore } from "./app/store/settingsStore";

function AppLanguageSync() {
  const language = useSettingsStore((state) => state.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }

    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language, i18n]);

  return null;
}

function App() {
  const initializeSettings = useSettingsStore((state) => state.initialize);

  useEffect(() => {
    void initializeSettings();
  }, [initializeSettings]);

  return (
    <BrowserRouter>
      <ColorMoodProvider />

      <AppLanguageSync />

      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
