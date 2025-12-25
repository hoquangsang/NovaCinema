import { Search } from 'lucide-react';

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function MovieSearchFilter({ search, onSearchChange }: Props) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
                <select 
                    disabled
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100 cursor-not-allowed opacity-60"
                >
                    <option>All Status</option>
                </select>
                <select 
                    disabled
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100 cursor-not-allowed opacity-60"
                >
                    <option>All Genres</option>
                </select>
            </div>
        </div>
    );
}
