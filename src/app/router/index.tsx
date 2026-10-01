import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { DashboardPage } from "../../features/dashboard/DashboardPage";
import { TasksPage } from "../../features/tasks/TasksPage";
import { TradingPage } from "../../features/trading/TradingPage";
import { TradingPlanPage } from "../../features/trading/plan/TradingPlanPage";
import { SetupsPage } from "../../features/trading/setups/SetupsPage";
import { SetupDetailPage } from "../../features/trading/setups/SetupDetailPage";
import { CaseStudiesPage } from "../../features/trading/caseStudies/CaseStudiesPage";
import { MarketsPage } from "../../features/markets/MarketsPage";
import { MusicPage } from "../../features/music/MusicPage";
import { SettingsPage } from "../../features/settings/SettingsPage";
import { MotivationPage } from "../../features/motivation/MotivationPage";
import { AIPage } from "../../features/ai/AIPage";
import { CaseStudyDetailPage } from "../../features/trading/caseStudies/CaseStudyDetailPage";
import { ForwardTestsPage } from "../../features/trading/forwardTests/ForwardTestsPage";
import { MarkupDetailPage } from "../../features/trading/forwardTests/MarkupDetailPage";
import { WeekDetailPage } from "../../features/trading/forwardTests/WeekDetailPage";
import { KeyLessonsPage } from "../../features/trading/forwardTests/KeyLessonsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/trading" element={<TradingPage />} />
        <Route path="/trading/plan" element={<TradingPlanPage />} />
        <Route path="/trading/setups" element={<SetupsPage />} />
        <Route path="/trading/setups/:id" element={<SetupDetailPage />} />
        <Route path="/trading/case-studies" element={<CaseStudiesPage />} />
        <Route
          path="/trading/case-studies/:id"
          element={<CaseStudyDetailPage />}
        />
        <Route path="/trading/forward-tests" element={<ForwardTestsPage />} />
        <Route
          path="/trading/forward-tests/:markupId"
          element={<MarkupDetailPage />}
        />
        <Route
          path="/trading/forward-tests/:markupId/key-lessons"
          element={<KeyLessonsPage />}
        />
        <Route
          path="/trading/forward-tests/:markupId/week/:weekId"
          element={<WeekDetailPage />}
        />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/motivation" element={<MotivationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
