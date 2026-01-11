import React from 'react';
import type { SeatAvailability } from '../../api/endpoints/booking.api';
import SeatButton from './SeatButton';

interface SeatMapProps {
    seatMap: (SeatAvailability | null)[][];
    selectedSeats: string[];
    onSeatSelect: (seatCode: string) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
    seatMap,
    selectedSeats,
    onSeatSelect,
}) => {
    const getRowLabel = (rowIndex: number): string => {
        return String.fromCharCode(65 + rowIndex); // A, B, C, ...
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            {/* Screen */}
            <div className="mb-8">
                <div className="text-center mb-2 text-gray-400 text-sm">Màn hình</div>
                <div className="h-2 bg-gradient-to-b from-gray-300 to-gray-600 rounded-t-3xl mx-auto max-w-4xl"></div>
            </div>

            {/* Seat Grid */}
            <div className="flex flex-col items-center gap-2">
                {seatMap.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-2">
                        {/* Row Label */}
                        <div className="w-6 text-center text-gray-400 font-semibold text-sm">
                            {getRowLabel(rowIndex)}
                        </div>

                        {/* Seats */}
                        <div className="flex gap-2">
                            {row.map((seat, seatIndex) => {
                                if (!seat) {
                                    // Empty space (aisle)
                                    return <div key={seatIndex} className="w-8 h-8"></div>;
                                }

                                const isSelected = selectedSeats.includes(seat.seatCode);

                                return (
                                    <SeatButton
                                        key={seat.seatCode}
                                        seat={seat}
                                        isSelected={isSelected}
                                        onSelect={() => onSeatSelect(seat.seatCode)}
                                    />
                                );
                            })}
                        </div>

                        {/* Row Label (Right) */}
                        <div className="w-6 text-center text-gray-400 font-semibold text-sm">
                            {getRowLabel(rowIndex)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatMap;
