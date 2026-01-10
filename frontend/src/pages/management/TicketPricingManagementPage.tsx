/**
 * TicketPricingManagementPage
 * Admin page for managing ticket pricing
 */

import { useState } from 'react';
import { Plus, Edit, Trash2, DollarSign, Calendar, Users, Film } from 'lucide-react';

interface TicketPrice {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    dayType: 'weekday' | 'weekend' | 'holiday';
    timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
    seatType: 'standard' | 'vip' | 'couple';
    discount: number;
    finalPrice: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function TicketPricingManagementPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [filterDayType, setFilterDayType] = useState('');
    const [filterTimeSlot, setFilterTimeSlot] = useState('');
    const [filterSeatType, setFilterSeatType] = useState('');

    // Mock data - replace with actual API call
    const mockPrices: TicketPrice[] = [
        {
            _id: '1',
            name: 'Weekday Morning Standard',
            description: 'Standard seat price for weekday morning shows',
            basePrice: 50000,
            dayType: 'weekday',
            timeSlot: 'morning',
            seatType: 'standard',
            discount: 20,
            finalPrice: 40000,
            isActive: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
        },
        {
            _id: '2',
            name: 'Weekend Evening VIP',
            description: 'VIP seat price for weekend evening shows',
            basePrice: 120000,
            dayType: 'weekend',
            timeSlot: 'evening',
            seatType: 'vip',
            discount: 0,
            finalPrice: 120000,
            isActive: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
        },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getDayTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            weekday: 'Weekday',
            weekend: 'Weekend',
            holiday: 'Holiday',
        };
        return labels[type] || type;
    };

    const getTimeSlotLabel = (slot: string) => {
        const labels: Record<string, string> = {
            morning: 'Morning',
            afternoon: 'Afternoon',
            evening: 'Evening',
            night: 'Night',
        };
        return labels[slot] || slot;
    };

    const getSeatTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            standard: 'Standard',
            vip: 'VIP',
            couple: 'Couple',
        };
        return labels[type] || type;
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Ticket Pricing Management</h1>
                    <p className="text-gray-600 mt-2">Manage ticket prices by seat type, time slot, and day</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
                >
                    <Plus size={20} />
                    Add Pricing
                </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Day Type
                        </label>
                        <select
                            value={filterDayType}
                            onChange={(e) => setFilterDayType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">All</option>
                            <option value="weekday">Weekday</option>
                            <option value="weekend">Weekend</option>
                            <option value="holiday">Holiday</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time Slot
                        </label>
                        <select
                            value={filterTimeSlot}
                            onChange={(e) => setFilterTimeSlot(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">All</option>
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="evening">Evening</option>
                            <option value="night">Night</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Seat Type
                        </label>
                        <select
                            value={filterSeatType}
                            onChange={(e) => setFilterSeatType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">All</option>
                            <option value="standard">Standard</option>
                            <option value="vip">VIP</option>
                            <option value="couple">Couple</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Total Configs</p>
                            <p className="text-3xl font-bold mt-1">24</p>
                        </div>
                        <DollarSign size={40} className="opacity-80" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Active</p>
                            <p className="text-3xl font-bold mt-1">20</p>
                        </div>
                        <Calendar size={40} className="opacity-80" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Average Price</p>
                            <p className="text-2xl font-bold mt-1">75.000đ</p>
                        </div>
                        <Users size={40} className="opacity-80" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Highest Price</p>
                            <p className="text-2xl font-bold mt-1">150.000đ</p>
                        </div>
                        <Film size={40} className="opacity-80" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Config Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Day Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Time Slot
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Seat Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Base Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Final Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {mockPrices.map((price) => (
                                <tr key={price._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-800">{price.name}</p>
                                            <p className="text-sm text-gray-500">{price.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {getDayTypeLabel(price.dayType)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {getTimeSlotLabel(price.timeSlot)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {getSeatTypeLabel(price.seatType)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-medium">
                                        {formatCurrency(price.basePrice)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-red-600 font-semibold">-{price.discount}%</span>
                                    </td>
                                    <td className="px-6 py-4 text-yellow-600 font-bold">
                                        {formatCurrency(price.finalPrice)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {price.isActive ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
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
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show</span>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-600">items</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-yellow-400 text-[#10142C] font-semibold rounded-lg">
                            {page}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
