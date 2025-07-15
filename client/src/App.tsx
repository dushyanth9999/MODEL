import React, { useState, useEffect } from 'react';
import { Building2, BarChart3, FileText, Home, Upload, LogOut, User, Bell, Share2, Brain, Moon, Sun } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { NotificationService } from './utils/notifications';
import Dashboard from './components/Dashboard';
import DailyReportForm from './components/DailyReportForm';
import WeeklyReport from './components/WeeklyReport';
import CenterDetail from './components/CenterDetail';
import AdminPanel from './components/AdminPanel';
import FileUpload from './components/FileUpload';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import ActionTracker from './components/ActionTracker';
import Login from './components/Login';
import NotificationCenter from './components/NotificationCenter';
import { ViewMode, Notification } from './types';

function AppContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = NotificationService.subscribe(setNotifications);
    
    // Request notification permission
    NotificationService.requestNotificationPermission();
    
    // Add some demo notifications
    if (isAuthenticated) {
      setTimeout(() => {
        NotificationService.createSystemNotification(
          'Welcome to NxtWave Operations Dashboard! Your enhanced analytics platform is ready.',
          'success'
        );
      }, 2000);
    }
    
    return unsubscribe;
  }, [isAuthenticated]);

  const handleViewModeChange = (mode: string, centerId?: string) => {
    setViewMode(mode as ViewMode);
    if (centerId) {
      setSelectedCenterId(centerId);
    }
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedCenterId('');
  };

  const canAccessAdmin = user?.role === 'admin';
  const canSubmitReports = user?.role === 'admin' || user?.role === 'cos' || user?.role === 'pm';
  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/api/assets/attached_assets/LOGIO_1752487117783.jpg?v=2" 
            alt="NIAT Logo" 
            className="h-16 w-auto mx-auto mb-4 rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-red-700 font-medium">Loading NIAT Operations Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'daily-form':
        return canSubmitReports ? (
          <DailyReportForm onBack={handleBackToDashboard} selectedCenterId={selectedCenterId} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Access denied. You don't have permission to submit reports.</p>
          </div>
        );
      case 'weekly-report':
        return <WeeklyReport onBack={handleBackToDashboard} onViewModeChange={handleViewModeChange} />;
      case 'center-detail':
        return <CenterDetail centerId={selectedCenterId} onBack={handleBackToDashboard} />;
      case 'admin':
        return canAccessAdmin ? (
          <AdminPanel onBack={handleBackToDashboard} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Access denied. Admin privileges required.</p>
          </div>
        );

      case 'analytics':
        return <AdvancedAnalytics onBack={handleBackToDashboard} />;
      case 'action-tracker':
        return (user?.role === 'admin' || user?.role === 'cos' || user?.role === 'pm') ? (
          <ActionTracker onBack={handleBackToDashboard} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Access denied. Only COS and PM roles can access Action Tracker.</p>
          </div>
        );
      default:
        return <Dashboard onViewModeChange={handleViewModeChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Enhanced Navigation */}
      <nav className="bg-red-700 shadow-sm border-b border-red-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/api/assets/attached_assets/LOGIO_1752487117783.jpg?v=2" 
                  alt="NIAT Logo" 
                  className="h-10 w-auto rounded-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Building2 className="h-8 w-8 text-amber-100 hidden" />
                <span className="text-xl font-bold text-amber-100">Ops Dashboard</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => handleViewModeChange('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'dashboard' 
                      ? 'bg-red-800 text-white' 
                      : 'text-amber-100 hover:text-white hover:bg-red-800'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                {canSubmitReports && (
                  <>
                    <button
                      onClick={() => handleViewModeChange('daily-form')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'daily-form' 
                          ? 'bg-red-800 text-white' 
                          : 'text-amber-100 hover:text-white hover:bg-red-800'
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Daily Report</span>
                    </button>

                  </>
                )}
                <button
                  onClick={() => handleViewModeChange('weekly-report')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'weekly-report' 
                      ? 'bg-red-800 text-white' 
                      : 'text-amber-100 hover:text-white hover:bg-red-800'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Weekly Report</span>
                </button>
                <button
                  onClick={() => handleViewModeChange('analytics')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'analytics' 
                      ? 'bg-red-800 text-white' 
                      : 'text-amber-100 hover:text-white hover:bg-red-800'
                  }`}
                >
                  <Brain className="h-4 w-4" />
                  <span>AI Analytics</span>
                </button>
                {canAccessAdmin && (
                  <button
                    onClick={() => handleViewModeChange('admin')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'admin' 
                        ? 'bg-red-800 text-white' 
                        : 'text-amber-100 hover:text-white hover:bg-red-800'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-amber-100 hover:text-white hover:bg-red-800 rounded-md transition-colors"
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="p-2 text-amber-100 hover:text-white hover:bg-red-800 rounded-md transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-400 text-red-800 text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-amber-100" />
                  <div className="text-sm">
                    <div className="font-medium text-amber-100">{user?.name}</div>
                    <div className="text-amber-100 opacity-75 capitalize">
                      {user?.role === 'cos' ? 'COS' : user?.role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-amber-100 hover:text-white hover:bg-red-800 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
              
              {/* Date Display */}
              <div className="text-sm text-amber-100 opacity-75 hidden lg:block">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;