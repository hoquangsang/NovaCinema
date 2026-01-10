import { useState } from 'react';
import type { User } from '../../api/endpoints/auth.api';
import { UserCircle, History, LogOut } from 'lucide-react';

interface Props {
  user: User | null;
  onLogout: () => void;
}

const Sidebar = ({ user, onLogout }: Props) => {
  const [selected, setSelected] = useState<'info' | 'history' | 'logout'>('info');

  const itemClass = (key: 'info' | 'history' | 'logout') => {
    if (selected === key) {
      return 'flex items-center px-3 py-2 mb-1 text-yellow-300 font-bold cursor-pointer border-l-2 border-yellow-400';
    }
    return 'flex items-center px-3 py-2 text-white opacity-90 mb-1 cursor-pointer transition-colors duration-150 border-l border-transparent hover:text-yellow-300 hover:border-yellow-300';
  };

  return (
    <aside className="bg-gradient-to-b from-[#5a2bd6] to-[#2d1160] text-white rounded-lg p-6 shadow-2xl -translate-y-12 self-start">
      <div className="flex gap-3 items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-white overflow-hidden">
          {user?.email ? (
            <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(user.email)}`} alt="avatar" />
          ) : null}
        </div>
        <div>
          <div className="font-bold">{user?.fullName || user?.username || 'User'}</div>
          <div className="text-sm text-white/80">{user?.roles?.includes('ADMIN') ? 'Admin' : 'Thành viên'}</div>
          <div className="text-xs text-white/60 mt-1">{user?.email}</div>
        </div>
      </div>

    <div className="mt-3">
      <a
        onClick={() => setSelected('info')}
        className={itemClass('info')}
      >
        <UserCircle className="mr-3" size={18} />
        Thông tin khách hàng
      </a>
      <a
        onClick={() => setSelected('history')}
        className={itemClass('history')}
      >
        <History className="mr-3" size={18} />
        Lịch sử mua hàng
      </a>
      <button
        type="button"
        onClick={() => { setSelected('logout'); onLogout(); }}
        className={itemClass('logout')}
      >
        <LogOut className="mr-3" size={18} />
        Đăng xuất
      </button>
    </div>
    </aside>
  );
};

export default Sidebar;
