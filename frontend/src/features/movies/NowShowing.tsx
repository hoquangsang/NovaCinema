// src/features/movies/NowShowingSection.tsx
import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../../api/endpoints/movie.api';
import { MovieListSlider } from './MovieListSlider';

export const NowShowing = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['movies', 'now-showing', 1],
    queryFn: () => movieApi.getNowShowing(1, 10)
  });

  if (isLoading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <MovieListSlider
      title="NOW SHOWING"
      movies={response?.items || []}
      variant="now-showing"
    />
  );
};