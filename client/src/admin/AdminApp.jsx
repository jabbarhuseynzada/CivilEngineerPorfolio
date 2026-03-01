import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { FaHardHat, FaTools, FaProjectDiagram, FaEnvelope, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import ServicesAdmin from './pages/ServicesAdmin';
import ProjectsAdmin from './pages/ProjectsAdmin';
import MessagesAdmin from './pages/MessagesAdmin';
import SiteSettingsAdmin from './pages/SiteSettingsAdmin';

const navItems = [
  { to: '/admin/services', icon: FaTools, label: 'Xidmətlər' },
  { to: '/admin/projects', icon: FaProjectDiagram, label: 'Layihələr' },
  { to: '/admin/messages', icon: FaEnvelope, label: 'Mesajlar' },
  { to: '/admin/settings', icon: FaCog, label: 'Sayt Ayarları' },
];

export default function AdminApp() {
  const navigate = useNavigate();
  const username = localStorage.getItem('adminUsername') ?? 'Admin';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
      isActive
        ? 'bg-terracotta-600 text-white shadow-lg'
        : 'text-charcoal-400 hover:text-white hover:bg-charcoal-800'
    }`;

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-charcoal-950 border-r border-charcoal-800">
      {/* Logo */}
      <div className="p-6 border-b border-charcoal-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaHardHat className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-lg leading-tight">Admin Panel</h1>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={() => setSidebarOpen(false)}>
            <Icon className="text-lg flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-charcoal-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-terracotta-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {username[0]?.toUpperCase()}
          </div>
          <span className="text-charcoal-300 font-medium text-sm">{username}</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal-400 hover:text-red-400 hover:bg-charcoal-800 transition-all font-medium"
        >
          <FaSignOutAlt />
          Çıxış
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-charcoal-900 overflow-hidden font-body">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center gap-4 px-4 py-4 bg-charcoal-950 border-b border-charcoal-800">
          <button onClick={() => setSidebarOpen(true)} className="text-charcoal-400 hover:text-white">
            <FaBars size={20} />
          </button>
          <span className="text-white font-display font-bold">Admin Panel</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<ServicesAdmin />} />
            <Route path="/services" element={<ServicesAdmin />} />
            <Route path="/projects" element={<ProjectsAdmin />} />
            <Route path="/messages" element={<MessagesAdmin />} />
            <Route path="/settings" element={<SiteSettingsAdmin />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
