/**
 * Auth API
 * API endpoints for authentication operations
 */

import { apiClient } from '../client';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export const authApi = {
  /**
   * Login
   */
  login: async (params: LoginParams): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', params);
    return response.data;
  },

  /**
   * Register
   */
  register: async (params: RegisterParams): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', params);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Verify email with OTP
   */
  verifyEmail: async (email: string, otp: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { email, otp });
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { email, otp, newPassword });
  },
};
