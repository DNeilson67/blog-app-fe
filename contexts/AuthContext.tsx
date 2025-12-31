'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { apiClient } from '@/lib/api';

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
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    const response = await apiClient.post<{ access_token: string; token_type: string; user: any }>(
      '/auth/login',
      { email, password }
    );

    if (response.error || !response.data) {
      return { success: false, error: response.error || 'Login failed' };
    }

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
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    const response = await apiClient.post<{ access_token: string; token_type: string; user: any }>(
      '/auth/register',
      { email, password, name }
    );

    if (response.error || !response.data) {
      return { success: false, error: response.error || 'Registration failed' };
    }

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
  };

  const logout = async () => {
    await apiClient.post('/auth/logout', {}, true);
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (name: string, profilePicture?: string) => {
    if (!user) return;

    const response = await apiClient.put<any>(
      '/users/me',
      { name, profile_picture: profilePicture },
      true
    );

    if (response.data) {
      const updatedUser = {
        ...user,
        name: response.data.name,
        profilePicture: response.data.profile_picture || response.data.profilePicture || undefined,
        createdAt: user.createdAt, // Preserve existing createdAt
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
