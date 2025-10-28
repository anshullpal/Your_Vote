'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  initializeAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>; // ✅ added
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  // Called after login/signup to refresh the user info
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/user/profile'); // <-- Adjust to your API route
      setUser(response.data);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setUser(null);
    }
  };

  // ✅ Added: Alias so signup page can use fetchUserProfile()
  const fetchUserProfile = initializeAuth;

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    initializeAuth(); // load user on mount
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        initializeAuth,
        fetchUserProfile, // ✅ added
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
