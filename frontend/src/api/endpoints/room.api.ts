/**
 * Room API
 * API endpoints for managing rooms
 */

import { apiClient, type PaginatedResponse } from "../client";

// ==================== Types ====================

export interface Room {
  _id: string;
  theaterId: string;
  roomName: string;
  roomType: string; // "2D", "3D", "IMAX", etc.
  isActive: boolean;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomFilters {
  theaterID?: string;
  search?: string;
  sort?: string[];
  page?: number;
  limit?: number;
  roomName?: string;
  roomType?: string[];
  isActive?: boolean;
}

// ==================== API ====================

export const roomApi = {
  /**
   * Get rooms by theater ID with pagination and filters
   */
  getRoomsByTheaterId: async (
    theaterId: string,
    filters: RoomFilters = {}
  ): Promise<PaginatedResponse<Room>> => {
    const params: Record<string, unknown> = {};

    if (filters.search) params.search = filters.search;
    if (filters.sort && filters.sort.length > 0) params.sort = filters.sort;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.roomName) params.roomName = filters.roomName;
    if (filters.roomType && filters.roomType.length > 0) params.roomType = filters.roomType;
    if (filters.isActive !== undefined) params.isActive = filters.isActive;

    const response = await apiClient.get(`/rooms/theaters/${theaterId}`, { params });
    return response as unknown as PaginatedResponse<Room>;
  },

  /**
   * Delete room by ID
   */
  delete: async (roomId: string): Promise<void> => {
    await apiClient.delete(`/rooms/${roomId}`);
  },
};
