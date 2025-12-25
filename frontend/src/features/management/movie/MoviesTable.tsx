import { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { movieApi, type Movie } from '../../../api/endpoints/movie.api';
import { useToast } from '../../../components/common/ToastProvider';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

interface Props {
    search?: string;
    page?: number;
    limit?: number;
    onPageChange?: (nextPage: number) => void;
    onLimitChange?: (nextLimit: number) => void;
    onEdit?: (movie: Movie) => void;
    refreshTrigger?: number;
}

export default function MoviesTable({ 
    search = '', 
    page = 1, 
    limit = 10, 
    onPageChange, 
    onLimitChange,
    onEdit,
    refreshTrigger = 0
}: Props) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
    const toast = useToast();

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await movieApi.getAllMoviesWithFilters({ 
                    search: search || undefined, 
                    page, 
                    limit 
                });
                if (!mounted) return;
                setMovies(res.items || []);
                setTotal(res.total || 0);
            } catch (err: any) {
                if (mounted) {
                    setError(err?.message || 'Failed to load movies');
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetch();

        return () => {
            mounted = false;
        };
    }, [search, page, limit, refreshTrigger]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const getPageList = (totalPages: number, current: number, maxButtons = 7): (number | '...')[] => {
        if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages = new Set<number>();
        pages.add(1);
        pages.add(totalPages);

        let left = Math.max(2, current - 1);
        let right = Math.min(totalPages - 1, current + 1);

        while (right - left + 1 < maxButtons - 2) {
            if (left > 2) {
                left -= 1;
            } else if (right < totalPages - 1) {
                right += 1;
            } else break;
        }

        for (let i = left; i <= right; i++) pages.add(i);

        const sorted = Array.from(pages).sort((a, b) => a - b);
        const withEllipsis: (number | '...')[] = [];
        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) withEllipsis.push('...');
            withEllipsis.push(sorted[i]);
        }
        return withEllipsis;
    };

    const handleDeleteClick = (movie: Movie) => {
        setMovieToDelete(movie);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!movieToDelete) return;
        setDeletingId(movieToDelete._id);
        setShowDeleteConfirm(false);
        try {
            await movieApi.deleteMovie(movieToDelete._id);
            toast.push(`Movie "${movieToDelete.title}" deleted successfully`, 'success');
            setMovies(movies.filter(m => m._id !== movieToDelete._id));
            setTotal(total - 1);
        } catch (err: any) {
            toast.push(err?.message || 'Failed to delete movie', 'error');
        } finally {
            setDeletingId(null);
            setMovieToDelete(null);
        }
    };

    const getMovieStatus = (movie: Movie): { label: string; color: string } => {
        const now = new Date();
        const releaseDate = movie.releaseDate ? new Date(movie.releaseDate) : null;
        const endDate = movie.endDate ? new Date(movie.endDate) : null;

        if (releaseDate && releaseDate > now) {
            return { label: 'Coming Soon', color: 'text-blue-600 bg-blue-100' };
        }
        if (endDate && endDate < now) {
            return { label: 'Ended', color: 'text-gray-600 bg-gray-100' };
        }
        return { label: 'Now Showing', color: 'text-green-600 bg-green-100' };
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-[35%]">Movie</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-[18%]">Genre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-[12%]">Duration</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-[13%]">Release Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-[12%]">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-[10%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Loading movies...
                                </td>
                            </tr>
                        ) : movies.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No movies found
                                </td>
                            </tr>
                        ) : (
                            movies.map((movie) => {
                                const status = getMovieStatus(movie);
                                return (
                                    <tr key={movie._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                    {movie.posterUrl ? (
                                                        <img
                                                            src={movie.posterUrl}
                                                            alt={movie.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-800 truncate" title={movie.title}>{movie.title}</div>
                                                    <div className="text-sm text-gray-500 truncate" title={movie.director || 'Unknown Director'}>{movie.director || 'Unknown Director'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-700 truncate" title={movie.genres.join(', ')}>
                                                {movie.genres.join(', ') || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {movie.duration} min
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {formatDate(movie.releaseDate)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => onEdit?.(movie)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="Edit movie"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(movie)}
                                                    disabled={deletingId === movie._id}
                                                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                                    title="Delete movie"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {!loading && movies.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Show</span>
                            <select
                                value={limit}
                                onChange={(e) => onLimitChange?.(Number(e.target.value))}
                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span>entries</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange?.(page - 1)}
                                disabled={page === 1}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            {getPageList(totalPages, page).map((p, i) =>
                                p === '...' ? (
                                    <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => onPageChange?.(p)}
                                        className={`px-3 py-1 border rounded transition-colors ${
                                            page === p
                                                ? 'bg-yellow-400 border-yellow-400 text-[#10142C] font-semibold'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => onPageChange?.(page + 1)}
                                disabled={page === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>

                        <div className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Movie"
                message={`Are you sure you want to delete "${movieToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </>
    );
}
