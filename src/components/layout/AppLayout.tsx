import { ReactNode } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';



/**
 * Main application layout wrapper
 * Provides consistent navigation and styling across all pages
 */
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={cn(
        "pt-16", // Account for fixed navbar height
        "animate-slide-up"
      )}>
        <Outlet/>
      </main>
    </div>
  );
};

export default AppLayout;