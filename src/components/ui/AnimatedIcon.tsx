import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  animation?: 'bounce' | 'spin' | 'pulse' | 'heartbeat' | 'float' | 'glow';
  trigger?: 'hover' | 'click' | 'always';
  color?: string;
  onClick?: () => void;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon: Icon,
  size = 20,
  className = '',
  animation = 'bounce',
  trigger = 'hover',
  color = 'currentColor',
  onClick
}) => {
  const [isTriggered, setIsTriggered] = useState(trigger === 'always');

  const getAnimationClass = () => {
    if (!isTriggered && trigger !== 'always') return '';
    
    switch (animation) {
      case 'bounce':
        return 'animate-bounce';
      case 'spin':
        return 'animate-spin';
      case 'pulse':
        return 'animate-pulse';
      case 'heartbeat':
        return 'animate-heart-beat';
      case 'float':
        return 'animate-float';
      case 'glow':
        return 'animate-glow';
      default:
        return '';
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsTriggered(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsTriggered(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsTriggered(true);
      setTimeout(() => setIsTriggered(false), 600);
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${getAnimationClass()} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ color }}
    >
      <Icon size={size} />
    </div>
  );
};

export default AnimatedIcon;