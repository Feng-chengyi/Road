import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CalendarDays, User } from 'lucide-react';

const tabs = [
  { to: '/', icon: LayoutDashboard, label: '看板' },
  { to: '/subjects', icon: BookOpen, label: '科目' },
  { to: '/plans', icon: CalendarDays, label: '计划' },
  { to: '/profile', icon: User, label: '我的' },
];

export default function Layout() {
  return (
    <div className="h-full flex flex-col max-w-[430px] mx-auto bg-surface-0 relative">
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      <nav className="flex-shrink-0 bg-surface-1 border-t border-white/5 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="flex justify-around">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-brand-500' : 'text-gray-500'
                }`
              }
            >
              <Icon size={22} strokeWidth={1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
