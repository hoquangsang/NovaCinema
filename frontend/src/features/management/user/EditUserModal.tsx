import React, { useState } from 'react';
import type { User } from '../../../api/endpoints/auth.api';
import { userApi } from '../../../api/endpoints/user.api';
import { useToast } from '../../../components/common/ToastProvider';

interface Props {
  user: User;
  onClose: () => void;
  onUpdated: (updated: User) => void;
}

export default function EditUserModal({ user, onClose, onUpdated }: Props) {
  const [status, setStatus] = useState<'active' | 'inactive'>(user.isActive ? 'active' : 'inactive');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if status changed
    const currentStatus = user.isActive ? 'active' : 'inactive';
    if (status === currentStatus) {
      toast.push('Không có thay đổi nào', 'info');
      onClose();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updated = status === 'active' 
        ? await userApi.activate(user._id)
        : await userApi.deactivate(user._id);
      
      toast.push(`Đã ${status === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} user thành công`, 'success');
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Cập nhật thất bại';
      setError(msg);
      toast.push(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái người dùng</h3>
        
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Người dùng:</p>
          <p className="font-semibold">{user.fullName || user.username}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-4 py-2 bg-yellow-400 text-[#10142C] font-semibold rounded-md hover:bg-yellow-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
