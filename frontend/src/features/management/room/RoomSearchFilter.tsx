import { Search } from 'lucide-react';

export interface RoomFilterValues {
    search: string;
    roomType: string;
    status: string;
}

interface RoomSearchFilterProps {
    filters: RoomFilterValues;
    onFilterChange: (filters: RoomFilterValues) => void;
    disabled?: boolean;
}

export default function RoomSearchFilter({
    filters,
    onFilterChange,
    disabled = false,
}: RoomSearchFilterProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, search: e.target.value });
    };

    const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, roomType: e.target.value });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, status: e.target.value });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={handleSearchChange}
                        placeholder="Search rooms..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                        disabled={disabled}
                    />
                </div>
                <select
                    value={filters.roomType}
                    onChange={handleRoomTypeChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                    disabled={disabled}
                >
                    <option value="">All Types</option>
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                    <option value="4DX">4DX</option>
                    <option value="VIP">VIP</option>
                </select>
                <select
                    value={filters.status}
                    onChange={handleStatusChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                    disabled={disabled}
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </div>
    );
}
