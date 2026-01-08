import React, { useState } from 'react';
import type { Showtime } from '../../api/endpoints/showtime.api';
import TheaterSelector from './TheaterSelector';
import DateSelector from './DateSelector';
import ShowtimeList from './ShowtimeList';
import SeatSelection from './SeatSelection';
import { useNavigate } from 'react-router-dom';

interface ShowtimeSectionProps {
    movieId: string;
}

export const ShowtimeSection: React.FC<ShowtimeSectionProps> = ({ movieId }) => {
    const navigate = useNavigate();
    const [selectedTheaterId, setSelectedTheaterId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

    const handleTheaterSelect = (theaterId: string) => {
        setSelectedTheaterId(theaterId);
        setSelectedDate(''); // Reset date when theater changes
        setSelectedShowtime(null); // Reset showtime
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedShowtime(null); // Reset showtime when date changes
    };

    const handleShowtimeSelect = (showtime: Showtime) => {
        setSelectedShowtime(showtime);
        // Scroll to seat selection
        setTimeout(() => {
            const seatSection = document.getElementById('seat-selection');
            if (seatSection) {
                seatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleBookingCreate = (bookingId: string) => {
        // Navigate to payment page or show success message
        alert(`Booking created! ID: ${bookingId}\n\nChức năng thanh toán đang được phát triển...`);
        // TODO: Navigate to payment page
        // navigate(`/payment/${bookingId}`);
    };

    return (
        <div className="mt-12 border-t border-gray-700 pt-8">
            {/* Theater Selection */}
            <TheaterSelector
                selectedTheaterId={selectedTheaterId}
                onTheaterSelect={handleTheaterSelect}
            />

            {/* Date Selection */}
            {selectedTheaterId && (
                <DateSelector selectedDate={selectedDate} onDateSelect={handleDateSelect} />
            )}

            {/* Showtime List */}
            {selectedTheaterId && selectedDate && (
                <ShowtimeList
                    movieId={movieId}
                    theaterId={selectedTheaterId}
                    selectedDate={selectedDate}
                    onShowtimeSelect={handleShowtimeSelect}
                    selectedShowtimeId={selectedShowtime?._id}
                />
            )}

            {/* Seat Selection (Expandable) */}
            {selectedShowtime && (
                <div id="seat-selection" className="animate-fadeIn">
                    <SeatSelection showtime={selectedShowtime} onBookingCreate={handleBookingCreate} />
                </div>
            )}
        </div>
    );
};

export default ShowtimeSection;
