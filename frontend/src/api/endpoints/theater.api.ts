/**
 * Theater API
 * API endpoints for managing theaters
 */

import { apiClient, type PaginatedResponse } from "../client";

// ==================== Types ====================

export interface Room {
  _id: string;
  name: string;
  type: string; // "2D", "3D", "IMAX", etc.
  capacity: number;
  theaterId: string;
  isActive: boolean;
}

export interface Theater {
  _id: string;
  name: string;
  address: string;
  city: string;
  rooms?: Room[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TheaterFilters {
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
}

// ==================== API ====================

export const theaterApi = {
  /**
   * Get theaters with pagination
   */
  getTheaters: async (filters: TheaterFilters = {}): Promise<PaginatedResponse<Theater>> => {
    const response = await apiClient.get("/theaters", { params: filters });
    return response as unknown as PaginatedResponse<Theater>;
  },

  /**
   * Get all theaters (no pagination) - for dropdown
   */
  getTheatersList: async (): Promise<Theater[]> => {
    const response = await apiClient.get("/theaters/list");
    return response.data;
  },

  /**
   * Get theater by ID
   */
  getTheaterById: async (id: string): Promise<Theater> => {
    const response = await apiClient.get(`/theaters/${id}`);
    return response.data;
  },

  /**
   * Get rooms by theater ID
   */
  getRoomsByTheaterId: async (theaterId: string): Promise<Room[]> => {
    const response = await apiClient.get(`/theaters/${theaterId}/rooms`);
    return response.data;
  },

  /**
   * Get all rooms (no pagination) - for dropdown
   */
  getRoomsList: async (): Promise<Room[]> => {
    const response = await apiClient.get("/rooms/list");
    return response.data;
  },
};
