import { Search, Filter } from 'lucide-react';

interface FilterValues {
    search: string;
    status: string;
    genre: string;
    ratingAge: string;
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
    const handleChange = (key: keyof FilterValues, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handleClearFilters = () => {
        onFilterChange({
            search: filters.search,
            status: '',
            genre: '',
            ratingAge: '',
        });
    };

    return (
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <div className='flex flex-wrap gap-4'>
                {/* Search */}
                <div className='flex-1 min-w-[250px] relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                    <input
                        type='text'
                        placeholder='Tìm kiếm phim...'
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400'
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={filters.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white min-w-[160px]'
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Genre Filter */}
                <select
                    value={filters.genre}
                    onChange={(e) => handleChange('genre', e.target.value)}
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white min-w-[160px]'
                >
                    {GENRE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Rating Age Filter */}
                <select
                    value={filters.ratingAge}
                    onChange={(e) => handleChange('ratingAge', e.target.value)}
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white min-w-[160px]'
                >
                    {RATING_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Clear Filters */}
                <button
                    onClick={handleClearFilters}
                    className='px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2'
                >
                    <Filter size={18} />
                    Xóa bộ lọc
                </button>
            </div>
        </div>
    );
}

export type { FilterValues };
