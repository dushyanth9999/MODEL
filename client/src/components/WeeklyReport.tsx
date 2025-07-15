import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Building2,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  MapPin,
  Zap,
  Cpu,
  Brain
} from 'lucide-react';
import { centers, mockReports } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getUserAccessibleCenters } from '../utils/rbac';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import * as XLSX from 'xlsx';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

interface WeeklyReportProps {
  onBack: () => void;
  onViewModeChange?: (mode: string) => void;
}

interface CenterAnalysis {
  centerId: string;
  centerName: string;
  location: string;
  cos: string;
  pm: string;
  totalItems: number;
  okItems: number;
  issueItems: number;
  highRiskItems: number;
  naItems: number;
  healthScore: number;
  reportSubmitted: boolean;
  lastUpdated?: Date;
  trends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
  criticalIssues: string[];
  achievements: string[];
}

export default function WeeklyReport({ onBack, onViewModeChange }: WeeklyReportProps) {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandAllCategories, setExpandAllCategories] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'visualization'>('overview');
  const { isDark } = useTheme();
  
  // Filter centers based on user permissions
  const accessibleCenters = getUserAccessibleCenters(user, centers);

  // Calculate weekly aggregates
  const totalCenters = centers.length;
  const reportsThisWeek = mockReports.length;
  
  const totalItems = mockReports.reduce((sum, report) => sum + report.items.length, 0);
  const okItems = mockReports.reduce((sum, report) => 
    sum + report.items.filter(item => item.status === 'OK').length, 0);
  const issueItems = mockReports.reduce((sum, report) => 
    sum + report.items.filter(item => item.status === 'ISSUE').length, 0);
  const highRiskItems = mockReports.reduce((sum, report) => 
    sum + report.items.filter(item => item.status === 'HIGH_RISK').length, 0);
  const naItems = mockReports.reduce((sum, report) => 
    sum + report.items.filter(item => item.status === 'NA').length, 0);

  const healthPercentage = totalItems > 0 ? Math.round((okItems / totalItems) * 100) : 0;
  const totalIssues = issueItems + highRiskItems;

  // AI Predictions and Analysis
  const generateAIPredictions = () => {
    const healthScore = Math.round((okItems / totalItems) * 100);
    const issueRate = Math.round((totalIssues / totalItems) * 100);
    const riskLevel = issueRate > 30 ? 'HIGH' : issueRate > 15 ? 'MEDIUM' : 'LOW';
    
    return {
      nextWeekRisk: riskLevel,
      recommendedActions: [
        'Increase maintenance frequency for high-risk areas',
        'Schedule training sessions for operational staff',
        'Implement preventive measures for recurring issues',
        'Review and update SOPs for critical processes'
      ],
      predictedIssues: Math.round(issueItems * 1.1),
      maintenanceNeeded: [
        'HVAC systems require scheduled maintenance',
        'Safety equipment needs inspection',
        'Network infrastructure updates pending'
      ],
      trendAnalysis: {
        improving: ['Safety protocols', 'Staff training completion'],
        declining: ['Equipment efficiency', 'Response times'],
        stable: ['Compliance scores', 'Customer satisfaction']
      }
    };
  };

  const aiPredictions = generateAIPredictions();

  // Chart Data Configuration
  const chartTheme = {
    background: isDark ? '#1f2937' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    grid: isDark ? '#374151' : '#e5e7eb'
  };

  const statusChartData = {
    labels: ['OK', 'Issues', 'High Risk', 'N/A'],
    datasets: [{
      data: [okItems, issueItems, highRiskItems, naItems],
      backgroundColor: [
        '#10b981', // green
        '#f59e0b', // yellow
        '#ef4444', // red
        '#6b7280'  // gray
      ],
      borderColor: chartTheme.background,
      borderWidth: 2
    }]
  };

  const trendsChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Health Score',
        data: [85, 82, 87, 89],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: 'Issue Rate',
        data: [15, 18, 13, 11],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  };

  const centerPerformanceData = {
    labels: centers.slice(0, 6).map(c => c.name),
    datasets: [{
      label: 'Health Score',
      data: [92, 88, 85, 91, 87, 89],
      backgroundColor: '#b91c1c',
      borderColor: '#991b1b',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: chartTheme.text
        }
      },
      title: {
        color: chartTheme.text
      }
    },
    scales: {
      x: {
        ticks: { color: chartTheme.text },
        grid: { color: chartTheme.grid }
      },
      y: {
        ticks: { color: chartTheme.text },
        grid: { color: chartTheme.grid }
      }
    }
  };

  // Generate center-wise analysis
  const centerAnalysis: CenterAnalysis[] = accessibleCenters.map(center => {
    const report = mockReports.find(r => r.centerId === center.id);
    const hasReport = !!report;
    
    let analysis: CenterAnalysis = {
      centerId: center.id,
      centerName: center.name,
      location: center.location,
      cos: center.cos, // Changed from coo to cos
      pm: center.pm,
      totalItems: 0,
      okItems: 0,
      issueItems: 0,
      highRiskItems: 0,
      naItems: 0,
      healthScore: 0,
      reportSubmitted: hasReport,
      trends: {
        improving: [],
        declining: [],
        stable: []
      },
      criticalIssues: [],
      achievements: []
    };

    if (hasReport && report) {
      analysis.totalItems = report.items.length;
      analysis.okItems = report.items.filter(item => item.status === 'OK').length;
      analysis.issueItems = report.items.filter(item => item.status === 'ISSUE').length;
      analysis.highRiskItems = report.items.filter(item => item.status === 'HIGH_RISK').length;
      analysis.naItems = report.items.filter(item => item.status === 'NA').length;
      analysis.healthScore = analysis.totalItems > 0 ? Math.round((analysis.okItems / analysis.totalItems) * 100) : 0;
      analysis.lastUpdated = report.submittedAt;
      
      // Mock trends data
      analysis.trends = {
        improving: ['Network Infrastructure', 'Student Engagement'],
        declining: ['Bus Punctuality'],
        stable: ['Fire Safety', 'CCTV Monitoring']
      };
      
      analysis.criticalIssues = report.summary.highRisk.concat(report.summary.immediateAttention);
      analysis.achievements = report.summary.goingGood;
    }

    return analysis;
  });

  // Group issues by category
  const issuesByCategory = mockReports.reduce((acc, report) => {
    report.items.filter(item => item.status === 'ISSUE' || item.status === 'HIGH_RISK').forEach(item => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        center: accessibleCenters.find(c => c.id === report.centerId)?.name || 'Unknown',
        item: item.item,
        status: item.status,
        remarks: item.remarks,
        timestamp: item.timestamp
      });
    });
    return acc;
  }, {} as Record<string, Array<{center: string, item: string, status: string, remarks: string, timestamp: Date}>>);

  // Calculate trends (enhanced with more realistic data)
  const trends = {
    improving: ['Network Infrastructure', 'Student Engagement', 'Facility Cleanliness', 'Learning Platform Usage'],
    declining: ['Bus Punctuality', 'AC Maintenance', 'Cafeteria Service'],
    stable: ['Fire Safety', 'Learning Platform', 'CCTV Monitoring', 'Water Quality', 'Power Supply']
  };

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // Filter centers based on search and location
  const filteredCenters = centerAnalysis.filter(center => {
    const matchesSearch = searchTerm === '' || 
      center.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.cos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.pm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === 'all' || center.location === selectedLocation;
    
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(accessibleCenters.map(center => center.location))];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleAllCategories = () => {
    const newState = !expandAllCategories;
    setExpandAllCategories(newState);
    const newExpandedState: Record<string, boolean> = {};
    Object.keys(issuesByCategory).forEach(category => {
      newExpandedState[category] = newState;
    });
    setExpandedCategories(newExpandedState);
  };

  const exportWeeklyReport = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Executive Summary Sheet
      const summaryData = [
        ['Weekly Operations Report'],
        [`${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`],
        [''],
        ['Executive Summary'],
        ['Total Centers', totalCenters],
        ['Reports Submitted', reportsThisWeek],
        ['Overall Health', `${healthPercentage}%`],
        ['High Risk Items', highRiskItems],
        [''],
        ['Status Distribution'],
        ['OK Items', okItems, `${totalItems > 0 ? Math.round((okItems / totalItems) * 100) : 0}%`],
        ['Issues', issueItems, `${totalItems > 0 ? Math.round((issueItems / totalItems) * 100) : 0}%`],
        ['High Risk', highRiskItems, `${totalItems > 0 ? Math.round((highRiskItems / totalItems) * 100) : 0}%`],
        ['Not Applicable', naItems, `${totalItems > 0 ? Math.round((naItems / totalItems) * 100) : 0}%`],
      ];

      const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWS, 'Executive Summary');

      // Center Performance Sheet
      const centerData = [
        ['Center Performance Summary'],
        [''],
        ['Center', 'Location', 'COS', 'PM', 'Report Status', 'Health Score', 'Issues', 'High Risk', 'Last Updated']
      ];

      centerAnalysis.forEach(center => {
        centerData.push([
          center.centerName,
          center.location,
          center.cos,
          center.pm,
          center.reportSubmitted ? 'Submitted' : 'Pending',
          center.reportSubmitted ? `${center.healthScore}%` : 'N/A',
          center.reportSubmitted ? center.issueItems : 'N/A',
          center.reportSubmitted ? center.highRiskItems : 'N/A',
          center.lastUpdated ? center.lastUpdated.toLocaleString() : 'N/A'
        ]);
      });

      const centerWS = XLSX.utils.aoa_to_sheet(centerData);
      XLSX.utils.book_append_sheet(wb, centerWS, 'Center Performance');

      // Issues by Category Sheet
      const issuesData = [
        ['Issues by Category'],
        [''],
        ['Category', 'Center', 'Item', 'Status', 'Remarks', 'Timestamp']
      ];

      Object.entries(issuesByCategory).forEach(([category, issues]) => {
        issues.forEach(issue => {
          issuesData.push([
            category,
            issue.center,
            issue.item,
            issue.status === 'HIGH_RISK' ? 'High Risk' : 'Issue',
            issue.remarks,
            issue.timestamp.toLocaleString()
          ]);
        });
      });

      const issuesWS = XLSX.utils.aoa_to_sheet(issuesData);
      XLSX.utils.book_append_sheet(wb, issuesWS, 'Issues by Category');

      // Trends Sheet
      const trendsData = [
        ['Weekly Trends'],
        [''],
        ['Trend Type', 'Items'],
        ['Improving', trends.improving.join(', ')],
        ['Declining', trends.declining.join(', ')],
        ['Stable', trends.stable.join(', ')]
      ];

      const trendsWS = XLSX.utils.aoa_to_sheet(trendsData);
      XLSX.utils.book_append_sheet(wb, trendsWS, 'Trends');

      const filename = `Weekly_Operations_Report_${weekStart.toISOString().split('T')[0]}_to_${weekEnd.toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error exporting report. Please try again.');
    }
  };

  const CenterDetailModal = ({ center }: { center: CenterAnalysis }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-4xl w-full mx-4 border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{center.centerName}</h3>
            <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{center.location}</span>
            </p>
          </div>
          <button
            onClick={() => setSelectedCenter(null)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600">{center.healthScore}%</div>
            <div className="text-sm text-green-700 dark:text-green-300">Health Score</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600">{center.okItems}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">OK Items</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="text-2xl font-bold text-yellow-600">{center.issueItems}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Issues</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-2xl font-bold text-red-600">{center.highRiskItems}</div>
            <div className="text-sm text-red-700 dark:text-red-300">High Risk</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Team Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Chief of Staff:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{center.cos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Project Manager:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{center.pm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Report Status:</span>
                  <span className={`font-medium ${center.reportSubmitted ? 'text-green-600' : 'text-red-600'}`}>
                    {center.reportSubmitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {center.trends.improving.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-800 dark:text-green-200">Improving Areas</h4>
                </div>
                <ul className="space-y-1">
                  {center.trends.improving.map((item, index) => (
                    <li key={index} className="text-sm text-green-700 dark:text-green-300">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {center.trends.declining.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800 dark:text-red-200">Areas of Concern</h4>
                </div>
                <ul className="space-y-1">
                  {center.trends.declining.map((item, index) => (
                    <li key={index} className="text-sm text-red-700 dark:text-red-300">• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {center.criticalIssues.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800 dark:text-red-200">Critical Issues</h4>
                </div>
                <ul className="space-y-1">
                  {center.criticalIssues.map((item, index) => (
                    <li key={index} className="text-sm text-red-700 dark:text-red-300">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {center.achievements.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-800 dark:text-green-200">Achievements</h4>
                </div>
                <ul className="space-y-1">
                  {center.achievements.map((item, index) => (
                    <li key={index} className="text-sm text-green-700 dark:text-green-300">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-3">
                <Minus className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Stable Areas</h4>
              </div>
              <ul className="space-y-1">
                {center.trends.stable.map((item, index) => (
                  <li key={index} className="text-sm text-blue-700 dark:text-blue-300">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-nxtwave-red hover:text-nxtwave-red-dark transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-nxtwave-red">NIAT Weekly Operations Report</h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>

          <button 
            onClick={exportWeeklyReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
              { id: 'detailed', label: 'Detailed Analysis', icon: Activity },
              { id: 'visualization', label: 'Data Visualization', icon: PieChart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  viewMode === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {viewMode === 'overview' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Executive Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="text-3xl font-bold text-blue-600">{totalCenters}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Total Centers</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Across {locations.length} locations</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-600">{reportsThisWeek}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Reports Submitted</div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">{Math.round((reportsThisWeek/totalCenters)*100)}% completion rate</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="text-3xl font-bold text-purple-600">{healthPercentage}%</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Overall Health</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">{okItems} of {totalItems} items OK</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="text-3xl font-bold text-red-600">{highRiskItems}</div>
                    <div className="text-sm text-red-700 dark:text-red-300">High Risk Items</div>
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">Requiring immediate attention</div>
                  </div>
                </div>
              </div>

              {/* Status Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600">{okItems}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">OK Items</div>
                    <div className="text-xs text-green-600 dark:text-green-400">{totalItems > 0 ? Math.round((okItems / totalItems) * 100) : 0}% of total</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="text-2xl font-bold text-yellow-600">{issueItems}</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Issues</div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">{totalItems > 0 ? Math.round((issueItems / totalItems) * 100) : 0}% of total</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-2xl font-bold text-red-600">{highRiskItems}</div>
                    <div className="text-sm text-red-700 dark:text-red-300">High Risk</div>
                    <div className="text-xs text-red-600 dark:text-red-400">{totalItems > 0 ? Math.round((highRiskItems / totalItems) * 100) : 0}% of total</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{naItems}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Not Applicable</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{totalItems > 0 ? Math.round((naItems / totalItems) * 100) : 0}% of total</div>
                  </div>
                </div>
              </div>

              {/* AI Predictions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-nxtwave-red" />
                  <span>AI Predictions & Insights</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-nxtwave-cream to-nxtwave-gold-light p-6 rounded-xl border border-nxtwave-red">
                    <div className="flex items-center space-x-2 mb-4">
                      <Cpu className="h-5 w-5 text-nxtwave-red" />
                      <h4 className="font-semibold text-nxtwave-red">Risk Analysis</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Next Week Risk Level:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          aiPredictions.nextWeekRisk === 'HIGH' ? 'bg-red-100 text-red-800' :
                          aiPredictions.nextWeekRisk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {aiPredictions.nextWeekRisk}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Predicted Issues:</span>
                        <span className="text-sm font-medium text-nxtwave-red">{aiPredictions.predictedIssues}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">Recommended Actions</h4>
                    </div>
                    <ul className="space-y-2">
                      {aiPredictions.recommendedActions.slice(0, 3).map((action, index) => (
                        <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Trends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Trends</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-800 dark:text-green-200">Improving</h4>
                    </div>
                    <ul className="space-y-1">
                      {trends.improving.map((item, index) => (
                        <li key={index} className="text-sm text-green-700 dark:text-green-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium text-red-800 dark:text-red-200">Declining</h4>
                    </div>
                    <ul className="space-y-1">
                      {trends.declining.map((item, index) => (
                        <li key={index} className="text-sm text-red-700 dark:text-red-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-3">
                      <Minus className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">Stable</h4>
                    </div>
                    <ul className="space-y-1">
                      {trends.stable.map((item, index) => (
                        <li key={index} className="text-sm text-blue-700 dark:text-blue-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'detailed' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Centers:</span>
                </div>
                <div className="flex flex-wrap gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search centers..."
                      className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Center Performance Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Center Performance Analysis ({filteredCenters.length} centers)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCenters.map(center => (
                    <div
                      key={center.centerId}
                      className="bg-white dark:bg-gray-700 p-6 rounded-lg border dark:border-gray-600 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedCenter(center.centerId)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{center.centerName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{center.location}</span>
                          </p>
                        </div>
                        <div className={`text-2xl font-bold ${
                          center.healthScore >= 90 ? 'text-green-600' :
                          center.healthScore >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {center.reportSubmitted ? `${center.healthScore}%` : 'N/A'}
                        </div>
                      </div>

                      {center.reportSubmitted ? (
                        <>
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-600">{center.okItems}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">OK</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-yellow-600">{center.issueItems}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Issues</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-red-600">{center.highRiskItems}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">High Risk</div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">COS:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{center.cos}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">PM:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{center.pm}</span>
                            </div>
                            {center.lastUpdated && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                                <span className="font-medium text-green-600">{center.lastUpdated.toLocaleTimeString()}</span>
                              </div>
                            )}
                          </div>

                          {center.criticalIssues.length > 0 && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                              <div className="text-xs text-red-700 dark:text-red-300 font-medium">
                                {center.criticalIssues.length} critical issue(s)
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">No report submitted</p>
                        </div>
                      )}

                      <button className="w-full mt-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues by Category */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Issues by Category</h3>
                  <button
                    onClick={toggleAllCategories}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
                  >
                    {expandAllCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span>{expandAllCategories ? 'Collapse All' : 'Expand All'}</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {Object.entries(issuesByCategory).map(([category, issues]) => (
                    <div key={category} className="bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">{category}</h4>
                          <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                            {issues.length} issues
                          </span>
                        </div>
                        {expandedCategories[category] ? 
                          <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        }
                      </button>
                      {expandedCategories[category] && (
                        <div className="px-4 pb-4 space-y-3">
                          {issues.map((issue, index) => (
                            <div key={index} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{issue.center}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                                    ${issue.status === 'HIGH_RISK' 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'}`}>
                                    {issue.status === 'HIGH_RISK' ? 'High Risk' : 'Issue'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{issue.item}</p>
                                {issue.remarks && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{issue.remarks}</p>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {issue.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'visualization' && (
            <div className="space-y-6">
              {/* Chart Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Visualization</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                  <select 
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    defaultValue="summary"
                  >
                    <option value="summary">Summary Charts</option>
                    <option value="trends">Trend Analysis</option>
                    <option value="centers">Center Comparison</option>
                  </select>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h4>
                  <div style={{ height: '300px' }}>
                    <Pie data={statusChartData} options={chartOptions} />
                  </div>
                </div>

                {/* Trends Line Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Trends</h4>
                  <div style={{ height: '300px' }}>
                    <Line data={trendsChartData} options={chartOptions} />
                  </div>
                </div>

                {/* Center Performance Bar Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Center Performance Comparison</h4>
                  <div style={{ height: '400px' }}>
                    <Bar data={centerPerformanceData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* AI Insights for Charts */}
              <div className="bg-gradient-to-br from-nxtwave-cream to-nxtwave-gold-light p-6 rounded-xl border border-nxtwave-red">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="h-5 w-5 text-nxtwave-red" />
                  <h4 className="font-semibold text-nxtwave-red">AI Chart Analysis</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Key Insights</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• {healthPercentage}% of operations are performing optimally</li>
                      <li>• {Math.round((highRiskItems / totalItems) * 100)}% of items require immediate attention</li>
                      <li>• Performance trends show {trends.improving.length > trends.declining.length ? 'improvement' : 'decline'} patterns</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Maintenance Priorities</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {aiPredictions.maintenanceNeeded.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Detail Modal */}
      {selectedCenter && (
        <CenterDetailModal 
          center={centerAnalysis.find(c => c.centerId === selectedCenter)!} 
        />
      )}
    </div>
  );
}