import { ReactNode } from 'react';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Main application layout wrapper
 * Provides consistent navigation and styling across all pages
 */
const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={cn(
        "pt-16", // Account for fixed navbar height
        "animate-slide-up"
      )}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;