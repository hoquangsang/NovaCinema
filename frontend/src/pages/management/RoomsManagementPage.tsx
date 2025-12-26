import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomHeader from '../../features/management/room/RoomHeader';
import RoomSearchFilter, { type RoomFilterValues } from '../../features/management/room/RoomSearchFilter';
import RoomsTable from '../../features/management/room/RoomsTable';
import { theaterApi, type Theater } from '../../api/endpoints/theater.api';
import { roomApi, type Room } from '../../api/endpoints/room.api';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/ToastProvider';

export default function RoomsManagementPage() {
    const [searchParams] = useSearchParams();
    const toast = useToast();

    // Theater state
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [selectedTheaterId, setSelectedTheaterId] = useState<string>('');
    const [loadingTheaters, setLoadingTheaters] = useState(true);

    // Filter state
    const [filters, setFilters] = useState<RoomFilterValues>({
        search: '',
        roomType: '',
        status: '',
    });
    const [page, setPage] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Delete modal state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch theaters on mount
    useEffect(() => {
        const fetchTheaters = async () => {
            try {
                setLoadingTheaters(true);
                const response = await theaterApi.list({ limit: 100 });
                const theatersArray = response.items || [];
                setTheaters(theatersArray);

                const theaterIdFromUrl = searchParams.get('theaterId');
                if (theaterIdFromUrl && theatersArray.some(t => t._id === theaterIdFromUrl)) {
                    setSelectedTheaterId(theaterIdFromUrl);
                } else if (theatersArray.length > 0) {
                    setSelectedTheaterId(theatersArray[0]._id);
                }
            } catch (error) {
                console.error('Failed to fetch theaters:', error);
                setTheaters([]);
            } finally {
                setLoadingTheaters(false);
            }
        };
        fetchTheaters();
    }, [searchParams]);

    const handleTheaterChange = (theaterId: string) => {
        setSelectedTheaterId(theaterId);
        setPage(1); // Reset to first page when theater changes
    };

    const handleAddClick = () => {
        // TODO: Open add room modal
        console.log('Add new room clicked');
    };

    const handleFilterChange = (newFilters: RoomFilterValues) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page when filters change
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleDeleteClick = (room: Room) => {
        setRoomToDelete(room);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!roomToDelete) return;

        setDeleting(true);
        try {
            await roomApi.delete(roomToDelete._id);
            toast.push('Room deleted successfully', 'success');
            setRefreshTrigger(prev => prev + 1);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete room';
            toast.push(errorMessage, 'error');
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
            setRoomToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setRoomToDelete(null);
    };

    return (
        <div>
            <RoomHeader
                theaters={theaters}
                selectedTheaterId={selectedTheaterId}
                loadingTheaters={loadingTheaters}
                onTheaterChange={handleTheaterChange}
                onAddClick={handleAddClick}
            />

            <RoomSearchFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                disabled={!selectedTheaterId}
            />

            <RoomsTable
                theaterId={selectedTheaterId}
                search={filters.search}
                roomType={filters.roomType}
                status={filters.status}
                page={page}
                limit={10}
                onPageChange={handlePageChange}
                onDelete={handleDeleteClick}
                refreshTrigger={refreshTrigger}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && roomToDelete && (
                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    title="Delete Room"
                    message={`Are you sure you want to delete "${roomToDelete.roomName}"? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    confirmText={deleting ? 'Deleting...' : 'Delete'}
                    cancelText="Cancel"
                    variant="danger"
                />
            )}
        </div>
    );
}
