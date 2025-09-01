import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'xp' | 'success';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Gamified progress bar component
 * Features: Multiple variants, animations, size options
 */
const ProgressBar = ({ 
  progress, 
  label, 
  size = 'md', 
  variant = 'primary',
  showPercentage = false,
  animated = true,
  className 
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variantClasses = {
    primary: 'bg-gradient-primary',
    xp: 'bg-xp',
    success: 'bg-gradient-success'
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-bold text-muted-foreground">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden shadow-inner",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            variantClasses[variant],
            animated && "animate-pulse"
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;