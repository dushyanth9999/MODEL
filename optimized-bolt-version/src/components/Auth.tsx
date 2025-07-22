// Authentication Components - Login and User Management
import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Shield, User, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AppContext';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label, Badge } from './UI';

export const LoginForm = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const demoUsers = [
    { email: 'admin@niat.edu', password: 'admin123', role: 'Admin', description: 'Full system access' },
    { email: 'pavan@niat.edu', password: 'pavan123', role: 'Head of NIAT', description: 'View all centers' },
    { email: 'cos@niat.edu', password: 'cos123', role: 'Chief of Staff', description: 'Manage assigned center' },
    { email: 'pm@niat.edu', password: 'pm123', role: 'Program Manager', description: 'Submit reports' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600 mr-2" />
              <CardTitle className="text-2xl text-red-600">NIAT Login</CardTitle>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Operations Dashboard Access</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-red-600" />
              Demo Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoUsers.map((user, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{user.role}</Badge>
                    <button
                      onClick={() => {
                        setEmail(user.email);
                        setPassword(user.password);
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Use Credentials
                    </button>
                  </div>
                  <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {user.email} / {user.password}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{user.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start">
                <Building2 className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">NIAT Operations Dashboard</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Comprehensive management system for 18 university centers across India with real-time analytics, 
                    daily reporting, and advanced monitoring capabilities.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};