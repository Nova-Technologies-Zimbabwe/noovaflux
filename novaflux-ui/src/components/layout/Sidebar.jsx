import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Brain, 
  ShieldAlert, 
  Factory, 
  AlertTriangle, 
  CreditCard, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/meters', icon: Zap, label: 'Smart Meters' },
  { path: '/forecast', icon: Brain, label: 'AI Forecast' },
  { path: '/theft', icon: ShieldAlert, label: 'Theft Detection' },
  { path: '/substations', icon: Factory, label: 'Substations' },
  { path: '/outages', icon: AlertTriangle, label: 'Outages' },
  { path: '/billing', icon: CreditCard, label: 'Billing' },
];

export default function Sidebar() {
  const { dark, setDark } = useTheme();
  const { logout, user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={clsx(
      'fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50',
      'bg-slate-900 dark:bg-slate-950',
      collapsed ? 'w-16' : 'w-56'
    )}>
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">NOVAFLUX</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={clsx(
              'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all',
              'text-slate-400 hover:text-white hover:bg-slate-800',
              location.pathname === item.path && 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        
        {user && (
          <div className={clsx('flex items-center gap-3 mt-2', collapsed && 'justify-center')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {user.firstName?.[0] || user.email?.[0] || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{user.firstName || user.email}</p>
                <p className="text-slate-500 text-xs capitalize">{user.role}</p>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 mt-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 text-sm"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}