
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: 'none' | 'short' | 'medium';
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-right' | 'blur';
}

const AnimatedContainer = ({
  children,
  className,
  delay = 'none',
  animation = 'fade',
}: AnimatedContainerProps) => {
  const getAnimationClass = () => {
    const baseAnimation = `animate-${animation === 'fade' ? 'fade-in' : animation === 'scale' ? 'scale-in' : animation === 'blur' ? 'blur-in' : animation}`;
    
    if (delay === 'none') return baseAnimation;
    if (delay === 'short') return `opacity-0 ${animation === 'slide-up' ? 'animate-slide-up-delayed' : baseAnimation} delay-100`;
    if (delay === 'medium') return `opacity-0 ${animation === 'slide-up' ? 'animate-slide-up-more-delayed' : baseAnimation} delay-200`;
    
    return baseAnimation;
  };

  return (
    <div className={cn(getAnimationClass(), className)}>
      {children}
    </div>
  );
};

export default AnimatedContainer;
