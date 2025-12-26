import { Plus } from 'lucide-react';

interface Props {
    onAddClick: () => void;
}

export default function TheaterHeader({ onAddClick }: Props) {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Theaters Management</h1>
                <p className="text-gray-600 mt-2">Manage all theaters and locations</p>
            </div>
            <button 
                onClick={onAddClick}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
            >
                <Plus size={20} />
                Add New Theater
            </button>
        </div>
    );
}
