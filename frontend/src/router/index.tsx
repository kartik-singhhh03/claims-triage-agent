import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import UploadPage from '../pages/UploadPage';
import UploadConfirmation from '../pages/UploadConfirmation';
import TeamClaimsPage from '../pages/TeamClaimsPage';
import ClaimDetailPage from '../pages/ClaimDetailPage';
import DashboardPage from '../pages/DashboardPage';
import QueuesPage from '../pages/QueuesPage';
import RulesPage from '../pages/RulesPage';
import LayoutContainer from '../components/layout/LayoutContainer';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/upload-confirmation" element={<UploadConfirmation />} />

        {/* Team Routes */}
        <Route
          path="/*"
          element={
            <LayoutContainer>
              <Routes>
                <Route path="/team" element={<TeamClaimsPage />} />
                <Route path="/claim/:claimId" element={<ClaimDetailPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/queues" element={<QueuesPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </LayoutContainer>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
