/**
 * Profile API
 * API endpoints for user profile operations
 */

import { apiClient } from '../client';
import type { User } from './auth.api';

export interface UpdateProfileParams {
  fullName?: string;
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
    const response = await apiClient.patch('/users/me', params);
    return response.data;
  },
};