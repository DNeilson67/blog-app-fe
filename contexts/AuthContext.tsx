'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, AuthContextType } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt),
        });
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { access_token, user: userData } = response.data;
      const userWithDate = {
        id: userData.id,
        email: userData.email,
        password: userData.password || '',
        name: userData.name,
        profilePicture: userData.profile_picture || userData.profilePicture || undefined,
        createdAt: new Date(userData.created_at || userData.createdAt),
      };

      setUser(userWithDate);
      setToken(access_token);
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(userWithDate));

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        name
      });

      const { access_token, user: userData } = response.data;
      const userWithDate = {
        id: userData.id,
        email: userData.email,
        password: userData.password || '',
        name: userData.name,
        profilePicture: userData.profile_picture || userData.profilePicture || undefined,
        createdAt: new Date(userData.created_at || userData.createdAt),
      };

      setUser(userWithDate);
      setToken(access_token);
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(userWithDate));

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      // Ignore logout errors
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (name: string, profilePicture?: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(
        `${API_BASE_URL}/users/me`,
        { name, profile_picture: profilePicture },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const updatedUser = {
        ...user,
        name: response.data.name,
        profilePicture: response.data.profile_picture || response.data.profilePicture || undefined,
        createdAt: user.createdAt,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, isLoading }}>
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
