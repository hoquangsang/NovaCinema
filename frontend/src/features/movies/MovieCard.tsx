import { type Movie } from "../../api/endpoints/movie.api";
import { Button } from "../../components/common/Button";
import { CirclePlay } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TrailerModal from "../../components/movie-details/TrailerModal";

interface Props {
  movie: Movie;
}

export const MovieCard = ({ movie }: Props) => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <div className="bg-transparent rounded-lg overflow-hidden group">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover object-top cursor-pointer transition-transform duration-500 group-hover:scale-110"
          onClick={() => navigate(`/movie/${movie._id}`)}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 cursor-pointer"
          onClick={() => navigate(`/movie/${movie._id}`)}
        >
          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-400/30"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Movie Info */}
          <div className="space-y-2 text-white text-sm">
            {/* Duration & Rating Age */}
            <div className="flex items-center gap-3">
              {movie.duration && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{movie.duration} min</span>
                </div>
              )}
              {movie.ratingAge && (
                <div className="px-2 py-0.5 bg-red-500/80 text-white text-xs font-bold rounded">
                  {movie.ratingAge}
                </div>
              )}
            </div>

            {/* Release Date */}
            {movie.releaseDate && (
              <div className="flex items-center gap-1 text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</span>
              </div>
            )}
          </div>

          {/* View Details Hint */}
          <div className="mt-3 text-yellow-400 text-sm font-semibold flex items-center gap-1">
            <span>Click to view details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className=" text-white text-lg wrapper text-center font-bergensans tracking-wide h-10 cursor-pointer hover:text-yellow-400 hover: transition-colors duration-300" title={movie.title} onClick={() => navigate(`/movie/${movie._id}`)}>
          {movie.title}
        </h3>

        <div className="flex space-x-2 mt-10 justify-between">
          <Button intent="secondary" onClick={() => setShowTrailer(true)}>
            <div className="flex items-center gap-2">
              <CirclePlay className="w-5 h-5" />
              <span>Watch Trailer</span>
            </div>
          </Button>

          <Button intent="primary" className="hidden sm:flex" onClick={() => navigate(`/movie/${movie._id}`)}>
            VIEW DETAILS
          </Button>
        </div>
        <TrailerModal
          open={showTrailer}
          trailerUrl={movie.trailerUrl}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      </div>
    </div>
  );
};
