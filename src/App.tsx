import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AppLayout } from './layouts/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { FundingRatesPage } from './pages/FundingRatesPage';
import { HistoricalFundingPage } from './pages/HistoricalFundingPage';
import { VolatilityPage } from './pages/VolatilityPage';
import { HeatmapsPage } from './pages/HeatmapsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProArbitragePage } from './pages/ProArbitragePage';
import { ProSimulatorPage } from './pages/ProSimulatorPage';
import { ProVolatilityTerminalPage } from './pages/ProVolatilityTerminalPage';
import { ProAdvancedAnalyticsPage } from './pages/ProAdvancedAnalyticsPage';
import { ProAlertsPage } from './pages/ProAlertsPage';
import { ProExportPage } from './pages/ProExportPage';
import { ProCustomDashboardPage } from './pages/ProCustomDashboardPage';
import { SettingsPage } from './pages/SettingsPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/app"
        element={
          <AppLayout>
            <OverviewPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/overview"
        element={
          <AppLayout>
            <OverviewPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/funding"
        element={
          <AppLayout>
            <FundingRatesPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/historical"
        element={
          <AppLayout>
            <HistoricalFundingPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/volatility"
        element={
          <AppLayout>
            <VolatilityPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/heatmaps"
        element={
          <AppLayout>
            <HeatmapsPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/alerts"
        element={
          <AppLayout>
            <AlertsPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/pro/arbitrage"
        element={
          <AppLayout>
            <ProArbitragePage />
          </AppLayout>
        }
      />
      <Route
        path="/app/pro/simulator"
        element={
          <AppLayout>
            <ProSimulatorPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/pro/volatility"
        element={
          <AppLayout>
            <ProVolatilityTerminalPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/pro/analytics"
        element={
          <AppLayout>
            <ProAdvancedAnalyticsPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/pro/alerts"
        element={
          <AppLayout>
            <ProAlertsPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/pro/export"
        element={
          <AppLayout>
            <ProExportPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/pro/custom"
        element={
          <AppLayout>
            <ProCustomDashboardPage />
          </AppLayout>
        }
      />
      <Route
        path="/app/settings"
        element={
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
