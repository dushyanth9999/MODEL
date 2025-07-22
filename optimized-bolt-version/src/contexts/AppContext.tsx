// Unified App Context for Authentication and Theme Management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { users } from '../data';

// Authentication Context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Combined App Context
interface AppContextType {
  auth: AuthContextType;
  theme: ThemeContextType;
}

const AppContext = createContext<AppContextType | null>(null);

// Mock credentials for demo
const mockCredentials = {
  'admin@niat.edu': 'admin123',
  'pavan@niat.edu': 'pavan123',
  'cos@niat.edu': 'cos123',
  'pm@niat.edu': 'pm123'
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    updateThemeClass(initialTheme);
    
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const updateThemeClass = (newTheme: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeClass(newTheme);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      if (mockCredentials[email as keyof typeof mockCredentials] === password) {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
          const userWithLogin = { ...foundUser, lastLoginAt: new Date() };
          setUser(userWithLogin);
          localStorage.setItem('user', JSON.stringify(userWithLogin));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const authContext: AuthContextType = {
    user,
    login,
    logout,
    loading
  };

  const themeContext: ThemeContextType = {
    theme,
    toggleTheme
  };

  return (
    <AppContext.Provider value={{ auth: authContext, theme: themeContext }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hooks
export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAuth must be used within AppProvider');
  return context.auth;
};

export const useTheme = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useTheme must be used within AppProvider');
  return context.theme;
};

// RBAC Utility Functions
export const getUserAccessibleCenters = (user: User | null, allCenters: any[]) => {
  if (!user) return [];
  
  switch (user.role) {
    case 'admin':
    case 'head_of_niat':
      return allCenters; // Full access
    case 'cos':
    case 'pm':
      return user.centerId ? allCenters.filter(center => center.id === user.centerId) : [];
    default:
      return [];
  }
};

export const canUserSubmitReports = (user: User | null): boolean => {
  if (!user) return false;
  return ['admin', 'cos', 'pm'].includes(user.role);
};

export const canUserAccessAdminPanel = (user: User | null): boolean => {
  return user?.role === 'admin';
};