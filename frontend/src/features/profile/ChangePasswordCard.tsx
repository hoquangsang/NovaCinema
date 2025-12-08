import React, { useState } from 'react';
import { authApi } from '../../api/endpoints/auth.api';
import { useAuth } from '../../context/AuthContext';

const ChangePasswordCard = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const auth = useAuth();
  
  // live validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^0-9a-zA-Z]/.test(newPassword);
  const isStrong = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Strong password rules: min 8, uppercase, lowercase, number, special char
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!strongRegex.test(newPassword)) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
      return;
    }

    try {
      setLoading(true);
      await authApi.changePassword(currentPassword, newPassword);
      setSuccess('Đổi mật khẩu thành công');
      resetForm();
    } catch (err: any) {
      // auto-clear success after a short delay
      setTimeout(() => setSuccess(null), 4000);
      const status = Number(err?.response?.status);
      const msg = err?.response?.data?.message || err?.message || 'Đã có lỗi xảy ra';

      if (status === 401) {
        auth.logout();
        window.location.href = '/login';
        return;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow">
      <h3 className="text-lg font-semibold mb-3">Đổi mật khẩu</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {success && <div className="mb-3 text-sm text-green-600">{success}</div>}

        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-700 mb-1">Mật khẩu cũ *</label>
          <input
            className="p-2.5 border border-gray-200 rounded"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-700 mb-1">Mật khẩu mới *</label>
          <input
            className="p-2.5 border border-gray-200 rounded"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <p className={newPassword && !isStrong ? 'text-xs text-red-600 mt-1' : 'text-xs text-gray-500 mt-1'}>
            Ít nhất 8 ký; có hoa, thường, số, ký tự đặc
          </p>

          <ul className="text-xs mt-2 space-y-1">
            <li className={hasMinLength ? 'text-green-600' : 'text-gray-500'}>
              {hasMinLength ? '✓' : '•'} Ít nhất 8 ký tự
            </li>
            <li className={hasUpper ? 'text-green-600' : 'text-gray-500'}>
              {hasUpper ? '✓' : '•'} Có chữ hoa (A-Z)
            </li>
            <li className={hasLower ? 'text-green-600' : 'text-gray-500'}>
              {hasLower ? '✓' : '•'} Có chữ thường (a-z)
            </li>
            <li className={hasNumber ? 'text-green-600' : 'text-gray-500'}>
              {hasNumber ? '✓' : '•'} Có số (0-9)
            </li>
            <li className={hasSpecial ? 'text-green-600' : 'text-gray-500'}>
              {hasSpecial ? '✓' : '•'} Có ký tự đặc biệt
            </li>
          </ul>
        </div>

        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-700 mb-1">Xác thực mật khẩu *</label>
          <input
            className="p-2.5 border border-gray-200 rounded"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-600 mt-1">Mật khẩu xác nhận không khớp</p>
          )}
        </div>
        <div className="flex flex-col mb-3">
          <button
            type="submit"
            disabled={loading || !isStrong || newPassword !== confirmPassword || !currentPassword}
            className="bg-[#222b5b] disabled:opacity-60 text-white py-2 px-4 rounded"
          >
            {loading ? 'Đang xử lý...' : 'ĐỔI MẬT KHẨU'}
          </button>
        </div>
        {/* duplicate confirm and button removed */}
      </form>
    </div>
  );
};

export default ChangePasswordCard;
