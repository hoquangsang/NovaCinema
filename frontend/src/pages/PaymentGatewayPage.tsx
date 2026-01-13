/**
 * PaymentGatewayPage
 * Custom payment page with QR code display (alternative to PayOS redirect)
 */

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QrCode, Clock, CreditCard, AlertCircle, CheckCircle, Loader2, ArrowLeft, XCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Showtime } from '../api/endpoints/showtime.api';
import type { BookingSeat } from '../api/endpoints/booking.api';
import { bookingApi } from '../api/endpoints/booking.api';
import { paymentApi, type PaymentCheckout } from '../api/endpoints/payment.api';

interface PaymentGatewayState {
    showtime: Showtime;
    selectedSeats: BookingSeat[];
    totalAmount: number;
}

type PaymentStep = 'creating' | 'pending' | 'checking' | 'success' | 'failed' | 'expired';

export default function PaymentGatewayPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as PaymentGatewayState;

    const [step, setStep] = useState<PaymentStep>('creating');
    const [payment, setPayment] = useState<PaymentCheckout | null>(null);
    const [bookingId, setBookingId] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [error, setError] = useState<string>('');
    const [pollingCount, setPollingCount] = useState(0);

    // Redirect if no booking data
    useEffect(() => {
        if (!state || !state.showtime || !state.selectedSeats || state.selectedSeats.length === 0) {
            navigate('/');
        }
    }, [state, navigate]);

    // Create booking and payment on mount
    useEffect(() => {
        if (state && step === 'creating') {
            createPayment();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Countdown timer
    useEffect(() => {
        if (step === 'pending' || step === 'checking') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setStep('expired');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [step]);

    // Poll payment status
    useEffect(() => {
        let pollInterval: ReturnType<typeof setInterval> | null = null;
        
        if (step === 'pending' && payment) {
            pollInterval = setInterval(async () => {
                try {
                    setStep('checking');
                    const paymentDetail = await paymentApi.getPaymentById(payment._id);
                    
                    if (paymentDetail.status === 'PAID') {
                        setStep('success');
                        if (pollInterval) clearInterval(pollInterval);
                    } else if (paymentDetail.status === 'CANCELLED' || paymentDetail.status === 'FAILED') {
                        setStep('failed');
                        if (pollInterval) clearInterval(pollInterval);
                    } else {
                        setStep('pending');
                        setPollingCount(prev => prev + 1);
                    }
                } catch (err) {
                    console.error('Failed to check payment status:', err);
                    setStep('pending');
                }
            }, 3000); // Check every 3 seconds
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [step, payment]);

    const createPayment = async () => {
        try {
            setStep('creating');
            setError('');

            // Create booking
            const booking = await bookingApi.createBooking(state.showtime._id, {
                selectedSeats: state.selectedSeats.map(s => s.seatCode),
            });
            setBookingId(booking._id);

            // Create payment
            const paymentData = await paymentApi.createPayment(booking._id);
            setPayment(paymentData);
            setStep('pending');
        } catch (err: unknown) {
            console.error('Payment creation error:', err);
            const errorMessage = 
                (err as { message?: string })?.message || 
                'Failed to create payment. Please try again.';
            setError(errorMessage);
            setStep('failed');
        }
    };

    const handleCancel = async () => {
        if (payment && window.confirm('Are you sure you want to cancel this payment?')) {
            try {
                await paymentApi.cancelPayment(payment._id, 'User cancelled');
                navigate('/');
            } catch (err) {
                console.error('Failed to cancel payment:', err);
                navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!state) {
        return null;
    }

    const { showtime, selectedSeats, totalAmount } = state;

    // Creating payment
    if (step === 'creating') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={64} />
                    <p className="text-white text-xl">Creating your payment...</p>
                    <p className="text-gray-400 mt-2">Please wait a moment</p>
                </div>
            </div>
        );
    }

    // Payment success
    if (step === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600 mb-6">Your booking has been confirmed</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-gray-600 mb-1">Order Code</p>
                        <p className="text-lg font-bold text-gray-800">{payment?.orderCode}</p>
                        <div className="border-t border-gray-200 my-3"></div>
                        <p className="text-sm text-gray-600">Movie: {showtime.movieTitle}</p>
                        <p className="text-sm text-gray-600">Seats: {selectedSeats.map(s => s.seatCode).join(', ')}</p>
                        <p className="text-sm text-gray-600">Amount: {formatCurrency(totalAmount)}</p>
                    </div>

                    <button
                        onClick={() => navigate('/profile/bookings')}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                    >
                        View My Bookings
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Payment failed or expired
    if (step === 'failed' || step === 'expired') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-800 to-pink-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <XCircle className="text-red-600" size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {step === 'expired' ? 'Payment Expired' : 'Payment Failed'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {step === 'expired' 
                            ? 'Your payment time has expired. Please try again.' 
                            : error || 'The payment was not completed successfully.'}
                    </p>
                    
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Payment pending - Show QR Code
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Header */}
            <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Cancel Payment</span>
                    </button>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                        <Clock className="text-yellow-400" size={20} />
                        <span className="text-white font-semibold text-lg">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* QR Code Section */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
                                <QrCode size={20} />
                                <span className="font-semibold">Scan to Pay</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
                            <p className="text-gray-600">Scan the QR code with your banking app</p>
                        </div>

                        {/* QR Code Display */}
                        {payment?.qrCode ? (
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 flex justify-center">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <QRCodeSVG 
                                        value={payment.qrCode} 
                                        size={280}
                                        level="M"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                        ) : payment?.checkoutUrl ? (
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
                                <p className="text-center text-gray-700 mb-4">QR Code not available, but you can use this link:</p>
                                <a 
                                    href={payment.checkoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center text-blue-600 hover:text-blue-800 underline break-all text-sm"
                                >
                                    {payment.checkoutUrl}
                                </a>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 mb-6 flex items-center justify-center">
                                <div className="text-center">
                                    <Loader2 className="animate-spin mx-auto mb-3 text-gray-400" size={48} />
                                    <p className="text-gray-500">Loading QR Code...</p>
                                </div>
                            </div>
                        )}

                        {/* Payment Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                                <div className="text-sm">
                                    <p className="font-semibold text-blue-900 mb-1">Payment Instructions:</p>
                                    <ul className="text-blue-800 space-y-1 list-disc list-inside">
                                        <li>Open your banking app</li>
                                        <li>Select "Scan QR Code"</li>
                                        <li>Scan the code above</li>
                                        <li>Confirm the payment</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Status indicator */}
                        <div className="mt-4 text-center">
                            {step === 'checking' ? (
                                <div className="flex items-center justify-center gap-2 text-blue-600">
                                    <Loader2 className="animate-spin" size={18} />
                                    <span className="text-sm font-medium">Checking payment status...</span>
                                </div>
                            ) : step === 'pending' && pollingCount > 0 && (
                                <div className="flex items-center justify-center gap-2 text-gray-500">
                                    <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm">Waiting for payment ({pollingCount} checks)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-white">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard size={24} />
                            Payment Details
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-sm text-gray-300 mb-1">Order Code</p>
                                <p className="text-xl font-bold">{payment?.orderCode}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-sm text-gray-300 mb-1">Movie</p>
                                <p className="text-lg font-semibold">{showtime.movieTitle}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-sm text-gray-300 mb-1">Theater & Room</p>
                                <p className="font-semibold">{showtime.theaterName}</p>
                                <p className="text-sm text-gray-300">{showtime.roomName} - {showtime.roomType}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-sm text-gray-300 mb-1">Showtime</p>
                                <p className="font-semibold">{formatDateTime(showtime.startAt)}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-sm text-gray-300 mb-2">Selected Seats</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map(seat => (
                                        <span 
                                            key={seat.seatCode}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-lg text-sm font-semibold"
                                        >
                                            {seat.seatCode}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-4 border-2 border-yellow-400/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total Amount</span>
                                    <span className="text-2xl font-bold text-yellow-400">{formatCurrency(totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <p className="text-sm text-yellow-200 flex items-start gap-2">
                                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                <span>
                                    Please complete your payment within <strong>{formatTime(timeLeft)}</strong> minutes. 
                                    The system will automatically check your payment status.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
