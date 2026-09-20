import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { DashboardPage } from "../../features/dashboard/DashboardPage";
import { TasksPage } from "../../features/tasks/TasksPage";
import { TradingPage } from "../../features/trading/TradingPage";
import { MarketsPage } from "../../features/markets/MarketsPage";
import { MusicPage } from "../../features/music/MusicPage";
import { SettingsPage } from "../../features/settings/SettingsPage";
import { AIPage } from "../../features/ai/AIPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/trading" element={<TradingPage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
