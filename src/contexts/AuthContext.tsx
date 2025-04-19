import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Define types
type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const refreshTokenValue = localStorage.getItem('refreshToken');

      if (token) {
        try {
          // Verify token by fetching user info
          const userData = await api.getUserInfo();
          setUser(userData);
        } catch (error) {
          // Token might be expired, try to refresh
          if (refreshTokenValue) {
            const refreshed = await refreshToken();
            if (!refreshed) {
              // If refresh failed, clear everything
              logout();
            }
          } else {
            logout();
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      const data = await api.login(username, password);

      // Save tokens to localStorage
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      // Save user data
      setUser(data.user);

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      // Use the API service's refreshToken function
      const success = await api.refreshToken();

      if (success) {
        // Fetch user data with new token
        const userData = await api.getUserInfo();
        setUser(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
