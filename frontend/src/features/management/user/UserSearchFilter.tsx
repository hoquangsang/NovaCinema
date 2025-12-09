import React from 'react';
import { Search } from 'lucide-react';

interface Props {
    q?: string;
    role?: string;
    status?: string;
    onChange: (next: { q?: string; role?: string; status?: string }) => void;
}

export default function UserSearchFilter({ q = '', role = '', status = '', onChange }: Props) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        value={q}
                        onChange={(e) => onChange({ q: e.target.value, role, status })}
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
                <select value={role} onChange={(e) => onChange({ q, role: e.target.value, status })} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <select value={status} onChange={(e) => onChange({ q, role, status: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>
        </div>
    );
}
