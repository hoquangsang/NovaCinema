// src/api/movieApi.ts
import { type Movie } from "../types";
import { MOCK_MOVIES } from "./MockData";

// Hàm giả lập gọi API, trả về một Promise
const fetchMockData = (data: Movie[]): Promise<Movie[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500); // Giả lập 500ms độ trễ mạng
  });
};

// Hàm này sẽ được gọi bởi React Query
const getNowShowing = (): Promise<Movie[]> => {
  // Giả sử 6 phim đầu là "Now Showing"
  return fetchMockData(MOCK_MOVIES.slice(0, 6));
};

const getComingSoon = (): Promise<Movie[]> => {
  // Lấy 6 phim tiếp theo (bạn cần thêm data vào mockData.ts)
  return fetchMockData(MOCK_MOVIES.slice(6, 12));
};

// Hàm lấy chi tiết phim theo id
const getMovieById = (id: string): Promise<Movie | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = MOCK_MOVIES.find((m) => m.movie_id === id);
      resolve(found);
    }, 300);
  });
};

export const movieApi = {
  getNowShowing,
  getComingSoon,
  getMovieById,
};
