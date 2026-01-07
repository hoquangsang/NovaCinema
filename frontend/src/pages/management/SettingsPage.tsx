import { Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-600 mt-2">Manage system settings and configurations</p>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                defaultValue="Nova Cinema"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Description
                            </label>
                            <textarea
                                rows={3}
                                defaultValue="The best cinema experience in Vietnam"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                defaultValue="contact@novacinema.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Booking Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Booking Advance Time (days)
                            </label>
                            <input
                                type="number"
                                defaultValue="7"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <p className="text-xs text-gray-500 mt-1">How many days in advance can users book tickets</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cancellation Time (hours)
                            </label>
                            <input
                                type="number"
                                defaultValue="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum hours before showtime to allow cancellation</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="autoConfirm"
                                defaultChecked
                                className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="autoConfirm" className="text-sm font-medium text-gray-700">
                                Auto-confirm bookings after payment
                            </label>
                        </div>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="vnpay"
                                defaultChecked
                                className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="vnpay" className="text-sm font-medium text-gray-700">
                                Enable VNPay
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="momo"
                                defaultChecked
                                className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="momo" className="text-sm font-medium text-gray-700">
                                Enable MoMo
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="zalopay"
                                className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="zalopay" className="text-sm font-medium text-gray-700">
                                Enable ZaloPay
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="emailNotif"
                                defaultChecked
                                className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="emailNotif" className="text-sm font-medium text-gray-700">
                                Send email notifications
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="smsNotif"
                                defaultChecked
                                className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="smsNotif" className="text-sm font-medium text-gray-700">
                                Send SMS notifications
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="pushNotif"
                                className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="pushNotif" className="text-sm font-medium text-gray-700">
                                Send push notifications
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-8 py-3 rounded-lg transition-colors shadow-md">
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
