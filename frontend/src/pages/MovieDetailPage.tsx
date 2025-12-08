
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "../api/endpoints/movie.api";
import MovieDetails from "../components/movie-details/MovieDetails";
import { Button } from "../components/common/Button";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => (id ? movieApi.getMovieById(id) : Promise.resolve(undefined)),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  if (!movie) {
    return (
      <div className="text-white text-center py-20">
        <p>Movie not found.</p>
        <div className="mt-4">
          <Button intent="ghost" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-12 text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <MovieDetails movie={movie} />
      </div>
    </section>
  );
}
