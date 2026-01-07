// src/features/movies/MovieCardSkeleton.tsx
import { Skeleton } from '../../components/common/Skeleton';

export const MovieCardSkeleton = () => {
    return (
        <div className="group relative overflow-hidden rounded-lg bg-gray-900">
            {/* Poster Skeleton */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Genre */}
                <Skeleton className="h-4 w-1/2" />

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" variant="circular" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        </div>
    );
};
