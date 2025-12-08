import { Plus, Search, Edit, Trash2, Calendar, Clock } from 'lucide-react';

export default function ShowtimesManagementPage() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Showtimes Management</h1>
                    <p className="text-gray-600 mt-2">Manage movie showtimes and schedules</p>
                </div>
                <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md">
                    <Plus size={20} />
                    Add New Showtime
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search showtimes..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Movies</option>
                        <option>The Dark Knight</option>
                        <option>Inception</option>
                        <option>Interstellar</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Theaters</option>
                        <option>CGV Vincom Center</option>
                        <option>CGV Landmark 81</option>
                        <option>Lotte Cinema</option>
                    </select>
                    <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
            </div>

            {/* Showtimes Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Movie</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Theater</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Room</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Available Seats</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {[
                            { movie: 'The Dark Knight', theater: 'CGV Vincom Center', room: 'Room 1', date: '2025-12-10', time: '19:00', price: '150,000', seats: 120 },
                            { movie: 'Inception', theater: 'CGV Landmark 81', room: 'Room 3', date: '2025-12-10', time: '20:30', price: '180,000', seats: 150 },
                            { movie: 'Interstellar', theater: 'Lotte Cinema', room: 'Room 2', date: '2025-12-11', time: '18:00', price: '160,000', seats: 80 },
                            { movie: 'The Dark Knight', theater: 'CGV Vincom Center', room: 'Room 2', date: '2025-12-11', time: '21:00', price: '200,000', seats: 60 },
                            { movie: 'Inception', theater: 'CGV Vincom Center', room: 'Room 1', date: '2025-12-12', time: '15:30', price: '150,000', seats: 140 },
                        ].map((showtime, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded"></div>
                                        <p className="font-medium text-gray-800">{showtime.movie}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{showtime.theater}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{showtime.room}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={16} className="text-gray-400" />
                                        {new Date(showtime.date).toLocaleDateString('vi-VN')}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={16} className="text-gray-400" />
                                        {showtime.time}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{showtime.price} ₫</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${showtime.seats > 100 ? 'bg-green-100 text-green-700' :
                                            showtime.seats > 50 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {showtime.seats} seats
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
                <p className="text-sm text-gray-600">Showing 1 to 5 of 48 showtimes</p>
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
