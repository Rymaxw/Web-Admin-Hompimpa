
import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Home, 
  AlertTriangle, 
  CheckSquare, 
  Users, 
  BarChart2, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  X
} from 'lucide-react';
import CreateTaskForm from './CreateTaskForm';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const navItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Insiden', path: '/insidents', icon: AlertTriangle },
    { name: 'Tugas', path: '/tasks', icon: CheckSquare },
    { name: 'Relawan', path: '/volunteers', icon: Users },
    { name: 'Laporan', path: '/reports', icon: BarChart2 },
    { name: 'Pengaturan', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <div className="rounded-lg bg-primary p-1.5 text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Hompimpa</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex ml-8 items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-primary'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden lg:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari..."
              value={searchParams.get('q') || ''}
              onChange={(e) => {
                const term = e.target.value;
                if (term) {
                  setSearchParams({ q: term });
                } else {
                  setSearchParams({});
                }
              }}
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-2 pl-10 pr-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* Avatar */}
          <img
            src="https://picsum.photos/seed/admin/100"
            alt="User"
            onClick={() => navigate('/settings')}
            className="h-9 w-9 cursor-pointer rounded-full border border-slate-200 object-cover hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all"
          />

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 absolute top-[65px] left-0 w-full z-40 shadow-lg">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-primary'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>

      {/* Global Modals */}
      <CreateTaskForm />
    </div>
  );
};

export default Layout;
