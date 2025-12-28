import { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { movieApi, type Movie } from '../../../api/endpoints/movie.api';
import { useToast } from '../../../components/common/ToastProvider';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { Pagination } from '../../../components/common/Pagination';

interface Props {
    search?: string;
    status?: string;
    genre?: string;
    ratingAge?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
    onPageChange?: (nextPage: number) => void;
    onLimitChange?: (nextLimit: number) => void;
    onEdit?: (movie: Movie) => void;
    refreshTrigger?: number;
}

export default function MoviesTable({ 
    search = '', 
    status = '',
    genre = '',
    ratingAge = '',
    from = '',
    to = '',
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
                let res;

                // Use different API based on status
                if (status === 'showing') {
                    // Use /movies/showing API - no from/to filter supported
                    res = await movieApi.getNowShowing(page, limit);
                    // Client-side filtering for search, genre, ratingAge
                    let filteredMovies = res.items || [];
                    if (search) {
                        const searchLower = search.toLowerCase();
                        filteredMovies = filteredMovies.filter(movie => 
                            movie.title.toLowerCase().includes(searchLower) ||
                            movie.director?.toLowerCase().includes(searchLower)
                        );
                    }
                    if (genre) {
                        filteredMovies = filteredMovies.filter(movie => 
                            movie.genres.includes(genre)
                        );
                    }
                    if (ratingAge) {
                        filteredMovies = filteredMovies.filter(movie => 
                            movie.ratingAge === ratingAge
                        );
                    }
                    if (mounted) {
                        setMovies(filteredMovies);
                        // Use res.total for pagination when no client-side filtering
                        const hasClientFilter = search || genre || ratingAge;
                        setTotal(hasClientFilter ? filteredMovies.length : (res.total || 0));
                    }
                } else if (status === 'upcoming') {
                    // Use /movies/upcoming API - no from/to filter supported
                    res = await movieApi.getComingSoon(page, limit);
                    // Client-side filtering for search, genre, ratingAge
                    let filteredMovies = res.items || [];
                    if (search) {
                        const searchLower = search.toLowerCase();
                        filteredMovies = filteredMovies.filter(movie => 
                            movie.title.toLowerCase().includes(searchLower) ||
                            movie.director?.toLowerCase().includes(searchLower)
                        );
                    }
                    if (genre) {
                        filteredMovies = filteredMovies.filter(movie => 
                            movie.genres.includes(genre)
                        );
                    }
                    if (ratingAge) {
                        filteredMovies = filteredMovies.filter(movie => 
                            movie.ratingAge === ratingAge
                        );
                    }
                    if (mounted) {
                        setMovies(filteredMovies);
                        // Use res.total for pagination when no client-side filtering
                        const hasClientFilter = search || genre || ratingAge;
                        setTotal(hasClientFilter ? filteredMovies.length : (res.total || 0));
                    }
                } else {
                    // Use /movies API for 'all' (empty) or 'ended' status
                    // from/to filter is supported
                    const now = new Date();
                    let filterFrom = from || undefined;
                    let filterTo = to || undefined;

                    // For 'ended' status, set 'to' to today if not already set
                    // to filter movies with endDate < now
                    if (status === 'ended' && !filterTo) {
                        filterTo = now.toISOString().split('T')[0];
                    }

                    res = await movieApi.getAllMoviesWithFilters({ 
                        search: search || undefined, 
                        page, 
                        limit,
                        genres: genre ? [genre] : undefined,
                        ratingAge: ratingAge || undefined,
                        from: filterFrom,
                        to: filterTo,
                    });

                    if (!mounted) return;
                    
                    // Client-side filtering for 'ended' status
                    let filteredMovies = res.items || [];
                    if (status === 'ended') {
                        filteredMovies = filteredMovies.filter(movie => {
                            const endDate = movie.endDate ? new Date(movie.endDate) : null;
                            return endDate && endDate < now;
                        });
                        setMovies(filteredMovies);
                        setTotal(filteredMovies.length);
                    } else {
                        setMovies(filteredMovies);
                        setTotal(res.total || 0);
                    }
                }
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
    }, [search, status, genre, ratingAge, from, to, page, limit, refreshTrigger]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

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
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        onLimitChange={onLimitChange}
                        itemLabel="movies"
                    />
                )}
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa phim"
                message={`Bạn có chắc chắn muốn xóa phim "${movieToDelete?.title}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                variant="danger"
            />
        </>
    );
}
