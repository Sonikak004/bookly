import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  CalendarCheck, 
  Users, 
  Sparkles, 
  UserCircle,
  BarChart3, 
  Settings as SettingsIcon,
  Menu,
  CalendarCheck2,
  X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DemoBanner = () => {
  const { resetDemoData } = useAppContext();
  
  const handleReset = () => {
    if (window.confirm('Reset Bookly Demo?\n\nThis will remove your current changes and restore the original sample data.')) {
      resetDemoData();
    }
  };

  return (
    <div className="bg-violet-600 text-white px-4 py-2 text-sm font-medium flex justify-between items-center z-50 relative">
      <div>
        <span className="hidden sm:inline">DEMO MODE — </span>
        You're exploring a sample Bookly account.
      </div>
      <button 
        onClick={handleReset}
        className="bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded text-xs font-semibold"
      >
        Reset Demo Data
      </button>
    </div>
  );
};

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'Appointments', path: '/appointments', icon: CalendarCheck },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Services', path: '/services', icon: Sparkles },
  { name: 'Staff', path: '/staff', icon: UserCircle },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { resetDemoData } = useAppContext();

  const handleReset = () => {
    if (window.confirm('Reset Bookly Demo?\n\nThis will remove your current changes and restore the original sample data.')) {
      resetDemoData();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 pt-10
        transition-transform duration-300 ease-in-out bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 px-6 pb-6">
          <div className="bg-violet-600 p-2 rounded-lg text-white">
            <CalendarCheck2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">Bookly</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Made Simple.</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200'}
              `}
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 m-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Demo Account</div>
          <button 
            onClick={handleReset}
            className="w-full text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </aside>
    </>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <DemoBanner />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64 flex flex-col h-[calc(100vh-40px)] overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="bg-violet-600 p-1.5 rounded-md text-white">
                <CalendarCheck2 size={20} />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">Bookly</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
