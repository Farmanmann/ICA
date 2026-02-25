// src/lib/store/authStore.ts

import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface UserProfile {
  id: number;
  role: 'borrower' | 'lender' | 'admin';
  phone?: string;
  address?: string;
  date_of_birth?: string;
  national_id?: string;
  employment_status?: string;
  annual_income?: number;
  credit_score?: number;
  created_at: string;
  updated_at: string;
  // Lender-specific fields
  lender_type?: 'individual' | 'organization';
  organization?: string;
  email_verified?: boolean;
  email_verified_at?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthState {
  // State
  user: User | null;
  profile: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User, profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  profile: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Set tokens
  setTokens: (accessToken, refreshToken) => {
    // Store in cookies (more secure)
    Cookies.set('access_token', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 1, // 1 day
    });
    Cookies.set('refresh_token', refreshToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 7, // 7 days
    });

    // Also store in localStorage as backup
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    set({
      accessToken,
     refreshToken,
      isAuthenticated: true,
      error: null,
    });
  },

  // Set user and profile
  setUser: (user, profile) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('profile', JSON.stringify(profile));

    set({
      user,
      profile,
      isAuthenticated: true,
    });
  },

  // Set loading state
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // Set error
  setError: (error) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Logout - clear all auth data
  logout: () => {
    // Clear cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');

    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');

    // Reset state
    set({
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Load from storage (on app init)
  loadFromStorage: () => {
    try {
      const accessToken = Cookies.get('access_token') || localStorage.getItem('access_token');
      const refreshToken = Cookies.get('refresh_token') || localStorage.getItem('refresh_token');
      const userJson = localStorage.getItem('user');
      const profileJson = localStorage.getItem('profile');

      if (accessToken && userJson && profileJson) {
        set({
          accessToken,
          refreshToken,
          user: JSON.parse(userJson),
          profile: JSON.parse(profileJson),
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Failed to load auth from storage:', error);
    }
  },
}));

// Helper hook to get user role
export const useUserRole = () => {
  const profile = useAuthStore((state) => state.profile);
  return profile?.role || null;
};

// Helper hook to check if user is authenticated
export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated);
};

// Helper hook to check specific roles
export const useHasRole = (role: string | string[]) => {
  const profile = useAuthStore((state) => state.profile);
  const roles = Array.isArray(role) ? role : [role];
  return profile?.role ? roles.includes(profile.role) : false;
};