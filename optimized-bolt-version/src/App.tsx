// Main App Component - Optimized NIAT Operations Dashboard
import React, { useState } from 'react';
import { Router, Route, Link, useLocation } from 'wouter';
import { Menu, X, Sun, Moon, LogOut, Home, FileText, TrendingUp, Settings, User, Building2 } from 'lucide-react';
import { AppProvider, useAuth, useTheme, canUserAccessAdminPanel } from './contexts/AppContext';
import { LoginForm } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { DailyReportForm, WeeklyReport } from './components/Reports';
import { Button } from './components/UI';
import './index.css';

// Navigation Component
const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/daily-report', label: 'Daily Report', icon: FileText, requiresReportAccess: true },
    { path: '/weekly-report', label: 'Analytics', icon: TrendingUp },
    { path: '/admin', label: 'Admin Panel', icon: Settings, requiresAdmin: true }
  ];

  const visibleItems = navigationItems.filter(item => {
    if (item.requiresAdmin && !canUserAccessAdminPanel(user)) return false;
    if (item.requiresReportAccess && !['admin', 'cos', 'pm'].includes(user?.role || '')) return false;
    return true;
  });

  return (
    <nav className="bg-red-600 dark:bg-red-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-red-100 mr-3" />
            <h1 className="text-xl font-bold">NIAT Ops Dashboard</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {visibleItems.map(item => (
              <Link key={item.path} href={item.path}>
                <a className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === item.path 
                    ? 'bg-red-700 text-white' 
                    : 'text-red-100 hover:bg-red-500 hover:text-white'
                }`}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-red-100 hover:bg-red-500 hover:text-white"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-red-200 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-red-100 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-red-100 hover:bg-red-500 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-red-500">
              {visibleItems.map(item => (
                <Link key={item.path} href={item.path}>
                  <a 
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location === item.path 
                        ? 'bg-red-700 text-white' 
                        : 'text-red-100 hover:bg-red-500 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </a>
                </Link>
              ))}
              <div className="flex items-center justify-between px-3 py-2 border-t border-red-500 mt-4">
                <div>
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-red-200 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-red-100 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Admin Panel Component (Simple)
const AdminPanel = () => {
  const { user } = useAuth();
  
  if (!canUserAccessAdminPanel(user)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">You don't have permission to access this panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">User Management</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Manage user accounts and permissions</p>
          <Button className="bg-red-600 hover:bg-red-700">Manage Users</Button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">System Settings</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Configure system parameters</p>
          <Button variant="outline">View Settings</Button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Reports & Analytics</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Advanced reporting tools</p>
          <Button variant="outline">View Reports</Button>
        </div>
      </div>
    </div>
  );
};

// Main App Layout
const AppLayout = () => {
  const [, setLocation] = useLocation();

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'daily-report') {
      setLocation('/daily-report');
    } else if (page === 'weekly-report' || page === 'analytics') {
      setLocation('/weekly-report');
    } else if (page === 'admin') {
      setLocation('/admin');
    } else {
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Router>
          <Route path="/" component={() => <Dashboard onNavigate={handleNavigate} />} />
          <Route path="/daily-report" component={() => <DailyReportForm onBack={() => setLocation('/')} />} />
          <Route path="/weekly-report" component={() => <WeeklyReport onBack={() => setLocation('/')} />} />
          <Route path="/admin" component={AdminPanel} />
        </Router>
      </main>
    </div>
  );
};

// Root App Component
const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading NIAT Operations Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <AppLayout />;
};

export default App;