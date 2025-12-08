import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { CirclePlay, Tag, Clock, Globe, MessageSquareMore, UserCheck } from "lucide-react";
import MetaItem from "./MetaItem";
import TrailerModal from "./TrailerModal";
import type { Movie } from "../../api/endpoints/movie.api";

// Component: render description with a "Xem thêm / Thu gọn" toggle underneath
function DescriptionWithToggle({
  description,
  truncateLen = 300,
}: {
  description?: string | null;
  truncateLen?: number;
}) {
  const [open, setOpen] = useState(false);
  const desc = description ?? "";
  const isLong = desc.length > truncateLen;
  const short = isLong ? desc.slice(0, truncateLen).trimEnd() + "…" : desc;

  return (
    <>
      <p className="mt-2 whitespace-pre-line">{open ? desc : short}</p>
      {desc && (
        <button
          type="button"
          className="mt-2 text-yellow-400 underline bg-transparent p-0 cursor-pointer"
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
        >
          {open ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </>
  );
}

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

  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // TrailerModal handles Escape key and overlay closing

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-2/5 self-start">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full rounded-lg max-h-[700px] object-cover border border-white/60"
        />
      </div>

      <div className="md:w-1/2 space-y-4">
        <h1 className="text-4xl font-bold" style={{ fontFamily: "Anton, sans-serif" }}>
          {movie.title}
        </h1>

        <div className="text-lg space-y-1">
          <MetaItem icon={Tag}>{movie.genre}</MetaItem>

          <MetaItem icon={Clock}>{movie.duration}'</MetaItem>

          <MetaItem icon={Globe}>{movie.country ?? "N/A"}</MetaItem>

          <MetaItem icon={MessageSquareMore}>{movie.language ?? "N/A"}</MetaItem>

          <MetaItem icon={UserCheck}>
            <span className="bg-yellow-400 text-black px-2 rounded">{formatRatingAge(movie.ratingAge)}</span>
          </MetaItem>
        </div>

        <div className="mt-4 text-lm text-gray-300">
          <h3 className="font-bold text-white text-lg">MÔ TẢ</h3>
          <p className="mt-1">Đạo diễn: {movie.director}</p>
          <p className="">Khởi chiếu: {movie.releaseDate}</p>
        </div>

        <div className="mt-4 text-lm text-gray-300">
          <h3 className="font-bold text-white text-lg">NỘI DUNG PHIM</h3>
          <DescriptionWithToggle description={movie.description} />
        </div>

        <div className="mt-4" />

        <div className="flex items-center gap-3 mt-6 cursor-pointer">
          <Button intent="secondary" onClick={() => setShowTrailerModal(true)} className="cursor-pointer">
            <div className="flex items-center gap-2">
              <CirclePlay className="w-5 h-5" />
              <span>Watch trailer</span>
            </div>
          </Button>

          <Button intent="primary" onClick={() => navigate(`/movie/${movie._id}`)} className="cursor-pointer">
            BUY TICKETS
          </Button>
        </div>
        <TrailerModal
          open={showTrailerModal}
          trailerUrl={movie.trailerUrl}
          title={movie.title}
          onClose={() => setShowTrailerModal(false)}
        />
      </div>
    </div>
  );
}
