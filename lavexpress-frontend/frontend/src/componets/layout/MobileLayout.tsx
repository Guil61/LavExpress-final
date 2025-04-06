
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MobileNavbar from '../ui/MobileNavbar';
import AppHeader from '../ui/AppHeader';

interface MobileLayoutProps {
    children: React.ReactNode;
    hideNavbar?: boolean;
    hideHeader?: boolean;
    title?: string;
    showBackButton?: boolean;
}

export default function MobileLayout({
                                         children,
                                         hideNavbar = false,
                                         hideHeader = false,
                                         title,
                                         showBackButton = false,
                                     }: MobileLayoutProps) {
    const location = useLocation();

    return (
        <div className="mobile-container">
            {!hideHeader && <AppHeader title={title} showBackButton={showBackButton} />}

            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="mobile-content"
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            {!hideNavbar && <MobileNavbar />}
        </div>
    );
}
