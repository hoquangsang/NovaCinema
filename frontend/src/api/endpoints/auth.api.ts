/**
 * Auth API
 * API endpoints for authentication operations
 */

import { apiClient } from '../client';
import axios from 'axios';
import { config } from '../../config/env';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  phoneNumber?: string;
  username?: string;
  fullName?: string;
  dateOfBirth?: string;
}

export interface User {
  _id: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  username: string;
  fullName: string;
  dateOfBirth: string;
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
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
  verifyEmail: async (email: string, otp: string): Promise<boolean> => {
    const response = await apiClient.post('/auth/email/verify', { email, otp });
    return response.data;
  },

  /**
   * Resend OTP
   */
  resendOTP: async (email: string): Promise<boolean> => {
    const response = await apiClient.post('/auth/otp/resend', { email });
    return response.data;
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

  /**
   * Change password for current logged in user
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    // Use direct axios call to bypass global interceptors so failure
    // (validation or 400) doesn't trigger automatic logout/refresh logic.
    const token = localStorage.getItem('accessToken');
    await axios.patch(
      `${config.apiBaseUrl}/api/users/me/password`,
      { currentPassword, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
  },
};
