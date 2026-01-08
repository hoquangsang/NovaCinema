import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../api/endpoints/booking.api';
import type { Showtime } from '../../api/endpoints/showtime.api';

interface ShowtimeListProps {
    movieId: string;
    theaterId: string;
    selectedDate: string;
    onShowtimeSelect: (showtime: Showtime) => void;
    selectedShowtimeId?: string;
}

export const ShowtimeList: React.FC<ShowtimeListProps> = ({
    movieId,
    theaterId,
    selectedDate,
    onShowtimeSelect,
    selectedShowtimeId,
}) => {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchShowtimes = async () => {
            if (!selectedDate || !theaterId) return;

            try {
                setIsLoading(true);
                const data = await bookingApi.getShowtimeAvailability({
                    movieId,
                    theaterId,
                    date: selectedDate,
                });
                setShowtimes(data);
            } catch (error) {
                console.error('Failed to fetch showtimes:', error);
                setShowtimes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShowtimes();
    }, [movieId, theaterId, selectedDate]);

    const formatTime = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    if (!selectedDate) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                <p className="mt-2 text-gray-400 text-sm">Đang tải suất chiếu...</p>
            </div>
        );
    }

    if (!showtimes || showtimes.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400">Không có suất chiếu nào cho ngày này</p>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Anton, sans-serif' }}>
                CHỌN SUẤT CHIẾU
            </h2>

            <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-sm text-gray-400 mb-4">
                    {showtimes[0]?.roomName} - {showtimes[0]?.roomType || 'Standard'}
                </p>

                <div className="flex flex-wrap gap-3">
                    {showtimes.map((showtime) => (
                        <button
                            key={showtime._id}
                            onClick={() => onShowtimeSelect(showtime)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedShowtimeId === showtime._id
                                    ? 'bg-yellow-400 text-black'
                                    : 'bg-gray-700 text-white hover:bg-yellow-400 hover:text-black'
                                }`}
                        >
                            {formatTime(showtime.startAt)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowtimeList;
