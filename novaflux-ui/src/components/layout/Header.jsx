import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search meters, regions, alerts..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
            </p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}