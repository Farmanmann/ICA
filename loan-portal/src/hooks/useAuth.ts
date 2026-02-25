// src/hooks/useAuth.ts

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useIsAuthenticated, useUserRole, useHasRole } from '@/lib/store/authStore';
import authService from '@/lib/api/services/authService';

/**
 * Custom hook for authentication
 * Usage:
 *   const { user, login, logout, isLoading } = useAuth();
 */
export function useAuth() {
  const router = useRouter();
  const {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    setLoading,
    setError,
    clearError,
    loadFromStorage,
  } = useAuthStore();

  // Load auth from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Login handler
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      clearError();

      // Authenticate
      await authService.login({ username, password });

      // Fetch user data
      await authService.getCurrentUser();

      setLoading(false);
      router.push('/borrower/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          'Login failed. Please try again.'
      );
      setLoading(false);
    }
  };

  // Register handler
  const register = async (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name?: string;
    last_name?: string;
    role: 'borrower' | 'lender';
    phone?: string;
  }) => {
    try {
      setLoading(true);
      clearError();

      // Register
      await authService.register(data);

      // Auto-login after registration
      await authService.login({
        username: data.username,
        password: data.password,
      });

      // Fetch user data
      await authService.getCurrentUser();

      setLoading(false);
      router.push('/borrower/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.message ||
        'Registration failed. Please try again.';

      setError(errorMessage);
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuth() {
  return useIsAuthenticated();
}

/**
 * Hook to get user role
 */
export function useRole() {
  return useUserRole();
}

/**
 * Hook to check if user has specific role(s)
 */
export function useCanAccess(role: string | string[]) {
  return useHasRole(role);
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
}

/**
 * Hook to require specific role
 * Redirects if user doesn't have required role
 */
export function useRequireRole(role: string | string[]) {
  const router = useRouter();
  const hasRole = useHasRole(role);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (!hasRole) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, hasRole, router]);

  return hasRole;
}