// src/features/movies/NowShowingSection.tsx
import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../../api/endpoints/movies.api';
import { MovieListSlider } from './MovieListSlider';

export const NowShowing = () => {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies', 'now-showing'],
    queryFn: () => moviesApi.getShowingMovies()
  });

  if (isLoading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <MovieListSlider
      title="NOW SHOWING"
      movies={movies || []}
      variant="now-showing"
    />
  );
};