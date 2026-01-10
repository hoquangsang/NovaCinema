// src/components/common/Skeleton.tsx
import { cn } from '../../utils/cn';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton = ({ className, variant = 'rectangular' }: SkeletonProps) => {
    return (
        <div
            className={cn(
                'animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]',
                variant === 'circular' && 'rounded-full',
                variant === 'rectangular' && 'rounded-md',
                variant === 'text' && 'rounded h-4',
                className
            )}
            style={{
                animation: 'shimmer 3s infinite linear',
            }}
        />
    );
};
