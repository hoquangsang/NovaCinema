// src/features/movies/ComingSoonSection.tsx
import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../../api/endpoints/movies';
import { MovieListSlider } from './MovieListSlider';

export const ComingSoon = () => {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies', 'coming-soon'],
    queryFn: () => moviesApi.getUpcomingMovies()
  });

  if (isLoading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <MovieListSlider
      title="COMING SOON"
      movies={movies || []}
      variant="coming-soon"
    />
  );
};