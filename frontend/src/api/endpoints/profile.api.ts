/**
 * Profile API
 * API endpoints for user profile operations
 */

import { apiClient } from '../client';
import axios from 'axios';
import { config } from '../../config/env';
import type { User } from './auth.api';

export interface UpdateProfileParams {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
}

export const profileApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (params: UpdateProfileParams): Promise<User> => {
    // Use a direct axios call here (bypassing apiClient interceptors)
    // so that update failures (e.g. validation errors) don't trigger
    // the global 401 refresh logic which may redirect/logout the user.
    const token = localStorage.getItem('accessToken');
    const response = await axios.patch(
      `${config.apiBaseUrl}/api/users/me`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    // The API wraps data under `data.data` when using apiClient,
    // but here we need to return the user object from response.data.data
    return response.data.data;
  },
};