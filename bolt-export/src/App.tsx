import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DailyReportForm from './components/DailyReportForm';
import WeeklyReport from './components/WeeklyReport';
import AdminPanel from './components/AdminPanel';
import ActionTracker from './components/ActionTracker';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import { useAuth } from './contexts/AuthContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [selectedCenterId, setSelectedCenterId] = React.useState<string>();

  const handleViewModeChange = (mode: string, centerId?: string) => {
    setCurrentView(mode);
    setSelectedCenterId(centerId);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedCenterId(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="niat-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {currentView === 'dashboard' && (
          <Dashboard onViewModeChange={handleViewModeChange} />
        )}
        {currentView === 'daily-report' && (
          <DailyReportForm onBack={handleBack} selectedCenterId={selectedCenterId} />
        )}
        {currentView === 'weekly-report' && (
          <WeeklyReport onBack={handleBack} onViewModeChange={handleViewModeChange} />
        )}
        {currentView === 'admin' && (
          <AdminPanel onBack={handleBack} />
        )}
        {currentView === 'action-tracker' && (
          <ActionTracker onBack={handleBack} />
        )}
        {currentView === 'analytics' && (
          <AdvancedAnalytics onBack={handleBack} />
        )}
        {currentView === 'center-detail' && selectedCenterId && (
          <div className="p-6">
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-maroon-700 text-cream-50 rounded-lg hover:bg-maroon-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-foreground">Center Details: {selectedCenterId}</h1>
            <p className="text-muted-foreground mt-2">Detailed view for center coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;