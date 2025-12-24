import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { User } from '../../api/endpoints/auth.api';
import { useAuth } from '../../context/AuthContext';
import { profileApi, type UpdateProfileParams } from '../../api/endpoints/profile.api';
import { formatUTC0DateForInput, convertDateInputToUTC0 } from '../../utils/timezone';
import { useToast } from '../../components/common/ToastProvider';

interface Props {
  profile?: User | null;
}

const PersonalInfoCard = ({}: Props) => {
  const { user, updateUserLocally } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState<UpdateProfileParams>({
    fullName: user?.fullName || '',
    username: user?.username || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: formatUTC0DateForInput(user?.dateOfBirth),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ message: string; details?: string[] } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate fullName
    if (!formData.fullName?.trim()) {
      errors.fullName = 'Họ và tên không được để trống';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    // Validate username - không được bắt đầu bằng số
    if (!formData.username?.trim()) {
      errors.username = 'Tên người dùng không được để trống';
    } else if (/^\d/.test(formData.username)) {
      errors.username = 'Tên người dùng không được bắt đầu bằng số';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Tên người dùng chỉ chứa chữ, số và gạch dưới';
    }

    // Validate phoneNumber
    if (!formData.phoneNumber?.trim()) {
      errors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Số điện thoại phải có 10-11 chữ số';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UpdateProfileParams) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear success message when user edits
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrorInfo(null);
    setSuccessMessage(null);

    // Validate form
    if (!validateForm()) {
      toast.push('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    setIsLoading(true);
    try {
      
      // Convert dateOfBirth từ UTC+7 sang UTC+0 trước khi gửi lên backend
      const dataToSend: UpdateProfileParams = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? convertDateInputToUTC0(formData.dateOfBirth) || undefined : undefined,
      };
      
      const updated = await profileApi.updateProfile(dataToSend);
      // Update user locally to avoid calling refreshUser which may trigger
      // a logout if token refresh fails. This keeps the user on the page.
      updateUserLocally(updated);
      
      // Show success message
      setSuccessMessage('Cập nhật thông tin thành công!');
      toast.push('Cập nhật thông tin thành công!', 'success');
    } catch (err) {
      console.error('Failed to update profile:', err);
      // Extract detailed error information when available
      let message = 'Cập nhật thất bại. Vui lòng thử lại.';
      const details: string[] = [];

      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as any;
        if (data?.message) message = data.message;
        if (Array.isArray(data?.errors)) {
          for (const e of data.errors) {
            if (e?.message) details.push(e.message);
            else details.push(JSON.stringify(e));
          }
        }
      } else if ((err as any)?.message) {
        message = (err as any).message;
      }

      setErrorInfo({ message, details: details.length ? details : undefined });
      toast.push(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFormData({
      fullName: user?.fullName ?? '',
      username: user?.username ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      dateOfBirth: formatUTC0DateForInput(user?.dateOfBirth),
    });
    // Clear messages when user changes
    setSuccessMessage(null);
    setErrorInfo(null);
    setFieldErrors({});
  }, [user]);

  return (
    <div className="bg-white rounded-md p-6 shadow-md mb-6">
      <h3 className="text-xl font-bold mb-6">Thông tin cá nhân</h3>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}
      
      {/* Error Message */}
      {errorInfo ? (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded">
          <div className="font-semibold">{errorInfo.message}</div>
          {errorInfo.details && (
            <ul className="mt-2 list-disc ml-5">
              {errorInfo.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
      
      <div className="">
        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="text-sm text-slate-700 mb-2">Họ và tên</label>
              <input 
                id="fullName" 
                name="fullName" 
                type="text" 
                className={`h-12 px-4 border rounded bg-white ${fieldErrors.fullName ? 'border-red-500' : 'border-black/20'}`}
                value={formData.fullName} 
                onChange={handleChange} 
              />
              {fieldErrors.fullName && (
                <span className="text-xs text-red-600 mt-1">{fieldErrors.fullName}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm text-slate-700 mb-2">Tên người dùng</label>
              <input 
                id="username" 
                name="username" 
                type="text" 
                className={`h-12 px-4 border rounded bg-white ${fieldErrors.username ? 'border-red-500' : 'border-black/20'}`}
                value={formData.username} 
                onChange={handleChange} 
              />
              {fieldErrors.username && (
                <span className="text-xs text-red-600 mt-1">{fieldErrors.username}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="text-sm text-slate-700 mb-2">Số điện thoại</label>
              <input 
                id="phoneNumber" 
                name="phoneNumber" 
                type="tel" 
                className={`h-12 px-4 border rounded bg-white ${fieldErrors.phoneNumber ? 'border-red-500' : 'border-black/20'}`}
                value={formData.phoneNumber} 
                onChange={handleChange} 
              />
              {fieldErrors.phoneNumber && (
                <span className="text-xs text-red-600 mt-1">{fieldErrors.phoneNumber}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="dateOfBirth" className="text-sm text-slate-700 mb-2">Ngày sinh</label>
              <input id="dateOfBirth" name="dateOfBirth" type="date" className="h-12 px-4 border border-black/20 rounded bg-white" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
          </div>

          <div className="mt-6">
            <button type="submit" className="uppercase font-semibold bg-slate-100 border border-slate-300 px-5 py-2 rounded shadow-sm disabled:opacity-60" disabled={isLoading}>Lưu thông tin</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
