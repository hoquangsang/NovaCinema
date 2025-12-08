import { type Movie } from "../../api/endpoints/movie.api";
import { Button } from "../../components/common/Button";
import { CirclePlay } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TrailerModal from "../../components/movie-details/TrailerModal";

interface Props {
  movie: Movie;
  variant: "now-showing" | "coming-soon";
}

export const MovieCard = ({ movie, variant }: Props) => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <div className="bg-transparent rounded-lg overflow-hidden group">
      <div className="relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full aspect-2/3 object-top rounded-bl-lg rounded-br-lg cursor-pointer"
          onClick={() => navigate(`/movie/${movie._id}`)}
        />
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

          {variant === "now-showing" ? (
            <Button intent="primary" className="hidden sm:flex" onClick={() => navigate(`/movie/${movie._id}`)}>
              BUY TICKETS
            </Button>
          ) : (
            <Button intent="primary" className="hidden sm:flex" onClick={() => navigate(`/movie/${movie._id}`)}>
              VIEW DETAILS
            </Button>
          )}
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
