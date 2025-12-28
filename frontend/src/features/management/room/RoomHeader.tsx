import { Building2, Plus } from 'lucide-react';
import type { Theater } from '../../../api/endpoints/theater.api';
import { SearchableTheaterSelect } from '../../../components/common/SearchableTheaterSelect';

interface RoomHeaderProps {
    theaters: Theater[];
    selectedTheaterId: string;
    loadingTheaters: boolean;
    onTheaterChange: (theaterId: string) => void;
    onAddClick: () => void;
}

export default function RoomHeader({
    theaters,
    selectedTheaterId,
    loadingTheaters,
    onTheaterChange,
    onAddClick,
}: RoomHeaderProps) {
    return (
        <>
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Rooms Management</h1>
                    <p className="text-gray-600 mt-2">Manage screening rooms and seating</p>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedTheaterId}
                >
                    <Plus size={20} />
                    Add New Room
                </button>
            </div>

            {/* Theater Selector */}
            <div className="bg-gradient-to-r from-[#10142C] to-[#1a1f3c] rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-400 rounded-lg">
                        <Building2 size={24} className="text-[#10142C]" />
                    </div>
                    <div className="flex-1 max-w-xl">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Select Theater to View Rooms
                        </label>
                        {loadingTheaters ? (
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                Loading theaters...
                            </div>
                        ) : (
                            <SearchableTheaterSelect
                                theaters={theaters}
                                value={selectedTheaterId}
                                onChange={onTheaterChange}
                                placeholder="Chọn rạp để xem phòng chiếu"
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
