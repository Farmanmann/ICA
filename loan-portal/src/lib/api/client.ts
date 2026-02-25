// src/lib/api/client.ts

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies
});

// Request interceptor - Add token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token') || localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token might be expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token') || localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token - redirect to login
          redirectToLogin();
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;

        // Store new token
        Cookies.set('access_token', access, {
          secure: true,
          sameSite: 'strict',
          expires: 1, // 1 day
        });
        localStorage.setItem('access_token', access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - Permission denied
    if (error.response?.status === 403) {
      console.error('Permission denied');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

// Helper function to redirect to login
export const redirectToLogin = () => {
  // Clear tokens
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

// Helper function to get headers for file uploads
export const getFormDataHeaders = () => {
  const token = Cookies.get('access_token') || localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    // Content-Type will be set automatically by axios for FormData
  };
};

export default apiClient;