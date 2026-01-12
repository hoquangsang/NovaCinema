// src/features/movies/MovieListPageSkeleton.tsx
import { Skeleton } from '../../components/common/Skeleton';
import { MovieCardSkeleton } from './MovieCardSkeleton';

interface Props {
    title: string;
    subtitle: string;
}

export const MovieListPageSkeleton = ({ title, subtitle }: Props) => {
    return (
        <div className="min-h-screen bg-[#0A0E27] py-16">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1
                        className="text-5xl font-bold text-white uppercase tracking-wide mb-4"
                        style={{ fontFamily: 'Anton, sans-serif' }}
                    >
                        {title}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {subtitle}
                    </p>
                    {/* Page info skeleton */}
                    <div className="flex justify-center mt-2">
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>

                {/* Movies Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <MovieCardSkeleton key={index} />
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-center gap-2">
                    {/* Previous Button Skeleton */}
                    <Skeleton className="w-20 h-10 rounded-lg" />

                    {/* Page Numbers Skeleton */}
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="w-10 h-10 rounded-lg" />
                    ))}

                    {/* Next Button Skeleton */}
                    <Skeleton className="w-20 h-10 rounded-lg" />
                </div>
            </div>
        </div>
    );
};
