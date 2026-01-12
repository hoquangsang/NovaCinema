import { apiClient, type PaginatedResponse } from '../client';

export interface Movie {
    _id: string; // ID của phim
    title: string; // Tên phim
    director?: string; // Đạo diễn
    description?: string; // Mô tả phim
    genres: string[]; // Thể loại phim
    duration: number; // Thời lượng phim tính bằng phút
    language?: string; // Ngôn ngữ của phim
    country?: string; // Quốc gia sản xuất
    releaseDate?: string; // Ngày phát hành
    endDate?: string; // Ngày kết thúc chiếu
    trailerUrl?: string; // URL trailer phim
    posterUrl?: string; // URL poster phim
    ratingAge?: string; // Độ tuổi phù hợp
    actors?: string[]; // Danh sách diễn viên
    producer?: string; // Nhà sản xuất
}

export interface GetMoviesParams {
    search?: string;
    sort?: string[];
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
    title?: string;
    direction?: string;
    producer?: string;
    genres?: string[];
    actors?: string[];
    ratingAge?: string;
    country?: string;
    language?: string;
}

export interface CreateMoviePayload {
    title: string;
    genres: string[];
    duration: number;
    description?: string;
    posterUrl?: string;
    trailerUrl?: string;
    releaseDate?: string;
    endDate?: string;
    ratingAge?: string;
    country?: string;
    language?: string;
    actors?: string[];
    director?: string;
    producer?: string;
}

export const movieApi = {
    /**
     * Get now showing movies
     */
    getNowShowing: async (page: number = 1, limit: number = 12): Promise<PaginatedResponse<Movie>> => {
        const response = await apiClient.get('/movies/showing', {
            params: { page, limit }
        });
        return response as unknown as PaginatedResponse<Movie>; // Interceptor transforms this
    },

    /**
     * Get coming soon movies
     */
    getComingSoon: async (page: number = 1, limit: number = 12): Promise<PaginatedResponse<Movie>> => {
        const response = await apiClient.get('/movies/upcoming', {
            params: { page, limit }
        });
        return response as unknown as PaginatedResponse<Movie>; // Interceptor transforms this
    },

    /**
     * Get movie by ID
     */
    getMovieById: async (id: string): Promise<Movie> => {
        const response = await apiClient.get(`/movies/${id}`);
        return response.data;
    },


    /**
     * Get all movies with filters and pagination
     */
    getAllMoviesWithFilters: async (params?: GetMoviesParams): Promise<PaginatedResponse<Movie>> => {
        const response = await apiClient.get('/movies', { params });
        return response as unknown as PaginatedResponse<Movie>;
    },

    /**
     * Create new movie
     */
    createMovie: async (data: CreateMoviePayload): Promise<Movie> => {
        const response = await apiClient.post('/movies', data);
        return response.data;
    },

    /**
     * Update movie
     */
    updateMovie: async (id: string, data: Partial<CreateMoviePayload>): Promise<Movie> => {
        const response = await apiClient.patch(`/movies/${id}`, data);
        return response.data;
    },

    /**
     * Delete movie
     */
    deleteMovie: async (id: string): Promise<void> => {
        await apiClient.delete(`/movies/${id}`);
    },
};
