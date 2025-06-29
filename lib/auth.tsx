'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api';
import { getApiUrl, API_CONFIG } from '@/lib/config';

interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_picture_url?: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  startGoogleLogin: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing token on mount
  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      // Set the token in the API client immediately
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      // Fetch user profile
      const response = await apiClient.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Token might be invalid, remove it
      Cookies.remove('auth_token');
      delete apiClient.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, userData: User) => {
    // Store token in cookie
    Cookies.set('auth_token', token, { expires: 7 }); // 7 days
    
    // Set token in API client
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Set user data
    setUser(userData);
  };

  const logout = () => {
    // Remove token from cookie
    Cookies.remove('auth_token');
    
    // Remove token from API client
    delete apiClient.defaults.headers.common['Authorization'];
    
    // Clear user data
    setUser(null);
  };

  const startGoogleLogin = async (): Promise<string> => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.GOOGLE_LOGIN));
      const data = await response.json();
      return data.auth_url;
    } catch (error) {
      console.error('Failed to start Google login:', error);
      throw new Error('Failed to initiate Google login');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    startGoogleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
