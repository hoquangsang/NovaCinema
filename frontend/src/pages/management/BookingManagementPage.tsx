/**
 * BookingManagementPage
 * Admin page for managing bookings
 */

import { useState } from 'react';
import { Search, Filter, Download, Eye, XCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface Booking {
    _id: string;
    bookingCode: string;
    user: {
        name: string;
        email: string;
        phone: string;
    };
    movie: {
        title: string;
        posterUrl: string;
    };
    showtime: {
        date: string;
        time: string;
        theater: string;
        room: string;
    };
    seats: string[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    createdAt: string;
    updatedAt: string;
}

export default function BookingManagementPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Mock data - replace with actual API call
    const mockBookings: Booking[] = [
        {
            _id: '1',
            bookingCode: 'BK20240101001',
            user: {
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@email.com',
                phone: '0901234567',
            },
            movie: {
                title: 'Avengers: Endgame',
                posterUrl: '/posters/avengers.jpg',
            },
            showtime: {
                date: '2024-01-15',
                time: '19:30',
                theater: 'CGV Vincom',
                room: 'Phòng 1',
            },
            seats: ['A1', 'A2', 'A3'],
            totalAmount: 240000,
            status: 'confirmed',
            paymentMethod: 'VNPay',
            paymentStatus: 'paid',
            createdAt: '2024-01-10T10:30:00',
            updatedAt: '2024-01-10T10:35:00',
        },
        {
            _id: '2',
            bookingCode: 'BK20240101002',
            user: {
                name: 'Trần Thị B',
                email: 'tranthib@email.com',
                phone: '0912345678',
            },
            movie: {
                title: 'Spider-Man: No Way Home',
                posterUrl: '/posters/spiderman.jpg',
            },
            showtime: {
                date: '2024-01-16',
                time: '14:00',
                theater: 'Lotte Cinema',
                room: 'Phòng 3',
            },
            seats: ['B5', 'B6'],
            totalAmount: 160000,
            status: 'pending',
            paymentMethod: 'MoMo',
            paymentStatus: 'pending',
            createdAt: '2024-01-10T14:20:00',
            updatedAt: '2024-01-10T14:20:00',
        },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-green-100 text-green-800',
        };
        const labels: Record<string, string> = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            cancelled: 'Cancelled',
            completed: 'Completed',
        };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getPaymentStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-orange-100 text-orange-800',
            paid: 'bg-green-100 text-green-800',
            refunded: 'bg-gray-100 text-gray-800',
        };
        const labels: Record<string, string> = {
            pending: 'Unpaid',
            paid: 'Paid',
            refunded: 'Refunded',
        };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Booking Management</h1>
                    <p className="text-gray-500 mt-2">Manage customer bookings and payments</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <Download size={20} />
                    Export Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                            <p className="text-3xl font-bold mt-1">1,234</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <CheckCircle size={32} className="opacity-90" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm font-medium">Pending</p>
                            <p className="text-3xl font-bold mt-1">45</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <Clock size={32} className="opacity-90" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm font-medium">Today's Revenue</p>
                            <p className="text-2xl font-bold mt-1">15.5M</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <DollarSign size={32} className="opacity-90" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-rose-500 via-red-600 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-rose-100 text-sm font-medium">Cancelled</p>
                            <p className="text-3xl font-bold mt-1">23</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <XCircle size={32} className="opacity-90" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Booking code, name..."
                                className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="min-w-[140px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="min-w-[140px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment
                        </label>
                        <select
                            value={filterPaymentStatus}
                            onChange={(e) => setFilterPaymentStatus(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">All</option>
                            <option value="pending">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                    <div className="min-w-[140px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="min-w-[140px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="min-w-[100px]">
                        <button
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Booking Code
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Movie & Showtime
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Seats
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {mockBookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-blue-50/50 transition-all">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-800">{booking.bookingCode}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{booking.user.name}</p>
                                            <p className="text-sm text-gray-500">{booking.user.email}</p>
                                            <p className="text-sm text-gray-500">{booking.user.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{booking.movie.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {booking.showtime.theater} - {booking.showtime.room}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {booking.showtime.date} {booking.showtime.time}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {booking.seats.map((seat) => (
                                                <span
                                                    key={seat}
                                                    className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs font-medium text-gray-700"
                                                >
                                                    {seat}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-emerald-700 font-bold text-lg">
                                            {formatCurrency(booking.totalAmount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            {getPaymentStatusBadge(booking.paymentStatus)}
                                            <p className="text-xs text-gray-500 mt-1">{booking.paymentMethod}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDateTime(booking.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110 shadow-sm hover:shadow-md"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">Show</span>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="px-3 py-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-600 font-medium">items</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-white hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-md">
                            {page}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all font-medium"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
