import { useState, useEffect, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { roomApi, type Room, type SeatType } from '../../../api/endpoints/room.api';
import { useToast } from '../../../components/common/ToastProvider';
import SeatMapEditor from './SeatMapEditor';

interface AddEditRoomModalProps {
    room: Room | null; // null = add mode, Room = edit mode
    theaterId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ROOM_TYPES = ['2D', '3D', 'VIP'];

export default function AddEditRoomModal({ room, theaterId, onClose, onSuccess }: AddEditRoomModalProps) {
    const toast = useToast();
    const isEditMode = !!room;

    // Form state
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState('2D');
    const [isActive, setIsActive] = useState(true);
    const [rows, setRows] = useState(8);
    const [seatsPerRow, setSeatsPerRow] = useState(10);
    const [seatMap, setSeatMap] = useState<(SeatType | null)[][]>([]);

    // UI state
    const [saving, setSaving] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Load room detail if editing
    useEffect(() => {
        if (isEditMode && room) {
            const loadRoomDetail = async () => {
                setLoadingDetail(true);
                try {
                    const detail = await roomApi.getById(room._id);
                    setRoomName(detail.roomName);
                    setRoomType(detail.roomType);
                    setIsActive(detail.isActive);
                    if (detail.seatMap && detail.seatMap.length > 0) {
                        setSeatMap(detail.seatMap);
                        setRows(detail.seatMap.length);
                        setSeatsPerRow(detail.seatMap[0]?.length || 10);
                    }
                } catch (error) {
                    console.error('Failed to load room detail:', error);
                    toast.push('Không thể tải thông tin phòng', 'error');
                } finally {
                    setLoadingDetail(false);
                }
            };
            loadRoomDetail();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, room?._id]);

    const generateSeatMap = useCallback(() => {
        const newSeatMap: (SeatType | null)[][] = [];
        for (let i = 0; i < rows; i++) {
            const row: (SeatType | null)[] = [];
            for (let j = 0; j < seatsPerRow; j++) {
                row.push('NORMAL');
            }
            newSeatMap.push(row);
        }
        setSeatMap(newSeatMap);
    }, [rows, seatsPerRow]);

    // Validate couple seats - must be in consecutive pairs
    const validateCoupleSEats = useCallback((): { valid: boolean; message?: string } => {
        for (let rowIndex = 0; rowIndex < seatMap.length; rowIndex++) {
            const row = seatMap[rowIndex];
            let coupleCount = 0;
            let consecutiveCouples = 0;
            
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                if (row[colIndex] === 'COUPLE') {
                    coupleCount++;
                    consecutiveCouples++;
                } else {
                    // Check if we had an odd number of consecutive couples
                    if (consecutiveCouples % 2 !== 0) {
                        const rowLabel = String.fromCharCode(65 + rowIndex);
                        return {
                            valid: false,
                            message: `Hàng ${rowLabel}: Ghế Đôi phải đi theo cặp liên tiếp (2, 4, 6... ghế). Hiện có ${consecutiveCouples} ghế liên tiếp.`
                        };
                    }
                    consecutiveCouples = 0;
                }
            }
            
            // Check end of row
            if (consecutiveCouples % 2 !== 0) {
                const rowLabel = String.fromCharCode(65 + rowIndex);
                return {
                    valid: false,
                    message: `Hàng ${rowLabel}: Ghế Đôi phải đi theo cặp liên tiếp (2, 4, 6... ghế). Hiện có ${consecutiveCouples} ghế liên tiếp.`
                };
            }
        }
        return { valid: true };
    }, [seatMap]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!roomName.trim()) {
            toast.push('Vui lòng nhập tên phòng', 'error');
            return;
        }

        if (seatMap.length === 0) {
            toast.push('Vui lòng tạo ma trận ghế', 'error');
            return;
        }

        // Validate couple seats
        const coupleValidation = validateCoupleSEats();
        if (!coupleValidation.valid) {
            toast.push(coupleValidation.message || 'Ghế Đôi không hợp lệ', 'error');
            return;
        }

        setSaving(true);
        try {
            if (isEditMode && room) {
                await roomApi.update(room._id, {
                    roomName: roomName.trim(),
                    roomType,
                    isActive,
                    seatMap,
                });
                toast.push('Cập nhật phòng thành công', 'success');
            } else {
                await roomApi.create(theaterId, {
                    roomName: roomName.trim(),
                    roomType,
                    seatMap,
                });
                toast.push('Tạo phòng mới thành công', 'success');
            }
            onSuccess();
            onClose();
        } catch (error: unknown) {
            // Extract detailed error message
            let errorMessage = 'Có lỗi xảy ra';
            if (error && typeof error === 'object') {
                // Check for axios error response
                const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.message) {
                    errorMessage = axiosError.message;
                } else if ('message' in error && typeof (error as Error).message === 'string') {
                    errorMessage = (error as Error).message;
                }
            }
            toast.push(errorMessage, 'error');
            console.error('Room save error:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#10142C] to-[#1a1f3c]">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {isEditMode ? 'Chỉnh Sửa Phòng Chiếu' : 'Thêm Phòng Chiếu Mới'}
                        </h2>
                        <p className="text-gray-300 text-sm mt-1">
                            {isEditMode ? 'Cập nhật thông tin và bố trí ghế cho phòng' : 'Tạo phòng chiếu và bố trí ghế cho rạp'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Content */}
                {loadingDetail ? (
                    <div className="flex-1 flex items-center justify-center p-12">
                        <Loader2 size={48} className="animate-spin text-yellow-500" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex">
                        {/* Left Panel - Configuration */}
                        <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto bg-gray-50">
                            <h3 className="font-semibold text-gray-800 mb-4">Cấu Hình Phòng</h3>
                            <p className="text-sm text-gray-500 mb-6">Nhập thông tin cơ bản</p>

                            {/* Room Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên Phòng
                                </label>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="Room 1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            {/* Room Type */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại Phòng
                                </label>
                                <select
                                    value={roomType}
                                    onChange={(e) => setRoomType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    {ROOM_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Is Active */}
                            <div className="mb-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Hoạt động</span>
                                </label>
                            </div>

                            <hr className="my-6 border-gray-200" />

                            {/* Seat Configuration */}
                            <h3 className="font-semibold text-gray-800 mb-4">Cấu Hình Ghế</h3>

                            {/* Rows */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số Hàng Ghế
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={26}
                                    value={rows}
                                    onChange={(e) => setRows(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            {/* Seats Per Row */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số Ghế Tối Đa Mỗi Hàng
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={seatsPerRow}
                                    onChange={(e) => setSeatsPerRow(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            {/* Generate Button */}
                            <button
                                type="button"
                                onClick={generateSeatMap}
                                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Tạo Ma Trận Ghế
                            </button>

                            {/* Instructions */}
                            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-800 mb-2">Hướng Dẫn</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li>• Click vào ghế để chuyển đổi loại</li>
                                    <li>• N = Ghế Thường</li>
                                    <li>• V = Ghế VIP</li>
                                    <li>• C = Ghế Đôi (ghế cặp 2 chỗ)</li>
                                    <li>• × = Xóa ghế</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Panel - Seat Map */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <h3 className="font-semibold text-gray-800 mb-2">Bố Trí Ghế Chiếu</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Click vào ghế để chỉnh sửa loại ghế hoặc xóa
                            </p>

                            <SeatMapEditor
                                seatMap={seatMap}
                                onChange={setSeatMap}
                                disabled={saving}
                            />
                        </div>
                    </form>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={saving || loadingDetail || seatMap.length === 0}
                        className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {isEditMode ? 'Lưu Phòng' : 'Tạo Phòng'}
                    </button>
                </div>
            </div>
        </div>
    );
}
