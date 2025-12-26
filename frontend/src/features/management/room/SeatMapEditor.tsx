import { useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import type { SeatType } from '../../../api/endpoints/room.api';

interface SeatMapEditorProps {
    seatMap: (SeatType | null)[][];
    onChange: (seatMap: (SeatType | null)[][]) => void;
    disabled?: boolean;
}

const SEAT_CYCLE: (SeatType | null)[] = ['NORMAL', 'VIP', 'COUPLE', null];

const SEAT_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
    NORMAL: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', label: 'N' },
    VIP: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', label: 'V' },
    COUPLE: { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-700', label: 'C' },
};

export default function SeatMapEditor({ seatMap, onChange, disabled = false }: SeatMapEditorProps) {
    const getRowLabel = (index: number) => String.fromCharCode(65 + index); // A, B, C...

    const handleSeatClick = useCallback((rowIndex: number, colIndex: number) => {
        if (disabled) return;

        const currentType = seatMap[rowIndex][colIndex];
        const currentIndex = SEAT_CYCLE.indexOf(currentType);
        const nextIndex = (currentIndex + 1) % SEAT_CYCLE.length;
        const nextType = SEAT_CYCLE[nextIndex];

        const newSeatMap = seatMap.map((row, rIdx) =>
            rIdx === rowIndex
                ? row.map((seat, cIdx) => (cIdx === colIndex ? nextType : seat))
                : [...row]
        );

        onChange(newSeatMap);
    }, [seatMap, onChange, disabled]);

    const handleReset = useCallback(() => {
        if (disabled) return;
        const resetMap = seatMap.map(row => row.map(() => 'NORMAL' as SeatType));
        onChange(resetMap);
    }, [seatMap, onChange, disabled]);

    const stats = useMemo(() => {
        let normal = 0, vip = 0, couple = 0;
        seatMap.forEach(row => {
            row.forEach(seat => {
                if (seat === 'NORMAL') normal++;
                else if (seat === 'VIP') vip++;
                else if (seat === 'COUPLE') couple++;
            });
        });
        return { normal, vip, couple, total: normal + vip + couple };
    }, [seatMap]);

    if (seatMap.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Nhập số hàng và số ghế, sau đó nhấn "Tạo Ma Trận Ghế"</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Huyền Thoại:</span>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 border-2 border-blue-400 rounded text-blue-700 font-bold text-sm">N</div>
                    <span className="text-sm text-gray-600">Ghế Thường</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 border-2 border-yellow-400 rounded text-yellow-700 font-bold text-sm">V</div>
                    <span className="text-sm text-gray-600">Ghế VIP</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-pink-100 border-2 border-pink-400 rounded text-pink-700 font-bold text-sm">C</div>
                    <span className="text-sm text-gray-600">Ghế Đôi</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded text-gray-400 font-bold text-sm">×</div>
                    <span className="text-sm text-gray-600">Trống</span>
                </div>
            </div>

            {/* Seat Grid */}
            <div className="overflow-x-auto p-4">
                <div className="inline-block min-w-full">
                    {seatMap.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex items-center gap-1 mb-1">
                            {/* Row Label */}
                            <div className="w-8 h-8 flex items-center justify-center text-gray-500 font-semibold text-sm">
                                {getRowLabel(rowIndex)}
                            </div>
                            {/* Seats */}
                            {row.map((seat, colIndex) => {
                                const style = seat ? SEAT_STYLES[seat] : null;
                                return (
                                    <button
                                        key={colIndex}
                                        type="button"
                                        onClick={() => handleSeatClick(rowIndex, colIndex)}
                                        disabled={disabled}
                                        className={`w-8 h-8 flex items-center justify-center rounded border-2 font-bold text-sm transition-all
                                            ${style ? `${style.bg} ${style.border} ${style.text}` : 'bg-gray-100 border-gray-300 text-gray-400'}
                                            ${!disabled && 'hover:scale-110 hover:shadow-md cursor-pointer'}
                                            ${disabled && 'cursor-not-allowed opacity-60'}
                                        `}
                                        title={seat || 'Empty'}
                                    >
                                        {style ? style.label : '×'}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={disabled}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCcw size={16} />
                    Reset Ma Trận
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <p className="text-xs text-gray-500">Ghế Thường</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.normal}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Ghế VIP</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.vip}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Ghế Đôi</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.couple}</p>
                </div>
            </div>
        </div>
    );
}
