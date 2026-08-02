'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, clearAuthData, getStoredUser, isAuthenticated as checkIsAuthenticated, setAuthData } from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (checkIsAuthenticated()) {
          const storedUser = getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }
          
          try {
            const userData = await api.getUser();
            if (userData) {
              setUser(userData);
              setAuthData(localStorage.getItem('auth_token') || '', userData);
              setIsAuthenticated(true);
            }
          } catch (apiError: any) {
            // Only clear auth if the server explicitly rejected the token (401)
            if (apiError?.message === 'Invalid credentials') {
              clearAuthData();
              setIsAuthenticated(false);
              setUser(null);
            }
            // For network errors / server cold start, keep user logged in with cached data
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization failed', error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.login(data);
      setAuthData(res.token, res.user);
      setUser(res.user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setAuthData(res.token, res.user);
      setUser(res.user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    } finally {
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
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
