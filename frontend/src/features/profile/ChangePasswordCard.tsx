import React, { useState } from 'react';

const ChangePasswordCard = () => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    // TODO: call change password API
    alert('Yêu cầu đổi mật khẩu đã được gửi (chưa implement API)');
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow">
      <h3 className="text-lg font-semibold mb-3">Đổi mật khẩu</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-700 mb-1">Mật khẩu cũ *</label>
          <input className="p-2.5 border border-gray-200 rounded" type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
        </div>
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-700 mb-1">Mật khẩu mới *</label>
          <input className="p-2.5 border border-gray-200 rounded" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
        </div>
        <div className="flex flex-col mb-3">
          <label className="text-sm text-gray-700 mb-1">Xác thực mật khẩu *</label>
          <input className="p-2.5 border border-gray-200 rounded" type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
        </div>
        <div>
          <button type="submit" className="bg-[#222b5b] text-white py-2 px-4 rounded">ĐỔI MẬT KHẨU</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordCard;
