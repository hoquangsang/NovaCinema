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
    ratingAge?: number; // Độ tuổi phù hợp
    actors?: string[]; // Danh sách diễn viên
    producer?: string; // Nhà sản xuất
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
     * Get all movies
     */
    getAllMovies: async (): Promise<Movie[]> => {
        const response = await apiClient.get('/movies');
        return response.data;
    },
};
