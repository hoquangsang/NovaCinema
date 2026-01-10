import React, { useEffect, useState } from 'react';
import { bookingApi, type BookingAvailability, type BookingSeat } from '../../api/endpoints/booking.api';
import type { Showtime } from '../../api/endpoints/showtime.api';
import SeatMap from './SeatMap';
import SeatLegend from './SeatLegend';
import BookingSummary from './BookingSummary';

interface SeatSelectionProps {
    showtime: Showtime;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({
    showtime,
}) => {
    const [availability, setAvailability] = useState<BookingAvailability | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                setIsLoading(true);
                const data = await bookingApi.getAvailability(showtime._id);
                setAvailability(data);
            } catch (error) {
                console.error('Failed to fetch seat availability:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailability();
        setSelectedSeats([]); // Reset selected seats when showtime changes
    }, [showtime._id]);

    const handleSeatSelect = (seatCode: string) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seatCode)) {
                return prev.filter((s) => s !== seatCode);
            } else {
                return [...prev, seatCode];
            }
        });
    };

    const calculateTotal = (): number => {
        if (!availability) return 0;

        let total = 0;
        selectedSeats.forEach((seatCode) => {
            const seat = availability.seatMap
                .flat()
                .find((s) => s && s.seatCode === seatCode);

            if (seat) {
                const price = availability.prices.find((p) => p.seatType === seat.seatType);
                if (price) {
                    total += price.price;
                }
            }
        });

        return total;
    };

    const getSelectedSeatsDetails = (): BookingSeat[] => {
        if (!availability) return [];

        return selectedSeats.map((seatCode) => {
            const seat = availability.seatMap
                .flat()
                .find((s) => s && s.seatCode === seatCode);

            const price = seat
                ? availability.prices.find((p) => p.seatType === seat.seatType)
                : null;

            return {
                seatCode,
                seatType: seat?.seatType || 'NORMAL',
                unitPrice: price?.price || 0,
            };
        });
    };

    const handleCheckout = async () => {
        if (selectedSeats.length === 0) return;

        try {
            setIsCreatingBooking(true);

            // Create booking
            const booking = await bookingApi.createBooking(showtime._id, {
                selectedSeats,
            });

            console.log('Booking created:', booking);

            // Show success message
            alert(`Đặt vé thành công!\n\nMã booking: ${booking._id}\nTổng tiền: ${booking.finalAmount.toLocaleString('vi-VN')} VNĐ\nTrạng thái: ${booking.status}`);

            // Refresh availability to show booked seats
            const data = await bookingApi.getAvailability(showtime._id);
            setAvailability(data);
            setSelectedSeats([]);

        } catch (error: any) {
            console.error('Failed to create booking:', error);
            const errorMsg = error?.message || 'Không thể tạo booking. Vui lòng thử lại!';
            alert(errorMsg);
        } finally {
            setIsCreatingBooking(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                <p className="mt-4 text-gray-400">Đang tải sơ đồ ghế...</p>
            </div>
        );
    }

    if (!availability) {
        return (
            <div className="text-center py-12 text-gray-400">
                Không thể tải thông tin ghế
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
            <h2 className="text-2xl font-bold mb-6 text-white" style={{ fontFamily: 'Anton, sans-serif' }}>
                CHỌN GHẾ - RẠP {showtime.roomName}
            </h2>

            <SeatLegend />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SeatMap
                        seatMap={availability.seatMap}
                        selectedSeats={selectedSeats}
                        onSeatSelect={handleSeatSelect}
                    />
                </div>

                <div>
                    <BookingSummary
                        selectedSeats={selectedSeats}
                        seats={getSelectedSeatsDetails()}
                        totalAmount={calculateTotal()}
                        onCheckout={handleCheckout}
                        isLoading={isCreatingBooking}
                    />
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
