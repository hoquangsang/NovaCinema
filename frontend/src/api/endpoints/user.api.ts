import { apiClient } from '../client';
import type { PaginatedResponse } from '../client';
import type { User } from './auth.api';

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export const userApi = {
  list: async (params: ListUsersParams = {}): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/users', { params });
    return response as unknown as PaginatedResponse<User>;
  },
  update: async (id: string, payload: Partial<Pick<User, 'phoneNumber' | 'fullName' | 'dateOfBirth' | 'active'>>): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}`, payload);
    return response as unknown as User;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
