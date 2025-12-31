'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create a mock JWT token
const createMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Helper function to decode mock JWT token
const decodeMockToken = (token: string): { userId: string } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUsers = localStorage.getItem('users');
    
    // Initialize users in localStorage if not present
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }

    if (storedToken) {
      const decoded = decodeMockToken(storedToken);
      if (decoded) {
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u) => u.id === decoded.userId);
        if (foundUser) {
          setUser(foundUser);
          setToken(storedToken);
        } else {
          localStorage.removeItem('auth_token');
        }
      } else {
        localStorage.removeItem('auth_token');
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

    const newToken = createMockToken(foundUser.id);
    setUser(foundUser);
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);

    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Validate password
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      createdAt: new Date(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    const newToken = createMockToken(newUser.id);
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const updateProfile = (name: string, profilePicture?: string) => {
    if (!user) return;

    const updatedUser = { ...user, name, profilePicture };
    setUser(updatedUser);

    // Update user in localStorage
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile }}>
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
