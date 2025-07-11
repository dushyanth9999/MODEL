import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Download,
  Share2,
  Filter,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Brain,
  Eye
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { AnalyticsService } from '../utils/analytics';
import { ExportService } from '../utils/export';
import { centers, mockReports } from '../data/mockData';
import { Analytics } from '../types';
import ShareModal from './ShareModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

interface AdvancedAnalyticsProps {
  onBack: () => void;
}

export default function AdvancedAnalytics({ onBack }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'performance' | 'predictions' | 'benchmarks'>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateAnalytics();
  }, [selectedPeriod, selectedCenter]);

  const generateAnalytics = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const centerPerformance = centers.map(center => {
      const report = mockReports.find(r => r.centerId === center.id);
      const healthScore = report ? AnalyticsService.calculateHealthScore(report) : 0;
      const efficiency = report ? AnalyticsService.calculateEfficiency(report) : 0;
      const compliance = report ? AnalyticsService.calculateCompliance(report) : 0;
      const riskLevel = report ? AnalyticsService.calculateRiskLevel(report) : 'LOW' as const;
      
      return {
        centerId: center.id,
        healthScore,
        trend: AnalyticsService.calculateTrend(healthScore, healthScore - 5) as 'IMPROVING' | 'DECLINING' | 'STABLE',
        riskLevel,
        efficiency,
        compliance
      };
    });

    const predictions = AnalyticsService.generatePredictions(mockReports);
    const benchmarks = AnalyticsService.generateBenchmarks();

    setAnalytics({
      centerPerformance,
      predictions,
      benchmarks
    });
    
    setIsLoading(false);
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (!analytics) return;

    if (format === 'excel') {
      const csvData = AnalyticsService.exportAnalytics(analytics, 'csv');
      ExportService.exportToCSV(
        analytics.centerPerformance.map(center => ({
          'Center ID': center.centerId,
          'Health Score': center.healthScore,
          'Trend': center.trend,
          'Risk Level': center.riskLevel,
          'Efficiency': center.efficiency,
          'Compliance': center.compliance
        })),
        `analytics_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`
      );
    } else {
      await ExportService.exportToPDF(
        'analytics-dashboard',
        `analytics_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.pdf`
      );
    }
  };

  // Chart configurations
  const healthScoreChartData = {
    labels: analytics?.centerPerformance.map(center => 
      centers.find(c => c.id === center.centerId)?.name || 'Unknown'
    ) || [],
    datasets: [
      {
        label: 'Health Score',
        data: analytics?.centerPerformance.map(center => center.healthScore) || [],
        backgroundColor: 'rgba(127, 29, 29, 0.8)',
        borderColor: 'rgba(127, 29, 29, 1)',
        borderWidth: 1
      }
    ]
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
    datasets: [
      {
        data: [
          analytics?.centerPerformance.filter(c => c.riskLevel === 'LOW').length || 0,
          analytics?.centerPerformance.filter(c => c.riskLevel === 'MEDIUM').length || 0,
          analytics?.centerPerformance.filter(c => c.riskLevel === 'HIGH').length || 0,
          analytics?.centerPerformance.filter(c => c.riskLevel === 'CRITICAL').length || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const trendChartData = {
    labels: analytics?.centerPerformance.map(center => 
      centers.find(c => c.id === center.centerId)?.name || 'Unknown'
    ) || [],
    datasets: [
      {
        label: 'Health Score',
        data: analytics?.centerPerformance.map(center => center.healthScore) || [],
        borderColor: 'rgba(127, 29, 29, 1)',
        backgroundColor: 'rgba(127, 29, 29, 0.1)',
        tension: 0.4
      },
      {
        label: 'Efficiency',
        data: analytics?.centerPerformance.map(center => center.efficiency) || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating advanced analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="analytics-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600">AI-powered insights and predictive analytics</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button
            onClick={() => setShowShareModal(true)}
            className="bg-maroon-600 text-white px-4 py-2 rounded-lg hover:bg-maroon-700 transition-colors flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'performance', label: 'Performance', icon: Activity },
              { id: 'predictions', label: 'AI Predictions', icon: Brain },
              { id: 'benchmarks', label: 'Benchmarks', icon: Target }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  viewMode === id
                    ? 'border-maroon-500 text-maroon-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {viewMode === 'overview' && analytics && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-maroon-50 to-maroon-100 p-6 rounded-xl border border-maroon-200">
                  <div className="text-3xl font-bold text-maroon-600">
                    {Math.round(analytics.centerPerformance.reduce((sum, c) => sum + c.healthScore, 0) / analytics.centerPerformance.length)}%
                  </div>
                  <div className="text-sm text-maroon-700">Average Health Score</div>
                  <div className="text-xs text-maroon-600 mt-1">
                    {analytics.centerPerformance.filter(c => c.trend === 'IMPROVING').length} improving
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(analytics.centerPerformance.reduce((sum, c) => sum + c.efficiency, 0) / analytics.centerPerformance.length)}%
                  </div>
                  <div className="text-sm text-blue-700">Average Efficiency</div>
                  <div className="text-xs text-blue-600 mt-1">Operational efficiency</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(analytics.centerPerformance.reduce((sum, c) => sum + c.compliance, 0) / analytics.centerPerformance.length)}%
                  </div>
                  <div className="text-sm text-green-700">Compliance Score</div>
                  <div className="text-xs text-green-600 mt-1">Regulatory compliance</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">
                    {analytics.centerPerformance.filter(c => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL').length}
                  </div>
                  <div className="text-sm text-orange-700">High Risk Centers</div>
                  <div className="text-xs text-orange-600 mt-1">Require attention</div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score by Center</h3>
                  <Bar data={healthScoreChartData} options={chartOptions} />
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
                  <Pie data={riskDistributionData} />
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AnalyticsService.generateInsights(analytics).map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg border">
                      <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'performance' && analytics && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                <Line data={trendChartData} options={chartOptions} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analytics.centerPerformance.map(center => {
                  const centerInfo = centers.find(c => c.id === center.centerId);
                  return (
                    <div key={center.centerId} className="bg-white p-6 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{centerInfo?.name}</h4>
                          <p className="text-sm text-gray-600">{centerInfo?.location}</p>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                          center.trend === 'IMPROVING' ? 'bg-green-100 text-green-800' :
                          center.trend === 'DECLINING' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {center.trend === 'IMPROVING' ? <TrendingUp className="h-4 w-4" /> :
                           center.trend === 'DECLINING' ? <TrendingDown className="h-4 w-4" /> :
                           <Activity className="h-4 w-4" />}
                          <span>{center.trend}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Health Score</span>
                          <span className="font-medium">{center.healthScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-maroon-600 h-2 rounded-full" 
                            style={{ width: `${center.healthScore}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <span className="text-sm text-gray-600">Efficiency</span>
                            <div className="font-medium">{center.efficiency}%</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Compliance</span>
                            <div className="font-medium">{center.compliance}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'predictions' && analytics && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Predictions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{analytics.predictions.nextWeekIssues}</div>
                    <div className="text-sm text-gray-600">Predicted Issues</div>
                    <div className="text-xs text-gray-500 mt-1">Next week</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">${analytics.predictions.budgetForecast.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Budget Forecast</div>
                    <div className="text-xs text-gray-500 mt-1">Maintenance costs</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">{analytics.predictions.riskAreas.length}</div>
                    <div className="text-sm text-gray-600">Risk Areas</div>
                    <div className="text-xs text-gray-500 mt-1">Identified</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600">{analytics.predictions.maintenanceNeeded.length}</div>
                    <div className="text-sm text-gray-600">Maintenance Items</div>
                    <div className="text-xs text-gray-500 mt-1">Scheduled</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-4">Risk Areas Identified</h4>
                  <div className="space-y-3">
                    {analytics.predictions.riskAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-800">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-4">Recommended Maintenance</h4>
                  <div className="space-y-3">
                    {analytics.predictions.maintenanceNeeded.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'benchmarks' && analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-2">{analytics.benchmarks.industryAverage}%</div>
                  <div className="text-sm text-gray-600">Industry Average</div>
                  <div className="text-xs text-gray-500 mt-1">Health Score</div>
                </div>
                <div className="bg-white p-6 rounded-lg border text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{analytics.benchmarks.topPerformer}%</div>
                  <div className="text-sm text-gray-600">Top Performer</div>
                  <div className="text-xs text-gray-500 mt-1">Best in class</div>
                </div>
                <div className="bg-white p-6 rounded-lg border text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">+{analytics.benchmarks.improvement}%</div>
                  <div className="text-sm text-gray-600">Improvement</div>
                  <div className="text-xs text-gray-500 mt-1">This quarter</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-4">Performance vs Benchmarks</h4>
                <div className="space-y-4">
                  {analytics.centerPerformance.map(center => {
                    const centerInfo = centers.find(c => c.id === center.centerId);
                    const vsIndustry = center.healthScore - analytics.benchmarks.industryAverage;
                    const vsTop = center.healthScore - analytics.benchmarks.topPerformer;
                    
                    return (
                      <div key={center.centerId} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{centerInfo?.name}</span>
                          <span className="text-sm text-gray-600">{center.healthScore}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className={`flex items-center space-x-2 ${vsIndustry >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {vsIndustry >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            <span>{vsIndustry >= 0 ? '+' : ''}{vsIndustry}% vs Industry</span>
                          </div>
                          <div className={`flex items-center space-x-2 ${vsTop >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {vsTop >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            <span>{vsTop >= 0 ? '+' : ''}{vsTop}% vs Top Performer</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          type="analysis"
          resourceId="analytics-dashboard"
          title="Advanced Analytics Dashboard"
          createdBy="System"
        />
      )}
    </div>
  );
}