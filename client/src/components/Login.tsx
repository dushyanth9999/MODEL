import React, { useState } from 'react';
import { Building2, Eye, EyeOff, Lock, Mail, Key, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { ChangePassword } from './ChangePassword';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'login' | 'forgot' | 'reset' | 'change'>('login');
  const [resetToken, setResetToken] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { login, user } = useAuth();

  // Check for reset token in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setView('reset');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/api/assets/attached_assets/LOGIO_1752487117783.jpg?v=2" 
                alt="NIAT Logo" 
                className="h-16 w-auto rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Building2 className="h-12 w-12 text-red-700 hidden" />
            </div>
          </div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-red-700">
            Ops Dashboard
          </h1>
          <h2 className="mt-2 text-center text-xl font-semibold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            NxtWave Institute of Advanced Technologies
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setView('forgot')}
              className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              Forgot your password?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Login Credentials:</h4>
            <div className="text-xs text-red-600 dark:text-red-300 space-y-1">
              <div>Admin (Full Access): admin@niat.edu / admin123</div>
              <div>Head of NIAT (View Only): pavan@niat.edu / pavan123</div>
              <div>Chief of Staff: cos@niat.edu / cos123</div>
              <div>Program Manager: pm@niat.edu / pm123</div>
            </div>
          </div>
        </form>

        {user && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowChangePassword(true)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        )}
      </div>

      {/* Forgot Password Dialog */}
      {view === 'forgot' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <ForgotPassword onBack={() => setView('login')} />
        </div>
      )}

      {/* Reset Password Dialog */}
      {view === 'reset' && resetToken && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <ResetPassword 
            token={resetToken} 
            onSuccess={() => {
              setView('login');
              setResetToken('');
              window.history.replaceState({}, '', window.location.pathname);
            }} 
          />
        </div>
      )}

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md">
          <ChangePassword onClose={() => setShowChangePassword(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}