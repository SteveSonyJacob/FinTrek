import { cn } from '@/lib/utils';
import { Award, Star, Crown, Zap } from 'lucide-react';

interface BadgeProps {
  type: 'bronze' | 'silver' | 'gold' | 'diamond';
  title: string;
  description?: string;
  icon?: 'award' | 'star' | 'crown' | 'zap';
  size?: 'sm' | 'md' | 'lg';
  earned?: boolean;
  className?: string;
}

/**
 * Gamified badge component
 * Features: Multiple tiers, icons, earned/unearned states, animations
 */
const Badge = ({ 
  type, 
  title, 
  description, 
  icon = 'award',
  size = 'md',
  earned = true,
  className 
}: BadgeProps) => {
  const icons = {
    award: Award,
    star: Star,
    crown: Crown,
    zap: Zap
  };

  const Icon = icons[icon];

  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      icon: 'w-6 h-6',
      text: 'text-xs'
    },
    md: {
      container: 'w-20 h-20',
      icon: 'w-8 h-8',
      text: 'text-sm'
    },
    lg: {
      container: 'w-24 h-24',
      icon: 'w-10 h-10',
      text: 'text-base'
    }
  };

  const typeClasses = {
    bronze: earned ? 'bg-badge-bronze text-white' : 'bg-badge-bronze/30 text-badge-bronze',
    silver: earned ? 'bg-badge-silver text-foreground' : 'bg-badge-silver/30 text-badge-silver',
    gold: earned ? 'bg-badge-gold text-badge-gold-foreground' : 'bg-badge-gold/30 text-badge-gold',
    diamond: earned ? 'bg-badge-diamond text-white' : 'bg-badge-diamond/30 text-badge-diamond'
  };

  return (
    <div className={cn(
      "flex flex-col items-center text-center group cursor-pointer",
      className
    )}>
      <div className={cn(
        "rounded-full flex items-center justify-center shadow-badge border-2 border-white/20 transition-all duration-300",
        sizeClasses[size].container,
        typeClasses[type],
        earned && "hover:scale-110 hover:shadow-glow",
        !earned && "grayscale opacity-50"
      )}>
        <Icon className={cn(
          sizeClasses[size].icon,
          earned && "animate-pulse",
          "drop-shadow-sm"
        )} />
      </div>
      
      <div className="mt-2 space-y-1 max-w-20">
        <h3 className={cn(
          "font-bold leading-tight",
          sizeClasses[size].text,
          earned ? "text-foreground" : "text-muted-foreground"
        )}>
          {title}
        </h3>
        
        {description && (
          <p className={cn(
            "text-muted-foreground leading-tight",
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Badge;