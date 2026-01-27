'use client'
// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and verify it on initial load
    const initAuth = async () => {
      try {
        const tokenExists = localStorage.getItem('authToken');
        if (tokenExists) {
          // Optionally verify the token with the backend
          // const isValid = await authApi.verifyToken();
          // if (isValid) {
          //   // Get user info from wherever it's stored
          //   const userDataStr = localStorage.getItem('userData');
          //   if (userDataStr) {
          //     setUser(JSON.parse(userDataStr));
          //   }
          // } else {
          //   // Token is invalid, clear it
          //   localStorage.removeItem('authToken');
          //   localStorage.removeItem('userData');
          // }

          // For now, just assume if token exists, user is authenticated
          // In a real app, you'd want to verify the token with the backend
          const userDataStr = localStorage.getItem('userData');
          if (userDataStr) {
            setUser(JSON.parse(userDataStr));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any invalid auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      // Assuming the response contains user data
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('userData', JSON.stringify(response.user));
      } else {
        // If user data isn't returned with login, you might need to fetch it separately
        // For now, create a minimal user object
        const userData = { id: response.userId || 'temp', email, name: response.name || email.split('@')[0] };
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userData');
    authApi.logout(); // This clears the auth token
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.register(name, email, password);
      // Assuming the response contains user data
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('userData', JSON.stringify(response.user));
      } else {
        // If user data isn't returned with registration, you might need to fetch it separately
        // For now, create a minimal user object
        const userData = { id: response.userId || 'temp', email, name };
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};