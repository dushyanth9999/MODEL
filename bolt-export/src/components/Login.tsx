import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (!success) {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const quickLogin = (userType: string) => {
    const credentials = {
      admin: { email: 'admin@niat.edu', password: 'password123' },
      cos: { email: 'cos@niat.edu', password: 'password123' },
      pm: { email: 'pm@niat.edu', password: 'password123' },
      head: { email: 'head@niat.edu', password: 'password123' },
    };
    
    const creds = credentials[userType as keyof typeof credentials];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 to-cream-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-soft hover:shadow-soft-lg transition-all duration-200"
          >
            {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg p-8 border border-gray-100 dark:border-gray-700">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-maroon-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-cream-50">N</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ops Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              NIAT Operations Management System
            </p>
          </div>

          {/* Quick Login Buttons */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Login:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 text-xs bg-maroon-100 dark:bg-maroon-900 text-maroon-700 dark:text-maroon-300 rounded-lg hover:bg-maroon-200 dark:hover:bg-maroon-800 transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('cos')}
                className="px-3 py-2 text-xs bg-maroon-100 dark:bg-maroon-900 text-maroon-700 dark:text-maroon-300 rounded-lg hover:bg-maroon-200 dark:hover:bg-maroon-800 transition-colors"
              >
                COS
              </button>
              <button
                onClick={() => quickLogin('pm')}
                className="px-3 py-2 text-xs bg-maroon-100 dark:bg-maroon-900 text-maroon-700 dark:text-maroon-300 rounded-lg hover:bg-maroon-200 dark:hover:bg-maroon-800 transition-colors"
              >
                PM
              </button>
              <button
                onClick={() => quickLogin('head')}
                className="px-3 py-2 text-xs bg-maroon-100 dark:bg-maroon-900 text-maroon-700 dark:text-maroon-300 rounded-lg hover:bg-maroon-200 dark:hover:bg-maroon-800 transition-colors"
              >
                Head
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-maroon-500 dark:focus:ring-maroon-400 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-maroon-500 dark:focus:ring-maroon-400 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-maroon-700 hover:bg-maroon-600 disabled:bg-maroon-400 text-cream-50 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="niat-spinner w-5 h-5"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Default password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}