import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function MoviesManagementPage() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Movies Management</h1>
                    <p className="text-gray-600 mt-2">Manage all movies in the system</p>
                </div>
                <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md">
                    <Plus size={20} />
                    Add New Movie
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Status</option>
                        <option>Now Showing</option>
                        <option>Coming Soon</option>
                        <option>Ended</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Genres</option>
                        <option>Action</option>
                        <option>Drama</option>
                        <option>Comedy</option>
                        <option>Horror</option>
                    </select>
                </div>
            </div>

            {/* Movies Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Movie</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Genre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Release Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <tr key={item} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-16 bg-gray-200 rounded"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">The Dark Knight</p>
                                            <p className="text-sm text-gray-500">Christopher Nolan</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Action, Drama</td>
                                <td className="px-6 py-4 text-sm text-gray-600">152 min</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Jul 18, 2008</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                        Now Showing
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
                <p className="text-sm text-gray-600">Showing 1 to 5 of 156 movies</p>
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
