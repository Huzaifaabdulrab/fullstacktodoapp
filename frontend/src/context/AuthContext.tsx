'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Attempt to verify the token
        const isValid = await authApi.verifyToken();

        if (isValid) {
          // If token is valid, we could potentially fetch user details here
          // For now, we'll just set isAuthenticated to true
          // In a real app, you might want to decode the JWT or make an API call to get user details

          // For now, we'll just set a placeholder user based on the token
          const token = localStorage.getItem('authToken');
          if (token) {
            try {
              const parts = token.split('.');
              if (parts.length === 3) {
                const payload = parts[1];
                const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
                const decodedPayload = atob(paddedPayload);
                const parsedPayload = JSON.parse(decodedPayload);

                // Set a placeholder user object
                setUser({
                  id: parsedPayload.sub || 'unknown',
                  name: parsedPayload.name || 'User',
                  email: parsedPayload.email || 'user@example.com'
                });
              }
            } catch (decodeError) {
              console.error('Error decoding token:', decodeError);
            }
          }
        } else {
          // Token is invalid, clear any stored auth data
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);

      // Get the token from localStorage after login
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = parts[1];
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            const decodedPayload = atob(paddedPayload);
            const parsedPayload = JSON.parse(decodedPayload);

            // Set the user based on the token payload
            setUser({
              id: parsedPayload.sub || 'unknown',
              name: parsedPayload.name || email.split('@')[0],
              email
            });
          }
        } catch (decodeError) {
          console.error('Error decoding token after login:', decodeError);
          // Fallback to basic user info
          setUser({
            id: 'unknown',
            name: email.split('@')[0],
            email
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(name, email, password);

      // Get the token from localStorage after registration
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = parts[1];
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            const decodedPayload = atob(paddedPayload);
            const parsedPayload = JSON.parse(decodedPayload);

            // Set the user based on the token payload
            setUser({
              id: parsedPayload.sub || 'unknown',
              name: parsedPayload.name || name,
              email
            });
          }
        } catch (decodeError) {
          console.error('Error decoding token after registration:', decodeError);
          // Fallback to basic user info
          setUser({
            id: 'unknown',
            name,
            email
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const verifyToken = async () => {
    return await authApi.verifyToken();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
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