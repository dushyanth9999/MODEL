// Consolidated Reports Components - Daily and Weekly Reports
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, Download, TrendingUp, Calendar, Building2, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { useAuth, getUserAccessibleCenters } from '../contexts/AppContext';
import { centers, mockReports, reportCategories, actionItems } from '../data';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Textarea, Badge } from './UI';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// Daily Report Form Component
export const DailyReportForm = ({ onBack, selectedCenterId }: { onBack: () => void, selectedCenterId?: string }) => {
  const { user } = useAuth();
  const [selectedCenter, setSelectedCenter] = useState(selectedCenterId || centers[0].id);
  const [reportItems, setReportItems] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    goingGood: '',
    goingWrong: '',
    highRisk: '',
    immediateAttention: '',
    progressFromLastDay: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const center = centers.find(c => c.id === selectedCenter);
  const accessibleCenters = getUserAccessibleCenters(user, centers);

  // Initialize report items for selected center
  const initializeReportItems = () => {
    const items: any[] = [];
    reportCategories.forEach(category => {
      category.items.forEach((item, index) => {
        items.push({
          id: `${category.name}-${index}`,
          category: category.name,
          item: item,
          status: 'OK',
          priority: 'Medium',
          description: '',
          notes: ''
        });
      });
    });
    setReportItems(items);
  };

  React.useEffect(() => {
    if (reportItems.length === 0) {
      initializeReportItems();
    }
  }, []);

  const updateItemStatus = (itemId: string, field: string, value: string) => {
    setReportItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        centerId: selectedCenter,
        centerName: center?.name,
        date: new Date().toISOString().split('T')[0],
        submittedBy: user?.username,
        items: reportItems,
        summary,
        status: 'submitted',
        submittedAt: new Date()
      };
      
      // In real app, would POST to API
      console.log('Report submitted:', reportData);
      alert('Report submitted successfully!');
      onBack();
    } catch (error) {
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusCounts = useMemo(() => {
    const counts = { OK: 0, ISSUE: 0, HIGH_RISK: 0, NA: 0 };
    reportItems.forEach(item => counts[item.status as keyof typeof counts]++);
    return counts;
  }, [reportItems]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daily Report</h1>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
          {isSubmitting ? 'Submitting...' : <><Save className="h-4 w-4 mr-1" />Submit Report</>}
        </Button>
      </div>

      {/* Center Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Center</Label>
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 mt-1"
              >
                {accessibleCenters.map(center => (
                  <option key={center.id} value={center.id}>{center.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Date</Label>
              <Input value={new Date().toISOString().split('T')[0]} disabled className="mt-1" />
            </div>
            <div>
              <Label>Submitted By</Label>
              <Input value={user?.username || ''} disabled className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="text-center p-4 rounded-lg border">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-gray-600">{status.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Items by Category */}
      {reportCategories.map(category => {
        const categoryItems = reportItems.filter(item => item.category === category.name);
        return (
          <Card key={category.name}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryItems.map(item => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">{item.item}</Label>
                    </div>
                    <div>
                      <select
                        value={item.status}
                        onChange={(e) => updateItemStatus(item.id, 'status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                      >
                        <option value="OK">OK</option>
                        <option value="ISSUE">Issue</option>
                        <option value="HIGH_RISK">High Risk</option>
                        <option value="NA">Not Applicable</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={item.priority}
                        onChange={(e) => updateItemStatus(item.id, 'priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <Input
                        placeholder="Notes..."
                        value={item.notes}
                        onChange={(e) => updateItemStatus(item.id, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries({
              'What went well today?': 'goingGood',
              'What challenges did we face?': 'goingWrong',
              'Any high-risk situations?': 'highRisk',
              'Items needing immediate attention': 'immediateAttention',
              'Progress from yesterday': 'progressFromLastDay'
            }).map(([label, key]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Textarea
                  value={summary[key as keyof typeof summary]}
                  onChange={(e) => setSummary(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Weekly Report Component with Analytics
export const WeeklyReport = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [viewMode, setViewMode] = useState<'overview' | 'visualization'>('overview');

  const accessibleCenters = getUserAccessibleCenters(user, centers);
  
  // Generate analytics data
  const analyticsData = useMemo(() => {
    const reportsData = mockReports.filter(report => 
      accessibleCenters.some(center => center.id === report.centerId)
    );

    const statusDistribution = {
      OK: 0, ISSUE: 0, HIGH_RISK: 0, NA: 0
    };

    reportsData.forEach(report => {
      report.items.forEach(item => {
        statusDistribution[item.status as keyof typeof statusDistribution]++;
      });
    });

    const centerPerformance = accessibleCenters.map(center => {
      const report = reportsData.find(r => r.centerId === center.id);
      const healthScore = report ? 
        Math.round(((report.items.length - report.items.filter(item => ['ISSUE', 'HIGH_RISK'].includes(item.status)).length) / report.items.length) * 100) : 
        75;
      return { name: center.name, score: healthScore };
    });

    return { statusDistribution, centerPerformance, reportsData };
  }, [accessibleCenters, selectedPeriod]);

  // Chart configurations
  const statusChartData = {
    labels: Object.keys(analyticsData.statusDistribution),
    datasets: [{
      data: Object.values(analyticsData.statusDistribution),
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
    }]
  };

  const performanceChartData = {
    labels: analyticsData.centerPerformance.map(c => c.name.split(' ').slice(-2).join(' ')),
    datasets: [{
      label: 'Health Score',
      data: analyticsData.centerPerformance.map(c => c.score),
      backgroundColor: 'rgba(185, 28, 28, 0.8)',
    }]
  };

  const trendChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Reports Submitted',
      data: [12, 15, 8, 18, 14, 6, 3],
      borderColor: 'rgb(185, 28, 28)',
      backgroundColor: 'rgba(185, 28, 28, 0.1)',
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Weekly Analytics</h1>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            onClick={() => setViewMode('overview')}
          >
            Overview
          </Button>
          <Button
            variant={viewMode === 'visualization' ? 'default' : 'outline'}
            onClick={() => setViewMode('visualization')}
          >
            Charts
          </Button>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                    <p className="text-3xl font-bold text-blue-600">{analyticsData.reportsData.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Centers Reporting</p>
                    <p className="text-3xl font-bold text-green-600">{analyticsData.reportsData.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues Reported</p>
                    <p className="text-3xl font-bold text-red-600">{analyticsData.statusDistribution.ISSUE + analyticsData.statusDistribution.HIGH_RISK}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Health Score</p>
                    <p className="text-3xl font-bold text-green-600">
                      {Math.round(analyticsData.centerPerformance.reduce((sum, c) => sum + c.score, 0) / analyticsData.centerPerformance.length || 0)}%
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Center Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Center</th>
                      <th className="text-left p-4">Location</th>
                      <th className="text-left p-4">Health Score</th>
                      <th className="text-left p-4">Last Report</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessibleCenters.map(center => {
                      const performance = analyticsData.centerPerformance.find(p => p.name === center.name);
                      const hasReport = analyticsData.reportsData.some(r => r.centerId === center.id);
                      return (
                        <tr key={center.id} className="border-b">
                          <td className="p-4 font-medium">{center.name}</td>
                          <td className="p-4 text-gray-600">{center.location}</td>
                          <td className="p-4">
                            <Badge variant={performance && performance.score >= 80 ? 'default' : 'destructive'}>
                              {performance?.score || 0}%
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600">Today</td>
                          <td className="p-4">
                            <Badge variant={hasReport ? 'default' : 'destructive'}>
                              {hasReport ? 'Reported' : 'Pending'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Data Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Pie data={statusChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={trendChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Center Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar data={performanceChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};