import React from 'react';
import type { SeatAvailability } from '../../api/endpoints/booking.api';

interface SeatButtonProps {
    seat: SeatAvailability;
    isSelected: boolean;
    onSelect: () => void;
}

export const SeatButton: React.FC<SeatButtonProps> = ({ seat, isSelected, onSelect }) => {
    const getSeatColor = (): string => {
        if (!seat.isAvailable) {
            return 'bg-gray-600 cursor-not-allowed';
        }

        if (isSelected) {
            return 'bg-yellow-400 text-black';
        }

        switch (seat.seatType) {
            case 'VIP':
                return 'bg-red-500 hover:bg-red-400';
            case 'COUPLE':
                return 'bg-pink-500 hover:bg-pink-400';
            default:
                return 'bg-white hover:bg-gray-200 text-black';
        }
    };

    const getSeatSize = (): string => {
        return seat.seatType === 'COUPLE' ? 'w-12 h-8' : 'w-8 h-8';
    };

    return (
        <button
            onClick={onSelect}
            disabled={!seat.isAvailable}
            className={`${getSeatSize()} ${getSeatColor()} rounded text-xs font-semibold transition-all flex items-center justify-center`}
            title={`${seat.seatCode} - ${seat.seatType}`}
        >
            {seat.seatCode.replace(/[A-Z]/g, '')}
        </button>
    );
};

export default SeatButton;
