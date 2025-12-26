import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import { theaterApi } from '../../../api/endpoints/theater.api';
import type { Theater } from '../../../api/endpoints/theater.api';
import AddEditTheaterModal from './AddEditTheaterModal';
import { useToast } from '../../../components/common/ToastProvider';
import { formatUTC0DateToLocal } from '../../../utils/timezone';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

interface Props {
    search?: string;
    isActive?: string;
    page?: number;
    limit?: number;
    onPageChange?: (nextPage: number) => void;
    onLimitChange?: (nextLimit: number) => void;
}

export default function TheatersTable({ 
    search = '', 
    isActive = '', 
    page = 1, 
    limit = 5, 
    onPageChange, 
    onLimitChange 
}: Props) {
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
    const [showEdit, setShowEdit] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [theaterToDelete, setTheaterToDelete] = useState<Theater | null>(null);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const params: any = { page, limit };
                if (search && search.trim()) params.search = search;
                if (isActive && isActive.trim()) params.isActive = isActive === 'true';
                
                const res = await theaterApi.list(params);
                if (!mounted) return;
                setTheaters(res.items || []);
                setTotal(res.total || 0);
            } catch (err: any) {
                if (!mounted) return;
                setError(err?.message || 'Failed to load theaters');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetch();

        return () => {
            mounted = false;
        };
    }, [search, isActive, page, limit, refreshTrigger]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const getPageList = (totalPages: number, current: number, maxButtons = 7): (number | '...')[] => {
        if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages = new Set<number>();
        pages.add(1);
        pages.add(totalPages);

        let left = Math.max(2, current - 1);
        let right = Math.min(totalPages - 1, current + 1);

        // expand window until we have enough buttons (reserve slots for first and last)
        while (right - left + 1 < maxButtons - 2) {
            if (left > 2) {
                left -= 1;
            } else if (right < totalPages - 1) {
                right += 1;
            } else break;
        }

        for (let i = left; i <= right; i++) pages.add(i);

        const sorted = Array.from(pages).sort((a, b) => a - b);
        const result: (number | '...')[] = [];
        for (let i = 0; i < sorted.length; i++) {
            result.push(sorted[i]);
            if (i < sorted.length - 1) {
                const a = sorted[i];
                const b = sorted[i + 1];
                if (b - a > 1) result.push('...');
            }
        }

        return result;
    };

    const handleEdit = (theater: Theater) => {
        setSelectedTheater(theater);
        setShowEdit(true);
    };

    const handleDeleteClick = (theater: Theater) => {
        setTheaterToDelete(theater);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!theaterToDelete) return;
        
        setDeletingId(theaterToDelete._id);
        try {
            await theaterApi.delete(theaterToDelete._id);
            toast.push('Theater deleted successfully', 'success');
            setRefreshTrigger((prev) => prev + 1);
        } catch (err: any) {
            toast.push(err?.message || 'Failed to delete theater', 'error');
        } finally {
            setDeletingId(null);
            setShowDeleteConfirm(false);
            setTheaterToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-6">Loading theaters...</div>
                ) : error ? (
                    <div className="p-6 text-red-600">Error: {error}</div>
                ) : (
                    <>
                        {/* Grid View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {theaters.length === 0 ? (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    No theaters found
                                </div>
                            ) : (
                                theaters.map((theater) => (
                                    <div 
                                        key={theater._id} 
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                                    >
                                        {/* Theater Header with gradient */}
                                        <div className="h-32 bg-gradient-to-br from-purple-500 to-blue-500 relative">
                                            <div className="absolute top-3 right-3">
                                                {theater.isActive ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                        <CheckCircle size={14} />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                        <XCircle size={14} />
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Theater Content */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-800 mb-3 truncate" title={theater.theaterName}>
                                                {theater.theaterName}
                                            </h3>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-start gap-2 text-gray-600">
                                                    <MapPin size={18} className="mt-0.5 flex-shrink-0 text-gray-400" />
                                                    <p className="text-sm line-clamp-2" title={theater.address}>
                                                        {theater.address}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone size={18} className="flex-shrink-0 text-gray-400" />
                                                    <p className="text-sm">{theater.hotline}</p>
                                                </div>
                                            </div>

                                            {/* Stats & Quick Actions */}
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                                <button
                                                    onClick={() => navigate(`/management/rooms?theaterId=${theater._id}`)}
                                                    className="group text-left hover:bg-gray-50 rounded-lg px-2 py-1 -ml-2 transition-colors"
                                                    title="Click to view rooms"
                                                >
                                                    <p className="text-xs text-gray-500 group-hover:text-yellow-600">Rooms</p>
                                                    <p className="text-2xl font-bold text-gray-800 group-hover:text-yellow-600">
                                                        {theater.roomsCount || 0}
                                                    </p>
                                                </button>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">Created</p>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {formatUTC0DateToLocal(theater.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(theater)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    disabled={deletingId === theater._id}
                                                >
                                                    <Edit size={18} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(theater)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    disabled={deletingId === theater._id}
                                                >
                                                    <Trash2 size={18} />
                                                    {deletingId === theater._id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {total > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Show</span>
                                    <select
                                        className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                                        value={limit}
                                        onChange={(e) => onLimitChange?.(Number(e.target.value))}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="text-sm text-gray-600">
                                        Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} theaters
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onPageChange?.(page - 1)}
                                        disabled={page <= 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Previous
                                    </button>
                                    {getPageList(totalPages, page).map((p, idx) =>
                                        p === '...' ? (
                                            <span key={idx} className="px-2 py-2 text-gray-400">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={idx}
                                                onClick={() => onPageChange?.(p)}
                                                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                                                    page === p
                                                        ? 'bg-yellow-400 text-[#10142C] font-semibold'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                    <button
                                        onClick={() => onPageChange?.(page + 1)}
                                        disabled={page >= totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {showEdit && (
                <AddEditTheaterModal
                    theater={selectedTheater}
                    onClose={() => {
                        setShowEdit(false);
                        setSelectedTheater(null);
                    }}
                    onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                />
            )}

            {showDeleteConfirm && theaterToDelete && (
                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    title="Delete Theater"
                    message={`Are you sure you want to delete "${theaterToDelete.theaterName}"? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setTheaterToDelete(null);
                    }}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                />
            )}
        </>
    );
}
