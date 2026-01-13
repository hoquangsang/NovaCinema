import { useState, useEffect } from 'react';
import { X, User, Film, MapPin, Calendar, Clock, Ticket as TicketIcon, CreditCard } from 'lucide-react';
import { bookingApi } from '../../../api/endpoints/booking.api';
import type { Booking, Ticket } from '../../../api/endpoints/booking.api';

interface Props {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingDetailModal({ booking, isOpen, onClose }: Props) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(false);

    useEffect(() => {
        if (isOpen && booking?._id) {
            loadTickets();
        } else if (!isOpen) {
            // Reset tickets when modal closes
            setTickets([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, booking?._id]);

    const loadTickets = async () => {
        if (!booking?._id) return;
        
        setLoadingTickets(true);
        try {
            const ticketsData = await bookingApi.getTicketsByBookingId(booking._id);
            setTickets(ticketsData || []);
        } catch (error) {
            console.error('Failed to load tickets:', error);
            setTickets([]);
        } finally {
            setLoadingTickets(false);
        }
    };

    if (!isOpen || !booking) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-800',
            PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            EXPIRED: 'bg-gray-100 text-gray-600',
        };
        const labels: Record<string, string> = {
            DRAFT: 'Draft',
            PENDING_PAYMENT: 'Pending Payment',
            CONFIRMED: 'Confirmed',
            CANCELLED: 'Cancelled',
            EXPIRED: 'Expired',
        };
        return (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getTicketStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            VALID: 'bg-green-100 text-green-800',
            USED: 'bg-blue-100 text-blue-800',
            CANCELLED: 'bg-red-100 text-red-800',
            EXPIRED: 'bg-gray-100 text-gray-600',
        };
        const labels: Record<string, string> = {
            VALID: 'Valid',
            USED: 'Used',
            CANCELLED: 'Cancelled',
            EXPIRED: 'Expired',
        };
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Booking Details</h2>
                        <p className="text-blue-100 text-sm mt-1">Booking ID: {booking._id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                        title="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status and Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                <User size={20} className="text-blue-600" />
                                Customer Information
                            </div>
                            <div className="space-y-2 text-sm">
                                <p className="font-medium text-gray-900">{booking.username || 'N/A'}</p>
                                <p className="text-gray-600">User ID: {booking.userId}</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                <CreditCard size={20} className="text-blue-600" />
                                Booking Status
                            </div>
                            <div className="space-y-3">
                                {getStatusBadge(booking.status)}
                                {booking.expiresAt && (
                                    <p className="text-xs text-gray-600">
                                        Expires: {formatDateTime(booking.expiresAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Movie and Showtime Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                            <Film size={22} className="text-blue-600" />
                            Movie & Showtime Details
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Movie</p>
                                    <p className="font-bold text-lg text-gray-900">{booking.movieTitle || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1 flex items-center gap-1">
                                        <MapPin size={14} />
                                        Theater & Room
                                    </p>
                                    <p className="font-medium text-gray-800">{booking.theaterName}</p>
                                    <p className="text-sm text-gray-600">{booking.roomName} ({booking.roomType})</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1 flex items-center gap-1">
                                        <Calendar size={14} />
                                        Showtime
                                    </p>
                                    <p className="font-medium text-gray-800">{formatDateTime(booking.startAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1 flex items-center gap-1">
                                        <Clock size={14} />
                                        Booking Created
                                    </p>
                                    <p className="font-medium text-gray-800">{formatDateTime(booking.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seats */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                            <TicketIcon size={22} className="text-blue-600" />
                            Selected Seats ({booking.seats?.length || 0})
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {booking.seats && booking.seats.map((seat, index) => (
                                <div
                                    key={index}
                                    className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2 shadow-sm"
                                >
                                    <p className="font-bold text-lg text-blue-600">{seat.seatCode}</p>
                                    <p className="text-xs text-gray-600">{seat.seatType}</p>
                                    <p className="text-xs font-semibold text-gray-800">{formatCurrency(seat.unitPrice)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                        <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                            <CreditCard size={22} className="text-emerald-600" />
                            Payment Summary
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Base Amount:</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(booking.baseAmount)}</span>
                            </div>
                            {booking.discountAmount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Discount:</span>
                                    <span className="font-semibold text-red-600">-{formatCurrency(booking.discountAmount)}</span>
                                </div>
                            )}
                            <div className="border-t-2 border-emerald-300 pt-3 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                                <span className="text-2xl font-bold text-emerald-600">{formatCurrency(booking.finalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tickets */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                            <TicketIcon size={22} className="text-purple-600" />
                            Tickets ({tickets.length})
                        </div>
                        {loadingTickets ? (
                            <p className="text-center text-gray-500 py-4">Loading tickets...</p>
                        ) : tickets.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No tickets available</p>
                        ) : (
                            <div className="space-y-3">
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket._id}
                                        className="bg-white rounded-lg p-4 border border-purple-200 flex items-center justify-between hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">Ticket: {ticket.code}</p>
                                            <p className="text-sm text-gray-600">
                                                Seat: <span className="font-semibold">{ticket.seatCode}</span> ({ticket.seatType})
                                            </p>
                                            {ticket.scannedAt && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Scanned: {formatDateTime(ticket.scannedAt)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            {getTicketStatusBadge(ticket.status)}
                                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                                {formatCurrency(ticket.unitPrice)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
