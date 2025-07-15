import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Calendar, 
  Settings,
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { centers, mockReports } from '../lib/data';

interface DashboardProps {
  onViewModeChange: (mode: string, centerId?: string) => void;
}

// Mock action tracker data for demo
const mockActionTemplates = [
  {
    id: 1,
    role: 'cos',
    title: 'Chief of Staff Daily Checklist',
    items: ['Review daily reports', 'Check KPIs', 'Team syncs', 'Strategic planning']
  },
  {
    id: 2,
    role: 'pm',
    title: 'Program Manager Daily Checklist', 
    items: ['Campus standup', 'Student issues', 'Lab checks', 'Faculty coordination']
  }
];

export default function Dashboard({ onViewModeChange }: DashboardProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState(false);

  // Filter centers based on user permissions
  const accessibleCenters = user?.role === 'head_of_niat' || user?.role === 'admin' 
    ? centers 
    : centers.filter(center => center.id === user?.centerId);

  const todayReports = mockReports.filter(report => 
    accessibleCenters.some(center => center.id === report.centerId)
  );

  const totalCenters = accessibleCenters.length;
  const reportsSubmitted = todayReports.length;
  const pendingReports = totalCenters - reportsSubmitted;

  // Get user-specific action templates
  const userTemplates = mockActionTemplates.filter(template => 
    template.role === user?.role || (user?.role === 'admin' && template.role === 'cos')
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Filter and sort centers
  const filteredCenters = accessibleCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || center.region === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const sortedCenters = [...filteredCenters].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'location': return a.location.localeCompare(b.location);
      case 'students': return b.students - a.students;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-maroon-700 text-cream-50 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-cream-100 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-maroon-700">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Ops Dashboard</h1>
              <p className="text-cream-200 text-sm">NIAT Operations Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-maroon-600 hover:bg-maroon-500 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <div className="text-right">
              <div className="font-medium">{user?.username}</div>
              <div className="text-cream-200 text-sm capitalize">{user?.role}</div>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 bg-maroon-600 hover:bg-maroon-500 rounded-lg transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Centers</p>
                <p className="text-2xl font-bold text-foreground">{totalCenters}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Reports Today</p>
                <p className="text-2xl font-bold text-foreground">{reportsSubmitted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending</p>
                <p className="text-2xl font-bold text-foreground">{pendingReports}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completion</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalCenters > 0 ? Math.round((reportsSubmitted / totalCenters) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onViewModeChange('daily-report')}
                className="p-4 bg-maroon-50 dark:bg-maroon-900/20 hover:bg-maroon-100 dark:hover:bg-maroon-900/40 rounded-lg border border-maroon-200 dark:border-maroon-800 transition-colors group"
              >
                <FileText className="h-6 w-6 text-maroon-600 dark:text-maroon-400 mb-2" />
                <p className="text-sm font-medium text-maroon-700 dark:text-maroon-300">Daily Report</p>
              </button>
              
              <button
                onClick={() => onViewModeChange('weekly-report')}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors"
              >
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Weekly Report</p>
              </button>
              
              <button
                onClick={() => onViewModeChange('action-tracker')}
                className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800 transition-colors"
              >
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Action Tracker</p>
              </button>
              
              <button
                onClick={() => onViewModeChange('analytics')}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors"
              >
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Analytics</p>
              </button>
            </div>
          </div>

          {/* Today's Progress */}
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Today's Progress</h2>
            {userTemplates.length > 0 ? (
              <div className="space-y-3">
                {userTemplates.map((template) => (
                  <div key={template.id} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{template.title}</h3>
                      <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-maroon-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      0 of {template.items.length} tasks completed
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No action items assigned to your role.</p>
            )}
          </div>
        </div>

        {/* Centers Overview */}
        <div className="bg-card rounded-xl shadow-soft border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Centers Overview</h2>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-maroon-700 text-cream-50 rounded-lg hover:bg-maroon-600 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search centers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-maroon-500"
              >
                <option value="all">All Regions</option>
                {[...new Set(accessibleCenters.map(c => c.region))].map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-maroon-500"
              >
                <option value="name">Sort by Name</option>
                <option value="location">Sort by Location</option>
                <option value="students">Sort by Students</option>
              </select>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedCenters.map((center) => {
                const hasReport = todayReports.some(r => r.centerId === center.id);
                
                return (
                  <div
                    key={center.id}
                    className="bg-muted/30 rounded-lg p-4 border border-border hover:shadow-soft transition-shadow cursor-pointer"
                    onClick={() => onViewModeChange('center-detail', center.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{center.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {center.location}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${hasReport ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">COS:</span>
                        <span className="text-foreground">{center.cos || 'TBD'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="text-foreground">{center.students.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-foreground capitalize">{center.type}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          hasReport 
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                            : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                        }`}>
                          {hasReport ? 'Report Submitted' : 'Pending Report'}
                        </span>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {sortedCenters.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No centers found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}