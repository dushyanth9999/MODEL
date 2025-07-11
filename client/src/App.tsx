import React, { useState, useEffect } from 'react';
import { Building2, BarChart3, FileText, Home, Upload, LogOut, User, Bell, Share2, Brain } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationService } from './utils/notifications';
import Dashboard from './components/Dashboard';
import DailyReportForm from './components/DailyReportForm';
import WeeklyReport from './components/WeeklyReport';
import CenterDetail from './components/CenterDetail';
import AdminPanel from './components/AdminPanel';
import FileUpload from './components/FileUpload';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import Login from './components/Login';
import NotificationCenter from './components/NotificationCenter';
import { ViewMode, Notification } from './types';

function AppContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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
  const canSubmitReports = user?.role === 'admin' || user?.role === 'cso' || user?.role === 'pm';
  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nxtwave-cream flex items-center justify-center">
        <div className="text-center">
          <img src="/logo-niat.png" alt="NxtWave Institute" className="h-16 w-auto mx-auto mb-4" />
          <div className="loading-spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-nxtwave-red font-medium">Loading NxtWave Operations Dashboard...</p>
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
        return <WeeklyReport onBack={handleBackToDashboard} />;
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
      case 'file-upload':
        return canSubmitReports ? (
          <FileUpload onBack={handleBackToDashboard} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Access denied. You don't have permission to upload files.</p>
          </div>
        );
      case 'analytics':
        return <AdvancedAnalytics onBack={handleBackToDashboard} />;
      default:
        return <Dashboard onViewModeChange={handleViewModeChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-nxtwave-cream transition-colors">
      {/* Enhanced Navigation */}
      <nav className="bg-nxtwave-red shadow-sm border-b border-nxtwave-red-dark transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="logo-container">
                <img src="/logo-niat.png" alt="NxtWave Institute" className="niat-logo" />
                <span className="logo-text">Operations Dashboard</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => handleViewModeChange('dashboard')}
                  className={`nav-link ${viewMode === 'dashboard' ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                {canSubmitReports && (
                  <>
                    <button
                      onClick={() => handleViewModeChange('daily-form')}
                      className={`nav-link ${viewMode === 'daily-form' ? 'nav-link-active' : 'nav-link-inactive'}`}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Daily Report</span>
                    </button>
                    <button
                      onClick={() => handleViewModeChange('file-upload')}
                      className={`nav-link ${viewMode === 'file-upload' ? 'nav-link-active' : 'nav-link-inactive'}`}
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Reports</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleViewModeChange('weekly-report')}
                  className={`nav-link ${viewMode === 'weekly-report' ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Weekly Report</span>
                </button>
                <button
                  onClick={() => handleViewModeChange('analytics')}
                  className={`nav-link ${viewMode === 'analytics' ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <Brain className="h-4 w-4" />
                  <span>AI Analytics</span>
                </button>
                {canAccessAdmin && (
                  <button
                    onClick={() => handleViewModeChange('admin')}
                    className={`nav-link ${viewMode === 'admin' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-gray-500 capitalize">
                      {user?.role === 'cso' ? 'CSO' : user?.role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
              
              {/* Date Display */}
              <div className="text-sm text-gray-600 hidden lg:block">
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;