
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Search, label: 'Buscar', path: '/browse' },
    { icon: Calendar, label: 'Agendar', path: '/schedule' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-sm z-50">
      <nav className="flex justify-around items-center h-16 px-1 mx-auto max-w-md">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = currentPath === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center w-full h-full relative ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
              aria-label={label}
            >
              <div className="relative">
                <Icon size={20} className="mb-1" />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                  />
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
