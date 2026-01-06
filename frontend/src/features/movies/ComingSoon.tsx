// src/features/movies/ComingSoonSection.tsx
import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../../api/endpoints/movie.api';
import { MovieListSlider } from './MovieListSlider';
import { MovieListSliderSkeleton } from './MovieListSliderSkeleton';

export const ComingSoon = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['movies', 'coming-soon', 1],
    queryFn: () => movieApi.getComingSoon(1, 10)
  });

  if (isLoading) {
    return <MovieListSliderSkeleton title="COMING SOON" />;
  }

  return (
    <MovieListSlider
      title="COMING SOON"
      movies={response?.items || []}
      variant="coming-soon"
    />
  );
};