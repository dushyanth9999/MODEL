import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
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
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { centers, mockReports } from '../data/mockData';
import { DailyReport } from '../types';

interface DashboardProps {
  onViewModeChange: (mode: string, centerId?: string) => void;
}

export default function Dashboard({ onViewModeChange }: DashboardProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState(false);
  const [actionTemplates, setActionTemplates] = useState<any[]>([]);
  const [dailyTrackers, setDailyTrackers] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const todayReports = mockReports;
  const totalCenters = centers.length;
  const reportsSubmitted = todayReports.length;
  const pendingReports = totalCenters - reportsSubmitted;

  // Fetch action tracker data
  useEffect(() => {
    const fetchActionTrackerData = async () => {
      try {
        const templatesRes = await fetch('/api/action-tracker-templates');
        const templates = await templatesRes.json();
        setActionTemplates(templates);

        const trackersRes = await fetch(`/api/daily-action-trackers?date=${selectedDate.toISOString().split('T')[0]}&userId=${user?.id || 1}`);
        const trackers = await trackersRes.json();
        setDailyTrackers(Array.isArray(trackers) ? trackers : []);
      } catch (error) {
        console.error('Error fetching action tracker data:', error);
        setDailyTrackers([]);
      }
    };

    if (user) {
      fetchActionTrackerData();
    }
  }, [selectedDate, user]);

  const userTemplates = actionTemplates.filter(template => 
    template.role === user?.role || (user?.role === 'admin' && template.role === 'cos')
  );

  const getCompletionPercentage = (template: any) => {
    if (!Array.isArray(dailyTrackers)) return 0;
    const tracker = dailyTrackers.find(t => t.templateId === template.id);
    if (!tracker || !tracker.completedItems || template.items.length === 0) return 0;
    return Math.round((tracker.completedItems.length / template.items.length) * 100);
  };

  const handleItemToggle = async (templateId: number, item: string) => {
    try {
      if (!Array.isArray(dailyTrackers)) return;
      const existingTracker = dailyTrackers.find(t => t.templateId === templateId);
      
      if (existingTracker) {
        const isCompleted = existingTracker.completedItems.includes(item);
        const updatedItems = isCompleted
          ? existingTracker.completedItems.filter((i: string) => i !== item)
          : [...existingTracker.completedItems, item];

        const response = await fetch(`/api/daily-action-trackers/${existingTracker.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedItems: updatedItems })
        });

        if (response.ok) {
          setDailyTrackers(prev => 
            prev.map(t => 
              t.id === existingTracker.id 
                ? { ...t, completedItems: updatedItems }
                : t
            )
          );
        }
      } else {
        const response = await fetch('/api/daily-action-trackers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            templateId,
            centerId: user?.centerId,
            date: selectedDate.toISOString().split('T')[0],
            completedItems: [item]
          })
        });

        if (response.ok) {
          const newTracker = await response.json();
          setDailyTrackers(prev => [...prev, newTracker]);
        }
      }
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  // Calculate aggregate statistics
  const totalItems = todayReports.reduce((sum, report) => sum + report.items.length, 0);
  const okItems = todayReports.reduce((sum, report) => 
    sum + report.items.filter(item => item.status === 'OK').length, 0);
  const issueItems = todayReports.reduce((sum, report) => 
    sum + report.items.filter(item => item.status === 'ISSUE').length, 0);
  const highRiskItems = todayReports.reduce((sum, report) => 
    sum + report.items.filter(item => item.status === 'HIGH_RISK').length, 0);

  const okPercentage = totalItems > 0 ? Math.round((okItems / totalItems) * 100) : 0;

  // Get centers with immediate attention items
  const centersNeedingAttention = todayReports.filter(report => 
    report.summary.immediateAttention.length > 0 || report.summary.highRisk.length > 0
  );

  // Get unique locations for filter
  const locations = [...new Set(centers.map(center => center.location))];

  // Filter and sort centers
  const filteredCenters = centers
    .filter(center => {
      const matchesSearch = searchTerm === '' || 
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.cos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.pm.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = selectedLocation === 'all' || center.location === selectedLocation;
      
      const report = todayReports.find(r => r.centerId === center.id);
      const hasReport = !!report;
      
      let status = 'no-report';
      if (hasReport && report) {
        const hasHighRisk = report.summary.highRisk.length > 0;
        const hasImmediateAttention = report.summary.immediateAttention.length > 0;
        const hasIssues = report.summary.goingWrong.length > 0;

        if (hasHighRisk || hasImmediateAttention) {
          status = 'attention';
        } else if (hasIssues) {
          status = 'issues';
        } else {
          status = 'good';
        }
      }
      
      const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
      
      return matchesSearch && matchesLocation && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'location':
          return a.location.localeCompare(b.location);
        case 'status':
          const getStatusPriority = (centerId: string) => {
            const report = todayReports.find(r => r.centerId === centerId);
            if (!report) return 4;
            const hasHighRisk = report.summary.highRisk.length > 0;
            const hasImmediateAttention = report.summary.immediateAttention.length > 0;
            const hasIssues = report.summary.goingWrong.length > 0;
            if (hasHighRisk || hasImmediateAttention) return 1;
            if (hasIssues) return 2;
            return 3;
          };
          return getStatusPriority(a.id) - getStatusPriority(b.id);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch action tracker data
      const templatesRes = await fetch('/api/action-tracker-templates');
      const templates = await templatesRes.json();
      setActionTemplates(templates);

      const trackersRes = await fetch(`/api/daily-action-trackers?date=${selectedDate.toISOString().split('T')[0]}&userId=${user?.id || 1}`);
      const trackers = await trackersRes.json();
      setDailyTrackers(Array.isArray(trackers) ? trackers : []);
      
      // Simulate brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportDashboardData = () => {
    // This would export current dashboard data
    alert('Dashboard data export feature would be implemented');
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/api/assets/attached_assets/LOGIO_1752487117783.jpg?v=2" 
            alt="NIAT Logo" 
            className="h-12 w-12 rounded-lg shadow-sm"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-3xl font-bold text-red-700 dark:text-red-400">Ops Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2 mt-1">
              <Activity className="h-4 w-4" />
              <span>Real-time operations overview across all centers</span>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                Live
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-primary flex items-center space-x-2 px-4 py-2 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportDashboardData}
            className="btn-secondary flex items-center space-x-2 px-4 py-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => onViewModeChange('daily-form')}
            className="btn-outline flex items-center space-x-2 px-4 py-2 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>Daily Report</span>
          </button>
          <button
            onClick={() => onViewModeChange('weekly-report')}
            className="btn-outline flex items-center space-x-2 px-4 py-2 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Weekly Analysis</span>
          </button>
          <button
            onClick={() => onViewModeChange('action-tracker')}
            className="btn-outline flex items-center space-x-2 px-4 py-2 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Action Tracker</span>
          </button>
        </div>
      </div>

      {/* Action Tracker Section */}
      {userTemplates.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Action Tracker</h3>
            </div>
            <button
              onClick={() => onViewModeChange('action-tracker')}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {userTemplates.map((template) => {
              const tracker = Array.isArray(dailyTrackers) ? dailyTrackers.find(t => t.templateId === template.id) : null;
              const completionPercentage = getCompletionPercentage(template);
              
              return (
                <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        completionPercentage === 100 ? 'bg-green-500' : 
                        completionPercentage > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                      }`} />
                      <h4 className="font-medium text-gray-900 dark:text-white">{template.title}</h4>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        {template.role.toUpperCase()}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      completionPercentage === 100 ? 'text-green-600' : 
                      completionPercentage > 0 ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {completionPercentage}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {template.items.slice(0, 3).map((item: string, index: number) => {
                      const isCompleted = tracker?.completedItems?.includes(item) || false;
                      
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => handleItemToggle(template.id, item)}
                            className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                          />
                          <span className={`text-sm ${
                            isCompleted ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {item}
                          </span>
                        </div>
                      );
                    })}
                    {template.items.length > 3 && (
                      <div className="text-xs text-gray-500 pl-6">
                        +{template.items.length - 3} more items...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Centers</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalCenters}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Across {locations.length} locations</p>
            </div>
            <Building2 className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl shadow-sm border border-green-200 dark:border-green-800 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Reports Submitted</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{reportsSubmitted}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {pendingReports} pending • {Math.round((reportsSubmitted/totalCenters)*100)}% completion
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Overall Health</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{okPercentage}%</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">{okItems} of {totalItems} items OK</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl shadow-sm border border-red-200 dark:border-red-800 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Need Attention</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">{centersNeedingAttention.length}</p>
              <p className="text-xs text-red-600 dark:text-red-400">{highRiskItems} high risk items</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Enhanced Immediate Attention Alerts */}
      {centersNeedingAttention.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h3 className="font-semibold text-red-800 dark:text-red-200">Centers Requiring Immediate Attention</h3>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                {centersNeedingAttention.length} centers
              </span>
            </div>
            <button
              onClick={() => setExpandedAlerts(!expandedAlerts)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              {expandedAlerts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
          
          <div className={`space-y-3 ${expandedAlerts ? 'block' : 'hidden'}`}>
            {centersNeedingAttention.map(report => {
              const center = centers.find(c => c.id === report.centerId);
              return (
                <div key={report.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-700 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{center?.name}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{center?.location}</span>
                      </div>
                      
                      {report.summary.immediateAttention.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">Immediate Attention Required:</p>
                          <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                            {report.summary.immediateAttention.map((item, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {report.summary.highRisk.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">High Risk Items:</p>
                          <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                            {report.summary.highRisk.map((item, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>COS: {center?.cos}</span>
                        <span>PM: {center?.pm}</span>
                        <span>Updated: {report.submittedAt.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewModeChange('center-detail', report.centerId)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {!expandedAlerts && (
            <div className="text-center">
              <button
                onClick={() => setExpandedAlerts(true)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              >
                View all {centersNeedingAttention.length} alerts
              </button>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search centers, locations, or staff..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="good">All Good</option>
              <option value="issues">Minor Issues</option>
              <option value="attention">Needs Attention</option>
              <option value="no-report">No Report</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="location">Sort by Location</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
        
        {/* Filter Results Summary */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCenters.length} of {totalCenters} centers
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedLocation !== 'all' && ` in ${selectedLocation}`}
          {selectedStatus !== 'all' && ` with ${selectedStatus.replace('-', ' ')} status`}
        </div>
      </div>

      {/* Enhanced Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCenters.map(center => {
          const report = todayReports.find(r => r.centerId === center.id);
          const hasReport = !!report;
          
          let statusColor = 'gray';
          let statusText = 'No Report';
          let statusIcon = Clock;
          let healthScore = 0;

          if (hasReport && report) {
            const totalCenterItems = report.items.length;
            const okCenterItems = report.items.filter(item => item.status === 'OK').length;
            healthScore = totalCenterItems > 0 ? Math.round((okCenterItems / totalCenterItems) * 100) : 0;
            
            const hasHighRisk = report.summary.highRisk.length > 0;
            const hasImmediateAttention = report.summary.immediateAttention.length > 0;
            const hasIssues = report.summary.goingWrong.length > 0;

            if (hasHighRisk || hasImmediateAttention) {
              statusColor = 'red';
              statusText = 'Needs Attention';
              statusIcon = AlertTriangle;
            } else if (hasIssues) {
              statusColor = 'yellow';
              statusText = 'Minor Issues';
              statusIcon = AlertCircle;
            } else {
              statusColor = 'green';
              statusText = 'All Good';
              statusIcon = CheckCircle;
            }
          }

          const StatusIcon = statusIcon;

          return (
            <div
              key={center.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
              onClick={() => onViewModeChange('center-detail', center.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {center.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{center.location}</span>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all
                  ${statusColor === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    statusColor === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span>{statusText}</span>
                </div>
              </div>

              {/* Health Score Bar */}
              {hasReport && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Health Score</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{healthScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        healthScore >= 90 ? 'bg-green-500' :
                        healthScore >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${healthScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">COS:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{center.cos}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">PM:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{center.pm}</span>
                </div>
                
                {hasReport && report && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {report.submittedAt.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    {(report.summary.immediateAttention.length > 0 || report.summary.highRisk.length > 0) && (
                      <div className="mt-2">
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {report.summary.immediateAttention.length + report.summary.highRisk.length} urgent items
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredCenters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No centers found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLocation('all');
              setSelectedStatus('all');
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}