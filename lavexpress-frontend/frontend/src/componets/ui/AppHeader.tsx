
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function AppHeader({ title, showBackButton = false }: AppHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50 flex items-center px-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-full max-w-md mx-auto flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 -ml-2 flex items-center justify-center text-gray-600"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {title && (
          <h1 className="text-lg font-medium text-center flex-1">
            {title}
          </h1>
        )}
      </div>
    </motion.header>
  );
}
