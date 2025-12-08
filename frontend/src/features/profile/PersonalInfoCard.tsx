import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { User } from '../../api/endpoints/auth.api';
import { useAuth } from '../../context/AuthContext';
import { profileApi, type UpdateProfileParams } from '../../api/endpoints/profile.api';

interface Props {
  profile?: User | null;
}

const PersonalInfoCard = ({}: Props) => {
  const { user, updateUserLocally } = useAuth();
  // normalize date string for <input type="date" /> (expects YYYY-MM-DD)
  const formatForDateInput = (val?: string | null) => {
    if (!val) return '';
    // already in ISO format
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    // dd/mm/yyyy or dd-mm-yyyy -> convert to yyyy-mm-dd
    const m1 = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m1) return `${m1[3]}-${m1[2]}-${m1[1]}`;
    const m2 = val.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (m2) return `${m2[3]}-${m2[2]}-${m2[1]}`;
    // try Date parse
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return '';
  };
  const [formData, setFormData] = useState<UpdateProfileParams>({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: formatForDateInput(user?.dateOfBirth),
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ message: string; details?: string[] } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UpdateProfileParams) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setErrorInfo(null);
      const updated = await profileApi.updateProfile(formData);
      // Update user locally to avoid calling refreshUser which may trigger
      // a logout if token refresh fails. This keeps the user on the page.
      updateUserLocally(updated);
      alert('Cập nhật thông tin thành công');
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFormData({
      fullName: user?.fullName ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      dateOfBirth: formatForDateInput(user?.dateOfBirth),
      email: user?.email ?? '',
    });
  }, [user]);

  return (
    <div className="bg-white rounded-md p-6 shadow-md mb-6">
      <h3 className="text-xl font-bold mb-6">Thông tin cá nhân</h3>
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
              <input id="fullName" name="fullName" type="text" className="h-12 px-4 border border-black/20 rounded bg-white" value={formData.fullName} onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="dateOfBirth" className="text-sm text-slate-700 mb-2">Ngày sinh</label>
              <input id="dateOfBirth" name="dateOfBirth" type="date" className="h-12 px-4 border border-black/20 rounded bg-white" value={formData.dateOfBirth} onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="text-sm text-slate-700 mb-2">Số điện thoại</label>
              <input id="phoneNumber" name="phoneNumber" type="tel" className="h-12 px-4 border border-black/20 rounded bg-white" value={formData.phoneNumber} onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm text-slate-700 mb-2">Email</label>
              <input id="email" name="email" type="email" className="h-12 px-4 border border-black/20 rounded bg-white" value={formData.email ?? ''} readOnly />
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
