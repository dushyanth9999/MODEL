import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/index';

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

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@niat.edu',
    name: 'System Administrator',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'cos@niat.edu',
    name: 'Chief of Staff',
    role: 'cos',
    centerId: 'niat-hyderabad',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    email: 'pm@niat.edu',
    name: 'Program Manager',
    role: 'pm',
    centerId: 'niat-hyderabad',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    email: 'head@niat.edu',
    name: 'Dr. Rajesh Kumar',
    role: 'head_of_niat',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Call backend API for authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        return false;
      }

      const data = await response.json();
      const backendUser = data.user;
      
      // Transform backend user to frontend User type
      const user: User = {
        id: backendUser.id.toString(),
        email: backendUser.email,
        name: backendUser.username === 'admin' ? 'System Administrator' : 
              backendUser.username === 'cos' ? 'Chief of Staff' :
              backendUser.username === 'pm' ? 'Program Manager' :
              backendUser.username || backendUser.email.split('@')[0],
        role: backendUser.role,
        centerId: backendUser.centerId,
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(backendUser.createdAt || Date.now())
      };
      
      // Store auth state
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState(prev => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};