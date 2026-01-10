import { BarChart3, Users, Film, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to the management dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Movies</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">156</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Film className="text-blue-500" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-green-600 mt-4">↑ 12% from last month</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Users</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">2,543</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <Users className="text-green-500" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-green-600 mt-4">↑ 8% from last month</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Revenue</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">$45,231</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <TrendingUp className="text-yellow-500" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-green-600 mt-4">↑ 23% from last month</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Bookings</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <BarChart3 className="text-purple-500" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-green-600 mt-4">↑ 15% from last month</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">New movie added: "The Dark Knight"</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">New user registered: john.doe@example.com</p>
                            <p className="text-xs text-gray-500">5 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">Theater updated: CGV Vincom Center</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
