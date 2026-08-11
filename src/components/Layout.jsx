import React from 'react';
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
  CalendarCheck2
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
    <div className="bg-rose-600 text-white px-4 py-2.5 text-sm font-medium flex justify-between items-center z-50 relative shadow-md">
      <div>
        <span className="hidden sm:inline">DEMO MODE — </span>
        You're exploring a sample Bookly account.
      </div>
      <button 
        onClick={handleReset}
        className="bg-white/20 hover:bg-white/30 active:scale-95 transition-all duration-200 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm"
      >
        Reset Demo
      </button>
    </div>
  );
};

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'Appointments', path: '/appointments', icon: CalendarCheck },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Menu', path: '/services', icon: Sparkles },
  { name: 'Staff', path: '/staff', icon: UserCircle },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

// Items specifically for the mobile bottom bar (Max 5 items usually for good UX)
const mobileNavItems = [
  { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'Book', path: '/appointments', icon: CalendarCheck },
  { name: 'Menu', path: '/services', icon: Sparkles },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

const DesktopSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-800/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-[calc(100vh-44px)] z-40 sticky top-[44px]">
      <div className="flex items-center gap-3 px-8 pt-8 pb-6">
        <div className="bg-gradient-to-tr from-rose-600 to-rose-400 p-2.5 rounded-xl text-white shadow-lg shadow-rose-500/20">
          <CalendarCheck2 size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">Bookly</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95
              ${isActive 
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'}
            `}
          >
            <item.icon size={20} strokeWidth={2} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const MobileBottomBar = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 z-50 pb-safe shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center px-2 py-2">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-16 py-1.5 rounded-2xl transition-all duration-300 active:scale-90
              ${isActive 
                ? 'text-rose-600 dark:text-rose-400' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl mb-1 transition-colors ${isActive ? 'bg-rose-50 dark:bg-rose-500/15' : 'bg-transparent'}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-semibold">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-rose-200 selection:text-rose-900">
      <DemoBanner />
      
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-5 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-rose-600 to-rose-400 p-1.5 rounded-lg text-white shadow-md shadow-rose-500/20">
            <CalendarCheck2 size={20} strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Bookly</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <UserCircle size={20} className="text-slate-500" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto h-[calc(100vh-44px)] lg:h-[calc(100vh-44px)] pb-24 lg:pb-0 scroll-smooth">
          <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        <MobileBottomBar />
      </div>
    </div>
  );
};

export default Layout;
