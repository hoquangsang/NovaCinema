// src/features/movies/NowShowingSection.tsx
import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../../api/endpoints/movie.api';
import { MovieListSlider } from './MovieListSlider';
import { MovieListSliderSkeleton } from './MovieListSliderSkeleton';

export const NowShowing = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['movies', 'now-showing', 1],
    queryFn: () => movieApi.getNowShowing(1, 10)
  });

  if (isLoading) {
    return <MovieListSliderSkeleton title="NOW SHOWING" />;
  }


  return (
    <MovieListSlider
      title="NOW SHOWING"
      movies={response?.items || []}
      variant="now-showing"
    />
  );
};