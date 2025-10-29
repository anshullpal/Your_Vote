'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVoter: boolean;
  isAdmin: boolean;
  setUser: (user: any) => void;
  initializeAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const response = await api.get('/user/profile');
      console.log('✅ Profile loaded:', response.data);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.warn('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = initializeAuth;

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  // Derived role flags ✅
  const isVoter = user?.role === 'voter';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isVoter,
        isAdmin,
        setUser,
        initializeAuth,
        fetchUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
