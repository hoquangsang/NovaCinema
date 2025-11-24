// src/types/index.ts

export interface Movie {
  movie_id: string; // ID của phim
  title: string; // Tên phim
  director: string; // Đạo diễn
  description: string; // Mô tả phim
  genre: string; // Thể loại phim
  duration: number; // Thời lượng phim tính bằng phút
  language: string; // Ngôn ngữ của phim
  country: string; // Quốc gia sản xuất
  release_date: string; // Ngày phát hành
  end_date: string; // Ngày kết thúc chiếu
  trailer_url: string; // URL trailer phim
  poster_url: string; // URL poster phim
  rating_age: number; // Độ tuổi phù hợp
}
