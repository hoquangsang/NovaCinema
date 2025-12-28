import { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

interface FilterValues {
    search: string;
    status: string;
    genre: string;
    ratingAge: string;
    from: string;
    to: string;
}

interface Props {
    filters: FilterValues;
    onFilterChange: (filters: FilterValues) => void;
}

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'showing', label: 'Đang chiếu' },
    { value: 'upcoming', label: 'Sắp chiếu' },
    { value: 'ended', label: 'Đã kết thúc' },
];

const GENRE_OPTIONS = [
    { value: '', label: 'Tất cả thể loại' },
    { value: 'Action', label: 'Hành động' },
    { value: 'Comedy', label: 'Hài' },
    { value: 'Drama', label: 'Tâm lý' },
    { value: 'Horror', label: 'Kinh dị' },
    { value: 'Romance', label: 'Lãng mạn' },
    { value: 'Sci-Fi', label: 'Khoa học viễn tưởng' },
    { value: 'Animation', label: 'Hoạt hình' },
    { value: 'Thriller', label: 'Giật gân' },
    { value: 'Fantasy', label: 'Giả tưởng' },
    { value: 'Documentary', label: 'Tài liệu' },
];

const RATING_OPTIONS = [
    { value: '', label: 'Tất cả độ tuổi' },
    { value: 'P', label: 'P - Mọi lứa tuổi' },
    { value: 'C13', label: 'C13 - Trên 13 tuổi' },
    { value: 'C16', label: 'C16 - Trên 16 tuổi' },
    { value: 'C18', label: 'C18 - Trên 18 tuổi' },
];

export default function MovieSearchFilter({ filters, onFilterChange }: Props) {
    // Local state for search input with debounce
    const [searchValue, setSearchValue] = useState(filters.search);

    // Debounce search input - sync to parent after 500ms
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== filters.search) {
                onFilterChange({ ...filters, search: searchValue });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue]);

    // Sync local search value when filters.search changes externally (e.g., clear filters)
    useEffect(() => {
        setSearchValue(filters.search);
    }, [filters.search]);

    const handleChange = (key: keyof FilterValues, value: string) => {
        // If changing status to showing, upcoming, or ended, clear from/to
        if (key === 'status' && (value === 'showing' || value === 'upcoming' || value === 'ended')) {
            onFilterChange({ ...filters, [key]: value, from: '', to: '' });
        } else {
            onFilterChange({ ...filters, [key]: value });
        }
    };

    const handleClearFilters = () => {
        setSearchValue(''); // Also clear local search
        onFilterChange({
            search: '',
            status: '',
            genre: '',
            ratingAge: '',
            from: '',
            to: '',
        });
    };

    // Hide from/to filter for showing/upcoming/ended status since those APIs don't support date filtering
    const showDateFilter = filters.status === '';

    return (
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            {/* Row 1: Search bar */}
            <div className='relative mb-4'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                <input
                    type='text'
                    placeholder='Tìm kiếm phim theo tên hoặc đạo diễn...'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400'
                />
            </div>

            {/* Row 2: Filters */}
            <div className='flex flex-wrap items-center gap-3'>
                {/* Status Filter */}
                <div className='flex items-center gap-2'>
                    <span className='text-gray-600 text-sm font-medium'>Trạng thái:</span>
                    <select
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm'
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='w-px h-6 bg-gray-300' />

                {/* Genre Filter */}
                <div className='flex items-center gap-2'>
                    <span className='text-gray-600 text-sm font-medium'>Thể loại:</span>
                    <select
                        value={filters.genre}
                        onChange={(e) => handleChange('genre', e.target.value)}
                        className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm'
                    >
                        {GENRE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='w-px h-6 bg-gray-300' />

                {/* Rating Age Filter */}
                <div className='flex items-center gap-2'>
                    <span className='text-gray-600 text-sm font-medium'>Độ tuổi:</span>
                    <select
                        value={filters.ratingAge}
                        onChange={(e) => handleChange('ratingAge', e.target.value)}
                        className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm'
                    >
                        {RATING_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range Filters - only show for 'all' status */}
                {showDateFilter && (
                    <>
                        <div className='w-px h-6 bg-gray-300' />
                        <div className='flex items-center gap-2'>
                            <Calendar size={16} className='text-gray-400' />
                            <span className='text-gray-600 text-sm font-medium'>Từ:</span>
                            <input
                                type='date'
                                value={filters.from}
                                onChange={(e) => handleChange('from', e.target.value)}
                                className='px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm'
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-gray-600 text-sm font-medium'>Đến:</span>
                            <input
                                type='date'
                                value={filters.to}
                                onChange={(e) => handleChange('to', e.target.value)}
                                className='px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm'
                            />
                        </div>
                    </>
                )}

                {/* Spacer to push clear button to the right */}
                <div className='flex-1' />

                {/* Clear Filters */}
                <button
                    onClick={handleClearFilters}
                    className='px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium'
                >
                    <Filter size={16} />
                    Xóa bộ lọc
                </button>
            </div>
        </div>
    );
}

export type { FilterValues };
