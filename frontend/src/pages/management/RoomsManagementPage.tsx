import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomHeader from '../../features/management/room/RoomHeader';
import RoomSearchFilter, { type RoomFilterValues } from '../../features/management/room/RoomSearchFilter';
import RoomsTable from '../../features/management/room/RoomsTable';
import AddEditRoomModal from '../../features/management/room/AddEditRoomModal';
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
    const [limit, setLimit] = useState(10);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

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
        setPage(1);
    };

    const handleAddClick = () => {
        setRoomToEdit(null);
        setShowEditModal(true);
    };

    const handleEditClick = (room: Room) => {
        setRoomToEdit(room);
        setShowEditModal(true);
    };

    const handleModalClose = () => {
        setShowEditModal(false);
        setRoomToEdit(null);
    };

    const handleModalSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleFilterChange = (newFilters: RoomFilterValues) => {
        setFilters(newFilters);
        setPage(1);
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
            toast.push('Xóa phòng thành công', 'success');
            setRefreshTrigger(prev => prev + 1);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể xóa phòng';
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
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                refreshTrigger={refreshTrigger}
            />

            {/* Add/Edit Room Modal */}
            {showEditModal && (
                <AddEditRoomModal
                    room={roomToEdit}
                    theaterId={selectedTheaterId}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && roomToDelete && (
                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    title="Xóa Phòng"
                    message={`Bạn có chắc chắn muốn xóa "${roomToDelete.roomName}"? Hành động này không thể hoàn tác.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    confirmText={deleting ? 'Đang xóa...' : 'Xóa'}
                    cancelText="Hủy"
                    variant="danger"
                />
            )}
        </div>
    );
}
