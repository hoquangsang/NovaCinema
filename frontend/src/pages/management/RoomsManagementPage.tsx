import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function RoomsManagementPage() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Rooms Management</h1>
                    <p className="text-gray-600 mt-2">Manage screening rooms and seating</p>
                </div>
                <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md">
                    <Plus size={20} />
                    Add New Room
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Theaters</option>
                        <option>CGV Vincom Center</option>
                        <option>CGV Landmark 81</option>
                        <option>Lotte Cinema</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Types</option>
                        <option>Standard</option>
                        <option>VIP</option>
                        <option>IMAX</option>
                        <option>4DX</option>
                    </select>
                </div>
            </div>

            {/* Rooms Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Room Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Theater</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Capacity</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rows × Seats</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {[
                            { name: 'Room 1', theater: 'CGV Vincom Center', type: 'Standard', capacity: 150, rows: 10, seats: 15, status: 'Active' },
                            { name: 'Room 2', theater: 'CGV Vincom Center', type: 'VIP', capacity: 80, rows: 8, seats: 10, status: 'Active' },
                            { name: 'Room 3', theater: 'CGV Landmark 81', type: 'IMAX', capacity: 200, rows: 12, seats: 17, status: 'Active' },
                            { name: 'Room 4', theater: 'Lotte Cinema', type: '4DX', capacity: 120, rows: 10, seats: 12, status: 'Maintenance' },
                            { name: 'Room 5', theater: 'CGV Vincom Center', type: 'Standard', capacity: 140, rows: 10, seats: 14, status: 'Active' },
                        ].map((room, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-800">{room.name}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{room.theater}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${room.type === 'IMAX' ? 'bg-purple-100 text-purple-700' :
                                            room.type === 'VIP' ? 'bg-yellow-100 text-yellow-700' :
                                                room.type === '4DX' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                                        {room.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{room.capacity} seats</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{room.rows} × {room.seats}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${room.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {room.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing 1 to 5 of 45 rooms</p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Previous
                    </button>
                    <button className="px-4 py-2 bg-yellow-400 text-[#10142C] font-semibold rounded-lg">
                        1
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        2
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        3
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
