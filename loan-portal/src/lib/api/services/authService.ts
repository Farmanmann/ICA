// src/lib/api/services/authService.ts

import { apiClient } from '../client';
import { useAuthStore } from '@/lib/store/authStore';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  role: 'borrower' | 'lender';
  phone?: string;
  lender_type?: 'individual' | 'organization';
  organization?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface UserResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  profile: {
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
  };
}

/**
 * Register a new user (borrower or lender)
 */
export const authService = {
  async register(data: RegisterData): Promise<UserResponse> {
    try {
      const response = await apiClient.post('/auth/register/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    try {
      const response = await apiClient.post('/auth/login/', credentials);
      const { access, refresh } = response.data;

      // Store tokens in auth store
      useAuthStore.getState().setTokens(access, refresh);

      return { access, refresh };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await apiClient.get('/auth/user/');
      const { user, profile } = response.data;

      // Store user data in auth store
      useAuthStore.getState().setUser(user, profile);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await apiClient.post('/auth/refresh/', {
        refresh: refreshToken,
      });
      const { access, refresh } = response.data;

      // Update tokens in store
      useAuthStore.getState().setTokens(access, refresh);

      return { access, refresh };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout - clear tokens from store
   */
  async logout(): Promise<void> {
    useAuthStore.getState().logout();
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<UserResponse['profile']>): Promise<UserResponse> {
    try {
      const response = await apiClient.put('/auth/profile/', data);
      const { user, profile } = response.data;

      // Update user data in store
      useAuthStore.getState().setUser(user, profile);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(uid: string, token: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/verify-email/', {
        uid,
        token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/resend-verification/', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/request-password-reset/', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirm password reset with new password
   */
  async confirmPasswordReset(
    uid: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/confirm-password-reset/', {
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  },

  /**
   * Get current user from store
   */
  getCurrentUserFromStore(): UserResponse | null {
    const user = useAuthStore.getState().user;
    const profile = useAuthStore.getState().profile;

    if (user && profile) {
      return { user, profile };
    }
    return null;
  },
};

export default authService;