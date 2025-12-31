'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { authApi, setSessionExpiredCallback } from '@/lib/api';
import { 
  getStoredToken, 
  storeToken, 
  removeToken, 
  isTokenExpired,
  isStoredTokenValid,
  getTokenTimeRemaining,
  getTokenExpirationDate 
} from '@/lib/tokenUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle session expiration
  const handleSessionExpired = useCallback(() => {
    setUser(null);
    setToken(null);
    removeToken();
    setSessionExpired(true);
    
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
      sessionCheckInterval.current = null;
    }
  }, []);

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = getStoredToken();
      
      if (!storedToken) {
        if (user) {
          handleSessionExpired();
        }
        return;
      }

      if (isTokenExpired(storedToken)) {
        console.log('Token expired, logging out...');
        handleSessionExpired();
        return;
      }

      // Log time remaining (for debugging)
      const timeRemaining = getTokenTimeRemaining(storedToken);
      if (timeRemaining < 300) { // Less than 5 minutes
        console.log(`Session expires in ${Math.floor(timeRemaining / 60)} minutes`);
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    sessionCheckInterval.current = setInterval(checkTokenExpiration, 60000);

    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [user, handleSessionExpired]);

  // Set up session expired callback for API calls
  useEffect(() => {
    setSessionExpiredCallback(handleSessionExpired);
  }, [handleSessionExpired]);

  // Initialize auth state from localStorage and fetch user profile
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      
      if (storedToken && isStoredTokenValid()) {
        setToken(storedToken);
        
        const expirationDate = getTokenExpirationDate(storedToken);
        if (expirationDate) {
          console.log('Session valid until:', expirationDate.toLocaleString());
        }
        
        try {
          const userData = await authApi.getProfile();
          setUser({
            ...userData,
            password: '', // Password not returned from API
            createdAt: new Date(userData.createdAt),
          });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          removeToken();
          setToken(null);
        }
      } else if (storedToken) {
        // Token exists but is expired
        console.log('Stored token is expired, clearing session');
        removeToken();
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login(email, password);
      
      setUser({
        ...response.user,
        password: '', // Don't store password
        createdAt: new Date(response.user.createdAt),
      });
      setToken(response.token);
      storeToken(response.token);
      setSessionExpired(false);

      const expirationDate = getTokenExpirationDate(response.token);
      if (expirationDate) {
        console.log('Session will expire at:', expirationDate.toLocaleString());
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.register(email, password, name);
      
      setUser({
        ...response.user,
        password: '', // Don't store password
        createdAt: new Date(response.user.createdAt),
      });
      setToken(response.token);
      storeToken(response.token);
      setSessionExpired(false);

      const expirationDate = getTokenExpirationDate(response.token);
      if (expirationDate) {
        console.log('Session will expire at:', expirationDate.toLocaleString());
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      removeToken();
      setSessionExpired(false);
      
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
        sessionCheckInterval.current = null;
      }
    }
  };

  const updateProfile = async (name: string, profilePicture?: string) => {
    if (!user) return;

    try {
      const updatedUser = await authApi.updateProfile(name, profilePicture);
      setUser({
        ...updatedUser,
        password: '',
        createdAt: new Date(updatedUser.createdAt),
      });
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile }}>
      {children}
      {sessionExpired && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-5">
          <p className="font-semibold">Session Expired</p>
          <p className="text-sm">Please log in again to continue.</p>
        </div>
      )}
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
