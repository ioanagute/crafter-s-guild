'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string | null;
  signature?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (details: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchAPI('/auth/profile');
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void initAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    localStorage.setItem('token', data.access_token);
    setUser(data.user);
  };

  const register = async (details: { username: string; email: string; password: string }) => {
    const data = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    });

    localStorage.setItem('token', data.access_token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, login, register, logout }}>
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
