import React, { useState } from 'react';
import type { User } from '../../../api/endpoints/auth.api';
import { userApi } from '../../../api/endpoints/user.api';
import { useToast } from '../../../components/common/ToastProvider';
import { formatUTC0DateForInput, convertDateInputToUTC0 } from '../../../utils/timezone';

interface Props {
  user: User;
  onClose: () => void;
  onUpdated: (updated: User) => void;
}

export default function EditUserModal({ user, onClose, onUpdated }: Props) {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState(formatUTC0DateForInput(user.dateOfBirth));
  const [active, setActive] = useState(!!user.active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // simple phone validation: allow optional + and 9-12 digits
  const phoneRegex = /^\+?\d{9,12}$/;
  const phoneValid = phoneNumber.trim() === '' ? true : phoneRegex.test(phoneNumber.replace(/\s|-/g, ''));
  const phoneError = phoneNumber.trim() !== '' && !phoneValid ? 'Số điện thoại không hợp lệ. Vui lòng nhập 9-12 chữ số, có thể bắt đầu bằng +.' : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate phone before submit
    if (!phoneValid) {
      setError(phoneError);
      toast.push(phoneError || 'Số điện thoại không hợp lệ', 'error');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        phoneNumber,
        fullName,
        dateOfBirth: dateOfBirth ? convertDateInputToUTC0(dateOfBirth) : undefined,
        active,
      } as const;

      const updated = await userApi.update(user._id, payload as any);
      toast.push('Cập nhật user thành công', 'success');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sửa thông tin người dùng</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone number</label>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={`mt-1 block w-full border px-3 py-2 rounded-md ${phoneError ? 'border-red-500' : ''}`} />
            {phoneError && <div className="text-sm text-red-600 mt-1">{phoneError}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of birth</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <input id="active" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            <label htmlFor="active" className="text-sm">Active</label>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
            <button type="submit" disabled={loading || !!phoneError} className="px-4 py-2 bg-yellow-400 text-[#10142C] font-semibold rounded disabled:opacity-50">
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
