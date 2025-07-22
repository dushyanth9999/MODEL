// Main Dashboard Component with Analytics and Overview
import React, { useState, useMemo } from 'react';
import { 
  Building2, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Activity, BarChart3,
  Calendar, Search, Filter, RefreshCw, Eye, MapPin, AlertCircle
} from 'lucide-react';
import { useAuth, getUserAccessibleCenters } from '../contexts/AppContext';
import { centers, mockReports, actionItems } from '../data';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from './UI';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter centers based on user permissions
  const accessibleCenters = getUserAccessibleCenters(user, centers);
  
  // Dashboard statistics
  const stats = useMemo(() => {
    const todayReports = mockReports.filter(report => 
      accessibleCenters.some(center => center.id === report.centerId)
    );
    
    const totalCenters = accessibleCenters.length;
    const reportsSubmitted = todayReports.length;
    const pendingReports = totalCenters - reportsSubmitted;
    
    // Calculate action items statistics
    const totalActions = actionItems.length;
    const completedActions = actionItems.filter(item => item.completed).length;
    const pendingActions = totalActions - completedActions;
    
    // Calculate health scores
    const healthScores = accessibleCenters.map(center => {
      const report = todayReports.find(r => r.centerId === center.id);
      if (!report) return 75; // Default score for no report
      
      const total = report.items.length;
      const issues = report.items.filter(item => ['ISSUE', 'HIGH_RISK'].includes(item.status)).length;
      return Math.max(0, Math.round(((total - issues) / total) * 100));
    });
    
    const averageHealthScore = healthScores.length > 0 
      ? Math.round(healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length)
      : 85;

    return {
      totalCenters,
      reportsSubmitted,
      pendingReports,
      totalActions,
      completedActions,
      pendingActions,
      averageHealthScore,
      reportingRate: totalCenters > 0 ? Math.round((reportsSubmitted / totalCenters) * 100) : 0
    };
  }, [accessibleCenters, mockReports, actionItems]);

  // Filter centers for display
  const filteredCenters = useMemo(() => {
    return accessibleCenters.filter(center => {
      const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           center.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || center.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [accessibleCenters, searchTerm, selectedRegion]);

  // Get unique regions for filter
  const regions = [...new Set(accessibleCenters.map(center => center.region))];

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", onClick }: any) => (
    <Card className={`cursor-pointer hover:shadow-lg transition-all ${onClick ? 'hover:scale-105' : ''}`} 
          onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <Icon className={`h-8 w-8 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </CardContent>
    </Card>
  );

  const CenterCard = ({ center }: { center: any }) => {
    const report = mockReports.find(r => r.centerId === center.id);
    const hasReport = !!report;
    const healthScore = hasReport ? 
      Math.round(((report.items.length - report.items.filter(item => ['ISSUE', 'HIGH_RISK'].includes(item.status)).length) / report.items.length) * 100) : 
      75;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{center.name}</h3>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{center.location}, {center.region}</span>
              </div>
            </div>
            <Badge variant={hasReport ? "default" : "destructive"}>
              {hasReport ? "Reported" : "Pending"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Health Score</p>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  healthScore >= 90 ? 'bg-green-500' :
                  healthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="font-semibold">{healthScore}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
              <p className="font-semibold">{center.currentStrength}/{center.capacity}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onNavigate('center-detail', center)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            {['admin', 'cos', 'pm'].includes(user?.role || '') && (
              <Button 
                size="sm" 
                onClick={() => onNavigate('daily-report', { centerId: center.id })}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {hasReport ? 'Edit Report' : 'Submit Report'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username || 'User'}!
        </h1>
        <p className="text-red-100">
          {user?.role === 'head_of_niat' ? 'Monitoring all NIAT centers across India' :
           user?.role === 'admin' ? 'Managing operations dashboard' :
           `Managing ${accessibleCenters.length} center${accessibleCenters.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Centers"
          value={stats.totalCenters}
          subtitle={`Across ${regions.length} regions`}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Reports Today"
          value={stats.reportsSubmitted}
          subtitle={`${stats.reportingRate}% reporting rate`}
          icon={CheckCircle}
          color="green"
          onClick={() => onNavigate('weekly-report')}
        />
        <StatCard
          title="Pending Reports"
          value={stats.pendingReports}
          subtitle="Need attention"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Health Score"
          value={`${stats.averageHealthScore}%`}
          subtitle="Overall system health"
          icon={Activity}
          color="green"
          onClick={() => onNavigate('analytics')}
        />
      </div>

      {/* Action Items Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
            Daily Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats.totalActions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Actions</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.completedActions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{stats.pendingActions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Centers Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-red-600" />
              Centers Overview
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('weekly-report')}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                View Analytics
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search centers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Centers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCenters.map(center => (
              <CenterCard key={center.id} center={center} />
            ))}
          </div>

          {filteredCenters.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No centers found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};