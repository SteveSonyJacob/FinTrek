import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Users, 
  User,
  Coins,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PointsDisplay from '../gamification/PointsDisplay';
import { ThemeToggle } from '../ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

/**
 * Main navigation component with gamified elements and theme toggle
 * Features: Active page highlighting, points display, responsive design, dark/light mode
 */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/learning', label: 'Learn', icon: BookOpen },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-card backdrop-blur-md border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 text-primary font-bold text-xl hover:text-primary-light transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-badge">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="hidden sm:block">FinTrek</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-gradient-primary text-primary-foreground shadow-button" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side: Points, Streak, Theme Toggle */}
          <div className="flex items-center space-x-4">
            <PointsDisplay points={2847} />
            <div className="flex items-center space-x-1 text-streak font-bold">
              <Flame className="w-5 h-5" />
              <span className="text-sm">7</span>
            </div>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/auth', { replace: true });
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
