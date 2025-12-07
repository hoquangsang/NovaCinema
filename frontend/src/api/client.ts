/**
 * API Client
 * Centralized HTTP client with interceptors for request/response handling
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../config/env';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.enableLogging) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Extract data from success response
    return response.data?.data ? response.data : response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${config.apiBaseUrl}/api/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Format error response
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    const errors = error.response?.data?.errors || [];

    if (config.enableLogging) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: errorMessage,
        errors,
      });
    }

    return Promise.reject({
      message: errorMessage,
      errors,
      status: error.response?.status,
    });
  }
);

// Helper types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
  status?: number;
}
