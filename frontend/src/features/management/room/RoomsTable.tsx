import { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Building2, Loader2 } from 'lucide-react';
import { roomApi, type Room, type RoomFilters } from '../../../api/endpoints/room.api';
import { Pagination } from '../../../components/common/Pagination';

interface MetaData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface RoomsTableProps {
    theaterId: string;
    search: string;
    roomType: string;
    status: string;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    onEdit?: (room: Room) => void;
    onDelete?: (room: Room) => void;
    refreshTrigger?: number;
}

export default function RoomsTable({
    theaterId,
    search,
    roomType,
    status,
    page,
    limit,
    onPageChange,
    onLimitChange,
    onEdit,
    onDelete,
    refreshTrigger = 0,
}: RoomsTableProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState<MetaData>({ total: 0, page: 1, limit: 10, totalPages: 0 });

    const fetchRooms = useCallback(async () => {
        if (!theaterId) return;

        try {
            setLoading(true);
            const filters: RoomFilters = {
                page: page,
                limit: limit,
            };

            if (search) filters.search = search;
            if (roomType) filters.roomType = [roomType];
            if (status !== '') filters.isActive = status === 'active';

            const response = await roomApi.getRoomsByTheaterId(theaterId, filters);
            // PaginatedResponse format: { items, total, page, limit, totalPages }
            setRooms(response.items || []);
            setMeta({
                total: response.total || 0,
                page: response.page || 1,
                limit: response.limit || 10,
                totalPages: response.totalPages || 0
            });
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
            setRooms([]);
            setMeta({ total: 0, page: 1, limit: 10, totalPages: 0 });
        } finally {
            setLoading(false);
        }
    }, [theaterId, search, roomType, status, page, limit]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms, refreshTrigger]);

    const getRoomTypeBadgeStyle = (type: string) => {
        switch (type.toUpperCase()) {
            case 'IMAX':
                return 'bg-purple-100 text-purple-700';
            case 'VIP':
                return 'bg-yellow-100 text-yellow-700';
            case '4DX':
                return 'bg-blue-100 text-blue-700';
            case '3D':
                return 'bg-pink-100 text-pink-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // No theater selected
    if (!theaterId) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Theater Selected</h3>
                <p className="text-gray-500">Please select a theater from the dropdown above to view its rooms.</p>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Loader2 size={48} className="mx-auto text-yellow-500 animate-spin mb-4" />
                <p className="text-gray-500">Loading rooms...</p>
            </div>
        );
    }

    // Empty state
    if (rooms.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Rooms Found</h3>
                <p className="text-gray-500">
                    {search || roomType || status
                        ? 'No rooms match your search criteria.'
                        : 'This theater has no rooms yet. Click "Add New Room" to create one.'}
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Rooms Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Room Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Capacity</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created At</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rooms.map((room) => (
                            <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-800">{room.roomName}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoomTypeBadgeStyle(room.roomType)}`}>
                                        {room.roomType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{room.capacity} seats</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${room.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {room.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(room.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit?.(room)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(room)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination - Always visible */}
                <Pagination
                    page={meta.page}
                    limit={meta.limit}
                    total={meta.total}
                    totalPages={meta.totalPages}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                    itemLabel="rooms"
                />
            </div>
        </>
    );
}
