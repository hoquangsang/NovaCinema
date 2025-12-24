import { useEffect, useState } from 'react';
import { Edit, Trash2, Shield } from 'lucide-react';
import { userApi } from '../../../api/endpoints/user.api';
import type { User } from '../../../api/endpoints/auth.api';
import EditUserModal from './EditUserModal';
import { useToast } from '../../../components/common/ToastProvider';
import { formatUTC0DateToLocal } from '../../../utils/timezone';

interface Props {
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
    onPageChange?: (nextPage: number) => void;
    onLimitChange?: (nextLimit: number) => void;
}

export default function UsersTable({ search = '', sort = '', page = 1, limit = 5, onPageChange, onLimitChange }: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showEdit, setShowEdit] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await userApi.list({ search, sort, page, limit });
                if (!mounted) return;
                setUsers(res.items || []);
                setTotal(res.total || 0);
            } catch (err: any) {
                setError(err?.message || 'Failed to load users');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetch();

        return () => {
            mounted = false;
        };
    }, [search, sort, page, limit, refreshTrigger]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const getPageList = (totalPages: number, current: number, maxButtons = 7): (number | '...')[] => {
        if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages = new Set<number>();
        pages.add(1);
        pages.add(totalPages);

        let left = Math.max(2, current - 1);
        let right = Math.min(totalPages - 1, current + 1);

        // expand window until we have enough buttons (reserve slots for first and last)
        while (right - left + 1 < maxButtons - 2) {
            if (left > 2) {
                left -= 1;
            } else if (right < totalPages - 1) {
                right += 1;
            } else break;
        }

        for (let i = left; i <= right; i++) pages.add(i);

        const sorted = Array.from(pages).sort((a, b) => a - b);
        const result: (number | '...')[] = [];
        for (let i = 0; i < sorted.length; i++) {
            result.push(sorted[i]);
            if (i < sorted.length - 1) {
                const a = sorted[i];
                const b = sorted[i + 1];
                if (b - a > 1) result.push('...');
            }
        }

        return result;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
                <div className="p-6">Đang tải...</div>
            ) : error ? (
                <div className="p-6 text-red-600">Lỗi: {error}</div>
            ) : (
                <>
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user, index) => (
                                <tr key={user._id || index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('') : (user.username || '?')}
                                            </div>
                                            <p className="font-medium text-gray-800">{user.fullName || user.username || user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.phoneNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.roles?.includes('admin') && <Shield size={16} className="text-yellow-500" />}
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.roles?.includes('admin') ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.roles?.includes('admin')
                                                    ? 'Admin'
                                                    : (user.roles && user.roles.length ? (user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1)) : 'User')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatUTC0DateToLocal(user.createdAt, 'en-US')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setSelectedUser(user); setShowEdit(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!user._id) return;
                                                    const ok = window.confirm('Bạn có chắc muốn xoá user này không?');
                                                    if (!ok) return;
                                                    try {
                                                        setDeletingId(user._id);
                                                        await userApi.delete(user._id);
                                                        toast.push('Xoá user thành công', 'success');
                                                        setRefreshTrigger(t => t + 1);
                                                    } catch (err: any) {
                                                        const msg = err?.message || 'Xoá thất bại';
                                                        toast.push(msg, 'error');
                                                    } finally {
                                                        setDeletingId(null);
                                                    }
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                disabled={deletingId === user._id}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showEdit && selectedUser && (
                        <EditUserModal
                            user={selectedUser}
                            onClose={() => { setShowEdit(false); setSelectedUser(null); }}
                            onUpdated={() => { setShowEdit(false); setSelectedUser(null); setRefreshTrigger(t => t + 1); }}
                        />
                    )}

                    <div className="mt-6 flex items-center justify-between p-4">
                        <p className="text-sm text-gray-600">Showing {(page - 1) * (limit || 0) + 1} to {Math.min((page || 1) * (limit || 0), total)} of {total} users</p>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Per page:</label>
                                <select
                                    value={limit}
                                    onChange={(e) => onLimitChange && onLimitChange(Number(e.target.value))}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button disabled={page <= 1} onClick={() => onPageChange && onPageChange(page - 1)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                                    Previous
                                </button>

                                {getPageList(totalPages, page, 7).map((p, idx) => (
                                    p === '...' ? (
                                        <button key={`dots-${idx}`} disabled className="px-3 py-2 rounded-lg">...</button>
                                    ) : (
                                        <button
                                            key={`page-${p}`}
                                            onClick={() => onPageChange && onPageChange(p as number)}
                                            className={`px-4 py-2 rounded-lg ${p === page ? 'bg-yellow-400 text-[#10142C] font-semibold' : 'border border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {p}
                                        </button>
                                    )
                                ))}

                                <button disabled={page >= totalPages} onClick={() => onPageChange && onPageChange(page + 1)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
