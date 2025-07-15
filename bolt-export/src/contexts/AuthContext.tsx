import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../lib/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for development - replace with Supabase auth in production
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@niat.edu',
    role: 'admin',
  },
  {
    id: 2,
    username: 'cos_hyderabad',
    email: 'cos@niat.edu',
    role: 'cos',
    centerId: 'niat-main-hyd',
  },
  {
    id: 3,
    username: 'pm_bangalore',
    email: 'pm@niat.edu',
    role: 'pm',
    centerId: 'niat-bangalore',
  },
  {
    id: 4,
    username: 'head_of_niat',
    email: 'head@niat.edu',
    role: 'head_of_niat',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('niat_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('niat_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Mock authentication - replace with Supabase auth
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const user = mockUsers.find(u => u.email === email);
    
    if (user && (password === 'password123' || password === 'admin123')) {
      localStorage.setItem('niat_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  };

  const logout = () => {
    localStorage.removeItem('niat_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('niat_user', JSON.stringify(user));
    setAuthState(prev => ({
      ...prev,
      user,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};