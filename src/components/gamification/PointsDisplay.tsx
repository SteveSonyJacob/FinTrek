import { Coins, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface PointsDisplayProps {
  points: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Animated points display component
 * Features: Number counting animation, size variants, visual feedback
 */
const PointsDisplay = ({ 
  points, 
  showAnimation = false, 
  size = 'md', 
  className 
}: PointsDisplayProps) => {
  const [displayPoints, setDisplayPoints] = useState(points);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate points counting up
  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true);
      const startValue = displayPoints;
      const endValue = points;
      const duration = 1000; // 1 second
      const steps = 30;
      const stepValue = (endValue - startValue) / steps;
      
      let current = 0;
      const timer = setInterval(() => {
        current++;
        setDisplayPoints(Math.round(startValue + (stepValue * current)));
        
        if (current >= steps) {
          clearInterval(timer);
          setDisplayPoints(endValue);
          setIsAnimating(false);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayPoints(points);
    }
  }, [points, showAnimation]);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-bold'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn(
      "flex items-center space-x-2 bg-gradient-secondary/20 px-3 py-1.5 rounded-full border border-secondary/30",
      sizeClasses[size],
      isAnimating && "animate-pulse-glow",
      className
    )}>
      <Coins className={cn(iconSizes[size], "text-secondary")} />
      <span className="font-bold text-secondary-foreground dark:text-white">
        {displayPoints.toLocaleString()}
      </span>
      {showAnimation && isAnimating && (
        <TrendingUp className={cn(iconSizes[size], "text-success animate-bounce-in")} />
      )}
    </div>
  );
};

export default PointsDisplay;