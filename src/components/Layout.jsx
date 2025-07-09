import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  FlaskConical,
  ClipboardList,
  LogOut,
  TestTube as TestTubeDiagonal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/reagents', label: 'Reactivos', icon: FlaskConical },
    { path: '/kardex', label: 'Kardex', icon: ClipboardList },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Fondo oscuro en móvil */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={toggleSidebar}
        className="fixed inset-0 z-30 bg-black/60 md:hidden"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      {/* Menú lateral */}
      <div
        className={cn(
          'z-40 h-full w-64 bg-gradient-to-b from-blue-100 to-cyan-100 dark:from-slate-900 dark:to-slate-800 shadow-lg border-r dark:border-slate-700 flex flex-col',
          'md:relative md:translate-x-0 fixed top-0 left-0 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Encabezado del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-blue-200 dark:border-slate-700 h-16">
          <div className="flex items-center gap-2">
            <TestTubeDiagonal className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <Link
              to="/"
              className="text-xl font-bold text-primary-foreground dark:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-sm"
            >
              QuimiKardex
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden text-primary-foreground dark:text-blue-300"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group transform hover:translate-x-1',
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                  : 'text-muted-foreground hover:bg-primary-foreground/5 hover:text-primary-foreground dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 transition-transform duration-200',
                  location.pathname === item.path ? '' : 'group-hover:scale-110'
                )}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Usuario y Logout */}
        <div className="p-4 border-t border-blue-200 dark:border-slate-700">
          <div className="mb-3 p-3 rounded-lg bg-primary-foreground/5 dark:bg-blue-900/20">
            <div className="text-xs text-muted-foreground dark:text-slate-400">
              Usuario Conectado:
            </div>
            <div className="font-semibold text-foreground dark:text-slate-200">
              {user?.username}
            </div>
            <div className="text-xs text-cyan-700 dark:text-cyan-400">
              {user?.role}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 btn-effect"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </>
  );
};

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-secondary dark:bg-background overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header móvil */}
        <header className="md:hidden flex items-center justify-between p-4 bg-primary dark:bg-slate-800 border-b border-border dark:border-slate-700 shadow-sm h-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-primary-foreground dark:text-blue-300"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-primary-foreground dark:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-sm"
          >
            <TestTubeDiagonal className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            QuimiKardex
          </Link>

          <div className="w-8" />
        </header>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
