import React, { useEffect, useState } from 'react';
import type { User } from '../../api/endpoints/auth.api';
import { useAuth } from '../../context/AuthContext';
import { profileApi, type UpdateProfileParams } from '../../api/endpoints/profile.api';

interface Props {
  profile?: User | null;
}

const PersonalInfoCard = ({}: Props) => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState<UpdateProfileParams>({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UpdateProfileParams) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await profileApi.updateProfile(formData);
      await refreshUser();
      alert('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFormData({
      fullName: user?.fullName ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      dateOfBirth: user?.dateOfBirth ?? '',
      email: user?.email ?? '',
    });
  }, [user]);

  return (
    <div className="bg-white rounded-md p-6 shadow-md mb-6">
      <h3 className="text-xl font-bold mb-6">Thông tin cá nhân</h3>
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
