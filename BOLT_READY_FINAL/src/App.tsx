import React, { useState, useEffect } from 'react';

// All data consolidated in one file
const centers = [
  { id: 'niat-hyd-main', name: 'NIAT Hyderabad Main', location: 'Hyderabad', region: 'South', cos: 'Dr. Rajesh Kumar', currentStrength: 450 },
  { id: 'niat-bang-main', name: 'NIAT Bangalore Electronic City', location: 'Bangalore', region: 'South', cos: 'Mr. Arun Reddy', currentStrength: 375 },
  { id: 'niat-chen-main', name: 'NIAT Chennai OMR', location: 'Chennai', region: 'South', cos: 'Dr. Suresh Babu', currentStrength: 360 },
  { id: 'niat-pune-main', name: 'NIAT Pune Hinjewadi', location: 'Pune', region: 'West', cos: 'Mr. Vikram Patil', currentStrength: 400 },
  { id: 'niat-mum-main', name: 'NIAT Mumbai Powai', location: 'Mumbai', region: 'West', cos: 'Dr. Rohit Shah', currentStrength: 425 },
  { id: 'niat-del-main', name: 'NIAT Delhi Connaught Place', location: 'Delhi', region: 'North', cos: 'Mr. Arjun Singh', currentStrength: 380 }
];

const credentials = {
  'admin@niat.edu': { password: 'admin123', role: 'admin', name: 'Admin User' },
  'pavan@niat.edu': { password: 'pavan123', role: 'head_of_niat', name: 'Pavan Dharma' },
  'cos@niat.edu': { password: 'cos123', role: 'cos', name: 'Chief of Staff', centerId: 'niat-hyd-main' },
  'pm@niat.edu': { password: 'pm123', role: 'pm', name: 'Program Manager', centerId: 'niat-hyd-main' }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [reports, setReports] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', error: '' });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = loginForm;
    const userCreds = credentials[email];
    
    if (userCreds && userCreds.password === password) {
      setUser({ email, ...userCreds });
      setIsAuthenticated(true);
      setLoginForm({ email: '', password: '', error: '' });
    } else {
      setLoginForm({ ...loginForm, error: 'Invalid credentials' });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const submitReport = (reportData) => {
    const newReport = {
      id: Date.now().toString(),
      centerId: user.centerId || 'niat-hyd-main',
      date: new Date().toISOString().split('T')[0],
      submittedBy: user.name,
      ...reportData,
      submittedAt: new Date()
    };
    setReports([...reports, newReport]);
  };

  // Login Component
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-600">NIAT</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Operations Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                required
              />
            </div>

            {loginForm.error && (
              <div className="text-red-600 text-sm text-center">{loginForm.error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1">
              <div>Admin: admin@niat.edu / admin123</div>
              <div>Head: pavan@niat.edu / pavan123</div>
              <div>COS: cos@niat.edu / cos123</div>
              <div>PM: pm@niat.edu / pm123</div>
            </div>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="mt-4 w-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Toggle {isDark ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Component
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Centers</h3>
          <p className="text-3xl font-bold text-red-600">{centers.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-red-600">{centers.reduce((sum, c) => sum + c.currentStrength, 0)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reports Today</h3>
          <p className="text-3xl font-bold text-red-600">{reports.filter(r => r.date === new Date().toISOString().split('T')[0]).length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">NIAT Centers Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {centers.map(center => (
            <div key={center.id} className="border dark:border-gray-600 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">{center.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{center.location}, {center.region}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">COS: {center.cos}</p>
              <p className="text-sm font-medium text-red-600">Students: {center.currentStrength}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Daily Report Component
  const DailyReportView = () => {
    const [reportForm, setReportForm] = useState({
      infrastructureStatus: '',
      academicStatus: '',
      studentServicesStatus: '',
      technologyStatus: '',
      goingGood: '',
      goingWrong: '',
      immediateAttention: ''
    });

    const handleSubmitReport = (e) => {
      e.preventDefault();
      submitReport(reportForm);
      setReportForm({
        infrastructureStatus: '',
        academicStatus: '',
        studentServicesStatus: '',
        technologyStatus: '',
        goingGood: '',
        goingWrong: '',
        immediateAttention: ''
      });
      alert('Daily report submitted successfully!');
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Daily Report Submission</h3>
        
        <form onSubmit={handleSubmitReport} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Infrastructure Status
              </label>
              <select
                value={reportForm.infrastructureStatus}
                onChange={(e) => setReportForm({ ...reportForm, infrastructureStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Status</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Academic Operations
              </label>
              <select
                value={reportForm.academicStatus}
                onChange={(e) => setReportForm({ ...reportForm, academicStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Status</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student Services
              </label>
              <select
                value={reportForm.studentServicesStatus}
                onChange={(e) => setReportForm({ ...reportForm, studentServicesStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Status</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technology Systems
              </label>
              <select
                value={reportForm.technologyStatus}
                onChange={(e) => setReportForm({ ...reportForm, technologyStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Status</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's Going Good
              </label>
              <textarea
                value={reportForm.goingGood}
                onChange={(e) => setReportForm({ ...reportForm, goingGood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
                placeholder="Describe positive developments..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's Going Wrong
              </label>
              <textarea
                value={reportForm.goingWrong}
                onChange={(e) => setReportForm({ ...reportForm, goingWrong: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
                placeholder="Describe issues or concerns..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Needs Immediate Attention
              </label>
              <textarea
                value={reportForm.immediateAttention}
                onChange={(e) => setReportForm({ ...reportForm, immediateAttention: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
                placeholder="Urgent matters requiring attention..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Submit Daily Report
          </button>
        </form>
      </div>
    );
  };

  // Reports View Component
  const ReportsView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Submitted Reports</h3>
      
      {reports.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center py-8">No reports submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="border dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Report #{report.id}</h4>
                <span className="text-sm text-gray-600 dark:text-gray-300">{report.date}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Submitted by: {report.submittedBy}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-xs text-gray-500">Infrastructure:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    report.infrastructureStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                    report.infrastructureStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                    report.infrastructureStatus === 'needs_attention' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.infrastructureStatus}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Academic:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    report.academicStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                    report.academicStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                    report.academicStatus === 'needs_attention' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.academicStatus}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Student Services:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    report.studentServicesStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                    report.studentServicesStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                    report.studentServicesStatus === 'needs_attention' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.studentServicesStatus}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Technology:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    report.technologyStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                    report.technologyStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                    report.technologyStatus === 'needs_attention' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.technologyStatus}
                  </span>
                </div>
              </div>

              {report.goingGood && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-green-600">Going Good: </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{report.goingGood}</span>
                </div>
              )}
              
              {report.goingWrong && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-red-600">Going Wrong: </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{report.goingWrong}</span>
                </div>
              )}
              
              {report.immediateAttention && (
                <div>
                  <span className="text-sm font-medium text-yellow-600">Immediate Attention: </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{report.immediateAttention}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Main App Layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">NIAT</h1>
              <span className="text-red-100">Operations Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-red-100">Welcome, {user.name}</span>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-red-700 hover:bg-red-800 transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['dashboard', 'daily-report', 'reports'].map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  currentView === view
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300'
                }`}
              >
                {view === 'dashboard' ? 'Dashboard' : 
                 view === 'daily-report' ? 'Daily Report' : 'View Reports'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'daily-report' && <DailyReportView />}
        {currentView === 'reports' && <ReportsView />}
      </main>
    </div>
  );
}
