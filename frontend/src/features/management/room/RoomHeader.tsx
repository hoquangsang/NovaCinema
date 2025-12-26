import { Building2, Plus } from 'lucide-react';
import type { Theater } from '../../../api/endpoints/theater.api';

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
    const getSelectedTheaterName = () => {
        const theater = theaters.find(t => t._id === selectedTheaterId);
        return theater?.theaterName || 'Select Theater';
    };

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
                    <div className="flex-1">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Select Theater to View Rooms
                        </label>
                        {loadingTheaters ? (
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                Loading theaters...
                            </div>
                        ) : (
                            <select
                                value={selectedTheaterId}
                                onChange={(e) => onTheaterChange(e.target.value)}
                                className="w-full md:w-[500px] lg:w-[600px] px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            >
                                <option value="" className="text-gray-800">-- Select a Theater --</option>
                                {theaters.map((theater) => (
                                    <option key={theater._id} value={theater._id} className="text-gray-800">
                                        {theater.theaterName} - {theater.address}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {selectedTheaterId && (
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Current Theater</p>
                            <p className="text-white font-semibold">{getSelectedTheaterName()}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
