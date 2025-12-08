import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';

export default function TheatersManagementPage() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Theaters Management</h1>
                    <p className="text-gray-600 mt-2">Manage all theaters and locations</p>
                </div>
                <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md">
                    <Plus size={20} />
                    Add New Theater
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search theaters..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Cities</option>
                        <option>Ho Chi Minh City</option>
                        <option>Hanoi</option>
                        <option>Da Nang</option>
                    </select>
                </div>
            </div>

            {/* Theaters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-gradient-to-br from-purple-500 to-blue-500"></div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">CGV Vincom Center</h3>
                            <div className="flex items-start gap-2 text-gray-600 mb-4">
                                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                                <p className="text-sm">72 Le Thanh Ton, District 1, Ho Chi Minh City</p>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Rooms</p>
                                    <p className="text-2xl font-bold text-gray-800">8</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Capacity</p>
                                    <p className="text-2xl font-bold text-gray-800">1,200</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Edit size={18} />
                                    Edit
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing 1 to 6 of 24 theaters</p>
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
