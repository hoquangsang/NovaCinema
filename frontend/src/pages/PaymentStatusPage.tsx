import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Home, FileText, RotateCcw } from 'lucide-react';
import type { Showtime } from '../api/endpoints/showtime.api';
import type { BookingSeat } from '../api/endpoints/booking.api';

interface PaymentState {
    bookingId: string;
    showtime: Showtime;
    selectedSeats: BookingSeat[];
    totalAmount: number;
}

type PaymentStatus = 'success' | 'pending' | 'failed';

export default function PaymentStatusPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const state = location.state as PaymentState;

    // PayOS Query Params
    const code = searchParams.get('code'); // 00 = success, 01 = invalid params
    const paymentLinkId = searchParams.get('id');
    const cancel = searchParams.get('cancel') === 'true';
    const status = searchParams.get('status'); // PAID, PENDING, PROCESSING, CANCELLED
    const orderCode = searchParams.get('orderCode');
    const customReason = searchParams.get('reason');

    // Get bookingId from either state or query params
    const bookingId = state?.bookingId || orderCode;

    // Determine payment status
    const getPaymentStatus = (): PaymentStatus => {
        if (cancel || status === 'CANCELLED' || code === '01') {
            return 'failed';
        }
        if (status === 'PENDING' || status === 'PROCESSING') {
            return 'pending';
        }
        if (status === 'PAID' || code === '00') {
            return 'success';
        }
        // Default to failed if no clear success indicator
        return 'failed';
    };

    const paymentStatus = getPaymentStatus();

    // Try to get booking details from localStorage if not in state
    const [bookingDetails, setBookingDetails] = useState<PaymentState | null>(state);

    useEffect(() => {
        // If we don't have state from navigation, try localStorage
        if (!state) {
            const pendingPayment = localStorage.getItem('pendingPayment');
            if (pendingPayment) {
                try {
                    const parsed = JSON.parse(pendingPayment);
                    setBookingDetails(parsed);

                    // Clean up localStorage after successful payment
                    if (paymentStatus === 'success') {
                        localStorage.removeItem('pendingPayment');
                    }
                } catch (error) {
                    console.error('Failed to parse pending payment data:', error);
                }
            }
        }
    }, [state, paymentStatus]);

    // Get failure reason
    const getFailureReason = () => {
        if (customReason) return customReason;
        if (cancel) return 'Payment was cancelled by user';
        if (status === 'CANCELLED') return 'Payment was cancelled';
        if (code === '01') return 'Invalid payment parameters';
        return 'Payment was cancelled or failed';
    };

    const failureReason = getFailureReason();

    useEffect(() => {
        // Clean up localStorage on failure
        if (paymentStatus === 'failed') {
            localStorage.removeItem('pendingPayment');
        }

        // If no booking info and not from PayOS, redirect to home after 3 seconds
        if (!bookingId && !paymentLinkId && paymentStatus === 'success') {
            setTimeout(() => navigate('/'), 3000);
        }
    }, [bookingId, paymentLinkId, paymentStatus, navigate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
        };
    };

    // Configuration based on payment status
    const statusConfig = {
        success: {
            gradient: 'from-green-500 to-green-600',
            icon: <CheckCircle className="text-green-500" size={64} />,
            title: 'PAYMENT SUCCESSFUL!',
            subtitle: 'Your booking has been confirmed',
            textColor: 'text-green-100'
        },
        pending: {
            gradient: 'from-yellow-500 to-yellow-600',
            icon: <Clock className="text-yellow-500 animate-pulse" size={64} />,
            title: 'PAYMENT PROCESSING',
            subtitle: 'Your payment is being processed',
            textColor: 'text-yellow-100'
        },
        failed: {
            gradient: 'from-red-500 to-red-600',
            icon: <XCircle className="text-red-500" size={64} />,
            title: 'PAYMENT FAILED',
            subtitle: 'Your payment could not be processed',
            textColor: 'text-red-100'
        }
    };

    const config = statusConfig[paymentStatus];

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    {/* Status Header */}
                    <div className={`bg-gradient-to-r ${config.gradient} p-8 text-center`}>
                        <div className="flex justify-center mb-4">
                            <div className="bg-white rounded-full p-4">
                                {config.icon}
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Anton, sans-serif' }}>
                            {config.title}
                        </h1>
                        <p className={`text-lg ${config.textColor}`}>
                            {config.subtitle}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Pending Status Info */}
                        {paymentStatus === 'pending' && (
                            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6">
                                <p className="text-yellow-300 text-sm text-center">
                                    ⏳ Please wait while we confirm your payment. This may take a few moments.
                                </p>
                            </div>
                        )}

                        {/* Failure Reason */}
                        {paymentStatus === 'failed' && (
                            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 mb-6">
                                <h3 className="text-red-400 font-semibold mb-2">What happened?</h3>
                                <p className="text-red-200 mb-4">{failureReason}</p>

                                {/* Payment Details */}
                                {(orderCode || paymentLinkId || code) && (
                                    <div className="mt-4 pt-4 border-t border-red-500/30">
                                        <p className="text-red-300 text-sm mb-2">Payment Details:</p>
                                        <div className="space-y-1 text-xs text-red-200">
                                            {orderCode && <p>Order Code: <span className="font-mono">{orderCode}</span></p>}
                                            {paymentLinkId && <p>Payment ID: <span className="font-mono">{paymentLinkId}</span></p>}
                                            {code && <p>Error Code: <span className="font-mono">{code}</span></p>}
                                            {status && <p>Status: <span className="font-mono">{status}</span></p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Booking ID */}
                        {bookingId && (
                            <div className="bg-gray-700/50 rounded-lg p-6 mb-6">
                                <p className="text-gray-400 text-sm mb-1">
                                    {orderCode ? 'Order Code' : 'Booking ID'}
                                </p>
                                <p className="text-2xl font-bold text-yellow-400 font-mono">{bookingId}</p>
                            </div>
                        )}

                        {/* Payment Link ID */}
                        {paymentLinkId && !bookingId && (
                            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                                <p className="text-gray-400 text-sm mb-1">Payment Link ID</p>
                                <p className="text-sm text-gray-300 font-mono break-all">{paymentLinkId}</p>
                            </div>
                        )}

                        {/* Booking Details (for success/pending) */}
                        {bookingDetails && bookingDetails.showtime && paymentStatus !== 'failed' && (
                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Movie</p>
                                    <p className="text-white text-xl font-bold">{bookingDetails.showtime.movieTitle}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Theater</p>
                                        <p className="text-white font-semibold">{bookingDetails.showtime.theaterName}</p>
                                        <p className="text-gray-400 text-sm">Room: {bookingDetails.showtime.roomName}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Showtime</p>
                                        <p className="text-white font-semibold">
                                            {formatDateTime(bookingDetails.showtime.startAt).time}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {formatDateTime(bookingDetails.showtime.startAt).date}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Seats</p>
                                    <div className="flex flex-wrap gap-2">
                                        {bookingDetails.selectedSeats.map((seat) => (
                                            <span
                                                key={seat.seatCode}
                                                className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm"
                                            >
                                                {seat.seatCode}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Total {paymentStatus === 'success' ? 'Paid' : 'Amount'}</span>
                                        <span className={`text-2xl font-bold ${paymentStatus === 'success' ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {formatCurrency(bookingDetails.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Common Failure Reasons */}
                        {paymentStatus === 'failed' && (
                            <div className="bg-gray-700/50 rounded-lg p-6 mb-6">
                                <h3 className="text-white font-semibold mb-3">Common reasons for payment failure:</h3>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400 mt-1">•</span>
                                        <span>Payment was cancelled by user</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400 mt-1">•</span>
                                        <span>Insufficient funds in account</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400 mt-1">•</span>
                                        <span>Payment timeout or network error</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400 mt-1">•</span>
                                        <span>Invalid payment information</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {paymentStatus === 'failed' ? (
                                <>
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={20} />
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Home size={20} />
                                        Back to Home
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FileText size={20} />
                                        View My Bookings
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Home size={20} />
                                        Back to Home
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Info Message */}
                        <div className={`mt-6 rounded-lg p-4 ${paymentStatus === 'failed'
                            ? 'bg-blue-900/30 border border-blue-500/50'
                            : 'bg-blue-900/30 border border-blue-500/50'
                            }`}>
                            <p className="text-blue-300 text-sm text-center">
                                {paymentStatus === 'failed'
                                    ? 'Need help? Contact our support team at support@novacinema.com'
                                    : 'A confirmation email has been sent to your registered email address'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
