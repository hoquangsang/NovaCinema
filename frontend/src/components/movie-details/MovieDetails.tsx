import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { CirclePlay } from "lucide-react";
import type { Movie } from "../../types";

export interface MovieDetailsProps {
  movie: Movie;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const navigate = useNavigate();

  const formatRatingAge = (age?: number | null) => {
    if (age === null || age === undefined) return "N/A";
    if (age === 0) return "P: Phim dành cho khán giả mọi lứa tuổi";
    return `T${age}: Phim dành cho khán giả từ đủ ${age} tuổi trở lên (${age}+)`;
  };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const fullDesc = movie.description ?? "";
  const truncateLen = 300;
  const isLong = fullDesc.length > truncateLen;
  const shortDesc = isLong ? fullDesc.slice(0, truncateLen).trimEnd() + "…" : fullDesc;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3">
        <img src={movie.poster_url} alt={movie.title} className="w-full rounded-lg shadow-lg" />
      </div>

      <div className="md:w-2/3 space-y-4">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Anton, sans-serif" }}>
          {movie.title}
        </h1>

        <div className="text-sm text-gray-300">
          <div>thể loại: {movie.genre}</div>
          <div>thời lượng: {movie.duration} phút</div>
          <div>country: {movie.country ?? "N/A"}</div>
          <div>lồng tiếng: {movie.language ?? "N/A"}</div>
          <div>tuổi: {formatRatingAge(movie.rating_age)}</div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-white">MÔ TẢ</h3>
          <p className="text-gray-200 mt-1">Đạo diễn: {movie.director}</p>
          <p className="text-gray-200">Khởi chiếu: {movie.release_date}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-white">NỘI DUNG PHIM</h3>
          <p className="text-gray-200 mt-2 whitespace-pre-line">{showFullDescription ? fullDesc : shortDesc}</p>
          {isLong && (
            <button
              className="mt-2 text-yellow-400 underline"
              onClick={() => setShowFullDescription((s) => !s)}
              aria-expanded={showFullDescription}
            >
              {showFullDescription ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>

        <div className="mt-4" />

        <div className="flex items-center gap-3 mt-6">
          <Button intent="secondary" onClick={() => window.open(movie.trailer_url, "_blank")}>
            <div className="flex items-center gap-2">
              <CirclePlay className="w-5 h-5" />
              <span>Watch trailer</span>
            </div>
          </Button>

          <Button intent="primary" onClick={() => navigate(`/movie/${movie.movie_id}`)}>
            BUY TICKETS
          </Button>

          <Button intent="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
