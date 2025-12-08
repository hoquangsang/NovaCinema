import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';

export default function UsersManagementPage() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
                    <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
                </div>
                <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md">
                    <Plus size={20} />
                    Add New User
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>User</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Suspended</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {[
                            { name: 'John Doe', email: 'john.doe@example.com', phone: '+84 901 234 567', role: 'admin', status: 'Active', joined: '2024-01-15' },
                            { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+84 902 345 678', role: 'user', status: 'Active', joined: '2024-02-20' },
                            { name: 'Mike Johnson', email: 'mike.j@example.com', phone: '+84 903 456 789', role: 'user', status: 'Active', joined: '2024-03-10' },
                            { name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '+84 904 567 890', role: 'user', status: 'Inactive', joined: '2024-04-05' },
                            { name: 'David Brown', email: 'david.b@example.com', phone: '+84 905 678 901', role: 'user', status: 'Active', joined: '2024-05-12' },
                        ].map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <p className="font-medium text-gray-800">{user.name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'admin' && <Shield size={16} className="text-yellow-500" />}
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(user.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
                <p className="text-sm text-gray-600">Showing 1 to 5 of 2,543 users</p>
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
