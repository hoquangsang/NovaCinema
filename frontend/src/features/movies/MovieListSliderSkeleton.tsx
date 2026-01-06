// src/features/movies/MovieListSliderSkeleton.tsx
import { Skeleton } from '../../components/common/Skeleton';
import { MovieCardSkeleton } from './MovieCardSkeleton';

interface Props {
    title: string;
}

export const MovieListSliderSkeleton = ({ title }: Props) => {
    return (
        <section className="w-full max-w-7xl mx-auto px-4">
            {/* Title */}
            <h2
                className="text-4xl font-bold text-white text-center uppercase mb-6 tracking-wide"
                style={{ fontFamily: 'Anton, sans-serif' }}
            >
                {title}
            </h2>

            {/* Slider Skeleton */}
            <div className="relative">
                {/* Navigation Buttons Skeleton */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                </div>

                {/* Movie Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <MovieCardSkeleton key={index} />
                    ))}
                </div>

                {/* Pagination Dots Skeleton */}
                <div className="flex justify-center gap-2 mb-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="w-2 h-2 rounded-full" />
                    ))}
                </div>
            </div>

            {/* See More Button Skeleton */}
            <div className="text-center mt-6">
                <Skeleton className="h-10 w-32 mx-auto" />
            </div>
        </section>
    );
};
