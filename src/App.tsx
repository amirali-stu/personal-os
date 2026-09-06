import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "./app/router";
import { ColorMoodProvider } from "./providers/ColorMoodProvider";
import { useSettingsStore } from "./app/store/settingsStore";

function App() {
  const initializeSettings = useSettingsStore((state) => state.initialize);

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  return (
    <BrowserRouter>
      <ColorMoodProvider />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
